import { Link } from 'react-router-dom';
import { useOrganizerEvents, useDeleteEvent } from '../../../hooks/useEvents';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { PageLoader } from '../../../components/ui/Spinner';
import { formatDate } from '../../../utils/formatDate';

export const MyEvents = () => {
  const { data, isLoading } = useOrganizerEvents();
  const deleteEvent = useDeleteEvent();

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Events</h1>
        <Link to="/dashboard/organizer/create"><Button size="sm">+ Create</Button></Link>
      </div>
      <div className="space-y-4">
        {data?.events?.map((e) => (
          <div key={e._id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-4 items-center">
              <img src={e.bannerUrl || 'https://placehold.co/80x60/1A1A2E/6C63FF'} alt="" className="w-20 h-14 object-cover rounded-lg" />
              <div>
                <p className="font-bold">{e.title}</p>
                <p className="text-sm text-text-muted">{formatDate(e.date)} · {e.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge status={e.status}>{e.status}</Badge>
              <Link to={`/dashboard/organizer/events/${e._id}/edit`}>
                <Button variant="secondary" size="sm">Edit</Button>
              </Link>
              <Link to={`/dashboard/organizer/events/${e._id}/bookings`}>
                <Button variant="ghost" size="sm">Bookings</Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (confirm('Delete this event?')) deleteEvent.mutate(e._id);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
