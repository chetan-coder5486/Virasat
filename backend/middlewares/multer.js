import multer from 'multer';

// We configure multer to store files in memory as a buffer
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;