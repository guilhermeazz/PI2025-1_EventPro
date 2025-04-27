import { Router } from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/UserController';

const router = Router();

/**
 * @swagger
 * /api/user:
 *   post:
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

/**
 * @swagger
 * /api/user:
 *   get:
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

/**
 * @swagger
 * /api/user/{id}:
 *   put:
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
router.put('/user/:id', updateUser);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
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