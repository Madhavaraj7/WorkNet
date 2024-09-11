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
  getUserBookedWorkersController,
} from "../controllers/userController";

import {
  addCategoryController,
  adminlogin,
  adminupdateProfile,
  blockUserController,
  deleteReviewController,
  deleteWorkerController,
  editCategoryController,
  getAllBookings,
  getAllCounts,
  getAllReviewsWithDetailsController,
  getAllWorkersController,
  getDailyRevenue,
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
import { cancelBookingController, createBooking, createBookingController } from "../controllers/bookingController";
import { confirmPayment } from "../controllers/paymentController";
// import { handleStripeWebhook } from "../controllers/stripeWebhookController";
import { getReviews, postReview } from "../controllers/reviewController";
import {  getWalletBalance } from "../controllers/walletController";
import { createRoom, getMessages, getRooms, sendMessage } from "../controllers/chatController";

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
router.get('/user/booked-workers', jwtMiddleware, getUserBookedWorkersController);
router.post('/reviews', jwtMiddleware,postReview);
router.get('/reviews/:workerId', getReviews);
router.get('/wallet/balance', jwtMiddleware, getWalletBalance);

router.post('/cancel/:bookingId',jwtMiddleware, cancelBookingController);
router.post('/walletBooking', jwtMiddleware,createBookingController); 




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
router.put("/editCategory/:id",AdminjwtMiddleware, editCategoryController);
router.get('/Adreviews',AdminjwtMiddleware, getAllReviewsWithDetailsController);
router.delete("/review/:id", AdminjwtMiddleware, deleteReviewController);
router.get('/counts', AdminjwtMiddleware,getAllCounts);
router.get('/revenue', AdminjwtMiddleware, getDailyRevenue);

router.get('/bookings',AdminjwtMiddleware, getAllBookings);



// Create or find a room between user and admin
router.post('/room', createRoom);

// Send a message in a room
router.post('/message', sendMessage);

// Get all rooms (admin view)
router.get('/rooms', getRooms);

// Get all messages in a room
router.get('/messages/:roomId', getMessages);

export default router;
