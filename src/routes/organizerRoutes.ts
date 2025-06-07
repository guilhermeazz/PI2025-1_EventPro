import { Router } from 'express';
import {
  addOrganizer,
  removeOrganizer,
  getOrganizers,
  updateOrganizer,
} from '../controllers/EventController';
import { authMiddleware } from '../middlewares/auth/AuthMiddlewares';

const router = Router();

// ✅ Aplica o middleware de autenticação para todas as rotas de organizador neste roteador
router.use('/', authMiddleware);

/**
 * @swagger
 * tags:
 *   - name: Event Organizers
 *     description: API para gerenciar organizadores de eventos
 */

/**
 * @swagger
 * /api/organizers/event/{id}:
 *   get:
 *     tags: [Event Organizers]
 *     summary: Lista organizadores de um evento
 *     description: 'Retorna a lista de organizadores de um evento específico.'
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
 *         description: 'Lista de organizadores retornada com sucesso.'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido).'
 *       404:
 *         description: 'Evento não encontrado.'
 *       500:
 *         description: 'Erro ao obter organizadores do evento.'
 */
router.get('/event/:id', getOrganizers);

/**
 * @swagger
 * /api/organizers/event/{id}:
 *   post:
 *     tags: [Event Organizers]
 *     summary: Adiciona um organizador ao evento
 *     description: 'Adiciona um novo organizador ao evento especificado.'
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
 *             required:
 *               - userId
 *               - nivel
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 'ID do usuário a ser adicionado como organizador.'
 *                 example: "60c8e23f1f7d5c001f3e0123"
 *               nivel:
 *                 type: string
 *                 enum: [admin, reception, speaker]
 *                 description: 'Nível de acesso do organizador.'
 *                 example: "reception"
 *     responses:
 *       200:
 *         description: 'Organizador adicionado com sucesso.'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido).'
 *       404:
 *         description: 'Evento não encontrado.'
 *       500:
 *         description: 'Erro ao adicionar organizador.'
 */
router.post('/event/:id', addOrganizer);

/**
 * @swagger
 * /api/organizers/event/{id}/{userId}:
 *   patch:
 *     tags: [Event Organizers]
 *     summary: Atualiza o nível de um organizador
 *     description: 'Atualiza o nível de acesso de um organizador específico em um evento.'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 'ID do evento'
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 'ID do organizador'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nivel
 *             properties:
 *               nivel:
 *                 type: string
 *                 enum: [admin, reception, speaker]
 *                 description: 'O novo nível de acesso para o organizador.'
 *                 example: "speaker"
 *     responses:
 *       200:
 *         description: 'Nível do organizador atualizado com sucesso.'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido).'
 *       404:
 *         description: 'Evento ou organizador não encontrado.'
 *       500:
 *         description: 'Erro ao atualizar organizador de evento.'
 */
router.patch('/event/:id/:userId', updateOrganizer);

/**
 * @swagger
 * /api/organizers/event/{id}/{userId}:
 *   delete:
 *     tags: [Event Organizers]
 *     summary: Remove um organizador do evento
 *     description: 'Remove um organizador específico do evento.'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 'ID do evento'
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 'ID do organizador a ser removido'
 *     responses:
 *       200:
 *         description: 'Organizador removido com sucesso.'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido).'
 *       404:
 *         description: 'Evento ou organizador não encontrado.'
 *       500:
 *         description: 'Erro ao remover organizador.'
 */
router.delete('/event/:id/:userId', removeOrganizer);

export default router;
