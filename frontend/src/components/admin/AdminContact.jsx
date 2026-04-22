import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminContact = () => {
  const [contact, setContact] = useState({
    email: '',
    instagram_url: '',
    spotify_url: '',
    facebook_url: '',
    youtube_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/contact`);
      if (response.data && Object.keys(response.data).length > 0) {
        setContact(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post(`${BACKEND_URL}/api/admin/contact`, contact);
      setMessage('Contact info saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-display text-warm-brown mb-6">Contact Information</h1>

      {message && (
        <div className="mb-6 bg-vintage-gold/20 border-l-2 border-vintage-gold p-4">
          <p className="text-warm-brown">{message}</p>
        </div>
      )}

      <div className="bg-white p-6 border border-vintage-gold/20 space-y-6">
        <div>
          <label className="block text-sm tracking-wider uppercase text-sepia-dark mb-2">Email Address</label>
          <input
            type="email"
            value={contact.email || ''}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            placeholder="contact@kirtikilledar.com"
            className="w-full px-4 py-3 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm tracking-wider uppercase text-sepia-dark mb-2">Instagram URL</label>
          <input
            type="url"
            value={contact.instagram_url || ''}
            onChange={(e) => setContact({ ...contact, instagram_url: e.target.value })}
            placeholder="https://www.instagram.com/kirti.killedar/"
            className="w-full px-4 py-3 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm tracking-wider uppercase text-sepia-dark mb-2">Spotify Profile URL</label>
          <input
            type="url"
            value={contact.spotify_url || ''}
            onChange={(e) => setContact({ ...contact, spotify_url: e.target.value })}
            placeholder="https://open.spotify.com/artist/..."
            className="w-full px-4 py-3 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm tracking-wider uppercase text-sepia-dark mb-2">Facebook Page URL</label>
          <input
            type="url"
            value={contact.facebook_url || ''}
            onChange={(e) => setContact({ ...contact, facebook_url: e.target.value })}
            placeholder="https://www.facebook.com/..."
            className="w-full px-4 py-3 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm tracking-wider uppercase text-sepia-dark mb-2">YouTube Channel URL</label>
          <input
            type="url"
            value={contact.youtube_url || ''}
            onChange={(e) => setContact({ ...contact, youtube_url: e.target.value })}
            placeholder="https://www.youtube.com/@..."
            className="w-full px-4 py-3 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-warm-brown text-vintage-cream hover:bg-burnt-sienna transition-all disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default AdminContact;
