import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const { DB_USER, DB_PASSWORD, DB_CLUSTER, DB_NAME } = process.env;

    if (!DB_USER || !DB_PASSWORD || !DB_CLUSTER || !DB_NAME) {
      throw new Error('Missing database connection variables');
    }

    const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(uri);
    console.log('Conectado ao MongoDB com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB', error);
    process.exit(1);  
  }
};

export default connectDB;
