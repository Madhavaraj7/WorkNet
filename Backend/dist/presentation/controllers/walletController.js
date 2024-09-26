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
exports.getWalletBalance = void 0;
const walletService_1 = require("../../application/walletService");
const getWalletBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const wallet = yield (0, walletService_1.getWalletByUserId)(userId);
        if (!wallet) {
            return res.status(404).json({ error: "Wallet not found" });
        }
        res.status(200).json({
            walletBalance: wallet.walletBalance,
            walletTransactions: wallet.walletTransaction,
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getWalletBalance = getWalletBalance;
