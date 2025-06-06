import { Request, Response } from "express";
import UserModel from '../models/UserModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationCodeEmail, sendResetPasswordEmail } from '../services/emailService';

// --- ARMAZENAMENTO TEMPORÁRIO DO TOKEN DE VERIFICAÇÃO ---
// Em um ambiente de produção, isto deve ser um cache (Redis, Memcached) ou um banco de dados temporário.
// Para este exemplo, usaremos um Map em memória para simplicidade.
// Map<email, { code: string, expires: Date }>
const temporaryVerificationCodes = new Map<string, { code: string, expires: Date }>();

// --- FUNÇÕES DE AUTENTICAÇÃO ---

// Função para fazer Login
export const login =  async (req: Request, res: Response) : Promise<any> => {
    const { email, password} = req.body;
    try {
        const user = await UserModel.findOne({
            email
        })
        if (!user) return res.status(404).json({ message : "Usuário não encontrado"});

        // Se o usuário existir mas não tiver senha (cenários de migração ou erro), pode-se tratar aqui
        if (!user.password) {
             return res.status(403).json({ message: 'Senha não definida para este usuário. Por favor, redefina sua senha ou complete o cadastro.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Senha inválida'});

        const token = jwt.sign({ email: user.email, password: user.password }, process.env.JWT_SECRET as string, {
            expiresIn: '30d',
            subject: user.id,
        });

        return (
            res.status(200).json({
                message: 'Login realizado com sucesso!',
                token,
                user: {
                    id: user?._id,
                    email: user?.email,
                    name: user?.name,
                    lastname: user?.lastname,
                },
            })
        );

    }   catch (error) {
        return res.status(500).json({ message: 'Erro ao fazer login', error });
    }
}

// ✅ NOVO ENDPOINT 1: Solicitar código de verificação
export const requestVerificationCode = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: 'Este e-mail já está cadastrado em nossa base.' });
            return; // ✅ Adicionado return
        }

        const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
        const verificationCodeExpires = new Date(Date.now() + 300000);

        temporaryVerificationCodes.set(email, { code: verificationCode, expires: verificationCodeExpires });

        await sendVerificationCodeEmail(email, verificationCode);

        // ✅ Removido 'return' aqui
        res.status(202).json({ message: 'Código de verificação enviado para seu e-mail. Por favor, verifique sua caixa de entrada.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao solicitar código de verificação', error: error.message });
        return; // ✅ Adicionado return
    }
};

// ✅ NOVO ENDPOINT 2: Finalizar Cadastro com Código e Dados Completos
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, code, name, lastname, dateOfBirth, cpf, phone, password } = req.body;

        const storedCodeInfo = temporaryVerificationCodes.get(email);

        if (!storedCodeInfo || storedCodeInfo.code !== code || storedCodeInfo.expires < new Date()) {
            res.status(400).json({ message: 'Código de verificação inválido ou expirado. Por favor, solicite um novo código.' });
            return; // ✅ Adicionado return
        }

        temporaryVerificationCodes.delete(email);

        const existingUserByEmail = await UserModel.findOne({ email });
        if (existingUserByEmail) {
            res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
            return; // ✅ Adicionado return
        }
        const existingUserByCpf = await UserModel.findOne({ cpf });
        if (existingUserByCpf) {
            res.status(409).json({ message: 'Este CPF já está cadastrado.' });
            return; // ✅ Adicionado return
        }

        const newUser = new UserModel({
            name,
            lastname,
            email,
            password,
            dateOfBirth,
            cpf,
            phone,
            emailVerified: true,
        });

        await newUser.save();

        // ✅ Removido 'return' aqui
        res.status(201).json({ message: 'Cadastro realizado com sucesso!', user: newUser });

    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            res.status(400).json({ message: 'Erro de validação no cadastro', errors: messages });
            return; // ✅ Adicionado return
        }
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            res.status(409).json({ message: `O campo '${field}' já está em uso.` });
            return; // ✅ Adicionado return
        }
        res.status(500).json({ message: 'Erro ao finalizar o cadastro', error: error.message });
        return; // ✅ Adicionado return
    }
};


// Função para solicitar recuperação de senha (enviar e-mail com token)
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(200).json({ message: 'Se o e-mail estiver cadastrado, um link de recuperação foi enviado.' });
            return;
        }

        // Gerar token de recuperação de senha
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // Expira em 1 hora
        await user.save();

        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password?token=${resetToken}`;
        await sendResetPasswordEmail(user.email, resetUrl);

        res.status(200).json({ message: 'Se o e-mail estiver cadastrado, um link de recuperação foi enviado.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao solicitar recuperação de senha', error: error.message });
    }
};

// Função para redefinir a senha
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.query;
        const { newPassword } = req.body;

        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() } // Token não expirado
        });

        if (!user) {
            res.status(400).json({ message: 'Token de recuperação inválido ou expirado.' });
            return;
        }

        // Validação da nova senha
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            res.status(400).json({ message: 'A nova senha não atende aos requisitos de segurança. A senha deve conter ao menos 8 caracteres, incluindo letras, números e caracteres especiais.' });
            return;
        }

        user.password = newPassword; // O middleware pre('save') do UserModel fará o hash
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Senha redefinida com sucesso!' });
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao redefinir a senha', error: error.message });
    }
};