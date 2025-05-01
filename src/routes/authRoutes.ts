import Router from 'express';

import { register, login } from '../controllers/AuthController';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     description: Endpoint para registrar um novo usuário no sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do usuário.
 *               lastname:
 *                 type: string
 *                 description: Sobrenome do usuário.
 *               password:
 *                 type: string
 *                 description: Senha do usuário.
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: Data de nascimento do usuário.
 *               cpf:
 *                 type: string
 *                 description: CPF do usuário.
 *               phone:
 *                 type: string
 *                 description: Número de telefone do usuário.
 *               email:
 *                 type: string
 *                 description: Email do usuário.
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso.
 *       400:
 *         description: Usuário já cadastrado ou dados inválidos fornecidos.
 */
router.post('/auth/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza o login de um usuário
 *     description: Endpoint para realizar o login de um usuário no sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *       401:
 *         description: Credenciais inválidas.
 */
router.post('/auth/login', login);
