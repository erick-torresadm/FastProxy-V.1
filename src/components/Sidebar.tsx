import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, HeadphonesIcon, BarChart2, BookOpen, Activity, Tags, Menu, X, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FastProxyLogo } from './FastProxyLogo';
import { motion, AnimatePresence } from 'framer-motion';

export function Sidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/proxy-checker', icon: Activity, label: 'Testador' },
    { path: '/proxy-manager', icon: Tags, label: 'Gerenciar Tags' },
    { path: '/analytics', icon: BarChart2, label: 'Análises' },
    { path: '/tutorials', icon: BookOpen, label: 'Tutoriais' },
    { path: '/support', icon: HeadphonesIcon, label: 'Suporte' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-800 dark:bg-gray-900 z-50 px-4 flex items-center justify-between border-b border-gray-700 dark:border-gray-800">
        <FastProxyLogo className="h-8" />
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-40"
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="lg:hidden fixed inset-y-0 left-0 w-64 bg-gray-800 dark:bg-gray-900 z-50 overflow-y-auto"
          >
            <div className="h-16 flex items-center justify-center border-b border-gray-700 dark:border-gray-800">
              <FastProxyLogo className="h-8" />
            </div>

            <nav className="mt-4 px-2 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={toggleMobileMenu}
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

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 dark:border-gray-800">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={toggleTheme}
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-5 w-5 mr-3" />
                      Modo claro
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5 mr-3" />
                      Modo escuro
                    </>
                  )}
                </button>
                <div className="px-4 py-2 text-sm text-gray-300">
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="truncate">{user?.email}</span>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sair
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen w-64 flex-col fixed left-0 bg-gray-800 dark:bg-gray-900 border-r border-gray-700 dark:border-gray-800">
        <div className="p-4">
          <FastProxyLogo className="h-8" />
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

        <div className="p-4 border-t border-gray-700 dark:border-gray-800">
          <div className="flex flex-col space-y-4">
            <button
              onClick={toggleTheme}
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-5 w-5 mr-3" />
                  Modo claro
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5 mr-3" />
                  Modo escuro
                </>
              )}
            </button>
            <div className="px-4 py-2 text-sm text-gray-300">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                <span className="truncate">{user?.email}</span>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Content Spacer for Mobile */}
      <div className="lg:hidden h-16" />
    </>
  );
}