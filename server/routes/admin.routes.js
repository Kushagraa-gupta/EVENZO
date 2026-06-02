import { Router } from 'express';
import {
  getStats,
  getUsers,
  updateUser,
  getAllEvents,
  deleteEventAdmin,
  getAllBookings,
  getPendingOrganizers,
  approveOrganizer,
  rejectOrganizer,
  getAdminAnalytics,
} from '../controllers/admin.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { asyncHandler } from '../utils/ApiError.js';

const router = Router();

router.use(verifyToken, requireRole('admin'));

router.get('/stats', asyncHandler(getStats));
router.get('/analytics', asyncHandler(getAdminAnalytics));
router.get('/users', asyncHandler(getUsers));
router.put('/users/:id', asyncHandler(updateUser));
router.get('/events', asyncHandler(getAllEvents));
router.delete('/events/:id', asyncHandler(deleteEventAdmin));
router.get('/bookings', asyncHandler(getAllBookings));
router.get('/organizers/pending', asyncHandler(getPendingOrganizers));
router.put('/organizers/:id/approve', asyncHandler(approveOrganizer));
router.put('/organizers/:id/reject', asyncHandler(rejectOrganizer));

export default router;
