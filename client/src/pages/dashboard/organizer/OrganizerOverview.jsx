import { Link } from 'react-router-dom';
import { useOrganizerEvents, useOrganizerStats } from '../../../hooks/useEvents';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Spinner';
import { formatCurrency } from '../../../utils/formatCurrency';

export const OrganizerOverview = () => {
  const { data: eventsData, isLoading: eventsLoading } = useOrganizerEvents();
  const { data: statsData, isLoading: statsLoading } = useOrganizerStats();

  const stats = statsData?.stats;
  const events = eventsData?.events || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Organizer Overview</h1>
        <Link to="/dashboard/organizer/create"><Button size="sm">+ Create Event</Button></Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Events', value: stats?.totalEvents },
          { label: 'Published', value: stats?.publishedEvents },
          { label: 'Tickets Sold', value: stats?.ticketsSold },
          { label: 'Revenue', value: stats ? formatCurrency(stats.totalRevenue) : '—' },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <p className="text-text-muted text-sm">{s.label}</p>
            <p className="text-2xl font-bold mt-1">
              {statsLoading ? <Skeleton className="h-8 w-16 inline-block" /> : s.value ?? 0}
            </p>
          </div>
        ))}
      </div>
      <h2 className="font-semibold mb-4">Your Events</h2>
      {eventsLoading ? (
        <Skeleton className="h-24" />
      ) : events.length === 0 ? (
        <p className="text-text-muted">No events yet. Create your first event!</p>
      ) : (
        events.slice(0, 5).map((e) => (
          <div key={e._id} className="glass rounded-xl p-4 mb-3 flex justify-between items-center">
            <div>
              <p className="font-semibold">{e.title}</p>
              <p className="text-sm text-text-muted">{e.city}</p>
            </div>
            <Badge status={e.status}>{e.status}</Badge>
          </div>
        ))
      )}
    </div>
  );
};
