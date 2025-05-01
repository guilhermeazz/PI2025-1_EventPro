import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface JWTPayload {
    sub: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1]; 
    
    if (!token) {
        res.status(401).end();
        return;
    }

    try {
        const { sub } = verify(
            token,
            process.env.JWT_SECRET as string,
        ) as JWTPayload;

        req.user_id = sub;

        return next();
    } catch (error) {
        res.status(401).end();
    }
};
