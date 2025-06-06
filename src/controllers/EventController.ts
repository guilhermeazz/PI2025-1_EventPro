import { Request, Response } from 'express';
import  EventModel  from '../models/EventModel';
import InscriptionModel from '../models/InscriptionsModels';
import ParticipationModel from '../models/ParticipationsModels';
import UserModel from '../models/UserModel'; // Adicionado para buscar dados do usuário em flash events
import QRCode from 'qrcode'; // Importa a biblioteca qrcode [cite: 13]
import { StatusEnumerator } from '../Enum/StatusEnumerator';
import { ParticipationStatusEnumerator } from '../Enum/ParticipationStatusEnumerator';

//CRUD de eventos
//Criar novo evento
export const createEvent = async (req: Request, res: Response) : Promise<void> => {
    try {
        const data = req.body;
        // Cria instância do evento mas ainda não salva [cite: 14]
        const event = new EventModel(data);
        // Gera o QR Code apenas se for tipo 'flash' [cite: 15]
        if (event.type === 'flash') {
            const qrData = `eventapp://entry?id=${event._id}`;
            const qrCodeBase64 = await QRCode.toDataURL(qrData);
            event.entryQrCode = qrCodeBase64;
            await event.save();
        } else {
            event.entryQrCode = '';
        }

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar evento', error });
    }
};
//Listar eventos [cite: 20]
export const getEvents = async (req: Request, res: Response) : Promise<void> => {
    try {
        const events = await EventModel.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter eventos', error });
    }
};

//Obter evento por ID [cite: 22]
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

//Atualizar evento por ID [cite: 25]
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

//Deletar evento por ID [cite: 28]
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
//ORGANIZADORES [cite: 32]
//Adicionar organizador ao evento [cite: 32]
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

//Remover organizador do evento [cite: 36]
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

//Listar organizadores do evento [cite: 40]
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

//Atualizar organizador do evento [cite: 43]
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

// Validar entrada (usado para ambos os tipos de evento)
export const validateEntry = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params; // Pode ser eventId (para flash) ou inscriptionId (para standard/class)
    const { qrData, userId } = req.body; // qrData para eventos flash, userId para standard/class

    try {
        let event;
        let inscription;
        let participation;

        // Tentar encontrar como Inscrição (para standard/class)
        inscription = await InscriptionModel.findById(id).populate('eventId');
        if (inscription) {
            event = inscription.eventId as any; // Populado
            if (!event) {
                 return res.status(404).json({ valid: false, reason: 'Evento associado à inscrição não encontrado.' });
            }
        } else {
            // Se não encontrou como Inscrição, tentar como Evento (para flash)
            event = await EventModel.findById(id);
        }

        if (!event) {
            return res.status(404).json({ valid: false, reason: 'Evento ou Inscrição não encontrado.' });
        }

        if (event.type === 'flash') {
            // Lógica para evento tipo 'flash'
            // O QR Code gerado contém `eventapp://entry?id=${event._id}`
            // O `qrData` recebido deve ser o `id` do evento
            if (event._id.toString() !== qrData) {
                return res.status(400).json({ valid: false, reason: 'QR Code inválido para este evento Flash.' });
            }

            // Encontrar ou criar uma participação para o usuário no evento Flash
            participation = await ParticipationModel.findOne({ userId, eventId: event._id });

            if (!participation) {
                // Se não houver participação, crie uma nova com status CHECKIN
                const user = await UserModel.findById(userId); // Busque o usuário para preencher os dados
                if (!user) return res.status(404).json({ valid: false, reason: 'Usuário não encontrado para criar participação.' });

                participation = new ParticipationModel({
                    userId,
                    eventId: event._id,
                    name: `${user.name} ${user.lastname}`,
                    email: user.email,
                    dateOfBirth: user.dateOfBirth,
                    document: user.cpf,
                    status: ParticipationStatusEnumerator.CHECKIN,
                });
                await participation.save();
                return res.status(200).json({ valid: true, message: 'Entrada registrada com sucesso no evento Flash!', event, participation });
            }

            if (participation.status === ParticipationStatusEnumerator.CHECKIN) {
                return res.status(400).json({ valid: false, reason: 'Você já fez check-in neste evento Flash.' });
            }

            if (participation.status === ParticipationStatusEnumerator.CHECKOUT) {
                return res.status(400).json({ valid: false, reason: 'Você já fez check-out deste evento Flash.' });
            }

            participation.status = ParticipationStatusEnumerator.CHECKIN;
            participation.checkin = { in: new Date() } as any; // Atualiza o horário de check-in
            await participation.save();
            return res.status(200).json({ valid: true, message: 'Entrada registrada com sucesso no evento Flash!', event, participation });

        } else {
            // Lógica para evento tipo 'standard' ou 'class' (usa Inscription)
            if (!inscription) {
                return res.status(404).json({ valid: false, reason: 'Inscrição não encontrada para este tipo de evento.' });
            }

            if (inscription.status === StatusEnumerator.CANCELED) {
                return res.status(400).json({ valid: false, reason: 'Sua inscrição foi cancelada.' });
            }
            if (inscription.participation_status === ParticipationStatusEnumerator.CHECKIN) {
                return res.status(400).json({ valid: false, reason: 'Você já fez check-in para esta inscrição.' });
            }
            if (inscription.participation_status === ParticipationStatusEnumerator.CHECKOUT) {
                 return res.status(400).json({ valid: false, reason: 'Você já fez check-out para esta inscrição.' });
            }


            inscription.participation_status = ParticipationStatusEnumerator.CHECKIN;
            inscription.checkin = { in: new Date() } as any; // Atualiza o horário de check-in
            inscription.status = StatusEnumerator.CONFIRMED; // Ou mantenha como CONFIRMED se já estava
            await inscription.save();

            res.status(200).json({ valid: true, message: 'Entrada validada com sucesso!', event, inscription });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ valid: false, reason: 'Erro interno ao validar entrada.' });
    }
};

