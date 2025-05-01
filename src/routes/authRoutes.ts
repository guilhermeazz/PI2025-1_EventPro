import Router from 'express';

import { login } from '../controllers/AuthController';


const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Realiza o login de um usuário
 *     description: Endpoint para realizar o login de um usuário no sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do usuário.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: Senha do usuário.
 *                 example: senhaSegura123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *       401:
 *         description: Credenciais inválidas.
 */
router.post('/login', login);

export default router;