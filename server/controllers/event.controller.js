import { z } from 'zod';
import Event from '../models/Event.js';
import TicketType from '../models/TicketType.js';
import Booking from '../models/Booking.js';
import { ApiError } from '../utils/ApiError.js';
import { getZodMessage } from '../utils/zodError.js';

const categories = ['Music', 'Sports', 'Comedy', 'Tech', 'Food', 'Art', 'Conference', 'Workshop', 'Other'];

const ticketTypeSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
  totalSeats: z.number().int().min(1),
});

const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.enum(categories),
  bannerUrl: z.string().optional(),
  date: z.string().or(z.date()),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  venueName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  mapsLink: z.string().optional(),
  status: z.enum(['draft', 'published', 'cancelled']).optional(),
  tags: z.array(z.string()).optional(),
  ticketTypes: z.array(ticketTypeSchema).min(1),
});

export const getEvents = async (req, res) => {
  const {
    city,
    category,
    date,
    minPrice,
    maxPrice,
    search,
    page = 1,
    limit = 12,
    status = 'published',
  } = req.query;

  const filter = { status };

  if (city) filter.city = new RegExp(city, 'i');
  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { tags: new RegExp(search, 'i') },
    ];
  }
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  }

  let events = await Event.find(filter)
    .populate('organizer', 'name avatar')
    .populate('ticketTypes')
    .sort({ date: 1 })
    .lean();

  if (minPrice || maxPrice) {
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || Infinity;
    events = events.filter((e) => {
      const prices = e.ticketTypes?.map((t) => t.price) || [0];
      const lowest = Math.min(...prices);
      return lowest >= min && lowest <= max;
    });
  }

  const skip = (Number(page) - 1) * Number(limit);
  const paginated = events.slice(skip, skip + Number(limit));

  res.json({
    success: true,
    count: events.length,
    page: Number(page),
    totalPages: Math.ceil(events.length / Number(limit)),
    events: paginated,
  });
};

export const getEventById = async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate('organizer', 'name email avatar')
    .populate('ticketTypes');

  if (!event) return next(new ApiError(404, 'Event not found'));

  if (event.status !== 'published' && req.user?.role !== 'admin') {
    const isOwner =
      req.user &&
      (event.organizer._id.toString() === req.user._id.toString() ||
        event.organizer.toString() === req.user._id.toString());
    if (!isOwner) return next(new ApiError(404, 'Event not found'));
  }

  const related = await Event.find({
    _id: { $ne: event._id },
    status: 'published',
    $or: [{ category: event.category }, { city: event.city }],
  })
    .populate('organizer', 'name')
    .populate('ticketTypes')
    .limit(4);

  res.json({ success: true, event, related });
};

export const createEvent = async (req, res, next) => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(new ApiError(400, getZodMessage(parsed.error)));
  }

  const data = parsed.data;
  const event = await Event.create({
    ...data,
    date: new Date(data.date),
    organizer: req.user._id,
    status: data.status || 'draft',
  });

  const ticketDocs = await Promise.all(
    data.ticketTypes.map((t) =>
      TicketType.create({ ...t, event: event._id })
    )
  );

  event.ticketTypes = ticketDocs.map((t) => t._id);
  await event.save();

  const populated = await Event.findById(event._id)
    .populate('organizer', 'name')
    .populate('ticketTypes');

  res.status(201).json({ success: true, event: populated });
};

export const updateEvent = async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) return next(new ApiError(404, 'Event not found'));

  const isOwner = event.organizer.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return next(new ApiError(403, 'Not authorized to update this event'));
  }

  const parsed = eventSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return next(new ApiError(400, getZodMessage(parsed.error)));
  }

  const updates = parsed.data;
  if (updates.date) updates.date = new Date(updates.date);

  if (updates.ticketTypes) {
    await TicketType.deleteMany({ event: event._id });
    const ticketDocs = await Promise.all(
      updates.ticketTypes.map((t) =>
        TicketType.create({ ...t, event: event._id })
      )
    );
    updates.ticketTypes = ticketDocs.map((t) => t._id);
  }

  Object.assign(event, updates);
  await event.save();

  const populated = await Event.findById(event._id)
    .populate('organizer', 'name')
    .populate('ticketTypes');

  res.json({ success: true, event: populated });
};

export const deleteEvent = async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) return next(new ApiError(404, 'Event not found'));

  const isOwner = event.organizer.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return next(new ApiError(403, 'Not authorized to delete this event'));
  }

  await TicketType.deleteMany({ event: event._id });
  await Booking.deleteMany({ event: event._id });
  await event.deleteOne();

  res.json({ success: true, message: 'Event deleted' });
};

export const getOrganizerEvents = async (req, res) => {
  const events = await Event.find({ organizer: req.user._id })
    .populate('ticketTypes')
    .sort({ createdAt: -1 });

  res.json({ success: true, events });
};

export const getOrganizerStats = async (req, res) => {
  const events = await Event.find({ organizer: req.user._id });
  const eventIds = events.map((e) => e._id);

  const bookings = await Booking.find({
    event: { $in: eventIds },
    status: { $in: ['confirmed', 'attended'] },
  });

  const revenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const ticketsSold = bookings.reduce((sum, b) => sum + b.quantity, 0);

  const byEvent = await Booking.aggregate([
    { $match: { event: { $in: eventIds }, status: { $in: ['confirmed', 'attended'] } } },
    { $group: { _id: '$event', revenue: { $sum: '$totalAmount' }, tickets: { $sum: '$quantity' } } },
  ]);

  res.json({
    success: true,
    stats: {
      totalEvents: events.length,
      publishedEvents: events.filter((e) => e.status === 'published').length,
      totalRevenue: revenue,
      ticketsSold,
      byEvent,
    },
  });
};
