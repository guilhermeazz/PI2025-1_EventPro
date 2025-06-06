import { Router } from 'express';
import {
  createFaq,
  getFaqs,
  updateFaq,
  deleteFaq
} from '../controllers/FaqController';
import { authMiddleware } from '../middlewares/auth/AuthMiddlewares';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: FAQs
 *     description: API for managing Frequently Asked Questions
 */

/**
 * @swagger
 * /api/faq:
 *   post:
 *     summary: Create a new FAQ
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FAQ'
 *     responses:
 *       201:
 *         description: FAQ created successfully
 *       401:
 *         description: Não autorizado (token ausente ou inválido).
 *       500:
 *         description: Error while creating FAQ
 */
router.post('/', authMiddleware, createFaq);

/**
 * @swagger
 * /api/faq:
 *   get:
 *     summary: Get all FAQs
 *     tags: [FAQs]
 *     responses:
 *       200:
 *         description: List of FAQs
 *       404:
 *         description: Error while fetching FAQs
 */
router.get('/', getFaqs);

/**
 * @swagger
 * /api/faq/{id}:
 *   patch:
 *     summary: Update a FAQ by ID
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: FAQ ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FAQ'
 *     responses:
 *       200:
 *         description: FAQ updated successfully
 *       401:
 *         description: Não autorizado (token ausente ou inválido).
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Error while updating FAQ
 */
router.patch('/:id', authMiddleware, updateFaq);

/**
 * @swagger
 * /api/faq/{id}:
 *   delete:
 *     summary: Delete a FAQ by ID
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: FAQ ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: FAQ deleted successfully
 *       401:
 *         description: Não autorizado (token ausente ou inválido).
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Error while deleting FAQ
 */
router.delete('/:id', authMiddleware, deleteFaq);

export default router;
