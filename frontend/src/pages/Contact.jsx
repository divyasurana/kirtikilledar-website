import React, { useEffect, useState } from 'react';
import { Instagram, Mail } from 'lucide-react';
import { siteData } from '../data/mockData';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl">
            <h1 className={`font-display text-5xl md:text-6xl lg:text-7xl text-charcoal mb-6 leading-tight transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Contact
            </h1>
            <p className={`text-xl text-charcoal/70 leading-relaxed transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {siteData.contact.description}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <h2 className="text-2xl font-display text-charcoal mb-8">Send a Message</h2>
              
              {submitted ? (
                <div className="bg-gold/10 border border-gold/30 p-8 text-center">
                  <p className="text-charcoal text-lg">
                    Thank you for reaching out! I'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm tracking-wider uppercase text-charcoal/60 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 border border-charcoal/20 focus:border-gold focus:outline-none text-charcoal bg-white transition-colors duration-300"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm tracking-wider uppercase text-charcoal/60 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 border border-charcoal/20 focus:border-gold focus:outline-none text-charcoal bg-white transition-colors duration-300"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm tracking-wider uppercase text-charcoal/60 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-6 py-4 border border-charcoal/20 focus:border-gold focus:outline-none text-charcoal bg-white transition-colors duration-300 resize-none"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-4 bg-gold text-ivory hover:bg-gold/90 transition-all duration-300 text-sm tracking-wider uppercase"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="sticky top-32">
                <h2 className="text-2xl font-display text-charcoal mb-8">Get in Touch</h2>
                
                <div className="space-y-8">
                  {/* Email */}
                  <div className="pb-8 border-b border-charcoal/10">
                    <h3 className="text-xs tracking-widest uppercase text-charcoal/60 mb-4">Email</h3>
                    <a 
                      href={`mailto:${siteData.contact.email}`}
                      className="text-lg text-charcoal hover:text-gold transition-colors duration-300 flex items-center gap-3"
                    >
                      <Mail size={20} />
                      {siteData.contact.email}
                    </a>
                  </div>

                  {/* Social Media */}
                  <div className="pb-8 border-b border-charcoal/10">
                    <h3 className="text-xs tracking-widest uppercase text-charcoal/60 mb-4">Social Media</h3>
                    <a 
                      href={siteData.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-charcoal hover:text-gold transition-colors duration-300 flex items-center gap-3"
                    >
                      <Instagram size={20} />
                      Instagram
                    </a>
                  </div>

                  {/* Inquiries */}
                  <div>
                    <h3 className="text-xs tracking-widest uppercase text-charcoal/60 mb-4">Inquiries Welcome For</h3>
                    <ul className="space-y-3 text-charcoal/70">
                      <li>• Performance bookings</li>
                      <li>• Collaboration opportunities</li>
                      <li>• Media & press inquiries</li>
                      <li>• Acting auditions</li>
                      <li>• Recording projects</li>
                    </ul>
                  </div>

                  {/* Quote */}
                  <div className="pt-8 mt-8 border-t border-charcoal/10">
                    <blockquote className="text-lg text-charcoal/70 italic leading-relaxed">
                      "Looking forward to connecting with fellow artists, creative minds, and kind souls."
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
