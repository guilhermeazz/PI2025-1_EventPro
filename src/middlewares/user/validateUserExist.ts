import { Request, Response, NextFunction } from "express";
import UserModel from "../../models/UserModel";

export const validateUserExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.body;

  const user = await UserModel.findById(userId);
  if (!user) {
    res.status(404).json({ message: "Usuário não encontrado." });
    return;
  }

  next(); 
};
