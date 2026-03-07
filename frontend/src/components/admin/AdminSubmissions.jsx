import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, CheckCircle, Circle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/submissions`);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${BACKEND_URL}/api/admin/submissions/${id}/read`);
      fetchSubmissions();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-display text-warm-brown">Contact Messages</h1>
        <div className="flex items-center gap-2 text-sm text-sepia-dark/70">
          <Mail size={16} />
          <span>{submissions.filter(s => !s.read).length} unread</span>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white p-12 border border-vintage-gold/20 text-center">
          <Mail size={48} className="mx-auto text-sepia-dark/30 mb-4" />
          <p className="text-sepia-dark/70">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className={`bg-white p-6 border ${
                submission.read ? 'border-vintage-gold/10' : 'border-vintage-gold/30 bg-vintage-paper'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-display text-warm-brown">{submission.name}</h3>
                  <a href={`mailto:${submission.email}`} className="text-sm text-vintage-gold hover:underline">
                    {submission.email}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-sepia-dark/50">{formatDate(submission.created_at)}</span>
                  <button
                    onClick={() => markAsRead(submission.id)}
                    className="text-vintage-gold hover:text-warm-brown transition-colors"
                  >
                    {submission.read ? (
                      <CheckCircle size={20} />
                    ) : (
                      <Circle size={20} />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-sepia-dark/80 whitespace-pre-wrap leading-relaxed">
                {submission.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSubmissions;
