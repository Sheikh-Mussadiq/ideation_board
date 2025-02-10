import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, LayoutGrid, Lightbulb, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navigation() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Posts', path: '/dashboard', icon: FileText },
    { name: 'Content Management', path: '/content', icon: LayoutGrid },
    { name: 'Ideation', path: '/ideation', icon: Lightbulb },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                      isActive
                        ? 'border-primary text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-primary-light hover:text-primary transition-colors'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </NavLink>
              );
            })}
          </div>
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <button
              onClick={handleLogout}
              className="btn-primary"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}