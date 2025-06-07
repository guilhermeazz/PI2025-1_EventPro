import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import mongoose from 'mongoose';

interface JWTPayload {
    sub: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(`[AUTH_MW] URL: ${req.method} ${req.originalUrl}`);
    console.log(`[AUTH_MW] Token Present: ${!!token}`);

    if (!token) {
        console.log("[AUTH_MW] Token missing, returning 401.");
        res.status(401).json({ message: "Token de autenticação não fornecido." });
        return;
    }

    try {
        const { sub } = verify(token, process.env.JWT_SECRET as string) as JWTPayload;

        if (!mongoose.Types.ObjectId.isValid(sub)) {
            console.error(`[AUTH_MW] Invalid token sub (not ObjectId): '${sub}'`);
            res.status(401).json({ message: "Token de autenticação inválido ou corrompido (ID do usuário)." });
            return;
        }

        req.user_id = sub;
        console.log(`[AUTH_MW] Token OK. req.user_id set to: '${req.user_id}'`);
        next(); // Continue para o próximo middleware/rota
    } catch (error: any) {
        console.error(`[AUTH_MW] Token verification failed: ${error.message}`);
        let message = "Falha na autenticação do token.";
        if (error.name === 'TokenExpiredError') message = "Token de autenticação expirado.";
        else if (error.name === 'JsonWebTokenError') message = "Token de autenticação inválido.";

        res.status(401).json({ message });
        return;
    }
};