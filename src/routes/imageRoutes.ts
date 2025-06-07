import { Router } from 'express';
import upload from '../middlewares/upload';
import { uploadImage } from '../controllers/imageController';
import { authMiddleware } from '../middlewares/auth/AuthMiddlewares';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Images
 *     description: Endpoints para upload de imagens
 */

/**
 * @swagger
 * /api/images/upload:
 *   post:
 *     summary: Faz upload de uma imagem para o Cloudinary e salva no banco de dados
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de imagem para ser enviado
 *     responses:
 *       201:
 *         description: Imagem enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Imagem enviada com sucesso!
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 66217f27b0f43d56a33450d9
 *                     url:
 *                       type: string
 *                       example: https://res.cloudinary.com/your_cloud/image/upload/v1/mvp-images/image123.jpg
 *                     public_id:
 *                       type: string
 *                       example: mvp-images/image123
 *                     createdAt:
 *                       type: string
 *                       example: 2025-05-18T15:23:00.000Z
 *       400:
 *         description: Nenhuma imagem enviada
 *       401:
 *         description: Não autorizado (token ausente ou inválido).
 *       500:
 *         description: Erro ao enviar imagem
 */
router.post('/upload', upload.single('image'), uploadImage);

export default router;
