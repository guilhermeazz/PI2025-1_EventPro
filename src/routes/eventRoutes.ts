import { Router } from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  validateEntry,
  validateExit
} from '../controllers/EventController';
import { authMiddleware } from '../middlewares/auth/AuthMiddlewares';

const router = Router();



/**
 * @swagger
 * tags:
 *   - name: Events
 *     description: 'API para gerenciar eventos'
 *   - name: Access Control
 *     description: 'Endpoints para controle de acesso a eventos'
 */

/**
 * @swagger
 * /api/event:
 *   post:
 *     tags: [Events]
 *     summary: Cria um novo evento
 *     description: 'Endpoint para criar um novo evento, com QR Code se for tipo "flash".'
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - name
 *               - description
 *               - categories
 *               - date
 *               - location
 *               - capacity
 *               - schedules
 *               - type
 *               - certificates
 *               - certificateTemplate
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 'ID do usuário criador do evento.'
 *                 example: '60d0fe4f5b67d5001f3e0921'
 *               name:
 *                 type: string
 *                 example: 'Minha Conferência Tech'
 *               description:
 *                 type: string
 *                 example: 'Uma conferência sobre as últimas tendências em tecnologia.'
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['Tecnologia', 'Desenvolvimento']
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: '2025-12-01T09:00:00Z'
 *               location:
 *                 type: object
 *                 required: [address, city, state, country]
 *                 properties:
 *                   address:
 *                     type: string
 *                     example: 'Rua Exemplo, 123'
 *                   city:
 *                     type: string
 *                     example: 'São Paulo'
 *                   state:
 *                     type: string
 *                     example: 'SP'
 *                   country:
 *                     type: string
 *                     example: 'Brasil'
 *                   additionalInfo:
 *                     type: string
 *                     example: 'Próximo à estação de metrô'
 *               capacity:
 *                 type: object
 *                 required: [max]
 *                 properties:
 *                   max:
 *                     type: number
 *                     example: 500
 *                   current:
 *                     type: number
 *                     example: 0
 *                   total:
 *                     type: number
 *                     example: 0
 *               schedules:
 *                 type: object
 *                 required: [start, end]
 *                 properties:
 *                   start:
 *                     type: string
 *                     format: date-time
 *                     example: '2025-12-01T09:00:00Z'
 *                   end:
 *                     type: string
 *                     format: date-time
 *                     example: '2025-12-01T17:00:00Z'
 *               type:
 *                 type: string
 *                 enum: [standard, class, flash]
 *                 example: 'standard'
 *               inscription:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [price, type, discount]
 *                   properties:
 *                     price:
 *                       type: number
 *                       example: 100.00
 *                     type:
 *                       type: string
 *                       enum: [full, half, free, promotional, vip, other]
 *                       example: 'full'
 *                     discount:
 *                       type: number
 *                       example: 10
 *               certificates:
 *                 type: boolean
 *                 example: true
 *               certificateTemplate:
 *                 type: object
 *                 required: [templateName, courseName, courseDescription]
 *                 properties:
 *                   templateName:
 *                     type: string
 *                     example: 'Template Certificado Padrão'
 *                   courseName:
 *                     type: string
 *                     example: 'Introdução à Programação'
 *                   courseDescription:
 *                     type: string
 *                     example: 'Curso intensivo de fundamentos de programação.'
 *               contents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [title]
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: 'Palestra de Abertura'
 *               organizers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [userId, nivel]
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: '60c8e23f1f7d5c001f3e0123'
 *                     nivel:
 *                       type: string
 *                       enum: [admin, reception, speaker]
 *                       example: 'reception'
 *               reviews:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [userId, rating, comment]
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: '60c8e23f1f7d5c001f3e0124'
 *                     rating:
 *                       type: number
 *                       format: float
 *                       example: 4.5
 *                     comment:
 *                       type: string
 *                       example: 'Ótimo evento, muito bem organizado!'
 *     responses:
 *       201:
 *         description: 'Evento criado com sucesso.'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido).'
 *       500:
 *         description: 'Erro ao criar evento.'
 */
router.post('/', createEvent);

