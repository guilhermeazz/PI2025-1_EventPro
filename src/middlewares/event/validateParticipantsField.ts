import { Request, Response, NextFunction } from "express";
import UserModel from "../../models/UserModel";

export const validateParticipantFields = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { forAnotherOne, participants, userId } = req.body;
  // Verificar se está se inscrevendo para outra pessoa [cite: 141]
  if (forAnotherOne) {
    const requiredFields = ["name", "email", "dateOfBirth", "document"];
    const missing = requiredFields.filter(field => !participants?.[field]);

    if (missing.length > 0) {
      res.status(400).json({
        message: `Campos obrigatórios faltando para participante: ${missing.join(", ")}`
      });
      return;
    }
  } else {
    // Verificar se o usuário existe no banco, usando o userId fornecido na requisição [cite: 144]
    if (!userId) {
      res.status(400).json({ message: "O campo userId é obrigatório." });
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado." });
      return;
    }

    // Preencher os dados do participante com as informações do usuário encontrado [cite: 147]
    req.body.participants = {
      name: `${user.name} ${user.lastname}`,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      document: user.cpf
    };
  }

  next();
};