import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const connectDB = async () => {
  try {
    // Validação das variáveis de ambiente [cite: 109]
    const { DB_USER, DB_PASSWORD, DB_CLUSTER, DB_NAME } = process.env;
    // Verifica se todas as variáveis necessárias estão presentes [cite: 109]
    if (!DB_USER || !DB_PASSWORD || !DB_CLUSTER || !DB_NAME) {
      throw new Error('Missing required environment variables for database connection');
    }

    // Valida a URL de conexão [cite: 111]
    const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
    // Verifica se a URL está bem formada [cite: 112]
    const urlPattern = /^mongodb\+srv:\/\/[A-Za-z0-9]+:[A-Za-z0-9]+@([A-Za-z0-9.-]+)\/[A-Za-z0-9]+/;
    if (!urlPattern.test(uri)) {
      throw new Error('Invalid MongoDB connection URI');
    }

    // Conecta ao MongoDB [cite: 113]
    await mongoose.connect(uri);
    // Verifica a conexão [cite: 114]
    const isConnected = mongoose.connection.readyState === 1;
    // 1 significa "conectado" [cite: 115]
    if (!isConnected) {
      throw new Error('Failed to establish a connection to MongoDB');
    }

    console.log('Conectado ao MongoDB com sucesso!');
  } catch (error: unknown) {
    // Verifica se o erro é uma instância de Error [cite: 116]
    if (error instanceof Error) {
      // Agora podemos acessar 'message' com segurança [cite: 117]
      console.error('Erro ao conectar ao MongoDB:', error.message);
    } else {
      console.error('Erro ao conectar ao MongoDB:', error);
    }
    process.exit(1);
  }
};

export default connectDB;