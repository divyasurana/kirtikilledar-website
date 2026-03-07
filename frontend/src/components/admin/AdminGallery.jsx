import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Trash2, X } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    image_url: '',
    caption: '',
    category: 'portraits'
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/gallery`);
      setImages(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formDataObj = new FormData();
    formDataObj.append('file', file);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/upload`, formDataObj);
      setFormData({ ...formData, image_url: response.data.url });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/api/admin/gallery`, formData);
      fetchImages();
      setFormData({ image_url: '', caption: '', category: 'portraits' });
      setShowForm(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/gallery/${id}`);
      fetchImages();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const categories = ['portraits', 'moments', 'work', 'behind'];

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-display text-warm-brown">Gallery</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-warm-brown text-vintage-cream hover:bg-burnt-sienna"
        >
          <Upload size={16} />
          Add Image
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-warm-brown/95 z-50 flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-vintage-cream p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display text-warm-brown">Add Gallery Image</h2>
              <button onClick={() => setShowForm(false)} className="text-warm-brown">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Image</label>
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="w-full h-64 object-cover mb-2" />
                )}
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-warm-brown/30">
                  <Upload size={16} />
                  <span className="text-sm">{uploading ? 'Uploading...' : 'Upload Image'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-sm mb-2">Caption</label>
                <input
                  type="text"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-warm-brown/20"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-warm-brown/20"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={!formData.image_url}
                  className="px-6 py-3 bg-warm-brown text-vintage-cream disabled:opacity-50"
                >
                  Add to Gallery
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border border-warm-brown/30">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <img src={image.image_url} alt={image.caption} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-warm-brown/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => handleDelete(image.id)}
                className="p-3 bg-burnt-sienna text-vintage-cream rounded-full"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <div className="p-2 bg-vintage-paper">
              <p className="text-xs text-sepia-dark truncate">{image.caption}</p>
              <p className="text-xs text-vintage-gold">{image.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGallery;
