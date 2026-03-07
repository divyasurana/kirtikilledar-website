import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/login`, null, {
        params: { username, password }
      });
      
      onLogin(response.data.access_token);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vintage-cream flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display text-warm-brown mb-2">Admin Login</h1>
          <p className="text-sepia-dark/70 font-light">Kirti's Portfolio Management</p>
        </div>

        <div className="bg-vintage-paper p-8 border border-vintage-gold/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs tracking-[0.2em] uppercase text-sepia-dark/60 mb-2 font-light">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-vintage-cream border border-warm-brown/20 focus:border-vintage-gold focus:outline-none text-sepia-dark transition-colors duration-300 font-light"
              />
            </div>

            <div>
              <label className="block text-xs tracking-[0.2em] uppercase text-sepia-dark/60 mb-2 font-light">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-vintage-cream border border-warm-brown/20 focus:border-vintage-gold focus:outline-none text-sepia-dark transition-colors duration-300 font-light"
              />
            </div>

            {error && (
              <div className="bg-burnt-sienna/10 border-l-2 border-burnt-sienna p-3">
                <p className="text-sm text-burnt-sienna font-light">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-warm-brown text-vintage-cream hover:bg-burnt-sienna transition-all duration-300 text-xs tracking-[0.3em] uppercase font-light disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-sepia-dark/50 font-light italic">
            Default: username "admin", password "Kirti2024!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
