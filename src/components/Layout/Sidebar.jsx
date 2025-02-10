import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, LayoutGrid, Lightbulb, Code2 } from 'lucide-react';

const navItems = [
  { name: 'Ideation', path: '/ideation', icon: Lightbulb },
  { name: 'Posts', path: '/dashboard', icon: FileText },
  { name: 'Content', path: '/content', icon: LayoutGrid },
  { name: 'API', path: '/api', icon: Code2 },
];

export default function Sidebar() {
  return (
    <div className="fixed inset-y-0 left-0 w-16 bg-white/80 backdrop-blur-sm border-r border-gray-200 shadow-sm z-50">
      <div className="flex flex-col items-center py-4 space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `p-2 rounded-lg transition-colors duration-150 group relative ${
                  isActive
                    ? 'text-primary bg-primary-light scale-110'
                    : 'text-gray-500 hover:text-primary hover:bg-primary-light hover:scale-110'
                }`
              }
              title={item.name}
            >
              <Icon className="h-6 w-6" />
              <span className="absolute left-full ml-2 px-2 py-1 text-sm font-medium text-primary bg-white/90 backdrop-blur-sm rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-150 whitespace-nowrap transform scale-95 group-hover:scale-100">
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}