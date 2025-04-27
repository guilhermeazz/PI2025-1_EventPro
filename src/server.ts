import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import connectDB from './db/moongose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'; // Importa suas rotas

dotenv.config(); 

connectDB(); // Conecta ao banco de dados MongoDB

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentação da API',
      version: '1.0.0',
      description: 'API criada para o Projeto Integrador 2025.',
    },
    servers: [
      {
        url: 'http://localhost:3000', // URL base da sua API
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Caminho para os arquivos de rotas
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

const createServer = (): Application => {
  const app = express();

  // Middleware para JSON
  app.use(express.json());

  // Configurando o Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  // Adicionando rotas
  app.use('/api', userRoutes);

  return app;
};

export default createServer;