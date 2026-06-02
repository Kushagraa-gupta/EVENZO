import { z } from 'zod';
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import TicketType from '../models/TicketType.js';
import { ApiError } from '../utils/ApiError.js';
import { createCheckoutSession, constructWebhookEvent, createRefund } from '../services/stripe.service.js';
import { confirmBooking } from './booking.controller.js';

const checkoutSchema = z.object({
  bookingId: z.string(),
});

export const createCheckout = async (req, res, next) => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) return next(new ApiError(400, 'Booking ID required'));

  const booking = await Booking.findById(parsed.data.bookingId)
    .populate('event')
    .populate('ticketType');

  if (!booking) return next(new ApiError(404, 'Booking not found'));
  if (booking.user.toString() !== req.user._id.toString()) {
    return next(new ApiError(403, 'Not authorized'));
  }
  if (booking.status !== 'pending') {
    return next(new ApiError(400, 'Booking is not pending payment'));
  }
  if (booking.totalAmount === 0) {
    return next(new ApiError(400, 'This is a free booking'));
  }

  const session = await createCheckoutSession({
    lineItems: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: `${booking.event.title} — ${booking.ticketType.name}`,
            description: `Ticket for ${booking.event.title}`,
          },
          unit_amount: Math.round(booking.ticketType.price * 100),
        },
        quantity: booking.quantity,
      },
    ],
    successUrl: `${process.env.CLIENT_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${process.env.CLIENT_URL}/events/${booking.event._id}`,
    metadata: {
      bookingId: booking._id.toString(),
      userId: req.user._id.toString(),
      eventId: booking.event._id.toString(),
    },
    customerEmail: req.user.email,
  });

  booking.stripeSessionId = session.id;
  await booking.save();

  res.json({ success: true, url: session.url, sessionId: session.id });
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = constructWebhookEvent(req.body, sig);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { bookingId } = session.metadata;

    const booking = await Booking.findById(bookingId);
    if (booking && booking.status === 'pending') {
      booking.stripePaymentIntentId = session.payment_intent;
      booking.stripeSessionId = session.id;
      await booking.save();
      await confirmBooking(bookingId);
    }
  }

  res.json({ received: true });
};

export const refundBooking = async (req, res, next) => {
  const booking = await Booking.findById(req.params.bookingId);
  if (!booking) return next(new ApiError(404, 'Booking not found'));

  if (!booking.stripePaymentIntentId) {
    return next(new ApiError(400, 'No payment to refund'));
  }

  await createRefund(booking.stripePaymentIntentId, booking.totalAmount);

  if (booking.status === 'confirmed') {
    const ticket = await TicketType.findById(booking.ticketType);
    if (ticket) {
      ticket.bookedSeats = Math.max(0, ticket.bookedSeats - booking.quantity);
      await ticket.save();
    }
  }

  booking.status = 'cancelled';
  await booking.save();

  res.json({ success: true, message: 'Refund issued', booking });
};

export const getSessionBooking = async (req, res, next) => {
  const { sessionId } = req.query;
  if (!sessionId) return next(new ApiError(400, 'Session ID required'));

  const booking = await Booking.findOne({ stripeSessionId: sessionId })
    .populate('event')
    .populate('ticketType');

  if (!booking) return next(new ApiError(404, 'Booking not found'));
  if (booking.user.toString() !== req.user._id.toString()) {
    return next(new ApiError(403, 'Not authorized'));
  }

  res.json({ success: true, booking });
};
