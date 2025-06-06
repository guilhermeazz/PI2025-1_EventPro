// src/server.ts
import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import connectDB from './db/moongose';
import dotenv from 'dotenv';
import path from 'path';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import organizerRoutes from './routes/organizerRoutes';
import faqRoutes from './routes/faqRoutes';
import participationRoutes from './routes/participationRoutes';
import inscriptionRoutes from './routes/inscriptionRoutes';
import imageRoutes from './routes/imageRoutes';

dotenv.config();
connectDB();

// ✅ Configuração corrigida do Swagger JSDoc
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventPro API Documentation',
      version: '1.0.0',
      description:
        'API for Event Management and Access Control Application. This documentation provides details on available endpoints, request/response structures, and authentication methods.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
      schemas: {
        FAQ: {
          type: 'object',
          required: ['question', 'answer'],
          properties: {
            question: {
              type: 'string',
              description: 'The question of the FAQ.',
              example: 'What is EventPro?',
            },
            answer: {
              type: 'string',
              description: 'The answer to the FAQ.',
              example: 'EventPro is an application for event management and access control.',
            },
          },
        },
        UserRegisterInitiate: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'newuser@example.com' },
            password: { type: 'string', format: 'password', example: 'StrongPassword123!' },
          },
        },
        UserRegisterComplete: {
          type: 'object',
          required: ['userId', 'name', 'lastname', 'dateOfBirth', 'cpf', 'phone'],
          properties: {
            userId: { type: 'string', example: '60d0fe4f5b67d5001f3e0921' },
            name: { type: 'string', example: 'Jane' },
            lastname: { type: 'string', example: 'Doe' },
            dateOfBirth: { type: 'string', format: 'date', example: '1995-10-25' },
            cpf: { type: 'string', example: '987.654.321-01' },
            phone: { type: 'string', example: '+5521998765432' },
          },
        },
        ChangePassword: {
          type: 'object',
          required: ['oldPassword', 'newPassword'],
          properties: {
            oldPassword: { type: 'string', format: 'password', example: 'oldPassword123' },
            newPassword: { type: 'string', format: 'password', example: 'newSecurePassword456!' },
          },
        },
        ForgotPassword: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
          },
        },
        ResetPassword: {
          type: 'object',
          required: ['newPassword'],
          properties: {
            newPassword: { type: 'string', format: 'password', example: 'resettingPassword789#' },
          },
        },
        ValidateEntry: {
          type: 'object',
          required: ['qrData', 'userId'],
          properties: {
            qrData: {
              type: 'string',
              description: 'Event ID from QR code for flash events',
              example: '60d0fe4f5b67d5001f3e0921',
            },
            userId: {
              type: 'string',
              description: 'User ID',
              example: '60c8e23f1f7d5c001f3e0123',
            },
          },
        },
        ValidateExit: {
          type: 'object',
          required: ['userId'],
          properties: {
            userId: {
              type: 'string',
              description: 'User ID',
              example: '60c8e23f1f7d5c001f3e0123',
            },
          },
        },
        UpdateParticipationStatus: {
          type: 'object',
          required: ['newStatus'],
          properties: {
            newStatus: {
              type: 'string',
              enum: [
                'PENDING',
                'APPROVED',
                'REJECTED',
                'CHECKIN',
                'CHECKOUT',
                'CERTIFICATE_GENERATED',
                'CERTIFICATE_SENT',
                'CERTIFICATE_REVOKED',
                'CERTIFICATE_APPROVED',
              ],
              example: 'CHECKIN',
            },
          },
        },
      },
    },
  },
  // ✅ Agora corretamente fora do 'definition':
  apis: [path.join(process.cwd(), 'src', 'routes', '*.ts')],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export const createServer = (): Application => {
  const app = express();

  app.use(express.json());

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
      explorer: true,
      customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-flattop.css',
      customSiteTitle: 'EventPro API Documentation',
    })
  );

  app.use('/api', userRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/event', eventRoutes);
  app.use('/api/organizers', organizerRoutes);
  app.use('/api/faq', faqRoutes);
  app.use('/api/participation', participationRoutes);
  app.use('/api/inscription', inscriptionRoutes);
  app.use('/api/images', imageRoutes);

  return app;
};
