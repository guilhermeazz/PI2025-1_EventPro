import multer from 'multer';

const storage = multer.memoryStorage(); // mantém na memória, ideal se vai direto para o Cloudinary

const upload = multer({ storage });

export default upload;
