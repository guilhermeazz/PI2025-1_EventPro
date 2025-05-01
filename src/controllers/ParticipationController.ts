import { Request, Response } from 'express';
import ParticipationModel from '../models/ParticipationsModels';

//CRUD de participações

//Criar nova participação

export const createParticipation = async (req: Request, res: Response) : Promise<void> => {
    try {
        const participation = new ParticipationModel(req.body); 
        await participation.save();
        res.status(201).json(participation);
        
    } catch (error) {
        res.status(500).json({
            message: "Error while creating participation",
            error
        })
    }
}

//Listar participações
export const getParticipations = async (req: Request, res: Response) : Promise<void> => {
    try {
        const participatios = await ParticipationModel.find();
        res.status(200).json(participatios);
    } catch (error){
        res.status(404).json({
            message: "Error while fetching participations",
            error
        })
    }
}

//Obter participação por ID

export const getParticipationsById = async (req: Request, res: Response): Promise<void> => { 
    try {
        const participation = await ParticipationModel.findById(req.params.id);
        if (!participation) {
            res.status(404).json({ message: 'Participation not found' });
        }
        res.status(200).json(participation);
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching participation",
            error
        })
    }
}

//Atualizar participação por Id

export const updateParticipation = async (req: Request, res: Response): Promise<void> => {
    try{
        const participation = await ParticipationModel.findByIdAndUpdate(req.params
            .id, req.body, { new: true });
        if (!participation) {
            res.status(404).json({ message: 'Participation not found' });
        }
        res.status(200).json(participation);
    } catch (error) {
        res.status(500).json({
            message: "Error while updating participation",
            error
        })
    }
}

//Deletar participação por Id

export const deleteParticipation = async (req: Request, res: Response) : Promise<void> => {
    try {
        const participation = await ParticipationModel.findByIdAndDelete(req.params.id);
        if (!participation) {
            res.status(404).json({ message: 'Participation not found' });
        }
        res.status(200).json({ message: 'Participation deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: "Error while deleting participation",
            error
        })
    }
}