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
    <div className="fixed inset-y-0 left-0 w-16 bg-white border-r border-gray-200">
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
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                }`
              }
              title={item.name}
            >
              <Icon className="h-6 w-6" />
              <span className="absolute left-full ml-2 px-2 py-1 text-sm font-medium text-gray-900 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap">
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}