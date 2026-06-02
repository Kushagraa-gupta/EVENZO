import { useMyBookings, useCancelBooking } from '../../../hooks/useBookings';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { PageLoader } from '../../../components/ui/Spinner';
import { formatDate } from '../../../utils/formatDate';
import { formatCurrency } from '../../../utils/formatCurrency';

export const MyBookings = () => {
  const { data, isLoading } = useMyBookings();
  const cancelBooking = useCancelBooking();

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <div className="space-y-4">
        {data?.bookings?.length === 0 ? (
          <p className="text-text-muted">No bookings yet.</p>
        ) : (
          data.bookings.map((b) => (
            <div key={b._id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-lg">{b.event?.title}</p>
                <p className="text-text-muted text-sm">{formatDate(b.event?.date)} · {b.ticketType?.name} × {b.quantity}</p>
                <p className="text-primary font-semibold mt-1">{formatCurrency(b.totalAmount)}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge status={b.status}>{b.status}</Badge>
                {b.status === 'confirmed' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => cancelBooking.mutate(b._id)}
                    disabled={cancelBooking.isPending}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
