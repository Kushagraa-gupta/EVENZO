import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { PageLoader } from '../../../components/ui/Spinner';
import { formatDate } from '../../../utils/formatDate';

export const ManageEvents = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: () => api.get('/admin/events').then((r) => r.data),
  });

  const deleteEvent = useMutation({
    mutationFn: (id) => api.delete(`/admin/events/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-events'] });
      toast.success('Event deleted');
    },
  });

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Events</h1>
      <div className="space-y-3">
        {data?.events?.map((e) => (
          <div key={e._id} className="glass rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{e.title}</p>
              <p className="text-sm text-text-muted">{formatDate(e.date)} · {e.organizer?.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge status={e.status}>{e.status}</Badge>
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  if (confirm('Delete event?')) deleteEvent.mutate(e._id);
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