/**
 * @swagger
 * /api/event:
 *   get:
 *     tags: [Events]
 *     summary: Lista todos os eventos
 *     description: 'Retorna uma lista de todos os eventos cadastrados.'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 'Lista de eventos retornada com sucesso.'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido).'
 *       500:
 *         description: 'Erro ao obter eventos.'
 */
router.get('/', getEvents);

/**
 * @swagger
 * /api/event/{id}:
 *   get:
 *     tags: [Events]
 *     summary: Busca evento por ID
 *     description: 'Retorna os dados de um evento específico.'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 'ID do evento'
 *     responses:
 *       200:
 *         description: 'Evento retornado com sucesso.'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido).'
 *       404:
 *         description: 'Evento não encontrado.'
 *       500:
 *         description: 'Erro ao obter evento.'
 */
router.get('/:id', getEventById);

/**
 * @swagger
 * /api/event/{id}:
 *   patch:
 *     tags: [Events]
 *     summary: Atualiza evento por ID
 *     description: 'Atualiza os dados de um evento específico.'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 'ID do evento'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: 'Nome do Evento Atualizado'
 *               description: 'Nova descrição do evento.'
 *     responses:
 *       200:
 *         description: 'Evento atualizado com sucesso.'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido).'
 *       404:
 *         description: 'Evento não encontrado.'
 *       500:
 *         description: 'Erro ao atualizar evento.'
 */
router.patch('/:id', updateEvent);

/**
 * @swagger
 * /api/event/{id}:
 *   delete:
 *     tags: [Events]
 *     summary: Remove evento por ID
 *     description: 'Remove um evento específico do banco de dados.'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 'ID do evento'
 *     responses:
 *       200:
 *         description: 'Evento deletado com sucesso.'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido).'
 *       404:
 *         description: 'Evento não encontrado.'
 *       500:
 *         description: 'Erro ao deletar evento.'
 */
router.delete('/:id', deleteEvent);

/**
 * @swagger
 * /api/event/validate-entry/{id}:
 *   post:
 *     tags: [Access Control]
 *     summary: Valida a entrada em um evento (check-in)
 *     description: |
 *       Realiza o check-in do usuário no evento, com base no ID do ingresso (QR Code).
 *       Para eventos 'Standard' ou 'Class', o `{id}` na URL é o ID da Inscrição.
 *       Para eventos 'Flash', o `{id}` na URL é o ID do Evento, e o `userId` deve ser enviado no corpo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 'ID do ingresso (para Standard/Class) ou ID do evento (para Flash).'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 'ID do usuário (obrigatório apenas para eventos Flash, para identificar o participante).'
 *                 example: '60c8e23f1f7d5c001f3e0123'
 *     responses:
 *       200:
 *         description: 'Entrada validada com sucesso!.'
 *       400:
 *         description: 'Ingresso/código inválido, já usado ou status incorreto.'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido).'
 *       404:
 *         description: 'Evento ou Inscrição/Participação não encontrado.'
 *       500:
 *         description: 'Erro interno ao validar entrada.'
 */
router.post('/validate-entry/:id', validateEntry);

/**
 * @swagger
 * /api/event/validate-exit/{id}:
 *   post:
 *     tags: [Access Control]
 *     summary: Valida a saída de um evento (check-out)
 *     description: |
 *       Registra a saída do usuário de um evento, com base no ID do ingresso (QR Code).
 *       Para eventos 'Standard' ou 'Class', o `{id}` na URL é o ID da Inscrição.
 *       Para eventos 'Flash', o `{id}` na URL é o ID do Evento, e o `userId` deve ser enviado no corpo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 'ID do ingresso (para Standard/Class) ou ID do evento (para Flash).'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 'ID do usuário (obrigatório apenas para eventos Flash, para identificar o participante).'
 *                 example: '60c8e23f1f7d5c001f3e0123'
 *     responses:
 *       200:
 *         description: 'Saída registrada com sucesso.'
 *       400:
 *         description: 'Ingresso/código inválido, não fez entrada ou status incorreto.'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido).'
 *       404:
 *         description: 'Evento ou Inscrição/Participação não encontrado.'
 *       500:
 *         description: 'Erro interno ao validar saída.'
 */
router.post('/validate-exit/:id', validateExit);

export default router;
