import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  Home as HomeIcon,
  User,
  Briefcase,
  Image as ImageIcon,
  Calendar,
  Mail,
} from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/', icon: HomeIcon },
  { name: 'About', path: '/about', icon: User },
  { name: 'Work', path: '/work', icon: Briefcase },
  { name: 'Gallery', path: '/gallery', icon: ImageIcon },
  { name: 'Events', path: '/events', icon: Calendar },
  { name: 'Contact', path: '/contact', icon: Mail },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-vintage-cream/95 backdrop-blur-sm shadow-sm border-b border-vintage-gold/20'
            : 'bg-vintage-cream/80 backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center py-6">
            <Link
              to="/"
              className="text-2xl font-display text-warm-brown hover:text-vintage-gold transition-colors duration-300"
              data-testid="nav-logo"
            >
              Kirti Killedar
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs tracking-[0.2em] uppercase transition-all duration-300 font-light ${
                    location.pathname === link.path
                      ? 'text-warm-brown border-b border-vintage-gold pb-1'
                      : 'text-sepia-dark/70 hover:text-warm-brown'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Hamburger — matches admin-panel styling */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden text-warm-brown p-2 hover:text-vintage-gold transition-colors duration-300"
              aria-label="Open menu"
              data-testid="nav-hamburger"
            >
              <Menu size={28} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer + Backdrop (matches /admin sidebar aesthetic) */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
            data-testid="nav-drawer-backdrop"
          />

          {/* Side drawer */}
          <aside
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-sepia-dark text-vintage-cream flex flex-col z-50 md:hidden shadow-2xl"
            data-testid="nav-drawer"
            role="dialog"
            aria-modal="true"
          >
            {/* Header with close */}
            <div className="flex justify-between items-center p-4 border-b border-vintage-gold/30">
              <div>
                <h2 className="text-xl font-display text-vintage-gold">Kirti Killedar</h2>
                <p className="text-xs text-vintage-cream/60 mt-1 font-light tracking-wide">
                  Singer &amp; Actress
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-vintage-cream p-2 hover:text-vintage-gold transition-colors"
                aria-label="Close menu"
                data-testid="nav-drawer-close"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 p-4 overflow-y-auto">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 mb-2 transition-colors duration-200 ${
                      isActive
                        ? 'bg-vintage-gold/20 text-vintage-gold border-l-2 border-vintage-gold'
                        : 'text-vintage-cream/70 hover:bg-vintage-cream/10 hover:text-vintage-gold'
                    }`}
                    data-testid={`nav-drawer-link-${item.name.toLowerCase()}`}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                    <span className="text-sm font-light tracking-wide">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-vintage-gold/30">
              <p className="text-xs text-vintage-cream/50 font-light tracking-wide text-center">
                A quiet observer of people, stories, and moments.
              </p>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default Navigation;
