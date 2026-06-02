import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    category: {
      type: String,
      enum: ['Music', 'Sports', 'Comedy', 'Tech', 'Food', 'Art', 'Conference', 'Workshop', 'Other'],
      required: true,
    },
    bannerUrl: { type: String, default: '' },
    date: { type: Date, required: [true, 'Event date is required'] },
    startTime: { type: String, default: '' },
    endTime: { type: String, default: '' },
    venueName: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    mapsLink: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'published', 'cancelled'],
      default: 'draft',
    },
    tags: [{ type: String }],
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ticketTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TicketType' }],
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);
export default Event;
