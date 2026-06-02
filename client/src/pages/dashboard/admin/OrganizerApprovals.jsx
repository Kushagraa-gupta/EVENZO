import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { PageLoader } from '../../../components/ui/Spinner';

export const OrganizerApprovals = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['pending-organizers'],
    queryFn: () => api.get('/admin/organizers/pending').then((r) => r.data),
  });

  const approve = useMutation({
    mutationFn: (id) => api.put(`/admin/organizers/${id}/approve`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pending-organizers'] });
      toast.success('Organizer approved');
    },
  });

  const reject = useMutation({
    mutationFn: (id) => api.put(`/admin/organizers/${id}/reject`, { reason: 'Application did not meet requirements.' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pending-organizers'] });
      toast.success('Organizer rejected');
    },
  });

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Organizer Approvals</h1>
      {data?.organizers?.length === 0 ? (
        <p className="text-text-muted">No pending approvals.</p>
      ) : (
        data.organizers.map((o) => (
          <div key={o._id} className="glass rounded-xl p-5 mb-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{o.name}</p>
              <p className="text-sm text-text-muted">{o.email}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => approve.mutate(o._id)}>Approve</Button>
              <Button size="sm" variant="danger" onClick={() => reject.mutate(o._id)}>Reject</Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
