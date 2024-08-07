import { Request, Response } from "express";
import { registerUser, verifyAndSaveUser, loginUser, updateUserOtp } from "../../application/userService";
import { otpGenerator } from "../../utils/otpGenerator";
import { sendEmail } from "../../utils/sendEmail";
import { findUserByEmail, updateUser } from "../../infrastructure/userRepository";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, profileImage } = req.body;
    const profile = req.file ? req.file.filename : profileImage;
    const otp = otpGenerator();

    await registerUser({
      username,
      email,
      password,
      profileImage: profile,
      otp,
    });
    await sendEmail(email, otp);
    res.status(200).json("OTP sent to email");
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.otp === otp) {
      await verifyAndSaveUser(email, otp);
      res.status(200).json("User registered successfully");
    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otp = otpGenerator();
    await updateUserOtp(email, otp);
    await sendEmail(email, otp);

    res.status(200).json({ message: 'OTP has been resent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.status(200).json({ user, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
