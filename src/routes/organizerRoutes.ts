import { Router } from 'express';
import {
  addOrganizer,
  getOrganizers,
  updateOrganizer,
  removeOrganizer
} from '../controllers/EventController';

const router = Router();

/**
 * @swagger
 * /api/event/{id}/organizer:
 *   post:
 *     tags:
 *       - Organizer
 *     summary: Adiciona organizador ao evento
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
 *     responses:
 *       200:
 *         description: Organizador adicionado com sucesso.
 */
router.post('/event/:id/organizer', addOrganizer);

/**
 * @swagger
 * /api/event/{id}/organizer:
 *   get:
 *     tags:
 *       - Organizer
 *     summary: Lista os organizadores do evento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Organizadores retornados com sucesso.
 */
router.get('/event/:id/organizer', getOrganizers);

/**
 * @swagger
 * /api/event/{id}/organizer:
 *   patch:
 *     tags:
 *       - Organizer
 *     summary: Atualiza nível de organizador do evento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: Nível do organizador atualizado com sucesso.
 *       404:
 *         description: Evento ou organizador não encontrado.
 */
router.patch('/event/:id/organizer', updateOrganizer);

/**
 * @swagger
 * /api/event/{id}/organizer:
 *   delete:
 *     tags:
 *       - Organizer
 *     summary: Remove organizador do evento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: userId
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *     responses:
 *       200:
 *         description: Organizador removido com sucesso.
 */
router.delete('/event/:id/organizer', removeOrganizer);

export default router;
