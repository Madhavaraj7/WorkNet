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
exports.processStripePayment = exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
if (!stripeSecretKey) {
    throw new Error('Stripe secret key is not defined');
}
exports.stripe = new stripe_1.default(stripeSecretKey, { apiVersion: '2024-06-20' });
const processStripePayment = (amount, stripeToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentIntent = yield exports.stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'inr',
            payment_method: stripeToken,
            confirm: true,
        });
        return { success: true, paymentIntent };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
exports.processStripePayment = processStripePayment;
