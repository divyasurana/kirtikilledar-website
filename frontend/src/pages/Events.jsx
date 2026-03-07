import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Events = () => {
  useDocumentTitle('Events');
  const [events, setEvents] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMonthDay = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    };
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
              Upcoming Events
            </h1>
            
            <p className={`text-xl text-sepia-dark/80 leading-relaxed italic max-w-2xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Join me for live performances, theatrical productions, and creative collaborations.
            </p>

            <div className="flex items-center justify-center mt-8">
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
              <div className="w-3 h-3 border border-vintage-gold rotate-45 mx-4"></div>
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-sepia-dark/70 font-light">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="bg-white p-16 border border-vintage-gold/20 text-center">
                <Calendar size={64} className="mx-auto text-sepia-dark/20 mb-6" />
                <h3 className="text-2xl font-display text-warm-brown mb-4">No Upcoming Events</h3>
                <p className="text-sepia-dark/70 font-light">
                  Check back soon for information about upcoming performances and shows.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {events.map((event, index) => {
                  const { day, month } = getMonthDay(event.event_date);
                  return (
                    <div
                      key={event.id}
                      className={`bg-white border border-vintage-gold/20 hover:border-vintage-gold/40 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                      style={{ transitionDelay: `${(index + 3) * 150}ms` }}
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Date Box */}
                        <div className="md:w-32 bg-vintage-paper flex flex-col items-center justify-center p-6 border-r border-vintage-gold/20">
                          <div className="text-center">
                            <div className="text-4xl font-display text-vintage-gold leading-none mb-1">
                              {day}
                            </div>
                            <div className="text-sm tracking-[0.3em] uppercase text-sepia-dark font-light">
                              {month}
                            </div>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 p-6">
                          <div className="mb-3">
                            <span className="text-xs tracking-[0.3em] uppercase text-vintage-gold font-light">
                              {event.event_type}
                            </span>
                          </div>

                          <h3 className="text-2xl font-display text-warm-brown mb-4 leading-tight">
                            {event.title}
                          </h3>

                          {event.venue && (
                            <div className="flex items-start gap-3 mb-2 text-sepia-dark/70">
                              <MapPin size={18} className="mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                              <span className="font-light">
                                {event.venue}{event.location && `, ${event.location}`}
                              </span>
                            </div>
                          )}

                          {event.event_time && (
                            <div className="flex items-center gap-3 mb-4 text-sepia-dark/70">
                              <Clock size={18} strokeWidth={1.5} />
                              <span className="font-light">{event.event_time}</span>
                            </div>
                          )}

                          {event.description && (
                            <p className="text-sepia-dark/70 leading-relaxed mb-4 font-light">
                              {event.description}
                            </p>
                          )}

                          {event.ticket_url && (
                            <a
                              href={event.ticket_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-6 py-3 bg-warm-brown text-vintage-cream hover:bg-burnt-sienna transition-all duration-300 text-sm tracking-wider uppercase font-light"
                            >
                              <span>Get Tickets</span>
                              <ExternalLink size={14} strokeWidth={1.5} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-vintage-paper">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-display text-warm-brown mb-6">
            Stay Connected
          </h2>
          <p className="text-lg text-sepia-dark/70 mb-8 max-w-2xl mx-auto font-light">
            Follow me on social media for the latest updates on performances, new projects, and behind-the-scenes moments.
          </p>
          <a
            href="https://www.instagram.com/kirti.killedar/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 border-2 border-warm-brown text-warm-brown hover:bg-warm-brown hover:text-vintage-cream transition-all duration-300 text-sm tracking-widest uppercase font-light"
          >
            Follow on Instagram
          </a>
        </div>
      </section>
    </div>
  );
};

export default Events;
