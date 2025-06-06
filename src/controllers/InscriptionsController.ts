import { Request, Response } from "express";
import InscriptionModel from "../models/InscriptionsModels";
import { StatusEnumerator } from "../Enum/StatusEnumerator";
import { ParticipationStatusEnumerator } from "../Enum/ParticipationStatusEnumerator"; // Certifique-se de importar

//CRUD (sem update) de inscrições
//Criar nova inscrição
export const createInscription = async (req: Request, res: Response) : Promise<void> => {
    try{
        const inscription = new InscriptionModel(req.body);
        await inscription.save();
        res.status(201).json(inscription);
    } catch (error) {
        res.status(500).json({
            message: "Error while creating inscription",
            error
        })
    }
}

//Listar inscrições
export const getInscriptions = async (req: Request, res: Response) : Promise<void> => {
    try {
        const inscriptions = await InscriptionModel.find().populate("userId").populate("eventId");
        res.status(200).json(inscriptions);
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching inscriptions",
            error
        })
    }
}

//Obter inscrição por ID
export const getInscriptionsById = async (req: Request, res: Response) : Promise<void>=> {
    try {
        const inscription = await InscriptionModel.findById(req.params.id).populate("userId").populate("eventId");
        res.status(200).json(inscription)
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching inscription",
            error
        })
    }
}

//Deletar inscrição por ID
export const deleteInscription = async (req: Request, res: Response) : Promise<void> => {
    try {
        const inscription  = await InscriptionModel.findByIdAndDelete(req.params.id);
        res.status(204).json({
            message: "Inscription deleted successfully",
            inscription
        })
    } catch (error){
        res.status(500).json({
            message: "Error while deleting inscription",
            error
        })
    }
}

// Função para cancelar inscrição
export const cancelInscription = async (req: Request, res: Response) : Promise<void> => {
    try {
        const { id } = req.params; // ID da inscrição

        const inscription = await InscriptionModel.findById(id);
        if (!inscription) {
            res.status(404).json({ message: 'Inscrição não encontrada.' });
            return;
        }

        if (inscription.status === StatusEnumerator.CANCELED) {
            res.status(400).json({ message: 'Esta inscrição já está cancelada.' });
            return;
        }

        inscription.status = StatusEnumerator.CANCELED;
        await inscription.save();

        res.status(200).json({ message: 'Inscrição cancelada com sucesso.', inscription });
    } catch (error) {
        res.status(500).json({
            message: "Error while canceling inscription",
            error
        })
    }
}