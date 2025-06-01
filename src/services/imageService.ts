import cloudinary from './cloudinary';
import Image from '../models/Image';

export const uploadToCloudinary = async (fileBuffer: Buffer, filename: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: 'image', public_id: `mvp-images/${filename}` },
      async (error, result) => {
        if (error || !result) return reject(error);

        // Salvar no MongoDB
        const savedImage = await Image.create({
          url: result.secure_url,
          public_id: result.public_id,
        });

        resolve(savedImage);
      }
    ).end(fileBuffer);
  });
};
