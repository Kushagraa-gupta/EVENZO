import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['attendee', 'organizer']),
});

export const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const defaultRole = params.get('role') === 'organizer' ? 'organizer' : 'attendee';

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: defaultRole },
  });

  const role = watch('role');

  const onSubmit = async (data) => {
    try {
      const result = await registerUser(data);
      toast.success(result.message || 'Account created!');
      navigate('/');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-2xl p-8"
      >
        <h1 className="text-2xl font-bold mb-1">Join Evenzo</h1>
        <p className="text-text-muted text-sm mb-6">Your gateway to every experience</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" error={errors.password?.message} {...register('password')} />
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">I want to</label>
            <div className="grid grid-cols-2 gap-2">
              {['attendee', 'organizer'].map((r) => (
                <label
                  key={r}
                  className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-colors ${
                    role === r ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 text-text-muted'
                  }`}
                >
                  <input type="radio" value={r} className="sr-only" {...register('role')} />
                  {r === 'attendee' ? '🎫 Attend Events' : '🎪 Host Events'}
                </label>
              ))}
            </div>
            {role === 'organizer' && (
              <p className="text-xs text-warning mt-2">Organizer accounts require admin approval.</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
        <p className="text-center text-sm text-text-muted mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};
