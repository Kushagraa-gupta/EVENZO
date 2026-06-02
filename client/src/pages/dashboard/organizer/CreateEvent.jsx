import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../../services/api';
import { useCreateEvent } from '../../../hooks/useEvents';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

const categories = ['Music', 'Sports', 'Comedy', 'Tech', 'Food', 'Art', 'Conference', 'Workshop', 'Other'];

const schema = z.object({
  title: z.string().min(3),
  category: z.enum(categories),
  description: z.string().min(10),
  tags: z.string().optional(),
  date: z.string().min(1),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  venueName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  mapsLink: z.string().optional(),
  bannerUrl: z.string().optional(),
  status: z.enum(['draft', 'published']),
  ticketTypes: z.array(z.object({
    name: z.string().min(1),
    price: z.coerce.number().min(0),
    totalSeats: z.coerce.number().min(1),
  })).min(1),
});

export const CreateEvent = () => {
  const navigate = useNavigate();
  const createEvent = useCreateEvent();
  const [step, setStep] = useState(0);
  const [uploading, setUploading] = useState(false);

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'draft',
      ticketTypes: [{ name: 'General Admission', price: 0, totalSeats: 100 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'ticketTypes' });
  const watched = watch();

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setValue('bannerUrl', data.url);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
    };
    await createEvent.mutateAsync(payload);
    navigate('/dashboard/organizer/events');
  };

  const steps = ['Basic Info', 'Date & Venue', 'Tickets', 'Banner & Publish'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Event</h1>
      <div className="flex gap-2 mb-8">
        {steps.map((s, i) => (
          <button
            key={s}
            onClick={() => setStep(i)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              step === i ? 'gradient-bg text-white' : 'bg-white/5 text-text-muted'
            }`}
          >
            {i + 1}. {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {step === 0 && (
            <>
              <Input label="Event Title" error={errors.title?.message} {...register('title')} />
              <div>
                <label className="block text-sm text-text-muted mb-1.5">Category</label>
                <select {...register('category')} className="w-full bg-surface2 border border-white/10 rounded-xl px-4 py-2.5 text-white">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1.5">Description</label>
                <textarea {...register('description')} rows={4} className="w-full bg-surface2 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
                {errors.description && <p className="text-error text-sm mt-1">{errors.description.message}</p>}
              </div>
              <Input label="Tags (comma separated)" {...register('tags')} />
            </>
          )}
          {step === 1 && (
            <>
              <Input label="Date" type="date" error={errors.date?.message} {...register('date')} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Start Time" type="time" {...register('startTime')} />
                <Input label="End Time" type="time" {...register('endTime')} />
              </div>
              <Input label="Venue Name" {...register('venueName')} />
              <Input label="Address" {...register('address')} />
              <Input label="City" {...register('city')} />
              <Input label="Google Maps Link" {...register('mapsLink')} />
            </>
          )}
          {step === 2 && (
            <>
              {fields.map((field, i) => (
                <div key={field.id} className="glass rounded-xl p-4 space-y-3">
                  <Input label="Ticket Name" {...register(`ticketTypes.${i}.name`)} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Price (₹)" type="number" {...register(`ticketTypes.${i}.price`)} />
                    <Input label="Total Seats" type="number" {...register(`ticketTypes.${i}.totalSeats`)} />
                  </div>
                  {fields.length > 1 && (
                    <Button type="button" variant="danger" size="sm" onClick={() => remove(i)}>Remove</Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={() => append({ name: 'VIP', price: 0, totalSeats: 50 })}>
                + Add Ticket Type
              </Button>
            </>
          )}
          {step === 3 && (
            <>
              <div>
                <label className="block text-sm text-text-muted mb-1.5">Banner Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-text-muted" />
                {uploading && <p className="text-sm text-primary mt-1">Uploading...</p>}
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1.5">Status</label>
                <select {...register('status')} className="w-full bg-surface2 border border-white/10 rounded-xl px-4 py-2.5 text-white">
                  <option value="draft">Save as Draft</option>
                  <option value="published">Publish Now</option>
                </select>
              </div>
              <Button type="submit" disabled={createEvent.isPending}>
                {createEvent.isPending ? 'Creating...' : 'Create Event'}
              </Button>
            </>
          )}
          {step < 3 && (
            <Button type="button" onClick={() => setStep(step + 1)}>Next →</Button>
          )}
        </form>

        <div className="glass rounded-2xl p-6 sticky top-24 h-fit hidden lg:block">
          <p className="text-sm text-text-muted mb-3">Live Preview</p>
          {watched.bannerUrl && (
            <img src={watched.bannerUrl} alt="" className="w-full aspect-video object-cover rounded-xl mb-3" />
          )}
          <h3 className="font-bold text-lg">{watched.title || 'Event Title'}</h3>
          {watched.category && <Badge category={watched.category} className="mt-2">{watched.category}</Badge>}
          <p className="text-text-muted text-sm mt-2 line-clamp-3">{watched.description || 'Description...'}</p>
          <p className="text-sm text-text-muted mt-2">📍 {watched.city || 'City'}</p>
        </div>
      </div>
    </div>
  );
};
