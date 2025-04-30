import { Request, Response } from "express";
import jwt from "jsonwebtoken"; 

interface JWTPayload {
    id: string;
}

export const authMiddleware = (req: Request, res: Response, next: () => void) => {
    const token = req.headers.authorization?.split(" ")[1]; 
    
    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
        req.body.userId = decoded.id; 
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
};
