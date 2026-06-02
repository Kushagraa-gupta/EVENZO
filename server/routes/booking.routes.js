import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getEventBookings,
  checkinBooking,
} from '../controllers/booking.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { asyncHandler } from '../utils/ApiError.js';

const router = Router();

router.use(verifyToken);

router.post('/', requireRole('attendee', 'organizer', 'admin'), asyncHandler(createBooking));
router.get('/my', asyncHandler(getMyBookings));
router.get('/event/:eventId', requireRole('organizer', 'admin'), asyncHandler(getEventBookings));
router.post('/checkin', requireRole('organizer', 'admin'), asyncHandler(checkinBooking));
router.get('/:id', asyncHandler(getBookingById));
router.put('/:id/cancel', asyncHandler(cancelBooking));

export default router;
