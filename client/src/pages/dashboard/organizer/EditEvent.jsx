import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEvent, useUpdateEvent } from '../../../hooks/useEvents';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { PageLoader } from '../../../components/ui/Spinner';

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string(),
  date: z.string(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  venueName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  status: z.enum(['draft', 'published', 'cancelled']),
  ticketTypes: z.array(z.object({
    name: z.string(),
    price: z.coerce.number().min(0),
    totalSeats: z.coerce.number().min(1),
  })),
});

export const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useEvent(id);
  const updateEvent = useUpdateEvent();

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const { fields } = useFieldArray({ control, name: 'ticketTypes' });

  useEffect(() => {
    if (data?.event) {
      const e = data.event;
      reset({
        title: e.title,
        description: e.description,
        category: e.category,
        date: e.date?.split('T')[0],
        startTime: e.startTime,
        endTime: e.endTime,
        venueName: e.venueName,
        address: e.address,
        city: e.city,
        status: e.status,
        ticketTypes: e.ticketTypes?.map((t) => ({
          name: t.name,
          price: t.price,
          totalSeats: t.totalSeats,
        })) || [],
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData) => {
    await updateEvent.mutateAsync({ id, data: formData });
    navigate('/dashboard/organizer/events');
  };

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
        <Input label="Title" error={errors.title?.message} {...register('title')} />
        <textarea {...register('description')} rows={4} className="w-full bg-surface2 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
        <Input label="Date" type="date" {...register('date')} />
        <Input label="City" {...register('city')} />
        <select {...register('status')} className="w-full bg-surface2 border border-white/10 rounded-xl px-4 py-2.5 text-white">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {fields.map((field, i) => (
          <div key={field.id} className="glass rounded-xl p-4 grid grid-cols-3 gap-2">
            <Input {...register(`ticketTypes.${i}.name`)} />
            <Input type="number" {...register(`ticketTypes.${i}.price`)} />
            <Input type="number" {...register(`ticketTypes.${i}.totalSeats`)} />
          </div>
        ))}
        <Button type="submit" disabled={updateEvent.isPending}>Save Changes</Button>
      </form>
    </div>
  );
};
