import { Router } from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserDetails
} from '../controllers/UserController';
import { authMiddleware } from '../middlewares/auth/AuthMiddlewares';

const router = Router();

// Rota de Post para criar um novo usuário

/**
 * @swagger
 * /api/user:
 *   post:
 *     tags:
 *       - User
 *     summary: Cria um novo usuário
 *     description: Endpoint para criar um usuário no banco de dados.
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
 *         description: Usuário criado com sucesso.
 *       400:
 *         description: Dados inválidos fornecidos.
 */
router.post('/user', createUser);

//Rotas de Get para listar todos os usuários e obter um usuário específico pelo ID

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags:
 *       - User
 *       - Auth
 *     summary: Obtém os detalhes do usuário autenticado
 *     description: Endpoint para obter os detalhes do usuário autenticado no sistema.
 *     responses:
 *       200:
 *         description: Detalhes do usuário obtidos com sucesso.
 *       401:
 *         description: Usuário não autenticado.
 */
router.get('/me', authMiddleware, getUserDetails);

/**
 * @swagger
 * /api/user:
 *   get:
 *     tags:
 *       - User
 *     summary: Lista todos os usuários
 *     description: Retorna uma lista de todos os usuários cadastrados.
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso.
 *       404:
 *         description: Nenhum usuário encontrado.
 */
router.get('/user', getUsers);

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Obtem um usuário pelo ID
 *     description: Retorna os dados de um usuário específico.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 */
router.get('/user/:id', getUserById);

// Rota de Patch para atualizar um usuário pelo ID

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Atualiza um usuário pelo ID
 *     description: Atualiza os dados de um usuário específico.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: string
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
 *       200:
 *         description: Usuário atualizado com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 */
router.patch('/user/:id', updateUser);

// Rota de Delete para excluir um usuário pelo ID

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Exclui um usuário pelo ID
 *     description: Remove um usuário específico do banco de dados.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 */
router.delete('/user/:id', deleteUser);

export default router;