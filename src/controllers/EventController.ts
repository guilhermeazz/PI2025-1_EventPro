import { Request, Response } from 'express';
import  EventModel  from '../models/EventModel';

//CRUD de eventos
//Criar novo evento
export const createEvent = async (req: Request, res: Response) => {
    try {
        const event = new EventModel(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error });
    }
};

//Listar eventos
export const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await EventModel.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error });
    }
};

//Obter evento por ID
export const getEventById = async (req: Request, res: Response) => {
    try {
        const event = await EventModel.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event', error });
    }
};

//Atualizar evento por ID
export const updateEvent = async (req: Request, res: Response) => {
    try {
        const event = await EventModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error });
    }
};

//Deletar evento por ID
export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const event = await EventModel.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error });
    }
};


//ORGANIZADORES
//Adicionar organizador ao evento
export const addOrganizer = async (req: Request, res: Response) => {
    try {
        const { userId, nivel } = req.body;
        const event = await EventModel.findByIdAndUpdate(
            req.params.id,
            { $push: { organizers: { userId, nivel } } },
            { new: true }
        );
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error adding organizer', error });
    }
};

//Remover organizador do evento
export const removeOrganizer = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const event = await EventModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { organizers: { userId } } },
            { new: true }
        );
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error removing organizer', error });
    }
}

//Listar organizadores do evento
export const getOrganizers = async (req: Request, res: Response) => {   
    try {
        const event = await EventModel.findById(req.params.id).populate('organizers.userId', 'name email');
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event.organizers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching organizers', error });
    }
}

//Atualizar organizador do evento
export const updateOrganizer = async (req: Request, res: Response) => {
    try {
        const { userId, nivel } = req.body;
        const event = await EventModel.findOneAndUpdate(
            { _id: req.params.id, 'organizers.userId': userId },
            { $set: { 'organizers.$.nivel': nivel } },
            { new: true }
        );
        if (!event) {
            return res.status(404).json({ message: 'Event not found or organizer not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error updating organizer', error });
    }
}




