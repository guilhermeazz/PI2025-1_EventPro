import { Router } from 'express';
import {
  createParticipation,
  getParticipations,
  getParticipationsById,
  updateParticipation,
  deleteParticipation,
  updateParticipationStatus,
} from '../controllers/ParticipationController';

import { authMiddleware } from '../middlewares/auth/AuthMiddlewares';

const router = Router();

// ✅ Aplica o middleware para todas as rotas de participação neste roteador
router.use('/', authMiddleware);

/**
 * @swagger
 * tags:
 *   - name: Participations
 *     description: API for managing event participations
 */

/**
 * @swagger
 * /api/participation:
 *   post:
 *     summary: Create a new participation
 *     tags: [Participations]
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
 *               - eventId
 *               - name
 *               - email
 *               - dateOfBirth
 *               - document
 *               - avaliation
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 'ID do usuário participando.'
 *                 example: "60c8e23f1f7d5c001f3e0123"
 *               eventId:
 *                 type: string
 *                 description: 'ID do evento.'
 *                 example: "60d0fe4f5b67d5001f3e0921"
 *               name:
 *                 type: string
 *                 example: "João da Silva"
 *               email:
 *                 type: string
 *                 example: "joao@email.com"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-20"
 *               document:
 *                 type: string
 *                 example: "123.456.789-00"
 *               avaliation:
 *                 type: object
 *                 properties:
 *                   note:
 *                     type: number
 *                     example: 5
 *                   comment:
 *                     type: string
 *                     example: "Excelente evento"
 *     responses:
 *       201:
 *         description: 'Participation created successfully'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido)'
 *       500:
 *         description: 'Error while creating participation'
 */
router.post('/', createParticipation);

/**
 * @swagger
 * /api/participation:
 *   get:
 *     summary: Get all participations
 *     tags: [Participations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 'List of participations'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido)'
 *       404:
 *         description: 'Error while fetching participations'
 */
router.get('/', getParticipations);

/**
 * @swagger
 * /api/participation/{id}:
 *   get:
 *     summary: Get a participation by ID
 *     tags: [Participations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 'Participation ID'
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 'Participation found'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido)'
 *       404:
 *         description: 'Participation not found'
 */
router.get('/:id', getParticipationsById);

/**
 * @swagger
 * /api/participation/{id}:
 *   patch:
 *     summary: Update a participation by ID
 *     tags: [Participations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 'Participation ID'
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - dateOfBirth
 *               - document
 *               - avaliation
 *             properties:
 *               name:
 *                 type: string
 *                 example: "João Atualizado"
 *               email:
 *                 type: string
 *                 example: "joao@atualizado.com"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1991-01-01"
 *               document:
 *                 type: string
 *                 example: "987.654.321-00"
 *               avaliation:
 *                 type: object
 *                 properties:
 *                   note:
 *                     type: number
 *                     example: 4
 *                   comment:
 *                     type: string
 *                     example: "Boa experiência"
 *     responses:
 *       200:
 *         description: 'Participation updated'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido)'
 *       404:
 *         description: 'Participation not found'
 */
router.patch('/:id', updateParticipation);

/**
 * @swagger
 * /api/participation/{id}:
 *   delete:
 *     summary: Delete a participation by ID
 *     tags: [Participations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 'Participation ID'
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 'Participation deleted successfully'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido)'
 *       404:
 *         description: 'Participation not found'
 */
router.delete('/:id', deleteParticipation);

/**
 * @swagger
 * /api/participation/{id}/status:
 *   patch:
 *     summary: Atualiza o status de uma participação
 *     tags: [Participations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 'Participation ID'
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateParticipationStatus'
 *     responses:
 *       200:
 *         description: 'Status da participação atualizado com sucesso'
 *       400:
 *         description: 'Status de participação inválido'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido)'
 *       404:
 *         description: 'Participação não encontrada'
 *       500:
 *         description: 'Erro interno ao atualizar status da participação'
 */
router.patch('/:id/status', updateParticipationStatus);

export default router;
