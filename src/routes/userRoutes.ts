import { Router } from 'express';
import {
  createUser,         // Rota /api/user           POST
  getUsers,           // Rota /api/user           GET (todos)
  getUserById,        // Rota /api/user/{id}      GET
  updateUser,         // Rota /api/user/{id}      PATCH
  deleteUser,         // Rota /api/user/{id}      DELETE
  getUserDetails,     // Rota /api/user/me        GET
  changePassword,     // Rota /api/user/change-password PATCH
} from '../controllers/UserController';

import { authMiddleware } from '../middlewares/auth/AuthMiddlewares';

const router = Router();

/**
 * @swagger
 * /api/user:
 *   post:
 *     tags: [Register]
 *     summary: Cria um novo usuário (completo)
 *     description: 'Endpoint para criar um usuário completo no banco de dados. Este endpoint NÃO exige verificação de e-mail.'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - lastname
 *               - password
 *               - dateOfBirth
 *               - cpf
 *               - phone
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: 'Nome do usuário.'
 *                 example: John
 *               lastname:
 *                 type: string
 *                 description: 'Sobrenome do usuário.'
 *                 example: Doe
 *               password:
 *                 type: string
 *                 description: 'Senha do usuário. Deve conter ao menos 8 caracteres, incluindo letras, números e caracteres especiais.'
 *                 example: minhaSenhaForte!123
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: 'Data de nascimento do usuário (YYYY-MM-DD).'
 *                 example: 1990-01-01
 *               cpf:
 *                 type: string
 *                 description: 'CPF do usuário (único).'
 *                 example: 123.456.789-00
 *               phone:
 *                 type: string
 *                 description: 'Número de telefone do usuário.'
 *                 example: "+5511987654321"
 *               email:
 *                 type: string
 *                 description: 'Email do usuário (único).'
 *                 example: newuser@example.com
 *     responses:
 *       201:
 *         description: 'Usuário criado com sucesso.'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60c8e23f1f7d5c001f3e0123"
 *                 name:
 *                   type: string
 *                   example: "John"
 *                 email:
 *                   type: string
 *                   example: "newuser@example.com"
 *       400:
 *         description: 'Dados inválidos fornecidos (ex: senha fraca, campos faltando).'
 *       409:
 *         description: 'E-mail ou CPF já cadastrado.'
 *       500:
 *         description: 'Erro interno ao criar usuário.'
 */
router.post('/user', createUser);

// Aplica o middleware de autenticação para as demais rotas
router.use('/user', authMiddleware);

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     tags: [User, Auth]
 *     summary: Obtém os detalhes do usuário autenticado
 *     description: 'Endpoint para obter os detalhes do usuário autenticado no sistema.'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 'Detalhes do usuário obtidos com sucesso.'
 *       401:
 *         description: 'Usuário não autenticado.'
 */
router.get('/me', getUserDetails);

/**
 * @swagger
 * /api/user/change-password:
 *   patch:
 *     tags: [User, Auth]
 *     summary: Altera a senha do usuário autenticado
 *     description: 'Endpoint para alterar a senha do usuário, exigindo a senha antiga e a nova.'
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePassword'
 *     responses:
 *       200:
 *         description: 'Senha alterada com sucesso.'
 *       400:
 *         description: 'Requisição inválida (ex: nova senha não atende aos requisitos).'
 *       401:
 *         description: 'Não autorizado (token inválido ou senha antiga incorreta).'
 *       404:
 *         description: 'Usuário não encontrado.'
 *       500:
 *         description: 'Erro interno ao alterar a senha.'
 */
router.patch('/change-password', changePassword);

/**
 * @swagger
 * /api/user:
 *   get:
 *     tags: [User]
 *     summary: Lista todos os usuários
 *     description: 'Retorna uma lista de todos os usuários cadastrados.'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 'Lista de usuários retornada com sucesso.'
 *       404:
 *         description: 'Nenhum usuário encontrado.'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido).'
 */
router.get('/', getUsers);

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     tags: [User]
 *     summary: Obtem um usuário pelo ID
 *     description: 'Retorna os dados de um usuário específico.'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 'ID do usuário.'
 *     responses:
 *       200:
 *         description: 'Usuário encontrado com sucesso.'
 *       404:
 *         description: 'Usuário não encontrado.'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido).'
 */
router.get('/:id', getUserById);

/**
 * @swagger
 * /api/user/{id}:
 *   patch:
 *     tags: [User]
 *     summary: Atualiza um usuário pelo ID
 *     description: 'Atualiza os dados de um usuário específico.'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 'ID do usuário.'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 'Nome do usuário.'
 *               lastname:
 *                 type: string
 *                 description: 'Sobrenome do usuário.'
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: 'Data de nascimento do usuário.'
 *               cpf:
 *                 type: string
 *                 description: 'CPF do usuário.'
 *               phone:
 *                 type: string
 *                 description: 'Número de telefone do usuário.'
 *               email:
 *                 type: string
 *                 description: 'Email do usuário.'
 *     responses:
 *       200:
 *         description: 'Usuário atualizado com sucesso.'
 *       404:
 *         description: 'Usuário não encontrado.'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido).'
 */
router.patch('/:id', updateUser);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Exclui um usuário pelo ID
 *     description: 'Remove um usuário específico do banco de dados.'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 'ID do usuário.'
 *     responses:
 *       200:
 *         description: 'Usuário excluído com sucesso.'
 *       404:
 *         description: 'Usuário não encontrado.'
 *       401:
 *         description: 'Não autorizado (token ausente ou inválido).'
 */
router.delete('/:id', deleteUser);

export default router;