// Validar saída (usado para ambos os tipos de evento)
export const validateExit = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params; // Pode ser eventId (para flash) ou inscriptionId (para standard/class)
    const { userId } = req.body; // Necessário para eventos flash

    try {
        let event;
        let inscription;
        let participation;

        // Tentar encontrar como Inscrição (para standard/class)
        inscription = await InscriptionModel.findById(id).populate('eventId');
        if (inscription) {
            event = inscription.eventId as any; // Populado
            if (!event) {
                 return res.status(404).json({ valid: false, reason: 'Evento associado à inscrição não encontrado.' });
            }
        } else {
            // Se não encontrou como Inscrição, tentar como Evento (para flash)
            event = await EventModel.findById(id);
        }

        if (!event) {
            return res.status(404).json({ valid: false, reason: 'Evento ou Inscrição não encontrado.' });
        }

        if (event.type === 'flash') {
            // Lógica para evento tipo 'flash'
            participation = await ParticipationModel.findOne({ userId, eventId: event._id });

            if (!participation) {
                return res.status(404).json({ valid: false, reason: 'Participação não encontrada para este evento Flash.' });
            }

            if (participation.status !== ParticipationStatusEnumerator.CHECKIN) {
                return res.status(400).json({ valid: false, reason: 'Você não fez check-in neste evento Flash ou já fez check-out.' });
            }

            participation.status = ParticipationStatusEnumerator.CHECKOUT;
            participation.checkin = { ...participation.checkin, out: new Date() } as any; // Atualiza o horário de check-out
            await participation.save();
            return res.status(200).json({ valid: true, message: 'Saída registrada com sucesso do evento Flash!', event, participation });

        } else {
            // Lógica para evento tipo 'standard' ou 'class' (usa Inscription)
            if (!inscription) {
                return res.status(404).json({ valid: false, reason: 'Inscrição não encontrada para este tipo de evento.' });
            }

            if (inscription.participation_status !== ParticipationStatusEnumerator.CHECKIN) {
                return res.status(400).json({ valid: false, reason: 'Você não fez check-in para esta inscrição ou já fez check-out.' });
            }

            inscription.participation_status = ParticipationStatusEnumerator.CHECKOUT;
            inscription.checkin = { ...inscription.checkin, out: new Date() } as any; // Atualiza o horário de check-out
            await inscription.save();

            res.status(200).json({ valid: true, message: 'Saída registrada com sucesso!', event, inscription });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ valid: false, reason: 'Erro interno ao validar saída.' });
    }
};