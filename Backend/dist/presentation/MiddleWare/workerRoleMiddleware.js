"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = require("../../infrastructure/userRepository");
const worker_1 = require("../../domain/worker"); // Import the Worker model
const workerRoleMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        // Verify the JWT token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        console.log('Decoded token:', decoded); // Debugging line
        // Validate the userId format
        if (!mongoose_1.default.Types.ObjectId.isValid(decoded.userId)) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }
        // Find the user by ID
        const user = yield (0, userRepository_1.findUserById)(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Check if the user's role is 'worker'
        if (user.role !== 'worker') {
            return res.status(403).json({ error: 'Unauthorized: Access restricted to workers only' });
        }
        // Find the worker associated with the userId
        const worker = yield worker_1.Worker.findOne({ userId: decoded.userId });
        if (!worker) {
            return res.status(404).json({ error: 'Worker profile not found' });
        }
        // Set workerId in the request object
        req.workerId = worker._id;
        // Proceed to the next middleware or route handler
        next();
    }
    catch (error) {
        console.error('Error in workerRoleMiddleware:', error);
        return res.status(403).json({ error: 'Failed to authenticate token or retrieve user' });
    }
});
exports.default = workerRoleMiddleware;
