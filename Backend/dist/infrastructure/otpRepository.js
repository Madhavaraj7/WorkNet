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
exports.deleteOTP = exports.findOTPByEmail = exports.createOTP = exports.OTPModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const otpSchema = new mongoose_1.default.Schema({
    email: String,
    otp: String,
});
exports.OTPModel = mongoose_1.default.model("OTP", otpSchema);
const createOTP = (otp) => __awaiter(void 0, void 0, void 0, function* () {
    return new exports.OTPModel(otp).save();
});
exports.createOTP = createOTP;
const findOTPByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.OTPModel.findOne({ email });
});
exports.findOTPByEmail = findOTPByEmail;
const deleteOTP = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.OTPModel.findOneAndDelete({ email });
});
exports.deleteOTP = deleteOTP;
