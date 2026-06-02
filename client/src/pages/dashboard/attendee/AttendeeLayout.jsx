import { NavLink, Outlet } from 'react-router-dom';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { DashboardMobileNav } from '../../../components/DashboardMobileNav';

const links = [
  { to: '/dashboard/attendee', label: 'Overview', icon: '🏠', end: true },
  { to: '/dashboard/attendee/bookings', label: 'My Bookings', icon: '🎫' },
  { to: '/dashboard/attendee/tickets', label: 'My Tickets', icon: '📱' },
  { to: '/dashboard/attendee/profile', label: 'Profile', icon: '👤' },
];

export const AttendeeLayout = () => (
  <ProtectedRoute roles={['attendee', 'organizer', 'admin']}>
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-56 bg-surface border-r border-white/10 fixed left-0 top-16 bottom-0 hidden md:block p-4">
        <p className="text-xs text-text-muted uppercase tracking-wider mb-4 px-3">Attendee</p>
        <nav className="space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive ? 'bg-primary/20 text-primary' : 'text-text-muted hover:text-white hover:bg-white/5'
                }`
              }
            >
              <span>{l.icon}</span> {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 md:ml-56 p-4 md:p-8">
        <DashboardMobileNav links={links} />
        <Outlet />
      </main>
    </div>
  </ProtectedRoute>
);
