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
exports.processZaopayPayment = void 0;
// src/Config/zaopay.ts
const axios_1 = __importDefault(require("axios"));
const processZaopayPayment = (amount, zaopayToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post('https://api.zaopay.com/payment', {
            amount,
            zaopayToken
        });
        // Adjust based on actual Zaopay response format
        if (response.data && response.data.success) {
            return response.data;
        }
        else {
            throw new Error('Zaopay payment failed');
        }
    }
    catch (error) {
        console.error('Zaopay payment error:', error);
        throw new Error('Payment processing failed');
    }
});
exports.processZaopayPayment = processZaopayPayment;
