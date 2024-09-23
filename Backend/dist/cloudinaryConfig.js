"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: 'dgvx0kymm', // Replace with your Cloudinary cloud name
    api_key: '747762698978995', // Replace with your Cloudinary API key
    api_secret: 'aVQAe7vDqkVw0Ok2BbsEALiB4lU' // Replace with your Cloudinary API secret
});
// Upload image to Cloudinary
const uploadToCloudinary = (file) => new Promise((resolve, reject) => {
    cloudinary_1.v2.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
        if (error)
            return reject(error);
        resolve((result === null || result === void 0 ? void 0 : result.url) || '');
    }).end(file.buffer);
});
exports.uploadToCloudinary = uploadToCloudinary;
exports.default = cloudinary_1.v2;
