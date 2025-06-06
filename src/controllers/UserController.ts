import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import InscriptionModel from '../models/InscriptionsModels';
import ParticipationModel from '../models/ParticipationsModels';

// Criar novo usuário [cite: 82]
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = new UserModel(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: 'Erro ao criar usuário', error: error.message });
    }
};

// Listar todos os usuários [cite: 84]
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
};

// Obter usuário por ID [cite: 87]
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }

        // Buscar inscriptions do usuário com forAnotherOne false [cite: 89]
        const inscriptions = await InscriptionModel.find({
            userId: req.params.id,
            forAnotherOne: false
        });
        // Buscar tickets do usuário com forAnotherOne true [cite: 90]
        const tickets = await InscriptionModel.find({
            userId: req.params.id,
            forAnotherOne: true
        });
        // Buscar participations do usuário [cite: 91]
        const participations = await ParticipationModel.find({
            userId: req.params.id
        });
        // Construir resposta [cite: 91]
        const userDetails = {
            ...user.toObject(),
            inscriptions: inscriptions.map(inscription => ({
                eventId: inscription.eventId, // Mantém a referência do eventId
                inscriptionId: inscription._id, // Usamos _id como inscriptionId
            })),
            tickets: tickets.map(ticket => ({
                eventId: ticket.eventId, // Mantém a referência do eventId
                inscriptionId: ticket._id, // Usamos _id como inscriptionId
            })),
            participations: participations.map(participation => ({
                eventId: participation.eventId, // Mantém a referência do eventId
                participationId: participation._id, // Usamos _id como participationId
            }))
        };
        res.status(200).json(userDetails);
    } catch (error: any) {
        res.status(400).json({ message: 'Erro ao buscar usuário', error: error.message });
    }
}

// Atualizar usuário por ID [cite: 95]
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }
        res.status(200).json(user);
    } catch (error: any) {
        res.status(400).json({ message: 'Erro ao atualizar usuário', error: error.message });
    }
};

// Deletar usuário por ID [cite: 99]
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }
        res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error: any) {
        res.status(400).json({ message: 'Erro ao deletar usuário', error: error.message });
    }
};

// Detalhes do usuário [cite: 103]
export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await UserModel.findById(req.user_id);
        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }
        res.status(200).json(user);
    } catch (error: any) {
        res.status(400).json({ message: 'Erro ao buscar detalhes do usuário', error: error.message });
    }
}

// Função para trocar a senha
export const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user_id; // Supondo que o ID do usuário esteja no token JWT

        if (!userId) {
            res.status(401).json({ message: 'Não autorizado: ID do usuário não encontrado.' });
            return;
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado.' });
            return;
        }

        const isPasswordValid = await user.comparePassword(oldPassword);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Senha antiga inválida.' });
            return;
        }

        // Validação da nova senha (reutilizando a validação do modelo UserModel)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            res.status(400).json({ message: 'A nova senha não atende aos requisitos de segurança. A senha deve conter ao menos 8 caracteres, incluindo letras, números e caracteres especiais.' });
            return;
        }

        user.password = newPassword; // O middleware pre('save') do UserModel fará o hash
        await user.save();

        res.status(200).json({ message: 'Senha alterada com sucesso.' });
    } catch (error: any) {
        res.status(400).json({ message: 'Erro ao alterar a senha', error: error.message });
    }
};