import { useParams } from 'react-router-dom';
import { useEventBookings } from '../../../hooks/useBookings';
import { Badge } from '../../../components/ui/Badge';
import { PageLoader } from '../../../components/ui/Spinner';
import { formatCurrency } from '../../../utils/formatCurrency';

export const EventBookings = () => {
  const { id } = useParams();
  const { data, isLoading } = useEventBookings(id);

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Event Bookings</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-text-muted border-b border-white/10">
              <th className="text-left py-3 px-2">Attendee</th>
              <th className="text-left py-3 px-2">Ticket</th>
              <th className="text-left py-3 px-2">Qty</th>
              <th className="text-left py-3 px-2">Amount</th>
              <th className="text-left py-3 px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.bookings?.map((b) => (
              <tr key={b._id} className="border-b border-white/5">
                <td className="py-3 px-2">{b.user?.name}<br /><span className="text-text-muted text-xs">{b.user?.email}</span></td>
                <td className="py-3 px-2">{b.ticketType?.name}</td>
                <td className="py-3 px-2">{b.quantity}</td>
                <td className="py-3 px-2">{formatCurrency(b.totalAmount)}</td>
                <td className="py-3 px-2"><Badge status={b.status}>{b.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
