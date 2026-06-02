import { Router } from 'express';
import { uploadImage } from '../controllers/upload.controller.js';
import { upload } from '../middleware/upload.middleware.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/ApiError.js';

const router = Router();

router.post(
  '/image',
  verifyToken,
  upload.single('image'),
  asyncHandler(uploadImage)
);

export default router;
