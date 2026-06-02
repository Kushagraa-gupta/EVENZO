export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTime = (time) => time || '';

export const formatDateTime = (date, startTime) => {
  const d = formatDate(date);
  return startTime ? `${d} · ${startTime}` : d;
};

export const getDaysUntil = (date) => {
  const diff = new Date(date) - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
};
