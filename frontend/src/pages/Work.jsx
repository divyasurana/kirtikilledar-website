import React, { useEffect, useState, useRef, useCallback } from 'react';
import { X, Music, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import ProjectMediaPlayer from '../components/ProjectMediaPlayer';
import RichText from '../components/RichText';
import useDocumentTitle from '../hooks/useDocumentTitle';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const SWIPE_THRESHOLD = 50; // px of horizontal movement to trigger navigation

const Work = () => {
  useDocumentTitle('Work');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const touchStartRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/content/projects`);
      setProjects(response.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      // Scroll modal back to top when switching projects via swipe / arrows
      const modalScroll = document.querySelector('.fixed.inset-0.bg-warm-brown\\/95');
      if (modalScroll) modalScroll.scrollTop = 0;
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  // Navigate prev/next within the projects list while the modal is open
  const currentIndex = selectedProject
    ? projects.findIndex((p) => p.id === selectedProject.id)
    : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < projects.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) setSelectedProject(projects[currentIndex - 1]);
  }, [hasPrev, currentIndex, projects]);

  const goNext = useCallback(() => {
    if (hasNext) setSelectedProject(projects[currentIndex + 1]);
  }, [hasNext, currentIndex, projects]);

  // Keyboard arrow support for desktop
  useEffect(() => {
    if (!selectedProject) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedProject, goPrev, goNext]);

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e) => {
    const start = touchStartRef.current;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    touchStartRef.current = null;
    // Only trigger on mostly-horizontal swipes to avoid fighting with vertical scroll
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) goNext();
      else goPrev();
    }
  };

  return (
    <div className="min-h-screen bg-vintage-cream">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-vintage-paper">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
              <div className="w-3 h-3 border border-vintage-gold rotate-45 mx-4"></div>
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
            </div>
            
            <h1 className={`font-display text-6xl md:text-7xl text-warm-brown mb-8 leading-tight transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Selected Work
            </h1>
            
            <p className={`text-xl text-sepia-dark/80 leading-relaxed italic max-w-2xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              A collection of performances, recordings, and creative endeavors—each an exploration of voice, character, and truth.
            </p>

            <div className="flex items-center justify-center mt-8">
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
              <div className="w-3 h-3 border border-vintage-gold rotate-45 mx-4"></div>
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-sepia-dark/50">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sepia-dark/50">No projects added yet. Use the admin panel to add your first project!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
              {projects.map((project, index) => (
              <div
                key={project.id}
                className={`group cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${(index + 3) * 150}ms` }}
                onClick={() => setSelectedProject(project)}
              >
                {/* Image */}
                <div className="relative mb-6 overflow-hidden">
                  <div className="absolute inset-0 border border-warm-brown/20 z-10 pointer-events-none"></div>
                  
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-[400px] object-cover grayscale-[30%] sepia-[15%] transition-all duration-700 group-hover:grayscale-[10%] group-hover:scale-105"
                  />
                  
                  {/* Corner accents on hover */}
                  <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-vintage-gold opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-vintage-gold opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>
                
                {/* Project Info */}
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs tracking-[0.3em] uppercase text-vintage-gold font-light">
                        {project.type}
                      </span>
                      {project.media_type === 'audio' && (
                        <Music size={14} className="text-vintage-gold" strokeWidth={1.5} />
                      )}
                      {project.media_type === 'video' && (
                        <Video size={14} className="text-vintage-gold" strokeWidth={1.5} />
                      )}
                    </div>
                    <span className="text-sm text-sepia-dark/50 font-light">{project.year}</span>
                  </div>
                  
                  <h3 className="text-2xl font-display text-warm-brown mb-3 leading-tight group-hover:text-vintage-gold transition-colors duration-300">
                    {project.title}
                  </h3>
                  
                  <RichText
                    content={project.description}
                    className="text-sepia-dark/70 leading-relaxed mb-4 font-light"
                  />
                  
                  <div className="flex items-center gap-2 text-warm-brown group-hover:text-vintage-gold transition-colors duration-300">
                    <span className="text-sm tracking-wider uppercase font-light">
                      {project.media_type === 'audio' ? 'Listen & View Details' : 'Watch & View Details'}
                    </span>
                    <span className="text-lg">→</span>
                  </div>
                </div>
              </div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-warm-brown/95 z-50 overflow-y-auto animate-fadeIn">
          <div className="min-h-screen py-6 px-2 sm:py-12 sm:px-6">
            <div
              className="max-w-5xl mx-auto bg-vintage-cream relative"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              data-testid="project-modal"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 text-warm-brown hover:text-vintage-gold transition-colors duration-300 bg-vintage-cream p-3 border border-warm-brown/20"
                aria-label="Close"
                style={{ minWidth: 44, minHeight: 44 }}
              >
                <X size={24} />
              </button>

              {/* Prev button (desktop chevron) */}
              {hasPrev && (
                <button
                  onClick={goPrev}
                  aria-label="Previous project"
                  data-testid="project-modal-prev"
                  className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 text-vintage-cream hover:text-vintage-gold transition-colors duration-300 bg-warm-brown/70 hover:bg-warm-brown p-3 rounded-full items-center justify-center"
                  style={{ minWidth: 44, minHeight: 44 }}
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Next button (desktop chevron) */}
              {hasNext && (
                <button
                  onClick={goNext}
                  aria-label="Next project"
                  data-testid="project-modal-next"
                  className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 text-vintage-cream hover:text-vintage-gold transition-colors duration-300 bg-warm-brown/70 hover:bg-warm-brown p-3 rounded-full items-center justify-center"
                  style={{ minWidth: 44, minHeight: 44 }}
                >
                  <ChevronRight size={24} />
                </button>
              )}

              {/* Content */}
              <div className="p-4 md:p-8 lg:p-12">
                {/* Header */}
                <div className="mb-6 md:mb-10">
                  <div className="flex justify-between items-start mb-3 md:mb-4 gap-2">
                    <span className="text-[11px] md:text-xs tracking-[0.25em] md:tracking-[0.3em] uppercase text-vintage-gold font-light">
                      {selectedProject.type}
                    </span>
                    <span className="text-xs md:text-sm text-sepia-dark/50 font-light flex-shrink-0">
                      {selectedProject.year}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-display text-warm-brown mb-4 md:mb-6 leading-tight break-words">
                    {selectedProject.title}
                  </h2>

                  <div className="w-16 md:w-20 h-0.5 bg-vintage-gold"></div>
                </div>

                {/* Main Image */}
                {selectedProject.image && (
                  <div className="relative mb-6 md:mb-10">
                    <div className="absolute inset-0 border border-warm-brown/20 z-10 pointer-events-none rounded-lg md:rounded-none"></div>
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full object-cover grayscale-[20%] sepia-[10%] rounded-lg md:rounded-none"
                      style={{ maxHeight: '50vh' }}
                      data-testid="project-modal-image"
                    />
                  </div>
                )}

                {/* Media Player */}
                {selectedProject.media_type && selectedProject.media_url && (
                  <div className="mb-6 md:mb-10">
                    <ProjectMediaPlayer
                      mediaType={selectedProject.media_type}
                      mediaUrl={selectedProject.media_url}
                      title={selectedProject.title}
                    />
                  </div>
                )}

                {/* Description / Summary */}
                {(selectedProject.summary || selectedProject.description) && (
                  <div>
                    <RichText
                      content={selectedProject.summary || selectedProject.description}
                      className="text-[15px] md:text-lg text-sepia-dark/80 leading-[1.6] md:leading-relaxed font-light"
                    />
                  </div>
                )}

                {/* Swipe hint + project counter */}
                {projects.length > 1 && (
                  <div
                    className="md:hidden mt-8 pt-6 border-t border-vintage-gold/20 flex items-center justify-between text-xs tracking-wider uppercase text-sepia-dark/50 font-light"
                    data-testid="project-modal-swipe-hint"
                  >
                    <button
                      onClick={goPrev}
                      disabled={!hasPrev}
                      className="flex items-center gap-1 disabled:opacity-30 text-warm-brown"
                      style={{ minHeight: 44 }}
                      aria-label="Previous"
                    >
                      <ChevronLeft size={16} />
                      <span>Prev</span>
                    </button>
                    <span>
                      {currentIndex + 1} / {projects.length} · swipe
                    </span>
                    <button
                      onClick={goNext}
                      disabled={!hasNext}
                      className="flex items-center gap-1 disabled:opacity-30 text-warm-brown"
                      style={{ minHeight: 44 }}
                      aria-label="Next"
                    >
                      <span>Next</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Work;
