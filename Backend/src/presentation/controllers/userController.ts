import { Request, Response } from "express";
import { registerUser, verifyAndSaveUser, loginUser, googleLogin, updateUserOtp, updateUserProfile, forgotPassword, resetPassword, fetchAllCategories, getSlotsByWorkerIdService, getUserBookedWorkers } from "../../application/userService";
import { otpGenerator } from "../../utils/otpGenerator";
import { sendEmail } from "../../utils/sendEmail";
import { findUserByEmail, findUserById } from "../../infrastructure/userRepository";
import axios from 'axios';
import sharp from 'sharp';
import cloudinary from '../../cloudinaryConfig'; 
import bcrypt from 'bcrypt';

// Handle Google login
export const googleLoginHandler = async (req: Request, res: Response) => {
    try {
        const { email, username, profileImage } = req.body;

        if (!profileImage) {
            return res.status(400).json({ error: 'Profile image URL is required' });
        }

        const imageResponse = await axios({
            url: profileImage,
            responseType: 'arraybuffer',
        });

        const imageBuffer = await sharp(imageResponse.data)
            .jpeg()
            .toBuffer();

        cloudinary.uploader.upload_stream(
            (error: any, result: any) => { 
                if (error) {
                    return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
                }

                const profileImageUrl = result?.secure_url || '';

                googleLogin({
                    email,
                    username,
                    profileImagePath: profileImageUrl,
                }).then((loginResult) => {
                    res.status(200).json(loginResult);
                }).catch(error => {
                    res.status(500).json({ error: 'Failed to handle Google login' });
                });
            }
        ).end(imageBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process Google login' });
    }
};

// Register the user
export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const profileImage = req.file ? req.file.buffer : req.body.profileImage;
        let profileImageUrl = '';

        const proceedWithRegistration = async () => {
            try {
                const otp = otpGenerator();
                await registerUser({
                    username,
                    email,
                    password,
                    profileImage: profileImageUrl,
                    otp,
                    is_verified: 0,
                    isBlocked: false,
                    role: "user",
                });
                await sendEmail(email, otp);
                res.status(200).json("OTP sent to email");
            } catch (error: any) {
                res.status(400).json({ error: 'Registration failed: ' + error.message });
            }
        };

        if (profileImage) {
            // Upload the image to Cloudinary
            cloudinary.uploader.upload_stream(
                (error: any, result: any) => { // Add type annotations for the callback parameters
                    if (error) {
                        return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
                    }
                    profileImageUrl = result?.secure_url || '';
                    proceedWithRegistration();
                }
            ).end(profileImage);
        } else {
            profileImageUrl = req.body.profileImage || '';
            proceedWithRegistration();
        }
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

export const updateProfile = async (req: any, res: Response) => {
    try {
        const { userId } = req;
        const { username, email, oldPassword, newPassword } = req.body;

        const profileImage = req.file ? req.file.buffer : null;
        let profileImageUrl = '';

        // Fetch the user from the database
        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const proceedWithUpdate = async (hashedPassword?: string) => {
            try {
                const updateData: any = {
                    username,
                    email,
                    profileImage: profileImageUrl || undefined,
                };

                if (hashedPassword) {
                    updateData.password = hashedPassword;
                }

                const updatedUser = await updateUserProfile(userId, updateData);
                res.status(200).json(updatedUser);
            } catch (error: any) {
                res.status(400).json({ error: 'Failed to update profile: ' + error.message });
            }
        };

        if (profileImage) {
            // Upload the image to Cloudinary
            cloudinary.uploader.upload_stream(
                async (error: any, result: any) => { // Add type annotations for the callback parameters
                    if (error) {
                        return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
                    }
                    profileImageUrl = result?.secure_url || '';
                    if (newPassword) {
                        // Verify old password and hash new password
                        const isMatch = await bcrypt.compare(oldPassword, user.password);
                        if (!isMatch) {
                            return res.status(400).json({ error: 'Old password is incorrect. Please use the forgot password option.' });
                        }
                        const hashedPassword = await bcrypt.hash(newPassword, 10);
                        proceedWithUpdate(hashedPassword);
                    } else {
                        proceedWithUpdate();
                    }
                }
            ).end(profileImage);
        } else {
            // Hash password if provided and old password is correct
            if (newPassword) {
                const isMatch = await bcrypt.compare(oldPassword, user.password);
                if (!isMatch) {
                    return res.status(400).json({ error: 'Old password is incorrect. Please use the forgot password option.' });
                }
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                proceedWithUpdate(hashedPassword);
            } else {
                proceedWithUpdate();
            }
        }
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
export const forgotPasswordHandler = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      await forgotPassword(email);
      res.status(200).json({ message: "OTP sent to your email" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Handle password reset
  export const resetPasswordHandler = async (req: Request, res: Response) => {
    try {
      const { email, otp, newPassword } = req.body;
      await resetPassword(email, otp, newPassword);
      res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };



  // Controller to get all categories
export const getCategoriesController = async (req: Request, res: Response) => {
    try {
      const categories = await fetchAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  };


  export const getSlotsByWorkerIdController = async (req: Request, res: Response) => {
    try {
        const { wId } = req.params;
        const slots = await getSlotsByWorkerIdService(wId);
        return res.status(200).json(slots);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving slots', error });
    }
};


export const getUserBookedWorkersController = async (req: any, res: Response) => {
    try {
      const userId = req.userId; 
      const bookings = await getUserBookedWorkers(userId);
  
      res.status(200).json({
        success: true,
        data: bookings,
      });
    } catch (error:any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };