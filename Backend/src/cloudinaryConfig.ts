import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dgvx0kymm', // Replace with your Cloudinary cloud name
  api_key: '747762698978995', // Replace with your Cloudinary API key
  api_secret: 'aVQAe7vDqkVw0Ok2BbsEALiB4lU' // Replace with your Cloudinary API secret
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
