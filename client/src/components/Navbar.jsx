import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const dashboardPath = {
    admin: '/dashboard/admin',
    organizer: '/dashboard/organizer',
    attendee: '/dashboard/attendee',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold gradient-text font-[family-name:var(--font-heading)]">
              Evenzo
            </span>
            <span className="hidden sm:block text-xs text-text-muted">Your gateway to every experience</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/events" className="text-text-muted hover:text-white transition-colors text-sm">
              Events
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardPath[user?.role] || '/dashboard/attendee'}
                  className="text-text-muted hover:text-white transition-colors text-sm"
                >
                  Dashboard
                </Link>
                <span className="text-sm text-text-muted">{user?.name}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 flex flex-col gap-3"
          >
            <Link to="/events" onClick={() => setMenuOpen(false)} className="text-text-muted">
              Events
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardPath[user?.role]}
                  onClick={() => setMenuOpen(false)}
                  className="text-text-muted"
                >
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-left text-text-muted">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
};
