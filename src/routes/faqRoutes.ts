import { Router } from 'express';
import {
  createFaq,
  getFaqs,
  updateFaq,
  deleteFaq
} from '../controllers/FaqController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: FAQs
 *   description: API for managing Frequently Asked Questions
 */

/**
 * @swagger
 * /api/faqs:
 *   post:
 *     summary: Create a new FAQ
 *     tags: [FAQs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FAQ'
 *     responses:
 *       201:
 *         description: FAQ created successfully
 *       500:
 *         description: Error while creating FAQ
 */
router.post('/', createFaq);

/**
 * @swagger
 * /api/faqs:
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
 * /api/faqs/{id}:
 *   patch:
 *     summary: Update a FAQ by ID
 *     tags: [FAQs]
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
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Error while updating FAQ
 */
router.patch('/:id', updateFaq);

/**
 * @swagger
 * /api/faqs/{id}:
 *   delete:
 *     summary: Delete a FAQ by ID
 *     tags: [FAQs]
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
 *       404:
 *         description: FAQ not found
 *       500:
 *         description: Error while deleting FAQ
 */
router.delete('/:id', deleteFaq);

export default router;
