import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useEvent } from '../hooks/useEvents';
import { useCreateBooking, useCheckout } from '../hooks/useBookings';
import { useAuth } from '../hooks/useAuth';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EventCard } from '../components/EventCard';
import { PageLoader } from '../components/ui/Spinner';
import { formatDate, formatDateTime, getDaysUntil } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';

export const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useEvent(id);
  const createBooking = useCreateBooking();
  const checkout = useCheckout();

  const [selectedTicket, setSelectedTicket] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('about');

  if (isLoading) return <PageLoader />;
  const { event, related } = data || {};
  if (!event) return <div className="text-center py-20 text-text-muted">Event not found</div>;

  const ticket = event.ticketTypes?.find((t) => t._id === selectedTicket) || event.ticketTypes?.[0];
  const total = (ticket?.price || 0) * quantity;
  const daysLeft = getDaysUntil(event.date);

  const handleBook = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }
    const ticketId = selectedTicket || event.ticketTypes[0]?._id;
    try {
      const { data: bookingData } = await createBooking.mutateAsync({
        eventId: id,
        ticketTypeId: ticketId,
        quantity,
      });

      if (bookingData.isFree) {
        toast.success('Booking confirmed!');
        navigate(`/booking-success?bookingId=${bookingData.booking._id}`);
      } else {
        const { data: checkoutData } = await checkout.mutateAsync(bookingData.booking._id);
        window.location.href = checkoutData.url;
      }
    } catch {
      /* handled by mutation */
    }
  };

  const tabs = ['about', 'tickets', 'location', 'organizer'];

  return (
    <div>
      <div className="relative h-64 sm:h-96 overflow-hidden">
        <img
          src={event.bannerUrl || 'https://placehold.co/1200x400/1A1A2E/6C63FF?text=Evenzo'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-[70%]">
            <div className="flex items-start gap-3 mb-4">
              <Badge category={event.category}>{event.category}</Badge>
              {daysLeft <= 7 && (
                <Badge variant="warning">{daysLeft === 0 ? 'Today!' : `${daysLeft} days left`}</Badge>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{event.title}</h1>
            <p className="text-text-muted mb-6">
              Organized by <span className="text-white">{event.organizer?.name}</span>
            </p>

            <div className="flex gap-2 mb-6 border-b border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm capitalize transition-colors border-b-2 -mb-px ${
                    activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-text-muted'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'about' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-text-muted leading-relaxed whitespace-pre-line">{event.description}</p>
                {event.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {event.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-white/5 px-3 py-1 rounded-full">#{tag}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
            {activeTab === 'tickets' && (
              <div className="space-y-3">
                {event.ticketTypes?.map((t) => (
                  <div key={t._id} className="glass rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-sm text-text-muted">
                        {t.totalSeats - t.bookedSeats} seats available
                      </p>
                    </div>
                    <span className="font-bold text-primary">{formatCurrency(t.price)}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'location' && (
              <div className="glass rounded-xl p-4 space-y-2">
                <p className="font-semibold">{event.venueName}</p>
                <p className="text-text-muted">{event.address}, {event.city}</p>
                <p className="text-text-muted">📅 {formatDateTime(event.date, event.startTime)}</p>
                {event.mapsLink && (
                  <a href={event.mapsLink} target="_blank" rel="noreferrer" className="text-primary text-sm hover:underline">
                    View on Maps →
                  </a>
                )}
              </div>
            )}
            {activeTab === 'organizer' && (
              <div className="glass rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                  {event.organizer?.name?.[0]}
                </div>
                <div>
                  <p className="font-semibold">{event.organizer?.name}</p>
                  <p className="text-sm text-text-muted">{event.organizer?.email}</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-[30%]">
            <div className="glass rounded-2xl p-6 sticky top-24">
              <p className="text-sm text-text-muted mb-1">📅 {formatDate(event.date)}</p>
              <p className="text-sm text-text-muted mb-4">📍 {event.city}</p>

              <div className="space-y-3 mb-4">
                <label className="text-sm text-text-muted">Ticket Type</label>
                <select
                  value={selectedTicket || event.ticketTypes?.[0]?._id}
                  onChange={(e) => setSelectedTicket(e.target.value)}
                  className="w-full bg-surface2 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                >
                  {event.ticketTypes?.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} — {formatCurrency(t.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-text-muted">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10"
                  >
                    −
                  </button>
                  <span className="font-bold w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 pt-4 border-t border-white/10">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(total)}</span>
              </div>

              <Button
                className="w-full"
                onClick={handleBook}
                disabled={createBooking.isPending || checkout.isPending}
              >
                {createBooking.isPending ? 'Processing...' : 'Book Now'}
              </Button>
            </div>
          </div>
        </div>

        {related?.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((e, i) => (
                <EventCard key={e._id} event={e} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
