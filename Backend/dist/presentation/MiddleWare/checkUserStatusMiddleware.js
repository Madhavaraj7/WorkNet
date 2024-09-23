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
Object.defineProperty(exports, "__esModule", { value: true });
const userRepository_1 = require("../../infrastructure/userRepository");
const checkUserStatusMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const user = yield (0, userRepository_1.findUserById)(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.isBlocked) {
            return res.status(403).json({ error: 'Your account is blocked. Please contact support.' });
        }
        next();
    }
    catch (error) {
        console.error('Error in checkUserStatusMiddleware:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});
exports.default = checkUserStatusMiddleware;
