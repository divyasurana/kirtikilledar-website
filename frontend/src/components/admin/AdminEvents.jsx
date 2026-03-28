import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Save, X, Calendar, MapPin, Clock } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    event_date: '',
    event_time: '',
    venue: '',
    location: '',
    description: '',
    event_type: 'Performance',
    ticket_url: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${BACKEND_URL}/api/admin/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      if (editingEvent) {
        await axios.put(`${BACKEND_URL}/api/admin/events/${editingEvent.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${BACKEND_URL}/api/admin/events`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchEvents();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData(event);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${BACKEND_URL}/api/admin/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      event_date: '',
      event_time: '',
      venue: '',
      location: '',
      description: '',
      event_type: 'Performance',
      ticket_url: ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-display text-warm-brown">Events Calendar</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-warm-brown text-vintage-cream hover:bg-burnt-sienna transition-all"
        >
          <Plus size={16} />
          Add Event
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-warm-brown/95 z-50 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto bg-vintage-cream p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display text-warm-brown">
                {editingEvent ? 'Edit Event' : 'New Event'}
              </h2>
              <button onClick={resetForm} className="text-warm-brown hover:text-burnt-sienna">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2 tracking-wider uppercase text-sepia-dark">Event Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Live Performance at Mumbai Theatre"
                  className="w-full px-4 py-3 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 tracking-wider uppercase text-sepia-dark">Date</label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 tracking-wider uppercase text-sepia-dark">Time</label>
                  <input
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                    className="w-full px-4 py-3 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 tracking-wider uppercase text-sepia-dark">Event Type</label>
                <select
                  value={formData.event_type}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                  className="w-full px-4 py-3 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none"
                >
                  <option>Performance</option>
                  <option>Concert</option>
                  <option>Theatre</option>
                  <option>Recording Session</option>
                  <option>Workshop</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 tracking-wider uppercase text-sepia-dark">Venue Name</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="Prithvi Theatre"
                  className="w-full px-4 py-3 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 tracking-wider uppercase text-sepia-dark">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Mumbai, Maharashtra"
                  className="w-full px-4 py-3 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 tracking-wider uppercase text-sepia-dark">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  placeholder="Brief description of the event..."
                  className="w-full px-4 py-3 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm mb-2 tracking-wider uppercase text-sepia-dark">Ticket/Registration URL (Optional)</label>
                <input
                  type="url"
                  value={formData.ticket_url}
                  onChange={(e) => setFormData({ ...formData, ticket_url: e.target.value })}
                  placeholder="https://bookmyshow.com/..."
                  className="w-full px-4 py-3 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-warm-brown text-vintage-cream hover:bg-burnt-sienna transition-all"
                >
                  <Save size={16} />
                  {editingEvent ? 'Update' : 'Create'} Event
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-warm-brown/30 hover:bg-vintage-paper transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="bg-white p-12 border border-vintage-gold/20 text-center">
            <Calendar size={48} className="mx-auto text-sepia-dark/30 mb-4" />
            <p className="text-sepia-dark/70">No events scheduled yet</p>
            <p className="text-sm text-sepia-dark/50 mt-2">Add your first event to showcase upcoming performances</p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-white p-6 border border-vintage-gold/20 hover:border-vintage-gold/40 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="text-center min-w-[80px] bg-vintage-paper p-3 border border-vintage-gold/30">
                      <div className="text-2xl font-display text-vintage-gold">
                        {new Date(event.event_date).getDate()}
                      </div>
                      <div className="text-xs tracking-wider uppercase text-sepia-dark">
                        {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>

                    <div className="flex-1">
                      <span className="text-xs tracking-widest uppercase text-vintage-gold mb-2 block">
                        {event.event_type}
                      </span>
                      <h3 className="text-xl font-display text-warm-brown mb-2">{event.title}</h3>
                      
                      {event.venue && (
                        <div className="flex items-center gap-2 text-sm text-sepia-dark/70 mb-1">
                          <MapPin size={14} />
                          <span>{event.venue}{event.location && `, ${event.location}`}</span>
                        </div>
                      )}
                      
                      {event.event_time && (
                        <div className="flex items-center gap-2 text-sm text-sepia-dark/70 mb-3">
                          <Clock size={14} />
                          <span>{event.event_time}</span>
                        </div>
                      )}
                      
                      {event.description && (
                        <p className="text-sm text-sepia-dark/70 leading-relaxed">{event.description}</p>
                      )}
                      
                      {event.ticket_url && (
                        <a
                          href={event.ticket_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-3 text-sm text-vintage-gold hover:text-warm-brown transition-colors"
                        >
                          Get Tickets →
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-2 hover:bg-vintage-paper transition-colors"
                  >
                    <Edit2 size={16} className="text-warm-brown" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 hover:bg-burnt-sienna/10 transition-colors"
                  >
                    <Trash2 size={16} className="text-burnt-sienna" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminEvents;
