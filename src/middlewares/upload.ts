import multer from 'multer';
const storage = multer.memoryStorage(); // mantém na memória, ideal se vai direto para o Cloudinary [cite: 120]

const upload = multer({ storage });
export default upload;