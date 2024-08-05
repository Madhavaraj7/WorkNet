import { Request, Response } from 'express';
import { registerUser, updateUserOtp, verifyAndSaveUser } from '../../application/userService';
import { generateAndSaveOTP, verifyOTP } from '../../application/otpService';
import { otpGenerator } from '../../utils/otpGenerator';
import { sendEmail } from '../../utils/sendEmail';

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, profileImage } = req.body;
        const profile = req.file ? req.file.filename : profileImage;
        const otp = otpGenerator();

        await registerUser({ username, email, password, profileImage: profile, otp });
        await generateAndSaveOTP({ email, otp });
        await sendEmail(email, otp);
        res.status(200).json('OTP sent to email');
    } catch (error:any) {
        res.status(400).json(error.message);
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        const isValid = await verifyOTP(email, otp);

        if (isValid) {
            await verifyAndSaveUser(email, otp);
            res.status(200).json('User registered successfully');
        } else {
            res.status(400).json('Invalid OTP');
        }
    } catch (error:any) {
        res.status(400).json(error.message);
    }
};
