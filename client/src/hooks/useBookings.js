import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import toast from 'react-hot-toast';

export const useMyBookings = () =>
  useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingService.getMyBookings().then((r) => r.data),
  });

export const useBooking = (id) =>
  useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getBooking(id).then((r) => r.data),
    enabled: !!id,
  });

export const useEventBookings = (eventId) =>
  useQuery({
    queryKey: ['event-bookings', eventId],
    queryFn: () => bookingService.getEventBookings(eventId).then((r) => r.data),
    enabled: !!eventId,
  });

export const useCreateBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => bookingService.createBooking(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-bookings'] }),
    onError: (e) => toast.error(e.response?.data?.message || 'Booking failed'),
  });
};

export const useCancelBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => bookingService.cancelBooking(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-bookings'] });
      toast.success('Booking cancelled');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Cancellation failed'),
  });
};

export const useCheckout = () =>
  useMutation({
    mutationFn: (bookingId) => paymentService.createCheckout(bookingId),
    onError: (e) => toast.error(e.response?.data?.message || 'Checkout failed'),
  });

export const useCheckin = () =>
  useMutation({
    mutationFn: (qrData) => bookingService.checkin(qrData),
    onSuccess: (r) => toast.success(`Checked in: ${r.data.attendee?.name}`),
    onError: (e) => toast.error(e.response?.data?.message || 'Check-in failed'),
  });
