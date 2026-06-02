import api from './api';

export const eventService = {
  getEvents: (params) => api.get('/events', { params }),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  getOrganizerEvents: () => api.get('/events/organizer/my'),
  getOrganizerStats: () => api.get('/events/organizer/stats'),
};
