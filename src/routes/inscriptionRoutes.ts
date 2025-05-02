import { Router } from 'express';
import {
  createInscription,
  getInscriptions,
  getInscriptionsById,
  deleteInscription
} from '../controllers/InscriptionsController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Inscriptions
 *   description: API for managing event inscriptions
 */

/**
 * @swagger
 * /api/inscriptions:
 *   post:
 *     summary: Create a new inscription
 *     tags: [Inscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inscription'
 *     responses:
 *       201:
 *         description: Inscription created successfully
 *       500:
 *         description: Error while creating inscription
 */
router.post('/', createInscription);

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
