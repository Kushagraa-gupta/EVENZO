import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';
import { Badge } from '../../../components/ui/Badge';
import { PageLoader } from '../../../components/ui/Spinner';
import { formatCurrency } from '../../../utils/formatCurrency';

export const ManageBookings = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => api.get('/admin/bookings').then((r) => r.data),
  });

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Bookings</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-text-muted border-b border-white/10">
              <th className="text-left py-3">User</th>
              <th className="text-left py-3">Event</th>
              <th className="text-left py-3">Amount</th>
              <th className="text-left py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.bookings?.map((b) => (
              <tr key={b._id} className="border-b border-white/5">
                <td className="py-3">{b.user?.name}</td>
                <td className="py-3">{b.event?.title}</td>
                <td className="py-3">{formatCurrency(b.totalAmount)}</td>
                <td className="py-3"><Badge status={b.status}>{b.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
