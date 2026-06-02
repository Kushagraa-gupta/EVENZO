import { Link } from 'react-router-dom';
import { useMyBookings } from '../../../hooks/useBookings';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Spinner';
import { formatDate } from '../../../utils/formatDate';
import { formatCurrency } from '../../../utils/formatCurrency';

export const AttendeeOverview = () => {
  const { data, isLoading } = useMyBookings();
  const bookings = data?.bookings || [];
  const confirmed = bookings.filter((b) => b.status === 'confirmed');
  const upcoming = confirmed.filter((b) => new Date(b.event?.date) > new Date());

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Bookings', value: bookings.length },
          { label: 'Confirmed', value: confirmed.length },
          { label: 'Upcoming', value: upcoming.length },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <p className="text-text-muted text-sm">{s.label}</p>
            <p className="text-3xl font-bold mt-1">{isLoading ? '—' : s.value}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Recent Bookings</h2>
        <Link to="/dashboard/attendee/bookings"><Button variant="ghost" size="sm">View all</Button></Link>
      </div>
      {isLoading ? (
        <Skeleton className="h-32" />
      ) : bookings.slice(0, 5).map((b) => (
        <div key={b._id} className="glass rounded-xl p-4 mb-3 flex justify-between items-center">
          <div>
            <p className="font-semibold">{b.event?.title}</p>
            <p className="text-sm text-text-muted">{formatDate(b.event?.date)} · {formatCurrency(b.totalAmount)}</p>
          </div>
          <Badge status={b.status}>{b.status}</Badge>
        </div>
      ))}
    </div>
  );
};
