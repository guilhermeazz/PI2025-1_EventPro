import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import mongoose from 'mongoose'; // Importe mongoose para validação de ObjectId

interface JWTPayload {
    sub: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];
    // console.log('AuthMiddleware: Token recebido:', token ? 'Sim' : 'Não'); // Log de depuração

    if (!token) {
        res.status(401).json({ message: "Token de autenticação não fornecido." });
        return;
    }

    try {
        const { sub } = verify(
            token,
            process.env.JWT_SECRET as string,
        ) as JWTPayload;

        // ✅ Adicionar validação para verificar se 'sub' é um ObjectId válido do Mongoose
        if (!mongoose.Types.ObjectId.isValid(sub)) {
            // console.error('AuthMiddleware: sub do token inválido (não é um ObjectId válido):', sub); // Log de depuração
            res.status(401).json({ message: "Token de autenticação inválido ou corrompido (ID do usuário)." });
            return;
        }

        req.user_id = sub;
        // console.log('AuthMiddleware: Token verificado, req.user_id:', req.user_id); // Log de depuração

        return next();
    } catch (error: any) {
        // console.error('AuthMiddleware: Erro na verificação do token:', error.message); // Log de depuração
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: "Token de autenticação expirado." });
        } else if (error.name === 'JsonWebTokenError') {
            res.status(401).json({ message: "Token de autenticação inválido." });
        } else {
            res.status(401).json({ message: "Falha na autenticação do token." });
        }
        return; // Certifique-se de que a execução para após o erro
    }
};