import { createOTP, findOTPByEmail, deleteOTP } from '../infrastructure/otpRepository';
import { OTP } from '../domain/otp';

export const generateAndSaveOTP = async (otp: OTP) => {
    await deleteOTP(otp.email);
    return createOTP(otp);
};

export const verifyOTP = async (email: string, otp: string) => {
    const existingOtp = await findOTPByEmail(email);
    if (existingOtp && existingOtp.otp === otp) {
        await deleteOTP(email);
        return true;
    }
    return false;
};
