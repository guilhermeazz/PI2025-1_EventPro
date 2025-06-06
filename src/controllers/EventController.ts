import { Request, Response } from 'express';
import  EventModel  from '../models/EventModel';
import InscriptionModel from '../models/InscriptionsModels';
import ParticipationModel from '../models/ParticipationsModels';
import UserModel from '../models/UserModel';
import QRCode from 'qrcode';
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

// ✅ Função para validar entrada (Check-in)
export const validateEntry = async (req: Request, res: Response): Promise<void> => {
    const { eventId, inscriptionId } = req.body; // Recebe o ID do evento (para flash) ou o ID da inscrição (para standard/class)
    // O ID do ingresso (qrcode_id) será o inscriptionId ou o eventId (para flash)
    const qrcode_id = req.params.id; // Assume que o ID lido do QR Code vem do parâmetro da URL

    try {
        // Tenta encontrar a inscrição primeiro, que se aplica a Standard e Class
        const inscription = await InscriptionModel.findById(qrcode_id).populate('eventId');

        if (inscription) { // Lógica para eventos Standard/Class
            const event = inscription.eventId as any;

            if (!event) {
                res.status(404).json({ valid: false, message: 'Evento associado à inscrição não encontrado.' });
                return;
            }

            if (inscription.status === StatusEnumerator.APROVADO) { // Verifica se está aprovado (equivalente ao CONFIRMED)
                if (inscription.participation_status === ParticipationStatusEnumerator.PARTICIPANDO) {
                    res.status(400).json({ valid: false, message: 'Este ingresso já foi usado para entrada (status PARTICIPANDO).' });
                    return;
                }
                if (inscription.participation_status === ParticipationStatusEnumerator.PARTICIPADO) {
                    res.status(400).json({ valid: false, message: 'Este ingresso já foi usado para entrada e saída (status PARTICIPADO).' });
                    return;
                }
                if (inscription.status === StatusEnumerator.USADO) { // Se já estiver como usado no status principal
                    res.status(400).json({ valid: false, message: 'Este ingresso já foi usado para entrada.' });
                    return;
                }
                if (inscription.status === StatusEnumerator.EXPIRADO) {
                    res.status(400).json({ valid: false, message: 'Este ingresso está expirado e não pode ser usado para entrada.' });
                    return;
                }

                // Valida a entrada
                inscription.status = StatusEnumerator.USADO; // Muda o status do ingresso para USADO
                inscription.participation_status = ParticipationStatusEnumerator.PARTICIPANDO; // Muda o status de participação para PARTICIPANDO
                inscription.checkin = { in: new Date() }; // Coloca o horário em checkin.in

                await inscription.save();
                res.status(200).json({ valid: true, message: 'Entrada validada com sucesso!', inscription });
                return;

            } else {
                res.status(400).json({ valid: false, message: `Status do ingresso inválido para entrada: ${inscription.status}.` });
                return;
            }

        } else { // Lógica para eventos Flash (sem inscrição formal, usa ParticipationModel diretamente)
            // Se não encontrou uma Inscrição com esse ID, tenta encontrar um Evento para o caso Flash
            const event = await EventModel.findById(qrcode_id);

            if (!event) {
                res.status(404).json({ valid: false, message: 'Evento ou Inscrição não encontrado.' });
                return;
            }

            if (event.type !== 'flash') {
                res.status(400).json({ valid: false, message: 'Este QR Code não corresponde a um evento Flash. Tente usar o QR Code do ingresso.' });
                return;
            }

            // Para evento Flash, o QR Code é o ID do evento, e a validação cria/atualiza uma Participação
            // Assumimos que o `userId` (da pessoa fazendo check-in no evento Flash) é passado no corpo da requisição.
            const { userId } = req.body;
            if (!userId) {
                res.status(400).json({ valid: false, message: 'ID do usuário é obrigatório para eventos Flash.' });
                return;
            }

            let participation = await ParticipationModel.findOne({ userId, eventId: event._id });

            if (!participation) {
                // Se não há participação, cria uma nova e marca como PARTICIPANDO
                const user = await UserModel.findById(userId);
                if (!user) {
                    res.status(404).json({ valid: false, message: 'Usuário não encontrado para criar participação.' });
                    return;
                }
                participation = new ParticipationModel({
                    userId,
                    eventId: event._id,
                    name: `${user.name} ${user.lastname}`,
                    email: user.email,
                    dateOfBirth: user.dateOfBirth,
                    document: user.cpf,
                    status: ParticipationStatusEnumerator.PARTICIPANDO, // ✅ Status inicial PARTICIPANDO
                    checkin: { in: new Date() }
                });
                await participation.save();
                res.status(200).json({ valid: true, message: 'Entrada registrada com sucesso no evento Flash!', participation });
                return;
            }

            // Se a participação já existe, atualiza o status se necessário
            if (participation.status === ParticipationStatusEnumerator.PARTICIPANDO) {
                res.status(400).json({ valid: false, message: 'Você já está PARTICIPANDO deste evento Flash.' });
                return;
            }
            if (participation.status === ParticipationStatusEnumerator.PARTICIPADO) {
                res.status(400).json({ valid: false, message: 'Você já PARTICIPOU e saiu deste evento Flash.' });
                return;
            }
            if (participation.status === ParticipationStatusEnumerator.NAO_COMPARECEU) {
                // Pode-se reverter o status aqui ou exigir que o usuário re-registre.
                // Por agora, vamos permitir a entrada, mudando de NAO_COMPARECEU para PARTICIPANDO.
                // Ou você pode adicionar uma lógica para não permitir se o status for NAO_COMPARECEU e o evento já começou.
            }

            participation.status = ParticipationStatusEnumerator.PARTICIPANDO; // ✅ Muda o status para PARTICIPANDO
            participation.checkin = { in: new Date() };
            await participation.save();
            res.status(200).json({ valid: true, message: 'Entrada registrada com sucesso no evento Flash!', participation });
            return;
        }

    } catch (error) {
        console.error('Erro ao validar entrada:', error);
        res.status(500).json({ valid: false, message: 'Erro interno ao validar entrada.', error });
    }
};

