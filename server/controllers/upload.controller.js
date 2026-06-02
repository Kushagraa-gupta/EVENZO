import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';

const bufferToStream = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

export const uploadImage = async (req, res, next) => {
  if (!req.file) return next(new ApiError(400, 'No image file provided'));

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return res.json({
      success: true,
      url: `https://placehold.co/800x400/1A1A2E/6C63FF?text=Evenzo+Event`,
      message: 'Cloudinary not configured — using placeholder',
    });
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'evenzo', resource_type: 'image' },
      (error, result) => {
        if (error) return reject(new ApiError(500, 'Image upload failed'));
        res.json({ success: true, url: result.secure_url });
        resolve();
      }
    );
    bufferToStream(req.file.buffer).pipe(uploadStream);
  });
};
