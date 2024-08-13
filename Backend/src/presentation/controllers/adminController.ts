import { Request, Response, NextFunction } from 'express';
import { blockOrUnblockUser, getAllUsers, loginUser, updateUserProfile } from '../../application/adminService';
import cloudinary from '../../cloudinaryConfig';


export const adminlogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  try {
    const result = await loginUser(email, password);
    if (result) {
      res.json({ token: result.token, user: result.user });
    } else {
      res.status(401).json({ message: 'Login failed' });
    }
  } catch (error) {
    next(error);
  }
};


export const adminupdateProfile = async (req: any, res: Response) => {
  try {
      const { userId } = req;  
      console.log(userId);
      
      
      const { username, email } = req.body; 
       
      const profileImage = req.file ? req.file.buffer : null;
      let profileImageUrl = '';

      const proceedWithUpdate = async () => {
          try {
              const updatedUser = await updateUserProfile(userId, {
                  username,
                  email,
                  profileImage: profileImageUrl || undefined,  
              });
              // console.log(updatedUser);
              
              res.status(200).json(updatedUser);
          } catch (error: any) {
              res.status(400).json({ error: 'Failed to update profile: ' + error.message });
          }
      };

      if (profileImage) {
          // Upload the image to Cloudinary
          cloudinary.v2.uploader.upload_stream((error, result) => {
              if (error) {
                  return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
              }
              profileImageUrl = result?.secure_url || '';
              proceedWithUpdate();
          }).end(profileImage);
      } else {
          proceedWithUpdate();  // No image provided, proceed with updating other fields
      }
  } catch (error: any) {
      res.status(500).json({ error: 'Failed to update profile: ' + error.message });
  }
};



export const getUsersList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Block or Unblock a user
export const toggleBlockUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId, isBlocked } = req.body;

  try {
    const updatedUser = await blockOrUnblockUser(userId, isBlocked);
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};