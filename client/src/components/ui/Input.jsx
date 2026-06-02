export const Input = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => (
  <div className="w-full">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-text-muted mb-1.5">
        {label}
      </label>
    )}
    <input
      id={id}
      className={`w-full bg-surface2 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-text-muted/60 focus:outline-none focus:border-primary transition-colors ${error ? 'border-error' : ''} ${className}`}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-error">{error}</p>}
  </div>
);
