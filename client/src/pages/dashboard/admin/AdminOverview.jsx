import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';
import { PageLoader } from '../../../components/ui/Spinner';
import { formatCurrency } from '../../../utils/formatCurrency';
import { Badge } from '../../../components/ui/Badge';

export const AdminOverview = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats').then((r) => r.data),
  });

  if (isLoading) return <PageLoader />;

  const stats = data?.stats;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Platform Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: stats?.users },
          { label: 'Total Events', value: stats?.events },
          { label: 'Bookings', value: stats?.bookings },
          { label: 'Revenue', value: formatCurrency(stats?.revenue) },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <p className="text-text-muted text-sm">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>
      {stats?.pendingOrganizers > 0 && (
        <div className="glass rounded-xl p-4 mb-6 border border-warning/30">
          <p className="text-warning">⚠ {stats.pendingOrganizers} organizer(s) awaiting approval</p>
        </div>
      )}
      <h2 className="font-semibold mb-4">Recent Bookings</h2>
      {stats?.recentBookings?.map((b) => (
        <div key={b._id} className="glass rounded-xl p-4 mb-3 flex justify-between">
          <div>
            <p className="font-medium">{b.user?.name} → {b.event?.title}</p>
          </div>
          <Badge status={b.status}>{b.status}</Badge>
        </div>
      ))}
    </div>
  );
};
