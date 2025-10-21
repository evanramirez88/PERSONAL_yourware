import { NavLink } from 'react-router-dom';
import { Bot, Code2, GitBranch, Settings, Sheet, GaugeCircle } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { to: '/', label: 'Editor', icon: Bot },
  { to: '/dashboard', label: 'Usage Dashboard', icon: GaugeCircle },
  { to: '/version-control', label: 'Version Control', icon: GitBranch },
  { to: '/source', label: 'Source Viewer', icon: Sheet },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <Code2 size={24} />
        <span>YourWare</span>
      </div>
      <nav className="sidebar__nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
            end={to === '/'}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
