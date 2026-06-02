import { NavLink } from 'react-router-dom';

export const DashboardMobileNav = ({ links }) => (
  <nav className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-4 -mx-1 px-1 scrollbar-hide">
    {links.map((l) => (
      <NavLink
        key={l.to}
        to={l.to}
        end={l.end}
        className={({ isActive }) =>
          `flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
            isActive ? 'bg-primary/20 text-primary' : 'bg-white/5 text-text-muted'
          }`
        }
      >
        {l.icon} {l.label}
      </NavLink>
    ))}
  </nav>
);
