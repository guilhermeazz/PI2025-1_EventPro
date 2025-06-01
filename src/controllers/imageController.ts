import { Request, Response } from 'express';
import { uploadToCloudinary } from '../services/imageService';

export const uploadImage = async (req: Request, res: Response) : Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
    }

    const filename = req.file.originalname.split('.')[0]; // nome do arquivo sem extensão
    const image = await uploadToCloudinary(req.file.buffer, filename);

    return res.status(201).json({
      message: 'Imagem enviada com sucesso!',
      data: image,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao enviar imagem.' });
  }
};
