import { formatDate, formatDateTime } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';
import { Badge } from './ui/Badge';

export const QRTicket = ({ booking }) => {
  const event = booking.event;
  return (
    <div className="glass rounded-2xl p-6 max-w-sm mx-auto text-center border border-white/10">
      <div className="mb-4">
        <span className="text-lg font-bold gradient-text">Evenzo</span>
        <p className="text-xs text-text-muted">Digital Ticket</p>
      </div>
      {booking.qrCode && (
        <img src={booking.qrCode} alt="QR Ticket" className="w-48 h-48 mx-auto rounded-xl mb-4" />
      )}
      <h3 className="font-bold text-lg mb-1">{event?.title}</h3>
      <p className="text-text-muted text-sm mb-3">
        {formatDateTime(event?.date, event?.startTime)}
      </p>
      <p className="text-sm text-text-muted mb-1">📍 {event?.venueName}, {event?.city}</p>
      <p className="text-sm mb-3">
        {booking.ticketType?.name} × {booking.quantity} — {formatCurrency(booking.totalAmount)}
      </p>
      <Badge status={booking.status}>{booking.status}</Badge>
      <p className="text-xs text-text-muted mt-4">ID: {booking._id?.slice(-8).toUpperCase()}</p>
    </div>
  );
};
