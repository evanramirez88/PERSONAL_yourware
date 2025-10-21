import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Code, Gauge, GitBranch, Settings, Upload } from 'lucide-react';

const navigation = [
  { name: 'Editor', to: '/editor', icon: Code },
  { name: 'Dashboard', to: '/dashboard', icon: Gauge },
  { name: 'Version Control', to: '/version-control', icon: GitBranch },
  { name: 'Source', to: '/source', icon: BookOpen },
  { name: 'Settings', to: '/settings', icon: Settings }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-black/10 bg-[#fbfaf8] hidden lg:flex flex-col">
      <div className="px-6 py-8 border-b border-black/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-youware-primary text-white flex items-center justify-center font-semibold">
            YW
          </div>
          <div>
            <p className="text-lg font-medium">YouWare</p>
            <p className="text-xs text-black/50">Personal Agent Studio</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.name}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-youware-primary/10 text-youware-primary' : 'text-black/70 hover:bg-black/5'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="px-6 py-6 border-t border-black/5">
        <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-youware-primary text-white py-3 text-sm font-medium shadow-subtle hover:bg-youware-primary/90 transition">
          <Upload size={16} /> Export Source
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
