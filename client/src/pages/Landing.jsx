import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEvents } from '../hooks/useEvents';
import { EventCard } from '../components/EventCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Spinner';

const categories = [
  { name: 'Music', emoji: '🎵' },
  { name: 'Sports', emoji: '⚽' },
  { name: 'Comedy', emoji: '😂' },
  { name: 'Tech', emoji: '💻' },
  { name: 'Food', emoji: '🍕' },
  { name: 'Art', emoji: '🎨' },
];

const steps = [
  { icon: '🔍', title: 'Find your event', desc: 'Browse thousands of experiences' },
  { icon: '🎫', title: 'Book your ticket', desc: 'Secure checkout in seconds' },
  { icon: '📱', title: 'Show your QR', desc: 'Instant digital entry' },
];

export const Landing = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ query: '', city: '', date: '' });
  const { data, isLoading } = useEvents({ limit: 8 });
  const featuredEvents = data?.events ?? [];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.query) params.set('search', search.query);
    if (search.city) params.set('city', search.city);
    if (search.date) params.set('date', search.date);
    navigate(`/events?${params.toString()}`);
  };

  return (
    <div>
      <section className="hero-gradient min-h-[90vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
              Discover & Book{' '}
              <span className="gradient-text">Amazing Experiences</span>
            </h1>
            <p className="text-text-muted text-lg mb-8">Your gateway to every experience</p>

            <form onSubmit={handleSearch} className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <Input
                placeholder="Event name..."
                value={search.query}
                onChange={(e) => setSearch({ ...search, query: e.target.value })}
                className="flex-1"
              />
              <Input
                placeholder="City..."
                value={search.city}
                onChange={(e) => setSearch({ ...search, city: e.target.value })}
                className="sm:w-36"
              />
              <Input
                type="date"
                value={search.date}
                onChange={(e) => setSearch({ ...search, date: e.target.value })}
                className="sm:w-40"
              />
              <Button type="submit">Search</Button>
            </form>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((c) => (
            <Link
              key={c.name}
              to={`/events?category=${c.name}`}
              className="glass px-4 py-2 rounded-full text-sm hover:border-primary/50 border border-white/10 transition-colors"
            >
              {c.emoji} {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Events</h2>
          <Link to="/events" className="text-primary text-sm hover:underline">View all →</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="min-w-[280px] h-72 flex-shrink-0" />
              ))
            : featuredEvents.slice(0, 6).map((event, i) => (
                <div key={event._id} className="min-w-[280px] flex-shrink-0 snap-start">
                  <EventCard event={event} index={i} />
                </div>
              ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 text-center"
            >
              <div className="text-4xl mb-3">{step.icon}</div>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-text-muted text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Trending Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72" />)
            : featuredEvents.slice(0, 6).map((event, i) => (
                <EventCard key={event._id} event={event} index={i} />
              ))}
        </div>
      </section>

      <section className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-2">Stay in the loop</h2>
          <p className="text-text-muted text-sm mb-4">Get notified about events in your city</p>
          <div className="flex gap-2">
            <Input placeholder="your@email.com" className="flex-1" />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
};
