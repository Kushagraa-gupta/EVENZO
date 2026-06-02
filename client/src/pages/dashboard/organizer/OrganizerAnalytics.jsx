import { useOrganizerStats } from '../../../hooks/useEvents';
import { PageLoader } from '../../../components/ui/Spinner';
import { formatCurrency } from '../../../utils/formatCurrency';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export const OrganizerAnalytics = () => {
  const { data, isLoading } = useOrganizerStats();

  if (isLoading) return <PageLoader />;

  const stats = data?.stats;
  const chartData = stats?.byEvent?.map((e) => ({
    name: e._id?.slice(-6) || 'Event',
    revenue: e.revenue,
    tickets: e.tickets,
  })) || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-2xl p-5">
          <p className="text-text-muted text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(stats?.totalRevenue || 0)}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-text-muted text-sm">Tickets Sold</p>
          <p className="text-2xl font-bold">{stats?.ticketsSold || 0}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-text-muted text-sm">Events</p>
          <p className="text-2xl font-bold">{stats?.totalEvents || 0}</p>
        </div>
      </div>
      {chartData.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Revenue by Event</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#A0A0B0" />
              <YAxis stroke="#A0A0B0" />
              <Tooltip contentStyle={{ background: '#1A1A2E', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Bar dataKey="revenue" fill="#6C63FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
