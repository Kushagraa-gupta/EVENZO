import { z } from 'zod';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import TicketType from '../models/TicketType.js';
import { ApiError } from '../utils/ApiError.js';
import {
  sendOrganizerApprovedEmail,
  sendOrganizerRejectedEmail,
} from '../services/email.service.js';

export const getStats = async (req, res) => {
  const [users, events, bookings, pendingOrganizers] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments(),
    Booking.countDocuments({ status: { $in: ['confirmed', 'attended'] } }),
    User.countDocuments({ role: 'organizer', isApproved: false }),
  ]);

  const revenue = await Booking.aggregate([
    { $match: { status: { $in: ['confirmed', 'attended'] } } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);

  const recentBookings = await Booking.find()
    .populate('user', 'name')
    .populate('event', 'title')
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({
    success: true,
    stats: {
      users,
      events,
      bookings,
      pendingOrganizers,
      revenue: revenue[0]?.total || 0,
      recentBookings,
    },
  });
};

export const getUsers = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);

  res.json({ success: true, users, total, page, totalPages: Math.ceil(total / limit) });
};

export const updateUser = async (req, res, next) => {
  const schema = z.object({
    role: z.enum(['attendee', 'organizer', 'admin']).optional(),
    isActive: z.boolean().optional(),
    isApproved: z.boolean().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return next(new ApiError(400, 'Invalid update data'));

  const user = await User.findByIdAndUpdate(req.params.id, parsed.data, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) return next(new ApiError(404, 'User not found'));
  res.json({ success: true, user });
};

export const getAllEvents = async (req, res) => {
  const events = await Event.find()
    .populate('organizer', 'name email')
    .populate('ticketTypes')
    .sort({ createdAt: -1 });
  res.json({ success: true, events });
};

export const deleteEventAdmin = async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) return next(new ApiError(404, 'Event not found'));

  await TicketType.deleteMany({ event: event._id });
  await Booking.deleteMany({ event: event._id });
  await event.deleteOne();

  res.json({ success: true, message: 'Event deleted' });
};

export const getAllBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate('user', 'name email')
    .populate('event', 'title')
    .populate('ticketType', 'name')
    .sort({ createdAt: -1 });
  res.json({ success: true, bookings });
};

export const getPendingOrganizers = async (req, res) => {
  const organizers = await User.find({ role: 'organizer', isApproved: false }).select('-password');
  res.json({ success: true, organizers });
};

export const approveOrganizer = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  ).select('-password');

  if (!user) return next(new ApiError(404, 'User not found'));
  sendOrganizerApprovedEmail(user).catch(console.error);
  res.json({ success: true, user, message: 'Organizer approved' });
};

export const rejectOrganizer = async (req, res, next) => {
  const { reason } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: 'attendee', isApproved: false },
    { new: true }
  ).select('-password');

  if (!user) return next(new ApiError(404, 'User not found'));
  sendOrganizerRejectedEmail(user, reason).catch(console.error);
  res.json({ success: true, user, message: 'Organizer rejected' });
};

export const getAdminAnalytics = async (req, res) => {
  const bookingsByMonth = await Booking.aggregate([
    { $match: { status: { $in: ['confirmed', 'attended'] } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const eventsByCategory = await Event.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);

  res.json({ success: true, bookingsByMonth, eventsByCategory });
};
