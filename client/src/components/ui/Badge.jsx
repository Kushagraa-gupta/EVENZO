const categoryColors = {
  Music: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Sports: 'bg-green-500/20 text-green-300 border-green-500/30',
  Comedy: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Tech: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Food: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Art: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  Conference: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  Workshop: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  Other: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

const statusColors = {
  draft: 'bg-gray-500/20 text-gray-300',
  published: 'bg-success/20 text-success',
  cancelled: 'bg-error/20 text-error',
  pending: 'bg-warning/20 text-warning',
  confirmed: 'bg-success/20 text-success',
  attended: 'bg-primary/20 text-primary',
};

export const Badge = ({ children, variant = 'default', category, status, className = '' }) => {
  let colorClass = 'bg-white/10 text-text-muted border-white/10';
  if (category && categoryColors[category]) colorClass = categoryColors[category];
  if (status && statusColors[status]) colorClass = statusColors[status];
  if (variant === 'danger') colorClass = 'bg-error/20 text-error border-error/30';
  if (variant === 'success') colorClass = 'bg-success/20 text-success border-success/30';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} ${className}`}>
      {children}
    </span>
  );
};
