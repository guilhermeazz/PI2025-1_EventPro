import { Request, Response } from "express";
import UserModel from '../models/UserModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req : Request, res: Response) => {
    const { email, password} = req.body;

    try {
        const existingUser = await UserModel.findOne({
            email
        });
        if (existingUser) {
            return res.status(400).json({ message : 'Usuário já cadastrado'});
        }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({
                email,
                password: hashedPassword
            });

            await newUser.save();
            return res.status(201).json({ message: 'Usuário cadastrado com sucesso!'});
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar usuário', error });
    }
};

export const login =  async (req: Request, res: Response) => {
    const { email, password} = req.body;

    try {
        const user = await UserModel.findOne({
            email
        })
        if (!user) return res.status(404).json({ message : "Usuário não encontrado"});
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Senha inválida'});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
            expiresIn: '1h' 
        });
        return res.status(200).json({ message: 'Login realizado com sucesso', token });

    }   catch (error) {
        return res.status(500).json({ message: 'Erro ao fazer login', error });
    }
}

