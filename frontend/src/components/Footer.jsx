import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';
import { siteData } from '../data/mockData';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sepia-dark text-vintage-cream py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-display mb-4 text-vintage-gold">Kirti Killedar</h3>
            <p className="text-vintage-cream/70 leading-relaxed font-light">
              Singer, actress, and artist exploring the intersection of tradition and contemporary expression.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-vintage-gold/80 mb-4 font-light">Navigate</h4>
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-vintage-cream/70 hover:text-vintage-gold transition-colors duration-300 font-light">
                Home
              </Link>
              <Link to="/about" className="text-vintage-cream/70 hover:text-vintage-gold transition-colors duration-300 font-light">
                About
              </Link>
              <Link to="/work" className="text-vintage-cream/70 hover:text-vintage-gold transition-colors duration-300 font-light">
                Work
              </Link>
              <Link to="/gallery" className="text-vintage-cream/70 hover:text-vintage-gold transition-colors duration-300 font-light">
                Gallery
              </Link>
              <Link to="/contact" className="text-vintage-cream/70 hover:text-vintage-gold transition-colors duration-300 font-light">
                Contact
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-vintage-gold/80 mb-4 font-light">Connect</h4>
            <div className="flex flex-col gap-3">
              <a 
                href={siteData.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-vintage-cream/70 hover:text-vintage-gold transition-colors duration-300 flex items-center gap-2 font-light"
              >
                <Instagram size={18} />
                Instagram
              </a>
              <a 
                href={`mailto:${siteData.contact.email}`}
                className="text-vintage-cream/70 hover:text-vintage-gold transition-colors duration-300 flex items-center gap-2 font-light"
              >
                <Mail size={18} />
                Email
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-vintage-gold/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-vintage-cream/50 text-sm font-light">
            © {currentYear} Kirti Killedar. All rights reserved.
          </p>
          <p className="text-vintage-cream/50 text-sm italic font-light">
            Designed with care and intention
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
