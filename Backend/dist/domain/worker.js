"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const workerSchema = new mongoose_1.Schema({
    registerImage: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    whatsappNumber: {
        type: Number,
        required: true,
    },
    categories: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        }],
    experience: {
        type: Number,
        required: true,
    },
    workingDays: {
        type: String,
        required: true,
    },
    availableTime: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    paymentMode: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    workImages: {
        type: [String],
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    averageReview: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        required: true,
        default: 'pending',
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    amount: {
        type: Number,
        required: true,
    },
    kycDetails: [{
            documentType: {
                type: String,
                required: true,
            },
            documentImage: {
                type: String,
                required: true,
            },
        }],
}, { timestamps: true });
exports.Worker = mongoose_1.default.model('Worker', workerSchema);
