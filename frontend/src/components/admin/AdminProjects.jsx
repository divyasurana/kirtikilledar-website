import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Upload, Save, X } from 'lucide-react';
import RichTextEditor from '../RichTextEditor';
import RichText from '../RichText';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Music',
    category: 'singing',
    year: new Date().getFullYear().toString(),
    description: '',
    image: '',
    media_type: '',
    media_url: '',
    duration: '',
    summary: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${BACKEND_URL}/api/admin/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append('file', file);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/upload`, formDataObj);
      setFormData({ ...formData, image: response.data.url });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await axios.put(`${BACKEND_URL}/api/admin/projects/${editingProject.id}`, formData);
      } else {
        await axios.post(`${BACKEND_URL}/api/admin/projects`, formData);
      }
      fetchProjects();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      type: project.type || 'Music',
      category: project.category || 'singing',
      year: project.year || new Date().getFullYear().toString(),
      description: project.description || '',
      image: project.image || '',
      media_type: project.media_type || '',
      media_url: project.media_url || '',
      duration: project.duration || '',
      summary: project.summary || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProject(null);
    setFormData({
      title: '',
      type: 'Music',
      category: 'singing',
      year: new Date().getFullYear().toString(),
      description: '',
      image: '',
      media_type: '',
      media_url: '',
      duration: '',
      summary: ''
    });
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-display text-warm-brown">Projects</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-warm-brown text-vintage-cream hover:bg-burnt-sienna"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-warm-brown/95 z-50 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto bg-vintage-cream p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display text-warm-brown">
                {editingProject ? 'Edit Project' : 'New Project'}
              </h2>
              <button onClick={resetForm} className="text-warm-brown hover:text-burnt-sienna">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value, category: e.target.value === 'Music' ? 'singing' : 'acting' })}
                    className="w-full px-4 py-2 border border-warm-brown/20 focus:border-vintage-gold focus:outline-none"
                  >
                    <option>Music</option>
                    <option>Acting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Year</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-2 border border-warm-brown/20"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Media Type</label>
                  <select
                    value={formData.media_type}
                    onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
                    className="w-full px-4 py-2 border border-warm-brown/20"
                  >
                    <option value="">None</option>
                    <option value="audio">Audio</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Description</label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(html) => setFormData({ ...formData, description: html })}
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Project Image</label>
                {formData.image && <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover mb-2" />}
                
                <div className="space-y-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-warm-brown/30">
                    <Upload size={16} />
                    <span className="text-sm">Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  
                  <div className="text-sm text-sepia-dark/60">OR</div>
                  
                  <input
                    type="text"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Paste image URL"
                    className="w-full px-4 py-2 border border-warm-brown/20 text-sm"
                  />
                </div>
              </div>

              {formData.media_type && (
                <div>
                  <label className="block text-sm mb-2">Media URL</label>
                  <input
                    type="text"
                    value={formData.media_url}
                    onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                    placeholder="YouTube URL or audio file URL"
                    className="w-full px-4 py-2 border border-warm-brown/20"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm mb-2">Summary</label>
                <RichTextEditor
                  value={formData.summary}
                  onChange={(html) => setFormData({ ...formData, summary: html })}
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-warm-brown text-vintage-cream">
                  <Save size={16} />
                  {editingProject ? 'Update' : 'Create'} Project
                </button>
                <button type="button" onClick={resetForm} className="px-6 py-3 border border-warm-brown/30">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-sepia-dark/60 text-lg mb-4">No projects yet</p>
            <p className="text-sepia-dark/40 text-sm">Click "Add Project" to create your first project</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="bg-white border border-vintage-gold/20 p-4">
              {project.image && <img src={project.image} alt={project.title} className="w-full h-48 object-cover mb-4" />}
              <h3 className="text-xl font-display text-warm-brown mb-2">{project.title}</h3>
              <RichText content={project.description} className="text-sm text-sepia-dark/70 mb-4" />
              <div className="flex justify-between items-center">
                <span className="text-xs text-vintage-gold">{project.type} • {project.year}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(project)} className="p-2 hover:bg-vintage-paper">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="p-2 hover:bg-burnt-sienna/10 text-burnt-sienna">
                    <Trash2 size={16} />
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

export default AdminProjects;
