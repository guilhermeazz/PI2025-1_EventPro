import { Router } from 'express';
import {
  createInscription,
  getInscriptions,
  getInscriptionsById,
  deleteInscription,
  cancelInscription,
} from '../controllers/InscriptionsController';

import { validateUserExists } from '../middlewares/user/validateUserExist';
import { validateEventExists } from '../middlewares/event/validateEventExist';
import { validateParticipantFields } from '../middlewares/event/validateParticipantsField';
import { preventDuplicateInscription } from '../middlewares/event/preventDuplicateInscription';
import { authMiddleware } from '../middlewares/auth/AuthMiddlewares';

const router = Router();

// ✅ Aplica o middleware para todas as rotas de inscrição neste roteador
router.use('/', authMiddleware);

/**
 * @swagger
 * tags:
 *   - name: Inscriptions
 *     description: API for managing event inscriptions
 */

/**
 * @swagger
 * /api/inscription:
 *   post:
 *     summary: Cria uma nova inscrição em um evento
 *     tags: [Inscriptions]
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
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 'ID do usuário se inscrevendo'
 *                 example: "60c8e23f1f7d5c001f3e0123"
 *               eventId:
 *                 type: string
 *                 description: 'ID do evento no qual a inscrição está sendo feita'
 *                 example: "60d0fe4f5b67d5001f3e0921"
 *               forAnotherOne:
 *                 type: boolean
 *                 description: 'Indica se a inscrição é para outra pessoa'
 *                 example: false
 *               participants:
 *                 type: object
 *                 description: 'Dados do participante (necessário apenas se forAnotherOne for true)'
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "João da Silva"
 *                   email:
 *                     type: string
 *                     example: "joao@email.com"
 *                   dateOfBirth:
 *                     type: string
 *                     format: date
 *                     example: "1990-01-01"
 *                   document:
 *                     type: string
 *                     example: "12345678900"
 *     responses:
 *       201:
 *         description: 'Inscrição criada com sucesso'
 *       400:
 *         description: 'Requisição inválida (ex: campos obrigatórios ausentes)'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido)'
 *       404:
 *         description: 'Usuário ou evento não encontrado'
 *       409:
 *         description: 'Usuário já inscrito ou participante já inscrito'
 *       500:
 *         description: 'Erro interno ao tentar criar a inscrição'
 */
router.post(
  '/',
  validateUserExists,
  validateEventExists,
  validateParticipantFields,
  preventDuplicateInscription,
  createInscription
);

/**
 * @swagger
 * /api/inscription:
 *   get:
 *     summary: Get all inscriptions
 *     tags: [Inscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 'List of inscriptions'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido)'
 *       500:
 *         description: 'Error while fetching inscriptions'
 */
router.get('/', getInscriptions);

/**
 * @swagger
 * /api/inscription/{id}:
 *   get:
 *     summary: Get an inscription by ID
 *     tags: [Inscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 'Inscription ID'
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 'Inscription found'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido)'
 *       500:
 *         description: 'Error while fetching inscription'
 */
router.get('/:id', getInscriptionsById);

/**
 * @swagger
 * /api/inscription/{id}:
 *   delete:
 *     summary: Delete an inscription by ID
 *     tags: [Inscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 'Inscription ID'
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: 'Inscription deleted successfully'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido)'
 *       500:
 *         description: 'Error while deleting inscription'
 */
router.delete('/:id', deleteInscription);

/**
 * @swagger
 * /api/inscription/{id}/cancel:
 *   patch:
 *     summary: Cancela uma inscrição em um evento
 *     tags: [Inscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 'ID da inscrição a ser cancelada'
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 'Inscrição cancelada com sucesso'
 *       400:
 *         description: 'Esta inscrição já está cancelada'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido)'
 *       404:
 *         description: 'Inscrição não encontrada'
 *       500:
 *         description: 'Erro interno ao cancelar a inscrição'
 */
router.patch('/:id/cancel', cancelInscription);

export default router;
