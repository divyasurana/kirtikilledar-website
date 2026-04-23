import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Upload,
  Trash2,
  X,
  Image as ImageIcon,
  Video,
  PlayCircle,
  Edit2,
  Save,
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const emptyForm = {
  image_url: '',
  caption: '',
  category: 'portraits',
  resource_type: 'image',
  public_id: '',
  instagram_url: '',
};

const CATEGORIES = ['portraits', 'moments', 'work', 'behind'];

const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
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
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setFilePreview(null);
    setFileType(null);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setFilePreview(reader.result);
    reader.readAsDataURL(file);

    const type = file.type.startsWith('video/') ? 'video' : 'image';
    setFileType(type);

    setUploading(true);
    setUploadProgress(0);
    const fd = new FormData();
    fd.append('file', file);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.post(`${BACKEND_URL}/api/admin/upload`, fd, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      setFormData((prev) => ({
        ...prev,
        image_url: response.data.url,
        resource_type: response.data.resource_type,
        public_id: response.data.public_id,
      }));
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
      if (editingId) {
        await axios.put(
          `${BACKEND_URL}/api/admin/gallery/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(`${BACKEND_URL}/api/admin/gallery`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      await fetchItems();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save gallery item');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      image_url: item.image_url || '',
      caption: item.caption || '',
      category: item.category || 'portraits',
      resource_type: item.resource_type || 'image',
      public_id: item.public_id || '',
      instagram_url: item.instagram_url || '',
    });
    setFilePreview(null);
    setFileType(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item? It will also be removed from Cloudinary.')) return;
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${BACKEND_URL}/api/admin/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchItems();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete item');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-display text-warm-brown">Gallery</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          data-testid="gallery-add-btn"
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
              <h2 className="text-2xl font-display text-warm-brown">
                {editingId ? 'Edit Gallery Item' : 'Add Gallery Media'}
              </h2>
              <button onClick={resetForm} className="text-warm-brown" data-testid="gallery-form-close">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Media (Image or Video)</label>

                {/* Preview: prefer freshly-selected file, else the current stored URL */}
                {filePreview ? (
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
                ) : formData.image_url ? (
                  <div className="mb-4">
                    {formData.resource_type === 'video' ? (
                      <video src={formData.image_url} controls className="w-full h-64 object-contain bg-black" />
                    ) : (
                      <img src={formData.image_url} alt="Preview" className="w-full h-64 object-cover" />
                    )}
                    <div className="text-xs text-sepia-dark/60 mt-2">
                      Current {formData.resource_type} — upload a new file to replace it.
                    </div>
                  </div>
                ) : null}

                <div className="space-y-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-warm-brown/30 hover:bg-warm-brown/5">
                    <Upload size={16} />
                    <span className="text-sm">
                      {uploading
                        ? `Uploading... ${uploadProgress}%`
                        : editingId
                        ? 'Upload Replacement File'
                        : 'Upload Image or Video'}
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
                    placeholder="Paste media URL (image, video, or YouTube)"
                    required
                    className="w-full px-4 py-2 border border-warm-brown/20 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Caption / Title</label>
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
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Instagram URL (optional)</label>
                <input
                  type="url"
                  value={formData.instagram_url || ''}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  placeholder="https://www.instagram.com/p/..."
                  className="w-full px-4 py-2 border border-warm-brown/20"
                />
                <p className="text-xs text-sepia-dark/60 mt-1">
                  Clear this field to remove the Instagram link.
                </p>
              </div>

              <div>
                <label className="block text-sm mb-2">Resource Type</label>
                <select
                  value={formData.resource_type}
                  onChange={(e) => setFormData({ ...formData, resource_type: e.target.value })}
                  className="w-full px-4 py-2 border border-warm-brown/20"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={!formData.image_url || uploading}
                  data-testid="gallery-save-btn"
                  className="flex items-center gap-2 px-6 py-3 bg-warm-brown text-vintage-cream disabled:opacity-50 hover:bg-burnt-sienna"
                >
                  <Save size={16} />
                  {editingId ? 'Save Changes' : 'Add to Gallery'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-warm-brown/30 hover:bg-vintage-paper"
                >
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
            <div
              key={item.id}
              className="relative group"
              data-testid={`admin-gallery-item-${item.id}`}
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              {/* Media preview */}
              {item.resource_type === 'video' ? (
                <div className="relative w-full h-64 bg-black">
                  {item.image_url &&
                  !/(youtube\.com|youtu\.be)/i.test(item.image_url) ? (
                    <video src={item.image_url} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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

              {/* Hover overlay with action buttons */}
              <div className="absolute inset-0 bg-warm-brown/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-3 bg-vintage-gold text-warm-brown rounded-full hover:bg-vintage-cream"
                  aria-label="Edit"
                  title="Edit"
                  data-testid={`gallery-edit-btn-${item.id}`}
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-3 bg-burnt-sienna text-vintage-cream rounded-full hover:bg-burnt-sienna/80"
                  aria-label="Delete"
                  title="Delete"
                  data-testid={`gallery-delete-btn-${item.id}`}
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
