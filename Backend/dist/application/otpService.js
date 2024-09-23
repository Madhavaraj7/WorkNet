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
exports.verifyOTP = exports.generateAndSaveOTP = void 0;
const otpRepository_1 = require("../infrastructure/otpRepository");
//gegenerateAndSaveOTP in database
const generateAndSaveOTP = (otp) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, otpRepository_1.deleteOTP)(otp.email);
    return (0, otpRepository_1.createOTP)(otp);
});
exports.generateAndSaveOTP = generateAndSaveOTP;
//verify the otp
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const existingOtp = yield (0, otpRepository_1.findOTPByEmail)(email);
    if (existingOtp && existingOtp.otp === otp) {
        yield (0, otpRepository_1.deleteOTP)(email);
        return true;
    }
    return false;
});
exports.verifyOTP = verifyOTP;
