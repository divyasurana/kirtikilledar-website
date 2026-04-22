import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Facebook, Youtube } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Spotify icon as SVG (Lucide doesn't have Spotify)
const SpotifyIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [contactInfo, setContactInfo] = useState({
    email: 'singerkirti@gmail.com',
    instagram_url: 'https://www.instagram.com/killedarkirti',
    spotify_url: '',
    facebook_url: '',
    youtube_url: ''
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/content/contact`);
      if (response.data) {
        setContactInfo(response.data);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  const socialLinks = [
    {
      name: 'Instagram',
      url: contactInfo.instagram_url,
      icon: Instagram,
      show: true
    },
    {
      name: 'Spotify',
      url: contactInfo.spotify_url,
      icon: SpotifyIcon,
      show: contactInfo.spotify_url && contactInfo.spotify_url.trim() !== ''
    },
    {
      name: 'Facebook',
      url: contactInfo.facebook_url,
      icon: Facebook,
      show: contactInfo.facebook_url && contactInfo.facebook_url.trim() !== ''
    },
    {
      name: 'YouTube',
      url: contactInfo.youtube_url,
      icon: Youtube,
      show: contactInfo.youtube_url && contactInfo.youtube_url.trim() !== ''
    }
  ];

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
              <Link to="/events" className="text-vintage-cream/70 hover:text-vintage-gold transition-colors duration-300 font-light">
                Events
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
              {/* Email */}
              <a 
                href={`mailto:${contactInfo.email}`}
                className="text-vintage-cream/70 hover:text-vintage-gold transition-colors duration-300 font-light flex items-center gap-2"
              >
                <Mail size={16} />
                Email
              </a>
              
              {/* Social Media Icons */}
              {socialLinks.filter(link => link.show).map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-vintage-cream/70 hover:text-vintage-gold transition-colors duration-300 font-light flex items-center gap-2"
                    aria-label={social.name}
                  >
                    <Icon size={16} />
                    {social.name}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-vintage-cream/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-vintage-cream/50 text-sm font-light">
            © {currentYear} Kirti Killedar. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            {socialLinks.filter(link => link.show).map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={`bottom-${social.name}`}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-vintage-cream/50 hover:text-vintage-gold transition-colors duration-300"
                  aria-label={social.name}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
