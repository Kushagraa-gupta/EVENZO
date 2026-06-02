import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const schema = z.object({ email: z.string().email('Invalid email') });

export const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await authService.forgotPassword(data.email);
      toast.success('If that email exists, a reset link was sent.');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Request failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md glass rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-1">Forgot Password</h1>
        <p className="text-text-muted text-sm mb-6">We'll send you a reset link</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Button type="submit" className="w-full" disabled={isSubmitting}>Send Reset Link</Button>
        </form>
        <Link to="/login" className="block text-center text-sm text-primary mt-4 hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  );
};
