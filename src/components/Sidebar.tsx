import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Columns3, PlusCircle, GitBranch, Zap } from 'lucide-react';

interface SidebarProps {
  onNewClaim: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/board', icon: Columns3, label: 'Kanban Board' },
  { to: '/flowchart', icon: GitBranch, label: 'Process Flow' },
  { to: '/automation', icon: Zap, label: 'Automation' },
];

export default function Sidebar({ onNewClaim }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">VS</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-sm">VSIC Claims</h1>
            <p className="text-xs text-gray-400">Management System</p>
          </div>
        </div>
      </div>

      {/* New Claim button */}
      <div className="px-4 pt-4">
        <button onClick={onNewClaim}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm">
          <PlusCircle className="w-4 h-4" />
          New Claim
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
            }>
            <item.icon className="w-4.5 h-4.5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">VSIC Claims v1.0</p>
      </div>
    </aside>
  );
}
