import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import api from '../../services/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const Profile = () => {
  const { user, updateUser } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name || '' },
  });

  const onSubmit = async (data) => {
    try {
      const res = await authService.updateProfile(data);
      updateUser(res.data.user);
      toast.success('Profile updated');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data: upload } = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const res = await authService.updateProfile({ avatar: upload.url });
      updateUser(res.data.user);
      toast.success('Avatar updated');
    } catch {
      toast.error('Avatar upload failed');
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="glass rounded-2xl p-6 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            user?.name?.[0]?.toUpperCase()
          )}
        </div>
        <div>
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm text-text-muted">{user?.email}</p>
          <RoleBadge role={user?.role} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-2xl p-6 space-y-4">
        <Input label="Display Name" error={errors.name?.message} {...register('name')} />
        <div>
          <label className="block text-sm text-text-muted mb-1.5">Avatar</label>
          <input type="file" accept="image/*" onChange={handleAvatarUpload} className="text-sm text-text-muted" />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
};

const RoleBadge = ({ role }) => (
  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary capitalize">
    {role}
  </span>
);
