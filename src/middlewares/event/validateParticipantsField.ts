import { Request, Response, NextFunction } from "express";
import UserModel from "../../models/UserModel";

export const validateParticipantFields = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { forAnotherOne, participants, userId } = req.body;

  // Verificar se está se inscrevendo para outra pessoa
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
    // Verificar se o usuário existe no banco, usando o userId fornecido na requisição
    if (!userId) {
      res.status(400).json({ message: "O campo userId é obrigatório." });
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado." });
      return;
    }

    // Preencher os dados do participante com as informações do usuário encontrado
    req.body.participants = {
      name: `${user.name} ${user.lastname}`,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      document: user.cpf
    };
  }

  next();
};
