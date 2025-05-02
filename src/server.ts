import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import connectDB from './db/moongose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'; // Importa suas rotas
import authRoutes from './routes/authRoutes'; // Importa as rotas de autenticação
import eventRoutes from './routes/eventRoutes'; // Importa as rotas de eventos
import organizerRoutes from './routes/organizerRoutes'; // Importa as rotas de organizador
import faqRoutes from './routes/faqRoutes'; // Importa as rotas de FAQ
import participationRoutes from './routes/participationRoutes'; // Importa o modelo de participação
import inscriptionRoutes from './routes/inscriptionRoutes';


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

  // Adicionando rotas de usuário
  app.use('/api', userRoutes);

  // Rota de autenticacao
  app.use('/api/auth', authRoutes); 

  // Rota de eventos
  app.use('/api', eventRoutes, organizerRoutes);

  // Rota de faqs
  app.use('/api/faq', faqRoutes);

  // Rota de participações
  app.use('/api/participation', participationRoutes);

  // Rota de inscrições
  app.use('/api/inscription', inscriptionRoutes);

  return app;
};

export default createServer;