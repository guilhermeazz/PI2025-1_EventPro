import { Router } from 'express';
import {
  createInscription,
  getInscriptions,
  getInscriptionsById,
  deleteInscription
} from '../controllers/InscriptionsController';
import { validateUserExists } from '../middlewares/user/validateUserExist';
import { validateEventExists } from '../middlewares/event/validateEventExist';
import { validateParticipantFields } from '../middlewares/event/validateParticipantsField';
import { preventDuplicateInscription } from '../middlewares/event/preventDuplicateInscription';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Inscriptions
 *   description: API for managing event inscriptions
 */

/**
 * @swagger
 * /api/inscription:
 *   post:
 *     summary: Cria uma nova inscrição em um evento
 *     tags: [Inscriptions]
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
 *                 description: ID do usuário se inscrevendo
 *               eventId:
 *                 type: string
 *                 description: ID do evento no qual a inscrição está sendo feita
 *               forAnotherOne:
 *                 type: boolean
 *                 description: Indica se a inscrição é para outra pessoa
 *               participants:
 *                 type: object
 *                 description: Dados do participante (necessário apenas se forAnotherOne for true)
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
 *         description: "Inscrição criada com sucesso"
 *       400:
 *         description: "Requisição inválida (ex: campos obrigatórios ausentes)"
 *       404:
 *         description: "Usuário ou evento não encontrado"
 *       409:
 *         description: "Usuário já inscrito ou participante já inscrito"
 *       500:
 *         description: "Erro interno ao tentar criar a inscrição"
 */

router.post(
  "/",
  validateUserExists,               // valida antes
  validateEventExists,              // valida antes
  validateParticipantFields,        // preenche ou valida os dados do participante
  preventDuplicateInscription,      // impede duplicidade
  createInscription                 // só executa se tudo acima passou
);

/**
 * @swagger
 * /api/inscriptions:
 *   get:
 *     summary: Get all inscriptions
 *     tags: [Inscriptions]
 *     responses:
 *       200:
 *         description: List of inscriptions
 *       500:
 *         description: Error while fetching inscriptions
 */
router.get('/', getInscriptions);

/**
 * @swagger
 * /api/inscriptions/{id}:
 *   get:
 *     summary: Get an inscription by ID
 *     tags: [Inscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Inscription ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inscription found
 *       500:
 *         description: Error while fetching inscription
 */
router.get('/:id', getInscriptionsById);

/**
 * @swagger
 * /api/inscriptions/{id}:
 *   delete:
 *     summary: Delete an inscription by ID
 *     tags: [Inscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Inscription ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Inscription deleted successfully
 *       500:
 *         description: Error while deleting inscription
 */
router.delete('/:id', deleteInscription);

export default router;








