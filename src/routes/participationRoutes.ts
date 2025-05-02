import { Router } from 'express';
import {
  createParticipation,
  getParticipations,
  getParticipationsById,
  updateParticipation,
  deleteParticipation
} from '../controllers/ParticipationController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Participations
 *   description: API for managing event participations
 */

/**
 * @swagger
 * /api/participations:
 *   post:
 *     summary: Create a new participation
 *     tags: [Participations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Participation'
 *     responses:
 *       201:
 *         description: Participation created successfully
 *       500:
 *         description: Error while creating participation
 */
router.post('/', createParticipation);

/**
 * @swagger
 * /api/participations:
 *   get:
 *     summary: Get all participations
 *     tags: [Participations]
 *     responses:
 *       200:
 *         description: List of all participations
 *       404:
 *         description: Error while fetching participations
 */
router.get('/', getParticipations);

/**
 * @swagger
 * /api/participations/{id}:
 *   get:
 *     summary: Get a participation by ID
 *     tags: [Participations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Participation ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Participation found
 *       404:
 *         description: Participation not found
 */
router.get('/:id', getParticipationsById);

/**
 * @swagger
 * /api/participations/{id}:
 *   patch:
 *     summary: Update a participation by ID
 *     tags: [Participations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Participation ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Participation'
 *     responses:
 *       200:
 *         description: Participation updated
 *       404:
 *         description: Participation not found
 */
router.patch('/:id', updateParticipation);

/**
 * @swagger
 * /api/participations/{id}:
 *   delete:
 *     summary: Delete a participation by ID
 *     tags: [Participations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Participation ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Participation deleted successfully
 *       404:
 *         description: Participation not found
 */
router.delete('/:id', deleteParticipation);

export default router;
