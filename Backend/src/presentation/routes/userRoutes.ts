import express from "express";
import multer from "multer";
import {
  register,
  verifyOtp,
  login,
  resendOtp,
  googleLoginHandler,
} from "../controllers/userController";


const router = express.Router();

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post("/signUp", upload.single("profileImage"), register);
router.post("/verifyOtp", verifyOtp);
router.post("/resendOtp", resendOtp);
router.post("/login", login);
router.post("/googleLogin", googleLoginHandler);

export default router;
