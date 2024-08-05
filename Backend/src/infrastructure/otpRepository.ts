import mongoose from 'mongoose';
import { OTP } from '../domain/otp';

const otpSchema = new mongoose.Schema<OTP>({
    email: String,
    otp: String
});

export const OTPModel = mongoose.model<OTP>('OTP', otpSchema);

export const createOTP = async (otp: OTP) => {
    return new OTPModel(otp).save();
};

export const findOTPByEmail = async (email: string) => {
    return OTPModel.findOne({ email });
};

export const deleteOTP = async (email: string) => {
    return OTPModel.findOneAndDelete({ email });
};
