import { Router } from 'express';
import {
  createCheckout,
  stripeWebhook,
  refundBooking,
  getSessionBooking,
} from '../controllers/payment.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { asyncHandler } from '../utils/ApiError.js';

const router = Router();

router.post('/create-checkout', verifyToken, asyncHandler(createCheckout));
router.get('/session', verifyToken, asyncHandler(getSessionBooking));
router.post('/refund/:bookingId', verifyToken, requireRole('admin'), asyncHandler(refundBooking));

export default router;
