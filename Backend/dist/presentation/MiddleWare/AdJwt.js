"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminJwtMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    // console.log("kdsanfkj");
    // console.log(token);
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;
        req.role = decoded.role;
        if (req.role !== 'admin') {
            return res.status(403).json({ error: 'User is not an admin' });
        }
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
};
exports.default = adminJwtMiddleware;
