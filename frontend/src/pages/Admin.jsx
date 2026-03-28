import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut, Home as HomeIcon, User, Briefcase, Image as ImageIcon, Mail, MessageSquare, Calendar } from 'lucide-react';
import axios from 'axios';
import useDocumentTitle from '../hooks/useDocumentTitle';
import AdminLogin from '../components/admin/AdminLogin';
import AdminHome from '../components/admin/AdminHome';
import AdminAbout from '../components/admin/AdminAbout';
import AdminProjects from '../components/admin/AdminProjects';
import AdminGallery from '../components/admin/AdminGallery';
import AdminContact from '../components/admin/AdminContact';
import AdminSubmissions from '../components/admin/AdminSubmissions';
import AdminEvents from '../components/admin/AdminEvents';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Admin = () => {
  useDocumentTitle('Admin Panel');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('admin_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
    navigate('/admin/home');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    navigate('/admin/login');
  };

  if (loading) {
    return <div className="min-h-screen bg-vintage-cream flex items-center justify-center">
      <p className="text-warm-brown">Loading...</p>
    </div>;
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const navItems = [
    { path: '/admin/home', icon: HomeIcon, label: 'Home' },
    { path: '/admin/about', icon: User, label: 'About' },
    { path: '/admin/projects', icon: Briefcase, label: 'Projects' },
    { path: '/admin/gallery', icon: ImageIcon, label: 'Gallery' },
    { path: '/admin/events', icon: Calendar, label: 'Events' },
    { path: '/admin/contact', icon: Mail, label: 'Contact' },
    { path: '/admin/submissions', icon: MessageSquare, label: 'Messages' }
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-vintage-cream flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-sepia-dark text-vintage-cream p-4 flex justify-between items-center">
        <h1 className="text-xl font-display text-vintage-gold">Admin Panel</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-vintage-cream p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar - Hidden on mobile unless menu is open */}
      <div className={`${
        mobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden'
      } md:flex md:w-64 bg-sepia-dark text-vintage-cream flex-col`}>
        {/* Close button for mobile */}
        <div className="md:hidden flex justify-between items-center p-4 border-b border-vintage-gold/30">
          <h1 className="text-2xl font-display text-vintage-gold">Menu</h1>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-vintage-cream p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="hidden md:block p-6 border-b border-vintage-gold/30">
          <h1 className="text-2xl font-display text-vintage-gold">Admin Panel</h1>
          <p className="text-sm text-vintage-cream/70 mt-1 font-light">Kirti's Portfolio</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 mb-2 transition-colors duration-200 ${
                  isActive
                    ? 'bg-vintage-gold/20 text-vintage-gold border-l-2 border-vintage-gold'
                    : 'text-vintage-cream/70 hover:bg-vintage-cream/10 hover:text-vintage-gold'
                }`}
              >
                <Icon size={18} strokeWidth={1.5} />
                <span className="text-sm font-light tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-vintage-gold/30">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-vintage-cream/70 hover:bg-vintage-cream/10 hover:text-vintage-gold transition-colors duration-200"
          >
            <LogOut size={18} strokeWidth={1.5} />
            <span className="text-sm font-light tracking-wide">Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pt-20 md:pt-20">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/home" />} />
          <Route path="/login" element={<Navigate to="/admin/home" />} />
          <Route path="/home" element={<AdminHome />} />
          <Route path="/about" element={<AdminAbout />} />
          <Route path="/projects" element={<AdminProjects />} />
          <Route path="/gallery" element={<AdminGallery />} />
          <Route path="/events" element={<AdminEvents />} />
          <Route path="/contact" element={<AdminContact />} />
          <Route path="/submissions" element={<AdminSubmissions />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
