import React, { useEffect, useState } from 'react';
import { Mail, Instagram } from 'lucide-react';
import axios from 'axios';
import useDocumentTitle from '../hooks/useDocumentTitle';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Contact = () => {
  useDocumentTitle('Contact');
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: 'contact@kirtikilledar.com',
    instagram_url: 'https://www.instagram.com/kirti.killedar/'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/content/contact`);
      if (response.data && Object.keys(response.data).length > 0) {
        setContactInfo(response.data);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/api/contact/submit`, formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error sending your message. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-vintage-cream">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-vintage-paper">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
              <div className="w-3 h-3 border border-vintage-gold rotate-45 mx-4"></div>
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
            </div>
            
            <h1 className={`font-display text-6xl md:text-7xl text-warm-brown mb-8 leading-tight transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Let's Connect
            </h1>
            
            <div className={`max-w-2xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-xl text-sepia-dark/80 leading-relaxed mb-6">
                I believe the best collaborations begin with genuine conversation.
              </p>
              <p className="text-lg text-sepia-dark/70 leading-relaxed italic">
                Whether you have a project in mind, a question to ask, or simply wish to say hello—I would be delighted to hear from you.
              </p>
            </div>

            <div className="flex items-center justify-center mt-8">
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
              <div className="w-3 h-3 border border-vintage-gold rotate-45 mx-4"></div>
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Contact Information */}
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="space-y-12">
                {/* Email */}
                <div>
                  <h3 className="text-sm tracking-[0.3em] uppercase text-sepia-dark mb-6 font-light flex items-center gap-4">
                    <div className="w-8 h-0.5 bg-vintage-gold"></div>
                    Email
                  </h3>
                  <a 
                    href={`mailto:${contactInfo.email}`}
                    className="text-2xl text-warm-brown hover:text-vintage-gold transition-colors duration-300 flex items-center gap-3 group"
                  >
                    <Mail size={24} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-light">{contactInfo.email}</span>
                  </a>
                </div>

                {/* Social */}
                <div>
                  <h3 className="text-sm tracking-[0.3em] uppercase text-sepia-dark mb-6 font-light flex items-center gap-4">
                    <div className="w-8 h-0.5 bg-vintage-gold"></div>
                    Social
                  </h3>
                  <a 
                    href={contactInfo.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl text-warm-brown hover:text-vintage-gold transition-colors duration-300 flex items-center gap-3 group"
                  >
                    <Instagram size={24} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-light">Instagram</span>
                  </a>
                </div>

                {/* What to expect */}
                <div className="bg-antique-white p-8 border-l-2 border-vintage-gold">
                  <h3 className="text-sm tracking-[0.3em] uppercase text-sepia-dark mb-4 font-light">
                    Open To
                  </h3>
                  <ul className="space-y-3 text-sepia-dark/80 font-light">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-vintage-gold mt-2 flex-shrink-0"></div>
                      Performance bookings and live collaborations
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-vintage-gold mt-2 flex-shrink-0"></div>
                      Film, theatre, and recording projects
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-vintage-gold mt-2 flex-shrink-0"></div>
                      Creative collaborations with fellow artists
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-vintage-gold mt-2 flex-shrink-0"></div>
                      Media inquiries and interviews
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-vintage-gold mt-2 flex-shrink-0"></div>
                      Teaching and mentorship opportunities
                    </li>
                  </ul>
                </div>

                {/* Quote */}
                <div className="pt-8 border-t border-vintage-gold/30">
                  <p className="text-lg text-sepia-dark/70 italic leading-relaxed font-light">
                    "The most meaningful work comes from genuine connection. I look forward to the possibility of creating something beautiful together."
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="bg-vintage-paper p-8 lg:p-10 border border-vintage-gold/20">
                <h2 className="text-2xl font-display text-warm-brown mb-8">Send a Message</h2>
                
                {submitted ? (
                  <div className="bg-antique-white border-l-2 border-vintage-gold p-8 text-center">
                    <p className="text-sepia-dark text-lg font-light">
                      Thank you for reaching out. I'll respond thoughtfully soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-xs tracking-[0.2em] uppercase text-sepia-dark/60 mb-3 font-light">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-vintage-cream border border-warm-brown/20 focus:border-vintage-gold focus:outline-none text-sepia-dark transition-colors duration-300 font-light"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-xs tracking-[0.2em] uppercase text-sepia-dark/60 mb-3 font-light">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-vintage-cream border border-warm-brown/20 focus:border-vintage-gold focus:outline-none text-sepia-dark transition-colors duration-300 font-light"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-xs tracking-[0.2em] uppercase text-sepia-dark/60 mb-3 font-light">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="w-full px-4 py-3 bg-vintage-cream border border-warm-brown/20 focus:border-vintage-gold focus:outline-none text-sepia-dark transition-colors duration-300 resize-none font-light"
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full px-8 py-4 bg-warm-brown text-vintage-cream hover:bg-burnt-sienna transition-all duration-300 text-xs tracking-[0.3em] uppercase font-light shadow-sm hover:shadow-md"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