// ✅ Função para validar saída (Check-out)
export const validateExit = async (req: Request, res: Response): Promise<void> => {
    const qrcode_id = req.params.id; // O ID lido do QR Code

    try {
        // Tenta encontrar a inscrição primeiro
        const inscription = await InscriptionModel.findById(qrcode_id).populate('eventId');

        if (inscription) { // Lógica para eventos Standard/Class
            const event = inscription.eventId as any;
            if (!event) {
                res.status(404).json({ valid: false, message: 'Evento associado à inscrição não encontrado.' });
                return;
            }

            if (inscription.participation_status === ParticipationStatusEnumerator.PARTICIPANDO) { // Verifica se está PARTICIPANDO
                inscription.participation_status = ParticipationStatusEnumerator.PARTICIPADO; // ✅ Muda para PARTICIPADO
                inscription.checkin = { ...inscription.checkin, out: new Date() }; // Coloca o horário em checkin.out

                await inscription.save();
                res.status(200).json({ valid: true, message: 'Saída validada com sucesso!', inscription });
                return;

            } else if (inscription.participation_status === ParticipationStatusEnumerator.PARTICIPADO) {
                res.status(400).json({ valid: false, message: 'Saída já registrada para este ingresso (status PARTICIPADO).' });
                return;
            } else {
                res.status(400).json({ valid: false, message: `Status do ingresso inválido para saída: ${inscription.participation_status}. A pessoa precisa estar PARTICIPANDO.` });
                return;
            }

        } else { // Lógica para eventos Flash
            // Para eventos Flash, o QR Code é o ID do evento, e a validação usa Participação
            const event = await EventModel.findById(qrcode_id);

            if (!event) {
                res.status(404).json({ valid: false, message: 'Evento ou Participação não encontrado.' });
                return;
            }
            if (event.type !== 'flash') {
                res.status(400).json({ valid: false, message: 'Este QR Code não corresponde a um evento Flash. Tente usar o QR Code do ingresso.' });
                return;
            }

            // Para eventos Flash, o userId da pessoa que está saindo é necessário
            const { userId } = req.body;
            if (!userId) {
                res.status(400).json({ valid: false, message: 'ID do usuário é obrigatório para eventos Flash.' });
                return;
            }

            let participation = await ParticipationModel.findOne({ userId, eventId: event._id });

            if (!participation) {
                res.status(404).json({ valid: false, message: 'Participação não encontrada para este usuário neste evento Flash.' });
                return;
            }

            if (participation.status === ParticipationStatusEnumerator.PARTICIPANDO) { // Verifica se está PARTICIPANDO
                participation.status = ParticipationStatusEnumerator.PARTICIPADO; // ✅ Muda para PARTICIPADO
                participation.checkin = { ...participation.checkin, out: new Date() };
                await participation.save();
                res.status(200).json({ valid: true, message: 'Saída registrada com sucesso do evento Flash!', participation });
                return;

            } else if (participation.status === ParticipationStatusEnumerator.PARTICIPADO) {
                res.status(400).json({ valid: false, message: 'Saída já registrada para este usuário neste evento Flash (status PARTICIPADO).' });
                return;
            } else {
                res.status(400).json({ valid: false, message: `Status da participação inválido para saída: ${participation.status}. A pessoa precisa estar PARTICIPANDO.` });
                return;
            }
        }
    } catch (error) {
        console.error('Erro ao validar saída:', error);
        res.status(500).json({ valid: false, message: 'Erro interno ao validar saída.', error });
    }
};