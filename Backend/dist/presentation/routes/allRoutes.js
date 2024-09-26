"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const userController_1 = require("../controllers/userController");
const adminController_1 = require("../controllers/adminController");
const jwt_1 = __importDefault(require("../MiddleWare/jwt"));
const workerRoleMiddleware_1 = __importDefault(require("../MiddleWare/workerRoleMiddleware"));
const AdJwt_1 = __importDefault(require("../MiddleWare/AdJwt"));
const multerConfig_1 = require("../MiddleWare/multerConfig");
const workerController_1 = require("../controllers/workerController");
const checkUserStatusMiddleware_1 = __importDefault(require("../MiddleWare/checkUserStatusMiddleware"));
const slotController_1 = require("../controllers/slotController");
const bookingController_1 = require("../controllers/bookingController");
const paymentController_1 = require("../controllers/paymentController");
const reviewController_1 = require("../controllers/reviewController");
const walletController_1 = require("../controllers/walletController");
const chatController_1 = require("../controllers/chatController");
const tokenController_1 = require("../controllers/tokenController");
const router = express_1.default.Router();
// Configure multer storage
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// User Routes
// User registration with profile image upload
router.post("/signUp", upload.single("profileImage"), userController_1.register);
// Verify OTP for user
router.post("/verifyOtp", userController_1.verifyOtp);
// Resend OTP to user
router.post("/resendOtp", userController_1.resendOtp);
// User login
router.post("/login", userController_1.login);
// Refresh user token
router.post("/refresh-token", tokenController_1.refreshToken);
// Google login handler
router.post("/googleLogin", userController_1.googleLoginHandler);
// Update user profile with optional image upload
router.put("/profile", jwt_1.default, checkUserStatusMiddleware_1.default, upload.single("profileImage"), userController_1.updateProfile);
// Handle forgot password
router.post("/forgotPassword", userController_1.forgotPasswordHandler);
// Reset user password
router.post("/resetPassword", userController_1.resetPasswordHandler);
// Get all workers
router.get("/getWorkers", workerController_1.getWorkersController);
// Get specific worker details by ID
router.get("/worker/:wId", workerController_1.getWorkerController);
// Get all categories
router.get("/categories", userController_1.getCategoriesController);
// Get available slots for a specific worker by ID
router.get("/worker/:wId/slots", jwt_1.default, checkUserStatusMiddleware_1.default, userController_1.getSlotsByWorkerIdController);
// Create a booking for a user
router.post("/bookings", jwt_1.default, bookingController_1.createBooking);
// Confirm payment for a booking
router.post("/payments/confirm", jwt_1.default, paymentController_1.confirmPayment);
// Get booked workers for the logged-in user
router.get("/user/booked-workers", jwt_1.default, userController_1.getUserBookedWorkersController);
// Post a review for a worker
router.post("/reviews", jwt_1.default, reviewController_1.postReview);
// Get reviews for a specific worker by ID
router.get("/reviews/:workerId", reviewController_1.getReviews);
// Get wallet balance for the logged-in user
router.get("/wallet/balance", jwt_1.default, walletController_1.getWalletBalance);
// Cancel a booking by booking ID
router.post("/cancel/:bookingId", jwt_1.default, bookingController_1.cancelBookingController);
// Create a booking using wallet
router.post("/walletBooking", jwt_1.default, bookingController_1.createBookingController);
// Get unread messages from admin for a specific user
router.get("/unread-from-admin/:userId", jwt_1.default, chatController_1.getUnreadMessagesFromAdmin);
// Worker Routes
// Register a new worker with profile image upload
router.post("/register", jwt_1.default, multerConfig_1.uploadMiddleware, checkUserStatusMiddleware_1.default, workerController_1.registerWorkerController);
// Get work details for the logged-in user
router.get("/getUserWorkDetails", jwt_1.default, checkUserStatusMiddleware_1.default, workerController_1.getLoginedUserWorksController);
// Update worker profile with optional image upload
router.put("/updateWorker", jwt_1.default, multerConfig_1.uploadMiddleware, workerController_1.updateWorkerController);
// Create a new time slot
router.post("/create-slot", workerRoleMiddleware_1.default, slotController_1.createSlotController);
// Get available slots for workers
router.get("/slots", workerRoleMiddleware_1.default, slotController_1.getSlotsByWorkerController);
// Get appointments for a specific worker
router.get("/appointments", workerRoleMiddleware_1.default, workerController_1.getWorkerAppointmentsController);
// Admin Routes
// Admin login
router.post("/adminLogin", adminController_1.adminlogin);
// Update admin profile with optional image upload
router.put("/adprofile", AdJwt_1.default, upload.single("profileImage"), adminController_1.adminupdateProfile);
// Get all registered users
router.get("/getAllUsers", AdJwt_1.default, adminController_1.getUsersList);
// Block a user by ID
router.put("/blockUser/:id", AdJwt_1.default, adminController_1.blockUserController);
// Unblock a user by ID
router.put("/unblockUser/:id", AdJwt_1.default, adminController_1.unblockUserController);
// Get all registered workers
router.get("/getAllWorkers", AdJwt_1.default, adminController_1.getAllWorkersController);
// Update status of a worker by ID
router.put("/updateWorkerStatus/:id", AdJwt_1.default, adminController_1.updateWorkerStatusController);
// Block a worker by ID
router.put("/blockWorker/:id", AdJwt_1.default, workerController_1.blockWorkerController);
// Unblock a worker by ID
router.put("/unblockWorker/:id", AdJwt_1.default, workerController_1.unblockWorkerController);
// Delete a worker by ID
router.delete("/deleteWorker/:id", AdJwt_1.default, adminController_1.deleteWorkerController);
// Get all categories for admin
router.get("/Adcategories", AdJwt_1.default, userController_1.getCategoriesController);
// Add a new category
router.post("/categories", AdJwt_1.default, adminController_1.addCategoryController);
// Edit an existing category by ID
router.put("/editCategory/:id", AdJwt_1.default, adminController_1.editCategoryController);
// Get all reviews with details for admin
router.get("/Adreviews", AdJwt_1.default, adminController_1.getAllReviewsWithDetailsController);
// Delete a review by ID
router.delete("/review/:id", AdJwt_1.default, adminController_1.deleteReviewController);
// Get all counts for various entities
router.get("/counts", AdJwt_1.default, adminController_1.getAllCounts);
// Get booking trends
router.get("/booking-trends", AdJwt_1.default, adminController_1.getBookingTrendsController);
// Get daily revenue
router.get("/revenue", AdJwt_1.default, adminController_1.getDailyRevenue);
// Get all bookings
router.get("/bookings", AdJwt_1.default, adminController_1.getAllBookings);
// Get unread messages count for a specific user
router.get("/messages/unread-count/:userId", AdJwt_1.default, chatController_1.getUnreadMessagesCount);
// Create a chat room
router.post("/room", chatController_1.createRoom);
// Send a message in a chat
router.post("/message", chatController_1.sendMessage);
// Get all chat rooms
router.get("/rooms", chatController_1.getRooms);
// Get messages for a specific room by ID
router.get("/messages/:roomId", chatController_1.getMessages);
exports.default = router;
