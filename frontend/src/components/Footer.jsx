import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';
import { siteData } from '../data/mockData';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-ivory py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-display mb-4">Kirti Killedar</h3>
            <p className="text-ivory/70 leading-relaxed">
              Singer, actress, and artist exploring the intersection of tradition and contemporary expression.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm tracking-widest uppercase text-ivory/60 mb-4">Navigate</h4>
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-ivory/70 hover:text-gold transition-colors duration-300">
                Home
              </Link>
              <Link to="/about" className="text-ivory/70 hover:text-gold transition-colors duration-300">
                About
              </Link>
              <Link to="/work" className="text-ivory/70 hover:text-gold transition-colors duration-300">
                Work
              </Link>
              <Link to="/gallery" className="text-ivory/70 hover:text-gold transition-colors duration-300">
                Gallery
              </Link>
              <Link to="/writing" className="text-ivory/70 hover:text-gold transition-colors duration-300">
                Writing
              </Link>
              <Link to="/contact" className="text-ivory/70 hover:text-gold transition-colors duration-300">
                Contact
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm tracking-widest uppercase text-ivory/60 mb-4">Connect</h4>
            <div className="flex flex-col gap-3">
              <a 
                href={siteData.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/70 hover:text-gold transition-colors duration-300 flex items-center gap-2"
              >
                <Instagram size={18} />
                Instagram
              </a>
              <a 
                href={`mailto:${siteData.contact.email}`}
                className="text-ivory/70 hover:text-gold transition-colors duration-300 flex items-center gap-2"
              >
                <Mail size={18} />
                Email
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-ivory/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-ivory/50 text-sm">
            © {currentYear} Kirti Killedar. All rights reserved.
          </p>
          <p className="text-ivory/50 text-sm">
            Designed with care and intention
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
