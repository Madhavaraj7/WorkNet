
import express from "express";
import multer from "multer";
import {
  register,
  verifyOtp,
  login,
  resendOtp,
  googleLoginHandler,
  updateProfile,
  forgotPasswordHandler,
  resetPasswordHandler
} from "../controllers/userController";

import {adminlogin,adminupdateProfile, getUsersList, toggleBlockUser} from "../controllers/adminController"

// const jwtMiddleware = require('../../MiddleWare/jwt')
import jwtMiddleware from "../MiddleWare/jwt"
import AdminjwtMiddleware from "../MiddleWare/AdJwt"



const router = express.Router();

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// user Routes
router.post("/signUp", upload.single("profileImage"), register);
router.post("/verifyOtp", verifyOtp);
router.post("/resendOtp", resendOtp);
router.post("/login", login);
router.post("/googleLogin", googleLoginHandler);
router.put("/profile", jwtMiddleware,upload.single("profileImage"), updateProfile);  
router.post("/forgotPassword", forgotPasswordHandler);
router.post("/resetPassword", resetPasswordHandler);


// admin Routes
router.post("/adminLogin",adminlogin)
router.put("/adprofile", AdminjwtMiddleware,upload.single("profileImage"), adminupdateProfile);  
router.get('/getAllUsers', AdminjwtMiddleware, getUsersList); 
router.put('/blockUser', AdminjwtMiddleware, toggleBlockUser); 


export default router;
