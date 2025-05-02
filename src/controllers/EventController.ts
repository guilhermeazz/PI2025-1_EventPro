import { Request, Response } from 'express';
import  EventModel  from '../models/EventModel';
import QRCode from 'qrcode'; // Importa a biblioteca qrcode

//CRUD de eventos
//Criar novo evento
export const createEvent = async (req: Request, res: Response) : Promise<void> => {
    try {
        const data = req.body;

    // Cria instância do evento mas ainda não salva
    const event = new EventModel(data);

    // Gera o QR Code apenas se for tipo 'flash'
    if (event.type === 'flash') {
      const qrData = `eventapp://entry?id=${event._id}`;
      const qrCodeBase64 = await QRCode.toDataURL(qrData);
      event.entryQrCode = qrCodeBase64;
      await event.save();
    }else {
            event.entryQrCode = '';
    }
        
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar evento', error });
    }
};

//Listar eventos
export const getEvents = async (req: Request, res: Response) : Promise<void> => {
    try {
        const events = await EventModel.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter eventos', error });
    }
};

//Obter evento por ID
export const getEventById = async (req: Request, res: Response) : Promise<any> => {
    try {
        const event = await EventModel.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Evento não encontrado' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter evento', error });
    }
};

//Atualizar evento por ID
export const updateEvent = async (req: Request, res: Response) : Promise<any> => {
    try {
        const event = await EventModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) {
            return res.status(404).json({ message: 'Evento não encontrado' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Erro au atualizar evento', error });
    }
};

//Deletar evento por ID
export const deleteEvent = async (req: Request, res: Response) : Promise<any> => {
    try {
        const event = await EventModel.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Evento não encontrado' });
        }
        res.status(200).json({ message: 'Evento deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar evento', error });
    }
};


//ORGANIZADORES
//Adicionar organizador ao evento
export const addOrganizer = async (req: Request, res: Response) : Promise<any> => {
    try {
        const { userId, nivel } = req.body;
        const event = await EventModel.findByIdAndUpdate(
            req.params.id,
            { $push: { organizers: { userId, nivel } } },
            { new: true }
        );
        if (!event) {
            return res.status(404).json({ message: 'Evento não encontrado' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar organizador', error });
    }
};

//Remover organizador do evento
export const removeOrganizer = async (req: Request, res: Response) : Promise<any> => {
    try {
        const { userId } = req.body;
        const event = await EventModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { organizers: { userId } } },
            { new: true }
        );
        if (!event) {
            return res.status(404).json({ message: 'Evento não encontrado' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover organizador ', error });
    }
}

//Listar organizadores do evento
export const getOrganizers = async (req: Request, res: Response) : Promise<any> => {   
    try {
        const event = await EventModel.findById(req.params.id).populate('organizers.userId', 'name email');
        if (!event) {
            return res.status(404).json({ message: 'Evento não encontrado' });
        }
        res.status(200).json(event.organizers);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter organizadores do evento', error });
    }
}

//Atualizar organizador do evento
export const updateOrganizer = async (req: Request, res: Response) : Promise<any> => {
    try {
        const { userId, nivel } = req.body;
        const event = await EventModel.findOneAndUpdate(
            { _id: req.params.id, 'organizers.userId': userId },
            { $set: { 'organizers.$.nivel': nivel } },
            { new: true }
        );
        if (!event) {
            return res.status(404).json({ message: 'Evento não encontrado' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar organizador de evento', error });
    }
}

// GET /validate-qr/:id
export const validateQrCode = async (req: Request, res: Response) : Promise<any> => {
  const { id } = req.params;

  try {
    const event = await EventModel.findById(id);

    if (!event) {
      return res.status(404).json({ valid: false, reason: 'Evento não encontrado' });
    }

    if (event.type !== 'flash') {
      return res.status(400).json({ valid: false, reason: 'Evento não usa QR Code de entrada' });
    }

    // Aqui você pode adicionar mais validações se quiser

    res.json({ valid: true, event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ valid: false, reason: 'Erro interno' });
  }
};




