import express from 'express';
import multer from 'multer';
import { register, verifyOtp } from '../controllers/userController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/signUp', upload.single('profileImage'), register);
router.post('/verifyOtp', verifyOtp);

export default router;