import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { formatDate } from '../utils/formatDate';
import { formatCurrency, getLowestPrice, getSeatsLeft } from '../utils/formatCurrency';

export const EventCard = ({ event, index = 0 }) => {
  const lowestPrice = getLowestPrice(event.ticketTypes);
  const seatsLeft = getSeatsLeft(event.ticketTypes);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="bg-surface rounded-2xl border border-white/10 overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
    >
      <div className="relative aspect-video">
        <img
          src={event.bannerUrl || 'https://placehold.co/800x450/1A1A2E/6C63FF?text=Evenzo'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge category={event.category}>{event.category}</Badge>
        </div>
        {seatsLeft < 10 && seatsLeft > 0 && (
          <div className="absolute top-3 right-3">
            <Badge variant="danger">{seatsLeft} left!</Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{event.title}</h3>
        <p className="text-text-muted text-sm mb-2">
          by {event.organizer?.name || 'Organizer'}
        </p>
        <div className="flex flex-col gap-1 text-sm text-text-muted mb-3">
          <span>📅 {formatDate(event.date)}{event.startTime ? ` · ${event.startTime}` : ''}</span>
          <span>📍 {event.city || 'TBA'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary">{formatCurrency(lowestPrice)}</span>
          <Link to={`/events/${event._id}`}>
            <Button size="sm">Book Now</Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
