import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="bg-surface border-t border-white/10 mt-auto">
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <span className="text-2xl font-bold gradient-text font-[family-name:var(--font-heading)]">
            Evenzo
          </span>
          <p className="text-text-muted text-sm mt-2">Your gateway to every experience</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-text-muted">
            <li><Link to="/events" className="hover:text-white">All Events</Link></li>
            <li><Link to="/events?category=Music" className="hover:text-white">Music</Link></li>
            <li><Link to="/events?category=Sports" className="hover:text-white">Sports</Link></li>
            <li><Link to="/events?category=Tech" className="hover:text-white">Tech</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-sm text-text-muted">
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
            <li><Link to="/register" className="hover:text-white">Register</Link></li>
            <li><Link to="/register?role=organizer" className="hover:text-white">Become Organizer</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Connect</h4>
          <div className="flex gap-3">
            {['Twitter', 'Instagram', 'LinkedIn'].map((s) => (
              <span
                key={s}
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-xs text-text-muted hover:bg-primary/20 hover:text-primary cursor-pointer transition-colors"
              >
                {s[0]}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-text-muted">
        © {new Date().getFullYear()} Evenzo. All rights reserved.
      </div>
    </div>
  </footer>
);
