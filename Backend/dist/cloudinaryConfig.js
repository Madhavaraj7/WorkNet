"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: 'dgvx0kymm',
    api_key: '747762698978995',
    api_secret: 'aVQAe7vDqkVw0Ok2BbsEALiB4lU'
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
