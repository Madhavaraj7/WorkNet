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
exports.WalletModel = void 0;
// src/domain/wallet.ts
const mongoose_1 = __importStar(require("mongoose"));
const walletSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.default.Types.ObjectId, required: true, ref: 'users' },
    walletBalance: { type: Number, default: 0 },
    walletTransaction: [
        {
            transactionDate: { type: Date, default: Date.now },
            transactionAmount: { type: Number, required: true },
            transactionType: { type: String, enum: ['credit', 'debit'], required: true },
        },
    ],
});
exports.WalletModel = mongoose_1.default.model('Wallet', walletSchema);
