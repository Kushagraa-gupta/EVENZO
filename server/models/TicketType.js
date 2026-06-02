import mongoose from 'mongoose';

const ticketTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0, default: 0 },
    totalSeats: { type: Number, required: true, min: 1 },
    bookedSeats: { type: Number, default: 0, min: 0 },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  },
  { timestamps: true }
);

const TicketType = mongoose.model('TicketType', ticketTypeSchema);
export default TicketType;
