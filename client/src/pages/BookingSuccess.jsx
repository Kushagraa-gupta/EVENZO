import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { paymentService } from '../services/paymentService';
import { bookingService } from '../services/bookingService';
import { QRTicket } from '../components/QRTicket';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/Spinner';

export const BookingSuccess = () => {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const bookingId = params.get('bookingId');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['success-booking', sessionId, bookingId],
    queryFn: async () => {
      if (sessionId) {
        const res = await paymentService.getSessionBooking(sessionId);
        return res.data.booking;
      }
      if (bookingId) {
        const res = await bookingService.getBooking(bookingId);
        return res.data.booking;
      }
      return null;
    },
    enabled: !!(sessionId || bookingId),
    refetchInterval: sessionId ? 2000 : false,
    retry: 3,
  });

  useEffect(() => {
    if (sessionId && !data?.qrCode) {
      const timer = setTimeout(() => refetch(), 2000);
      return () => clearTimeout(timer);
    }
  }, [sessionId, data, refetch]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl mb-4">
        🎉
      </motion.div>
      <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
      <p className="text-text-muted mb-8">Your ticket is ready. Show the QR code at the venue.</p>

      {data && <QRTicket booking={data} />}

      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
        <Link to="/dashboard/attendee/tickets">
          <Button>My Tickets</Button>
        </Link>
        <Link to="/events">
          <Button variant="secondary">Browse More Events</Button>
        </Link>
      </div>
    </div>
  );
};
