"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
// Configure multer storage
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
exports.uploadMiddleware = upload.fields([
    { name: 'registerImage', maxCount: 1 },
    { name: 'workImages', maxCount: 12 },
    { name: 'kycDocumentImage', maxCount: 1 },
    // { name: 'additionalField', maxCount: 1 } // example for an additional field
]);
