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
  resetPasswordHandler,
} from "../controllers/userController";

import {
  adminlogin,
  adminupdateProfile,
  blockUserController,
  deleteWorkerController,
  getAllWorkersController,
  getUsersList,
  unblockUserController,
  updateWorkerStatusController,
} from "../controllers/adminController";

// const jwtMiddleware = require('../../MiddleWare/jwt')
import jwtMiddleware from "../MiddleWare/jwt";
import AdminjwtMiddleware from "../MiddleWare/AdJwt";
import { uploadMiddleware } from "../MiddleWare/multerConfig";
import {
  blockWorkerController,
  getLoginedUserWorksController,
  getWorkerController,
  getWorkersController,
  registerWorkerController,
  unblockWorkerController,
  updateWorkerController,
} from "../controllers/workerController";

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
router.put(
  "/profile",
  jwtMiddleware,
  upload.single("profileImage"),
  updateProfile
);
router.post("/forgotPassword", forgotPasswordHandler);
router.post("/resetPassword", resetPasswordHandler);
router.get('/getWorkers', getWorkersController);
router.get('/worker/:wId', getWorkerController);



//worker Routes
router.post(
  "/register",
  jwtMiddleware,
  uploadMiddleware,
  registerWorkerController
);
router.get("/getUserWorkDetails", jwtMiddleware, getLoginedUserWorksController);
//update worker profile pending
router.put(
  "/updateWorker",
  jwtMiddleware,
  uploadMiddleware, updateWorkerController)

// admin Routes
router.post("/adminLogin", adminlogin);
router.put(
  "/adprofile",
  AdminjwtMiddleware,
  upload.single("profileImage"),
  adminupdateProfile
);
router.get("/getAllUsers", AdminjwtMiddleware, getUsersList);
router.put("/blockUser/:id", AdminjwtMiddleware, blockUserController);
router.put("/unblockUser/:id", AdminjwtMiddleware, unblockUserController);
router.get("/getAllWorkers", AdminjwtMiddleware, getAllWorkersController);
router.put(
  "/updateWorkerStatus/:id",
  AdminjwtMiddleware,
  updateWorkerStatusController
);
router.put("/blockWorker/:id", AdminjwtMiddleware, blockWorkerController);
router.put("/unblockWorker/:id", AdminjwtMiddleware, unblockWorkerController);
router.delete('/deleteWorker/:id', AdminjwtMiddleware, deleteWorkerController); 


export default router;
