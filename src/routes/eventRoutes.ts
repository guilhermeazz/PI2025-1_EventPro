import { Router } from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  addOrganizer,
  removeOrganizer,
  getOrganizers,
  updateOrganizer
} from '../controllers/EventController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API para gerenciar eventos
 */

/**
 * @swagger
 * /api/event:
 *   post:
 *     tags:
 *       - Event
 *     summary: Cria um novo evento
 *     description: Endpoint para criar um novo evento, com QR Code se for tipo 'flash'.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - type
 *               - date
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [standart, class, flash]
 *               date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: object
 *                 required:
 *                   - address
 *                   - city
 *                 properties:
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *                   additionalInfo:
 *                     type: string
 *               capacity:
 *                 type: object
 *                 properties:
 *                   max:
 *                     type: number
 *                   current:
 *                     type: number
 *                   total:
 *                     type: number
 *               schedules:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     format: date-time
 *                   end:
 *                     type: string
 *                     format: date-time
 *               inscription:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     price:
 *                       type: number
 *                     type:
 *                       type: string
 *                     discount:
 *                       type: number
 *               certificates:
 *                 type: boolean
 *               certificateTemplate:
 *                 type: object
 *                 properties:
 *                   templateName:
 *                     type: string
 *                   courseName:
 *                     type: string
 *                   courseDescription:
 *                     type: string
 *               contents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *               organizers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - userId
 *                     - nivel
 *                   properties:
 *                     userId:
 *                       type: string
 *                     nivel:
 *                       type: string
 *                       enum: [admin, reception, speaker]
 *               reviews:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     rating:
 *                       type: number
 *                     comment:
 *                       type: string
 *     responses:
 *       201:
 *         description: Evento criado com sucesso.
 */
router.post('/event', createEvent);

/**
 * @swagger
 * /api/event:
 *   get:
 *     tags:
 *       - Event
 *     summary: Lista todos os eventos
 *     responses:
 *       200:
 *         description: Lista de eventos retornada com sucesso.
 */
router.get('/event', getEvents);

/**
 * @swagger
 * /api/event/{id}:
 *   get:
 *     tags:
 *       - Event
 *     summary: Busca evento por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Evento retornado com sucesso.
 *       404:
 *         description: Evento não encontrado.
 */
router.get('/event/:id', getEventById);

/**
 * @swagger
 * /api/event/{id}:
 *   patch:
 *     tags:
 *       - Event
 *     summary: Atualiza evento por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso.
 *       404:
 *         description: Evento não encontrado.
 */
router.patch('/event/:id', updateEvent);

/**
 * @swagger
 * /api/event/{id}:
 *   delete:
 *     tags:
 *       - Event
 *     summary: Remove evento por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Evento deletado com sucesso.
 *       404:
 *         description: Evento não encontrado.
 */
router.delete('/event/:id', deleteEvent);

/**
 * @swagger
 * /api/event/{id}/organizers:
 *   get:
 *     tags:
 *       - Event
 *     summary: Lista organizadores de um evento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Lista de organizadores retornada com sucesso.
 */
router.get('/event/:id/organizers', getOrganizers);

/**
 * @swagger
 * /api/event/{id}/organizers:
 *   post:
 *     tags:
 *       - Event
 *     summary: Adiciona um organizador ao evento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               nivel:
 *                 type: string
 *                 enum: [admin, reception, speaker]
 *     responses:
 *       200:
 *         description: Organizador adicionado com sucesso.
 */
router.post('/event/:id/organizers', addOrganizer);

/**
 * @swagger
 * /api/event/{id}/organizers/{userId}:
 *   patch:
 *     tags:
 *       - Event
 *     summary: Atualiza o nível de um organizador
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *       - in: path
 *         name: userId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nivel:
 *                 type: string
 *                 enum: [admin, reception, speaker]
 *     responses:
 *       200:
 *         description: Nível do organizador atualizado com sucesso.
 */
router.patch('/event/:id/organizers/:userId', updateOrganizer);

/**
 * @swagger
 * /api/event/{id}/organizers/{userId}:
 *   delete:
 *     tags:
 *       - Event
 *     summary: Remove um organizador do evento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *       - in: path
 *         name: userId
 *         required: true
 *     responses:
 *       200:
 *         description: Organizador removido com sucesso.
 */
router.delete('/event/:id/organizers/:userId', removeOrganizer);

export default router;
