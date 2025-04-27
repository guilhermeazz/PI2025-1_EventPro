import { Router } from "express";
import { createUser, getUsers, getUserById, updateUser, deleteUser } from "../controllers/UserController";

const router = Router();

// Rotas para usuários
router.post("/user", createUser); // Criar novo usuário
router.get("/user", getUsers); // Listar usuários


export default router;