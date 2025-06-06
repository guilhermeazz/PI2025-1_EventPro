// src/index.ts
import dotenv from 'dotenv';
// Correção: Importar como named export, já que server.ts faz 'export const createServer'
import { createServer } from './src/server';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Cria o servidor
const app = createServer();

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
});