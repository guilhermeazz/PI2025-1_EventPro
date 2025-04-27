import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Validação das variáveis de ambiente
    const { DB_USER, DB_PASSWORD, DB_CLUSTER, DB_NAME } = process.env;

    // Verifica se todas as variáveis necessárias estão presentes
    if (!DB_USER || !DB_PASSWORD || !DB_CLUSTER || !DB_NAME) {
      throw new Error('Missing required environment variables for database connection');
    }

    // Valida a URL de conexão
    const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

    // Verifica se a URL está bem formada
    const urlPattern = /^mongodb\+srv:\/\/[A-Za-z0-9]+:[A-Za-z0-9]+@([A-Za-z0-9.-]+)\/[A-Za-z0-9]+/;
    if (!urlPattern.test(uri)) {
      throw new Error('Invalid MongoDB connection URI');
    }

    // Conecta ao MongoDB
    await mongoose.connect(uri);
    
    // Verifica a conexão
    const isConnected = mongoose.connection.readyState === 1; // 1 significa "conectado"
    if (!isConnected) {
      throw new Error('Failed to establish a connection to MongoDB');
    }

    console.log('Conectado ao MongoDB com sucesso!');
  } catch (error: unknown) {
    // Verifica se o erro é uma instância de Error
    if (error instanceof Error) {
      // Agora podemos acessar 'message' com segurança
      console.error('Erro ao conectar ao MongoDB:', error.message);
    } else {
      console.error('Erro ao conectar ao MongoDB:', error);
    }
    process.exit(1);  // Encerra o servidor em caso de erro na conexão
  }
};

export default connectDB;
