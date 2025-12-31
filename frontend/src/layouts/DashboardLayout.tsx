import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  MessageCircle,
  BarChart3,
  BookOpen,
  Target,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LogoIcon } from '../components/Logo';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Home', end: true },
    { to: '/dashboard/chat', icon: MessageCircle, label: 'Chat with Solina' },
    { to: '/dashboard/insights', icon: BarChart3, label: 'Mood Insights' },
    { to: '/dashboard/journal', icon: BookOpen, label: 'Journal' },
    { to: '/dashboard/goals', icon: Target, label: 'Goals & Stress' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/10 backdrop-blur-xl border-r border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center p-1.5">
                <LogoIcon size={32} />
              </div>
              <span className="text-lg font-semibold tracking-wide text-white">SOLINA AI</span>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 mx-4 mt-4 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="flex items-center gap-3">
              {user?.avatar ? (
                <img
                  src={`http://localhost:5000${user.avatar}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/30 shadow-lg"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <p className="font-medium text-white">{user?.name || 'User'}</p>
                <p className="text-sm text-white/70">{user?.subscriptionTier || 'Free'} Plan</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  isActive ? 'sidebar-link-active' : 'sidebar-link'
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-300 w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 py-4 flex items-center justify-between">
          <button
            className="p-2 rounded-lg hover:bg-white/10 text-white transition-all duration-300"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/70">
              Welcome back, <span className="font-medium text-purple-300">{user?.name}</span>
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
