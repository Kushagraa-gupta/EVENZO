import { Router } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
  getOrganizerStats,
} from '../controllers/event.controller.js';
import { verifyToken, optionalAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { asyncHandler } from '../utils/ApiError.js';

const router = Router();

router.get('/', asyncHandler(getEvents));
router.get('/organizer/my', verifyToken, requireRole('organizer', 'admin'), asyncHandler(getOrganizerEvents));
router.get('/organizer/stats', verifyToken, requireRole('organizer', 'admin'), asyncHandler(getOrganizerStats));
router.get('/:id', optionalAuth, asyncHandler(getEventById));
router.post('/', verifyToken, requireRole('organizer', 'admin'), asyncHandler(createEvent));
router.put('/:id', verifyToken, requireRole('organizer', 'admin'), asyncHandler(updateEvent));
router.delete('/:id', verifyToken, requireRole('organizer', 'admin'), asyncHandler(deleteEvent));

export default router;
