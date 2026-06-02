import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { PageLoader } from '../../../components/ui/Spinner';

export const ManageUsers = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users').then((r) => r.data),
  });

  const updateUser = useMutation({
    mutationFn: ({ id, ...body }) => api.put(`/admin/users/${id}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User updated');
    },
  });

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-text-muted border-b border-white/10">
              <th className="text-left py-3">Name</th>
              <th className="text-left py-3">Email</th>
              <th className="text-left py-3">Role</th>
              <th className="text-left py-3">Status</th>
              <th className="text-left py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.users?.map((u) => (
              <tr key={u._id} className="border-b border-white/5">
                <td className="py-3">{u.name}</td>
                <td className="py-3 text-text-muted">{u.email}</td>
                <td className="py-3"><Badge>{u.role}</Badge></td>
                <td className="py-3">
                  <Badge variant={u.isActive ? 'success' : 'danger'}>
                    {u.isActive ? 'Active' : 'Banned'}
                  </Badge>
                </td>
                <td className="py-3">
                  <Button
                    size="sm"
                    variant={u.isActive ? 'danger' : 'secondary'}
                    onClick={() => updateUser.mutate({ id: u._id, isActive: !u.isActive })}
                  >
                    {u.isActive ? 'Ban' : 'Unban'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
