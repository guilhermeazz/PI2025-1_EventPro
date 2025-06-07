// src/routes/authRoutes.ts
import Router from 'express';
import {
  login,
  requestVerificationCode,
  registerUser,
  forgotPassword,
  resetPassword
} from '../controllers/AuthController';

const router = Router();

// As rotas de autenticação/registro (login, request code, register, forgot/reset password)
// geralmente SÃO PÚBLICAS e não exigem autenticação prévia.

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Realiza o login de um usuário
 *     description: 'Endpoint para realizar o login de um usuário no sistema.'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 'Email do usuário.'
 *                 example: 'user@example.com'
 *               password:
 *                 type: string
 *                 description: 'Senha do usuário.'
 *                 example: 'senhaSegura123'
 *     responses:
 *       200:
 *         description: 'Login realizado com sucesso.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Login realizado com sucesso!'
 *                 token:
 *                   type: string
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: '60c8e23f1f7d5c001f3e0123'
 *                     email:
 *                       type: string
 *                       example: 'user@example.com'
 *                     name:
 *                       type: string
 *                       example: 'John'
 *                     lastname:
 *                       type: string
 *                       example: 'Doe'
 *       401:
 *         description: 'Credenciais inválidas.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Senha inválida'
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/request-verification-code:
 *   post:
 *     tags: [Register]
 *     summary: Solicita um código de verificação para cadastro
 *     description: 'Envia um código de 5 caracteres para o e-mail do usuário para iniciar o cadastro.'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: 'Email do usuário para o qual o código será enviado.'
 *                 example: 'novo.usuario@example.com'
 *     responses:
 *       202:
 *         description: 'Código de verificação enviado com sucesso.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Código de verificação enviado para seu e-mail. Por favor, verifique sua caixa de entrada.'
 *       409:
 *         description: 'Este e-mail já está cadastrado em nossa base.'
 *       500:
 *         description: 'Erro interno ao solicitar código de verificação.'
 */
router.post('/request-verification-code', requestVerificationCode);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Register]
 *     summary: Finaliza o cadastro de usuário com o código de verificação
 *     description: 'Cria um novo usuário completo após a verificação do e-mail com o código.'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *               - name
 *               - lastname
 *               - dateOfBirth
 *               - cpf
 *               - phone
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: 'Email do usuário.'
 *                 example: 'novo.usuario@example.com'
 *               code:
 *                 type: string
 *                 description: 'Código de verificação de 5 caracteres recebido por e-mail.'
 *                 example: '12345'
 *               name:
 *                 type: string
 *                 description: 'Nome do usuário.'
 *                 example: 'João'
 *               lastname:
 *                 type: string
 *                 description: 'Sobrenome do usuário.'
 *                 example: 'Silva'
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: 'Data de nascimento do usuário (YYYY-MM-DD).'
 *                 example: '1990-01-01'
 *               cpf:
 *                 type: string
 *                 description: 'CPF do usuário (único).'
 *                 example: '123.456.789-00'
 *               phone:
 *                 type: string
 *                 description: 'Número de telefone do usuário.'
 *                 example: '+5511999999999'
 *               password:
 *                 type: string
 *                 description: 'Senha para o novo usuário. Deve conter ao menos 8 caracteres, incluindo letras, números e caracteres especiais.'
 *                 example: 'MinhaSenhaSegura123!'
 *     responses:
 *       201:
 *         description: 'Cadastro realizado com sucesso!'
 *       400:
 *         description: 'Código de verificação inválido/expirado ou erro de validação de dados.'
 *       409:
 *         description: 'E-mail ou CPF já cadastrado.'
 *       500:
 *         description: 'Erro interno ao finalizar o cadastro.'
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Solicita recuperação de senha
 *     description: 'Envia um e-mail com um link para redefinir a senha.'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPassword'
 *     responses:
 *       200:
 *         description: 'Se o e-mail estiver cadastrado, um link de recuperação foi enviado.'
 *       500:
 *         description: 'Erro interno ao solicitar recuperação de senha.'
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Redefine a senha do usuário
 *     description: 'Redefine a senha do usuário usando um token de recuperação.'
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: 'Token de recuperação de senha.'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       200:
 *         description: 'Senha redefinida com sucesso.'
 *       400:
 *         description: 'Token inválido ou expirado, ou nova senha não atende aos requisitos.'
 *       500:
 *         description: 'Erro interno ao redefinir a senha.'
 */
router.post('/reset-password', resetPassword);

// Se você tiver uma rota /api/auth/me protegida:
/*
import { getUserDetails } from '../controllers/UserController'; // ou AuthController, se moveu para lá
import { authMiddleware } from '../middlewares/auth/AuthMiddlewares';
router.get('/me', authMiddleware, getUserDetails);
*/

export default router;
