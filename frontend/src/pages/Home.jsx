import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useDocumentTitle from '../hooks/useDocumentTitle';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  useDocumentTitle('Home');
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState({
    hero_image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    tagline: 'A quiet observer of people, stories, and moments.',
    intro_text: 'Through music and performance, I seek to explore the depth of human emotion.'
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [homeRes, projectsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/content/home`).catch(() => ({ data: {} })),
        axios.get(`${BACKEND_URL}/api/content/projects`).catch(() => ({ data: [] }))
      ]);

      if (homeRes.data && Object.keys(homeRes.data).length > 0) {
        setContent(homeRes.data);
      }
      
      if (projectsRes.data && projectsRes.data.length > 0) {
        setProjects(projectsRes.data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vintage-cream">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Column */}
            <div className={`order-2 lg:order-1 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="max-w-xl">
                <div className="w-16 h-0.5 bg-vintage-gold mb-8"></div>
                
                <h1 className="font-display text-7xl md:text-8xl lg:text-9xl text-warm-brown mb-6 tracking-tight leading-none">
                  Kirti
                </h1>
                
                <p className="text-2xl md:text-3xl text-sepia-dark/80 font-light italic mb-8 leading-relaxed">
                  {content.tagline}
                </p>
                
                <div className="w-16 h-0.5 bg-vintage-gold mb-8"></div>
                
                <p className="text-lg text-sepia-dark/70 leading-relaxed mb-12">
                  {content.intro_text}
                </p>
                
                <div className="flex gap-4">
                  <Link 
                    to="/work" 
                    className="inline-block px-8 py-3 border-2 border-warm-brown text-warm-brown hover:bg-warm-brown hover:text-vintage-cream transition-all duration-300 text-sm tracking-widest uppercase font-light"
                  >
                    View Work
                  </Link>
                </div>
              </div>
            </div>

            {/* Image Column */}
            <div className={`order-1 lg:order-2 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative">
                <div className="absolute -inset-4 border-2 border-vintage-gold/30 hidden lg:block"></div>
                <div className="absolute -inset-2 border border-vintage-gold/20 hidden lg:block"></div>
                
                <img 
                  src={content.hero_image}
                  alt="Kirti Killedar"
                  className="w-full h-[600px] lg:h-[700px] object-cover relative grayscale-[20%] contrast-[1.1] sepia-[10%]"
                />
                
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-vintage-gold"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-vintage-gold"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-vintage-gold"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-vintage-gold"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image Section - Simplified */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display text-warm-brown mb-6 leading-tight">
              Singer & Actress
            </h2>
            <p className="text-lg text-sepia-dark/70 leading-relaxed mb-6">
              Exploring the intersection of classical tradition and contemporary expression through voice and performance.
            </p>
            <Link 
              to="/about" 
              className="inline-block text-warm-brown border-b border-vintage-gold hover:text-vintage-gold transition-colors duration-300 text-sm tracking-wider uppercase font-light"
            >
              Read More About Kirti →
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Work Preview */}
      <section className="py-20 bg-vintage-cream">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-sm tracking-widest uppercase text-sepia-dark/60 mb-12">Recent Work</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-sepia-dark/50">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sepia-dark/50">No projects added yet. Use the admin panel to add your first project!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.slice(0, 2).map((project, index) => (
                  <Link
                    key={project.id}
                    to="/work"
                    className={`group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: `${(index + 3) * 150}ms` }}
                  >
                    <div className="overflow-hidden mb-4">
                      <img 
                        src={project.image}
                        alt={project.title}
                        className="w-full h-[400px] object-cover grayscale-[30%] sepia-[15%] transition-all duration-700 group-hover:grayscale-[10%] group-hover:scale-105"
                      />
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-display text-warm-brown group-hover:text-vintage-gold transition-colors duration-300">
                        {project.title}
                      </h3>
                      <span className="text-sm text-sepia-dark/50">{project.year}</span>
                    </div>
                    <p className="text-sepia-dark/70 leading-relaxed">
                      {project.description}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-12">
                <Link 
                  to="/work" 
                  className="inline-block px-8 py-3 border border-warm-brown text-warm-brown hover:bg-warm-brown hover:text-vintage-cream transition-all duration-300 text-sm tracking-wider uppercase"
                >
                  View All Work
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
