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
  getBookingTrendsController,
  getDailyRevenue,
  getUsersList,
  unblockUserController,
  updateWorkerStatusController,
} from "../controllers/adminController";

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
import {
  cancelBookingController,
  createBooking,
  createBookingController,
} from "../controllers/bookingController";
import { confirmPayment } from "../controllers/paymentController";
import { getReviews, postReview } from "../controllers/reviewController";
import { getWalletBalance } from "../controllers/walletController";
import {
  createRoom,
  getMessages,
  getRooms,
  getUnreadMessagesCount,
  getUnreadMessagesFromAdmin,
  sendMessage,
} from "../controllers/chatController";
import { refreshToken } from "../controllers/tokenController";

const router = express.Router();

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });



// User Routes
// User registration with profile image upload
router.post("/signUp", upload.single("profileImage"), register);

// Verify OTP for user
router.post("/verifyOtp", verifyOtp);

// Resend OTP to user
router.post("/resendOtp", resendOtp);

// User login
router.post("/login", login);

// Refresh user token
router.post("/refresh-token", refreshToken);

// Google login handler
router.post("/googleLogin", googleLoginHandler);

// Update user profile with optional image upload
router.put(
  "/profile",
  jwtMiddleware,
  checkUserStatusMiddleware,
  upload.single("profileImage"),
  updateProfile
);

// Handle forgot password
router.post("/forgotPassword", forgotPasswordHandler);

// Reset user password
router.post("/resetPassword", resetPasswordHandler);

// Get all workers
router.get("/getWorkers", getWorkersController);

// Get specific worker details by ID
router.get("/worker/:wId", getWorkerController);

// Get all categories
router.get("/categories", getCategoriesController);

// Get available slots for a specific worker by ID
router.get(
  "/worker/:wId/slots",
  jwtMiddleware,
  checkUserStatusMiddleware,
  getSlotsByWorkerIdController
);

// Create a booking for a user
router.post("/bookings", jwtMiddleware, createBooking);

// Confirm payment for a booking
router.post("/payments/confirm", jwtMiddleware, confirmPayment);

// Get booked workers for the logged-in user
router.get(
  "/user/booked-workers",
  jwtMiddleware,
  getUserBookedWorkersController
);

// Post a review for a worker
router.post("/reviews", jwtMiddleware, postReview);

// Get reviews for a specific worker by ID
router.get("/reviews/:workerId", getReviews);

// Get wallet balance for the logged-in user
router.get("/wallet/balance", jwtMiddleware, getWalletBalance);

// Cancel a booking by booking ID
router.post("/cancel/:bookingId", jwtMiddleware, cancelBookingController);

// Create a booking using wallet
router.post("/walletBooking", jwtMiddleware, createBookingController);

// Get unread messages from admin for a specific user
router.get(
  "/unread-from-admin/:userId",
  jwtMiddleware,
  getUnreadMessagesFromAdmin
);





// Worker Routes
// Register a new worker with profile image upload
router.post(
  "/register",
  jwtMiddleware,
  uploadMiddleware,
  checkUserStatusMiddleware,
  registerWorkerController
);

// Get work details for the logged-in user
router.get(
  "/getUserWorkDetails",
  jwtMiddleware,
  checkUserStatusMiddleware,
  getLoginedUserWorksController
);

// Update worker profile with optional image upload
router.put(
  "/updateWorker",
  jwtMiddleware,
  uploadMiddleware,
  updateWorkerController
);

// Create a new time slot
router.post("/create-slot", workerRoleMiddleware, createSlotController);

// Get available slots for workers
router.get("/slots", workerRoleMiddleware, getSlotsByWorkerController);

// Get appointments for a specific worker
router.get(
  "/appointments",
  workerRoleMiddleware,
  getWorkerAppointmentsController
);





// Admin Routes
// Admin login
router.post("/adminLogin", adminlogin);

// Update admin profile with optional image upload
router.put(
  "/adprofile",
  AdminjwtMiddleware,
  upload.single("profileImage"),
  adminupdateProfile
);

// Get all registered users
router.get("/getAllUsers", AdminjwtMiddleware, getUsersList);

// Block a user by ID
router.put("/blockUser/:id", AdminjwtMiddleware, blockUserController);

// Unblock a user by ID
router.put("/unblockUser/:id", AdminjwtMiddleware, unblockUserController);

// Get all registered workers
router.get("/getAllWorkers", AdminjwtMiddleware, getAllWorkersController);

// Update status of a worker by ID
router.put(
  "/updateWorkerStatus/:id",
  AdminjwtMiddleware,
  updateWorkerStatusController
);

// Block a worker by ID
router.put("/blockWorker/:id", AdminjwtMiddleware, blockWorkerController);

// Unblock a worker by ID
router.put("/unblockWorker/:id", AdminjwtMiddleware, unblockWorkerController);

// Delete a worker by ID
router.delete("/deleteWorker/:id", AdminjwtMiddleware, deleteWorkerController);

// Get all categories for admin
router.get("/Adcategories", AdminjwtMiddleware, getCategoriesController);

// Add a new category
router.post("/categories", AdminjwtMiddleware, addCategoryController);

// Edit an existing category by ID
router.put("/editCategory/:id", AdminjwtMiddleware, editCategoryController);

// Get all reviews with details for admin
router.get(
  "/Adreviews",
  AdminjwtMiddleware,
  getAllReviewsWithDetailsController
);

// Delete a review by ID
router.delete("/review/:id", AdminjwtMiddleware, deleteReviewController);

// Get all counts for various entities
router.get("/counts", AdminjwtMiddleware, getAllCounts);

// Get booking trends
router.get("/booking-trends", AdminjwtMiddleware, getBookingTrendsController);

// Get daily revenue
router.get("/revenue", AdminjwtMiddleware, getDailyRevenue);

// Get all bookings
router.get("/bookings", AdminjwtMiddleware, getAllBookings);

// Get unread messages count for a specific user
router.get(
  "/messages/unread-count/:userId",
  AdminjwtMiddleware,
  getUnreadMessagesCount
);

// Create a chat room
router.post("/room", createRoom);

// Send a message in a chat
router.post("/message", sendMessage);

// Get all chat rooms
router.get("/rooms", getRooms);

// Get messages for a specific room by ID
router.get("/messages/:roomId", getMessages);

export default router;
