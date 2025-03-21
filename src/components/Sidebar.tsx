import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, HeadphonesIcon, BarChart2, BookOpen, Activity } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/proxy-checker', icon: Activity, label: 'Testador' },
    { path: '/analytics', icon: BarChart2, label: 'Análises' },
    { path: '/tutorials', icon: BookOpen, label: 'Tutoriais' },
    { path: '/support', icon: HeadphonesIcon, label: 'Suporte' },
  ];

  return (
    <div className="hidden lg:flex h-screen w-64 flex-col fixed left-0 bg-gray-800 dark:bg-gray-900 border-r border-gray-700 dark:border-gray-800">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white">Fast Proxy</h2>
      </div>
      
      <nav className="flex-1 space-y-1 px-2 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-gray-700 dark:bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}