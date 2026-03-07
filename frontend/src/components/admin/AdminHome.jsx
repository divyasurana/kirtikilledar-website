import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Save } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminHome = () => {
  const [content, setContent] = useState({
    hero_image: '',
    tagline: '',
    intro_text: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/home`);
      if (response.data && Object.keys(response.data).length > 1) {
        setContent(response.data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/upload`, formData);
      setContent({ ...content, hero_image: response.data.url });
      setMessage('Image uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post(`${BACKEND_URL}/api/admin/home`, content);
      setMessage('Home page content saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      setMessage('Error saving content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display text-warm-brown mb-2">Home Page Content</h1>
        <p className="text-sepia-dark/70 font-light">Manage hero section and introduction</p>
      </div>

      {message && (
        <div className="mb-6 bg-vintage-gold/20 border-l-2 border-vintage-gold p-4">
          <p className="text-warm-brown font-light">{message}</p>
        </div>
      )}

      <div className="bg-white p-6 border border-vintage-gold/20 space-y-6">
        <div>
          <label className="block text-sm tracking-wider uppercase text-sepia-dark mb-2 font-light">
            Hero Image
          </label>
          {content.hero_image && (
            <img 
              src={content.hero_image} 
              alt="Hero" 
              className="w-48 h-64 object-cover mb-4 grayscale-[20%] sepia-[10%]"
            />
          )}
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-warm-brown/30 hover:bg-vintage-paper transition-colors duration-200">
            <Upload size={16} />
            <span className="text-sm font-light">{uploading ? 'Uploading...' : 'Upload Image'}</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>

        <div>
          <label className="block text-sm tracking-wider uppercase text-sepia-dark mb-2 font-light">
            Tagline
          </label>
          <input
            type="text"
            value={content.tagline || ''}
            onChange={(e) => setContent({ ...content, tagline: e.target.value })}
            placeholder="A quiet observer of people, stories, and moments."
            className="w-full px-4 py-3 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none font-light"
          />
        </div>

        <div>
          <label className="block text-sm tracking-wider uppercase text-sepia-dark mb-2 font-light">
            Introduction Text
          </label>
          <textarea
            value={content.intro_text || ''}
            onChange={(e) => setContent({ ...content, intro_text: e.target.value })}
            rows="6"
            placeholder="Introduction about artistic sensibility..."
            className="w-full px-4 py-3 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none font-light resize-none"
          ></textarea>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-warm-brown text-vintage-cream hover:bg-burnt-sienna transition-all duration-300 text-sm tracking-wider uppercase font-light disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default AdminHome;
