import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEvents } from '../hooks/useEvents';
import { EventCard } from '../components/EventCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { Skeleton } from '../components/ui/Spinner';

export const Events = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    date: searchParams.get('date') || '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      city: searchParams.get('city') || '',
      category: searchParams.get('category') || '',
      date: searchParams.get('date') || '',
      minPrice: '',
      maxPrice: '',
    });
  }, [searchParams]);

  const { data, isLoading, isError, error, refetch } = useEvents(filters);
  const events = data?.events ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        Explore Events
      </motion.h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-64 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters({ search: '', city: '', category: '', date: '', minPrice: '', maxPrice: '' })}
          />
        </div>
        <div className="flex-1">
          <p className="text-text-muted text-sm mb-4">{data?.count || 0} events found</p>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72" />
              ))}
            </div>
          ) : isError ? (
            <div className="glass rounded-2xl p-12 text-center">
              <p className="text-error mb-2">Could not load events</p>
              <p className="text-text-muted text-sm mb-4">
                {error?.response?.data?.message || error?.message || 'Make sure the API server is running on port 5001'}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="text-primary hover:underline text-sm"
              >
                Try again
              </button>
            </div>
          ) : events.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center text-text-muted">
              No events found. Try adjusting your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <EventCard key={event._id} event={event} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
