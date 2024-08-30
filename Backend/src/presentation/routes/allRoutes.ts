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
  getCategoriesController,
  getSlotsByWorkerIdController,
} from "../controllers/userController";

import {
  addCategoryController,
  adminlogin,
  adminupdateProfile,
  blockUserController,
  deleteWorkerController,
  editCategoryController,
  getAllWorkersController,
  getUsersList,
  unblockUserController,
  updateWorkerStatusController,
} from "../controllers/adminController";

// const jwtMiddleware = require('../../MiddleWare/jwt')
import jwtMiddleware from "../MiddleWare/jwt";
import workerRoleMiddleware from "../MiddleWare/workerRoleMiddleware";

import AdminjwtMiddleware from "../MiddleWare/AdJwt";
import { uploadMiddleware } from "../MiddleWare/multerConfig";
import {
  blockWorkerController,
  getLoginedUserWorksController,
  getWorkerAppointmentsController,
  getWorkerController,
  getWorkersController,
  registerWorkerController,
  unblockWorkerController,
  updateWorkerController,
} from "../controllers/workerController";
import checkUserStatusMiddleware from "../MiddleWare/checkUserStatusMiddleware";
import {
  createSlotController,
  getSlotsByWorkerController,
} from "../controllers/slotController";
import { createBooking } from "../controllers/bookingController";
import { confirmPayment } from "../controllers/paymentController";
import { handleStripeWebhook } from "../controllers/stripeWebhookController";

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
  checkUserStatusMiddleware,
  upload.single("profileImage"),
  updateProfile
);
router.post("/forgotPassword", forgotPasswordHandler);
router.post("/resetPassword", resetPasswordHandler);
router.get("/getWorkers", getWorkersController);
router.get("/worker/:wId", getWorkerController);
router.get("/categories", getCategoriesController);

router.get('/worker/:wId/slots', jwtMiddleware, checkUserStatusMiddleware, getSlotsByWorkerIdController);
router.post('/bookings',jwtMiddleware, createBooking);
router.post('/payments/confirm', jwtMiddleware,confirmPayment);



//worker Routes
router.post(
  "/register",
  jwtMiddleware,
  uploadMiddleware,
  checkUserStatusMiddleware,
  registerWorkerController
);
router.get(
  "/getUserWorkDetails",
  jwtMiddleware,
  checkUserStatusMiddleware,
  getLoginedUserWorksController
);
//update worker profile pending
router.put(
  "/updateWorker",
  jwtMiddleware,
  uploadMiddleware,
  updateWorkerController
);

router.post("/create-slot", workerRoleMiddleware, createSlotController);
router.get("/slots", workerRoleMiddleware, getSlotsByWorkerController);
router.get("/appointments", workerRoleMiddleware,  getWorkerAppointmentsController);


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
router.delete("/deleteWorker/:id", AdminjwtMiddleware, deleteWorkerController);

router.get("/Adcategories", AdminjwtMiddleware, getCategoriesController);
router.post("/categories", AdminjwtMiddleware, addCategoryController);
router.put("/editCategory/:id", editCategoryController);

export default router;
