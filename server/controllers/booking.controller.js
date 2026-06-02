import { z } from 'zod';
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import TicketType from '../models/TicketType.js';
import { ApiError } from '../utils/ApiError.js';
import { getZodMessage } from '../utils/zodError.js';
import { generateBookingQR, parseQRPayload } from '../services/qr.service.js';
import {
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail,
} from '../services/email.service.js';
import { createRefund } from '../services/stripe.service.js';

const createBookingSchema = z.object({
  eventId: z.string(),
  ticketTypeId: z.string(),
  quantity: z.number().int().min(1).max(10),
});

export const confirmBooking = async (bookingId) => {
  const booking = await Booking.findById(bookingId)
    .populate('user', 'name email')
    .populate('event')
    .populate('ticketType');

  if (!booking || booking.status === 'confirmed') return booking;

  const qrCode = await generateBookingQR(booking._id);
  booking.status = 'confirmed';
  booking.qrCode = qrCode;
  await booking.save();

  const ticket = await TicketType.findById(booking.ticketType._id);
  ticket.bookedSeats += booking.quantity;
  await ticket.save();

  sendBookingConfirmationEmail(
    booking.user,
    booking,
    booking.event,
    qrCode
  ).catch(console.error);

  return booking;
};

export const createBooking = async (req, res, next) => {
  const parsed = createBookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(new ApiError(400, getZodMessage(parsed.error)));
  }

  const { eventId, ticketTypeId, quantity } = parsed.data;

  const event = await Event.findById(eventId);
  if (!event || event.status !== 'published') {
    return next(new ApiError(404, 'Event not available for booking'));
  }

  const ticketType = await TicketType.findById(ticketTypeId);
  if (!ticketType || ticketType.event.toString() !== eventId) {
    return next(new ApiError(404, 'Ticket type not found'));
  }

  const available = ticketType.totalSeats - ticketType.bookedSeats;
  if (available < quantity) {
    return next(new ApiError(400, `Only ${available} seats available`));
  }

  const totalAmount = ticketType.price * quantity;

  const booking = await Booking.create({
    user: req.user._id,
    event: eventId,
    ticketType: ticketTypeId,
    quantity,
    totalAmount,
    status: totalAmount === 0 ? 'confirmed' : 'pending',
  });

  if (totalAmount === 0) {
    const confirmed = await confirmBooking(booking._id);
    return res.status(201).json({ success: true, booking: confirmed, isFree: true });
  }

  res.status(201).json({ success: true, booking, isFree: false });
};

export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('event')
    .populate('ticketType')
    .sort({ createdAt: -1 });

  res.json({ success: true, bookings });
};

export const getBookingById = async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('event')
    .populate('ticketType')
    .populate('user', 'name email');

  if (!booking) return next(new ApiError(404, 'Booking not found'));

  const isOwner = booking.user._id.toString() === req.user._id.toString();
  const event = await Event.findById(booking.event._id || booking.event);
  const isOrganizer =
    req.user.role === 'organizer' &&
    event?.organizer?.toString() === req.user._id.toString();

  if (!isOwner && !isOrganizer && req.user.role !== 'admin') {
    return next(new ApiError(403, 'Not authorized'));
  }

  res.json({ success: true, booking });
};

export const cancelBooking = async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('event')
    .populate('user', 'name email');

  if (!booking) return next(new ApiError(404, 'Booking not found'));
  if (booking.user._id.toString() !== req.user._id.toString()) {
    return next(new ApiError(403, 'Not authorized'));
  }
  if (booking.status === 'cancelled') {
    return next(new ApiError(400, 'Booking already cancelled'));
  }
  if (booking.status === 'attended') {
    return next(new ApiError(400, 'Cannot cancel attended booking'));
  }

  if (booking.status === 'confirmed' && booking.stripePaymentIntentId) {
    try {
      await createRefund(booking.stripePaymentIntentId, booking.totalAmount);
    } catch (err) {
      console.error('Refund error:', err.message);
    }
  }

  if (booking.status === 'confirmed') {
    const ticket = await TicketType.findById(booking.ticketType);
    if (ticket) {
      ticket.bookedSeats = Math.max(0, ticket.bookedSeats - booking.quantity);
      await ticket.save();
    }
  }

  booking.status = 'cancelled';
  await booking.save();

  sendBookingCancellationEmail(booking.user, booking, booking.event).catch(console.error);

  res.json({ success: true, message: 'Booking cancelled', booking });
};

export const getEventBookings = async (req, res, next) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) return next(new ApiError(404, 'Event not found'));
  if (event.organizer.toString() !== req.user._id.toString()) {
    return next(new ApiError(403, 'Not authorized'));
  }

  const bookings = await Booking.find({ event: req.params.eventId })
    .populate('user', 'name email')
    .populate('ticketType')
    .sort({ createdAt: -1 });

  res.json({ success: true, bookings });
};

export const checkinBooking = async (req, res, next) => {
  const schema = z.object({ qrData: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return next(new ApiError(400, 'QR data required'));

  const bookingId = parseQRPayload(parsed.data.qrData);
  const booking = await Booking.findById(bookingId).populate('event').populate('user', 'name email');

  if (!booking) return next(new ApiError(404, 'Invalid ticket'));
  if (booking.status !== 'confirmed') {
    return next(new ApiError(400, `Booking status: ${booking.status}`));
  }

  const event = booking.event;
  if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ApiError(403, 'Not authorized to check in for this event'));
  }

  booking.status = 'attended';
  await booking.save();

  res.json({
    success: true,
    message: 'Check-in successful',
    attendee: booking.user,
    booking,
  });
};
