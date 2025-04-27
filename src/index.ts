import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import connectDB from './db/moongose';  // Importe a função de conexão com o banco de dados

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Testa a conexão com o banco de dados quando o servidor for iniciado
connectDB();

app.use(express.json());

// Configuração das rotas
app.use('/api', userRoutes);

app.get('/', (_req, res) => {
  res.send('API está rodando! 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
