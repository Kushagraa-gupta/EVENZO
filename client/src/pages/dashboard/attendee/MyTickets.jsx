import { useMyBookings } from '../../../hooks/useBookings';
import { QRTicket } from '../../../components/QRTicket';
import { PageLoader } from '../../../components/ui/Spinner';

export const MyTickets = () => {
  const { data, isLoading } = useMyBookings();
  const tickets = data?.bookings?.filter((b) => b.status === 'confirmed' || b.status === 'attended') || [];

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Tickets</h1>
      {tickets.length === 0 ? (
        <p className="text-text-muted">No active tickets. Book an event to get started!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((b) => (
            <QRTicket key={b._id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
};
