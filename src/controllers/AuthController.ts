import { Request, Response } from "express";
import UserModel from '../models/UserModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// Função para fazer Login
export const login =  async (req: Request, res: Response) : Promise<any> => {
    const { email, password} = req.body;

    try {
        const user = await UserModel.findOne({
            email
        })
        if (!user) return res.status(404).json({ message : "Usuário não encontrado"});
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Senha inválida'});

        //Gerar o token JWT
        // O token é gerado com o id do usuário e uma chave secreta, e tem um tempo de expiração de 30 dias.
        const token = jwt.sign({ email: user.email, password: user.password }, process.env.JWT_SECRET as string, {
            expiresIn: '30d',
            subject: user.id,
        });
        // O token é enviado na resposta, junto com uma mensagem de sucesso e os dados do usuário.
        // O token é enviado no formato Bearer, que é o padrão para autenticação com JWT.
        return (
            res.status(200).json({
                message: 'Login realizado com sucesso!',
                token,
                user: {
                    id: user?._id,
                    email: user?.email,
                    name: user?.name,
                    lastname: user?.lastname,
                    eventsInscriptions: user?.eventsInscriptions,
                    eventsParticipations: user?.eventsParticipations,
                    tickets: user?.tickets,
                    token : token,
                },
            })
        );

    }   catch (error) {
        return res.status(500).json({ message: 'Erro ao fazer login', error });
    }
}

