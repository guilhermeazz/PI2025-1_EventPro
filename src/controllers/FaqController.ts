import { Request, Response } from "express";
import FaqModel from "../models/faqModels"; //

//CRUD de FAQ

//Criar novo FAQ
export const createFaq = async (req: Request, res: Response) : Promise<void> => {
    try {
        const faq = new FaqModel(req.body);
        await faq.save();
        res.status(201).json(faq)
    } catch (error) {
        res.status(500).json({
            message: "Error while creating FAQ",
            error
        })
    }
}

//Listar FAQ
export const getFaqs = async (req: Request, res: Response) : Promise<void> => {
    try {
        const faqs = await FaqModel.find();
        res.status(200).json(faqs);
    } catch (error) {
        res.status(404).json({
            message: "Error while fetching FAQs",
            error
        })
    }
}

//Update FAQ por Id
export const updateFaq = async (req: Request, res: Response): Promise<void> => {
    try {
        const faq = await FaqModel.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Adicionado req.body para atualização
        if (!faq) {
            res.status(404).json({ message: 'FAQ not found' });
        }
        res.status(200).json(faq);
    } catch (error) {
        res.status(500).json({
            message: "Error while updating FAQ",
            error
        })
    }
}

//Delete FAQ por Id
export const deleteFaq = async (req: Request, res: Response): Promise<void> => {
    try {
        const faq = await FaqModel.findByIdAndDelete(req.params.id);
        if (!faq) {
            res.status(404).json({ message: 'FAQ not found' });
        }
        res.status(200).json(faq);
    } catch (error) {
        res.status(500).json({
            message: "Error while deleting FAQ",
            error
        })
    }
}