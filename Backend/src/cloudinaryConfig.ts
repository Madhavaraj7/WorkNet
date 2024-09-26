import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dgvx0kymm', 
  api_key: '747762698978995', 
  api_secret: 'aVQAe7vDqkVw0Ok2BbsEALiB4lU'
});

// Upload image to Cloudinary
export const uploadToCloudinary = (file: Express.Multer.File): Promise<string> =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) return reject(error);
        resolve(result?.url || '');
      }
    ).end(file.buffer);
  });

export default cloudinary;
