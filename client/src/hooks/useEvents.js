import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../services/eventService';
import toast from 'react-hot-toast';

export const useEvents = (params = {}) =>
  useQuery({
    queryKey: ['events', params],
    queryFn: () => eventService.getEvents(params).then((r) => r.data),
  });

export const useEvent = (id) =>
  useQuery({
    queryKey: ['event', id],
    queryFn: () => eventService.getEvent(id).then((r) => r.data),
    enabled: !!id,
  });

export const useOrganizerEvents = () =>
  useQuery({
    queryKey: ['organizer-events'],
    queryFn: () => eventService.getOrganizerEvents().then((r) => r.data),
  });

export const useOrganizerStats = () =>
  useQuery({
    queryKey: ['organizer-stats'],
    queryFn: () => eventService.getOrganizerStats().then((r) => r.data),
  });

export const useCreateEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => eventService.createEvent(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organizer-events'] });
      toast.success('Event created!');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to create event'),
  });
};

export const useUpdateEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => eventService.updateEvent(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organizer-events'] });
      qc.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event updated!');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update event'),
  });
};

export const useDeleteEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => eventService.deleteEvent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organizer-events'] });
      toast.success('Event deleted');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to delete event'),
  });
};
