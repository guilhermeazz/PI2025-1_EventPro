import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import InscriptionModel from '../models/InscriptionsModels';
import ParticipationModel from '../models/ParticipationsModels';


// Criar novo usuário
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = new UserModel(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: 'Erro ao criar usuário', error: error.message });
    }
};

// Listar todos os usuários
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
};

// Obter usuário por ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }

        // Buscar inscriptions do usuário com forAnotherOne false
        const inscriptions = await InscriptionModel.find({ 
            userId: req.params.id, 
            forAnotherOne: false 
        });

        // Buscar tickets do usuário com forAnotherOne true
        const tickets = await InscriptionModel.find({ 
            userId: req.params.id, 
            forAnotherOne: true 
        });

        // Buscar participations do usuário
        const participations = await ParticipationModel.find({ 
            userId: req.params.id 
        });

        // Construir resposta
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


// Atualizar usuário por ID
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

// Deletar usuário por ID
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

// Detalhes do usuário
export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await UserModel.findById(req.user_id); // Supondo que o ID do usuário esteja no token JWT
        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }
        res.status(200).json(user);
    } catch (error: any) {
        res.status(400).json({ message: 'Erro ao buscar detalhes do usuário', error: error.message });
    }
}


