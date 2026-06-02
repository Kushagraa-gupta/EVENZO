import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
  updateProfile,
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/ApiError.js';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.post('/refresh', asyncHandler(refreshToken));
router.get('/me', verifyToken, asyncHandler(getMe));
router.put('/profile', verifyToken, asyncHandler(updateProfile));
router.post('/forgot-password', asyncHandler(forgotPassword));
router.put('/reset-password/:token', asyncHandler(resetPassword));

export default router;
