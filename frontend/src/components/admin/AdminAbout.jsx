import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Save } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminAbout = () => {
  const [content, setContent] = useState({
    portrait_image: '',
    background_text: '',
    approach_text: '',
    influences_text: '',
    skills: [],
    quote: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/about`);
      if (response.data && Object.keys(response.data).length > 1) {
        setContent(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/upload`, formData);
      setContent({ ...content, portrait_image: response.data.url });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setContent({ ...content, skills: [...content.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setContent({ ...content, skills: content.skills.filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post(`${BACKEND_URL}/api/admin/about`, content);
      setMessage('About page saved successfully!');
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
      <h1 className="text-3xl font-display text-warm-brown mb-6">About Page Content</h1>

      {message && (
        <div className="mb-6 bg-vintage-gold/20 border-l-2 border-vintage-gold p-4">
          <p className="text-warm-brown">{message}</p>
        </div>
      )}

      <div className="bg-white p-6 border border-vintage-gold/20 space-y-6">
        <div>
          <label className="block text-sm tracking-wider uppercase text-sepia-dark mb-2">Portrait Image</label>
          {content.portrait_image && <img src={content.portrait_image} alt="Portrait" className="w-48 h-64 object-cover mb-4" />}
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-warm-brown/30">
            <Upload size={16} />
            <span className="text-sm">Upload Image</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>

        <div>
          <label className="block text-sm tracking-wider uppercase text-sepia-dark mb-2">Background Text</label>
          <textarea
            value={content.background_text || ''}
            onChange={(e) => setContent({ ...content, background_text: e.target.value })}
            rows="6"
            className="w-full px-4 py-3 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm tracking-wider uppercase text-sepia-dark mb-2">Approach Text</label>
          <textarea
            value={content.approach_text || ''}
            onChange={(e) => setContent({ ...content, approach_text: e.target.value })}
            rows="6"
            className="w-full px-4 py-3 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm tracking-wider uppercase text-sepia-dark mb-2">Influences Text</label>
          <textarea
            value={content.influences_text || ''}
            onChange={(e) => setContent({ ...content, influences_text: e.target.value })}
            rows="6"
            className="w-full px-4 py-3 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm tracking-wider uppercase text-sepia-dark mb-2">Skills</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              placeholder="Add a skill"
              className="flex-1 px-4 py-2 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none"
            />
            <button onClick={addSkill} className="px-4 py-2 bg-warm-brown text-vintage-cream text-sm">
              Add
            </button>
          </div>
          <div className="space-y-2">
            {content.skills && content.skills.map((skill, index) => (
              <div key={index} className="flex justify-between items-center bg-vintage-paper p-2 border border-vintage-gold/20">
                <span className="text-sm">{skill}</span>
                <button onClick={() => removeSkill(index)} className="text-burnt-sienna text-sm">Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm tracking-wider uppercase text-sepia-dark mb-2">Quote</label>
          <textarea
            value={content.quote || ''}
            onChange={(e) => setContent({ ...content, quote: e.target.value })}
            rows="3"
            className="w-full px-4 py-3 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none resize-none"
          ></textarea>
        </div>

        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-warm-brown text-vintage-cream hover:bg-burnt-sienna transition-all">
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default AdminAbout;
