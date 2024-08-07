import express from 'express';
import multer from 'multer';
import { register, verifyOtp, login } from '../controllers/userController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/signUp', upload.single('profileImage'), register);
router.post('/verifyOtp', verifyOtp);
router.post('/login', login);

export default router;
