import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Trash2, X, Image as ImageIcon, Video, PlayCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    image_url: '',
    caption: '',
    category: 'portraits',
    resource_type: 'image',
    public_id: ''
  });
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${BACKEND_URL}/api/admin/gallery`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Determine file type
    const type = file.type.startsWith('video/') ? 'video' : 'image';
    setFileType(type);

    setUploading(true);
    setUploadProgress(0);
    const formDataObj = new FormData();
    formDataObj.append('file', file);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.post(`${BACKEND_URL}/api/admin/upload`, formDataObj, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      setFormData({
        ...formData,
        image_url: response.data.url,
        resource_type: response.data.resource_type,
        public_id: response.data.public_id
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Upload failed: ' + (error.response?.data?.detail || error.message));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(`${BACKEND_URL}/api/admin/gallery`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems();
      setFormData({ image_url: '', caption: '', category: 'portraits', resource_type: 'image', public_id: '' });
      setFilePreview(null);
      setFileType(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add gallery item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item? It will also be removed from Cloudinary.')) return;
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${BACKEND_URL}/api/admin/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete item');
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
          Add Media
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-warm-brown/95 z-50 flex items-center justify-center p-6 overflow-y-auto">
          <div className="max-w-lg w-full bg-vintage-cream p-8 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display text-warm-brown">Add Gallery Media</h2>
              <button onClick={() => {
                setShowForm(false);
                setFilePreview(null);
                setFileType(null);
              }} className="text-warm-brown">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Media (Image or Video)</label>
                
                {/* Preview */}
                {filePreview && (
                  <div className="mb-4">
                    {fileType === 'video' ? (
                      <video src={filePreview} controls className="w-full h-64 object-contain bg-black" />
                    ) : (
                      <img src={filePreview} alt="Preview" className="w-full h-64 object-cover" />
                    )}
                    <div className="text-xs text-sepia-dark/60 mt-2">
                      Type: {formData.resource_type}
                    </div>
                  </div>
                )}

                {formData.image_url && !filePreview && (
                  <div className="mb-4">
                    {formData.resource_type === 'video' ? (
                      <video src={formData.image_url} controls className="w-full h-64 object-contain bg-black" />
                    ) : (
                      <img src={formData.image_url} alt="Preview" className="w-full h-64 object-cover" />
                    )}
                  </div>
                )}
                
                <div className="space-y-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-warm-brown/30 hover:bg-warm-brown/5">
                    <Upload size={16} />
                    <span className="text-sm">
                      {uploading ? `Uploading... ${uploadProgress}%` : 'Upload Image or Video'}
                    </span>
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png,.webp,.gif,.mp4,.mov,.webm,.avi" 
                      onChange={handleFileUpload} 
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>

                  {uploading && (
                    <div className="w-full bg-vintage-paper h-2 rounded overflow-hidden">
                      <div 
                        className="h-full bg-vintage-gold transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                  
                  <div className="text-sm text-sepia-dark/60">OR</div>
                  
                  <input
                    type="text"
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="Paste media URL"
                    required
                    className="w-full px-4 py-2 border border-warm-brown/20 text-sm"
                  />
                </div>
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
                  disabled={!formData.image_url || uploading}
                  className="px-6 py-3 bg-warm-brown text-vintage-cream disabled:opacity-50 hover:bg-burnt-sienna"
                >
                  Add to Gallery
                </button>
                <button type="button" onClick={() => {
                  setShowForm(false);
                  setFilePreview(null);
                  setFileType(null);
                }} className="px-6 py-3 border border-warm-brown/30 hover:bg-vintage-paper">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-sepia-dark/60 text-lg mb-4">No media in gallery yet</p>
            <p className="text-sepia-dark/40 text-sm">Click "Add Media" to upload your first image or video</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="relative group">
              {/* Media preview */}
              {item.resource_type === 'video' ? (
                <div className="relative w-full h-64 bg-black">
                  <video src={item.image_url} className="w-full h-full object-contain" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle size={48} className="text-white/80" />
                  </div>
                  <div className="absolute top-2 left-2 bg-warm-brown/90 text-vintage-cream px-2 py-1 text-xs flex items-center gap-1">
                    <Video size={12} />
                    Video
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-64">
                  <img src={item.image_url} alt={item.caption} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-warm-brown/90 text-vintage-cream px-2 py-1 text-xs flex items-center gap-1">
                    <ImageIcon size={12} />
                    Image
                  </div>
                </div>
              )}
              
              {/* Hover overlay with delete button */}
              <div className="absolute inset-0 bg-warm-brown/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-3 bg-burnt-sienna text-vintage-cream rounded-full hover:bg-burnt-sienna/80"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              {/* Info footer */}
              <div className="p-2 bg-vintage-paper">
                <p className="text-xs text-sepia-dark truncate">{item.caption}</p>
                <p className="text-xs text-vintage-gold">{item.category}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminGallery;
