import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { siteData } from '../data/mockData';

const Gallery = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'portraits', label: 'Portraits' },
    { id: 'moments', label: 'Moments' },
    { id: 'work', label: 'Work Stills' },
    { id: 'behind', label: 'Behind the Scenes' }
  ];

  const filteredGallery = activeCategory === 'all' 
    ? siteData.gallery 
    : siteData.gallery.filter(item => item.category === activeCategory);

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
              Gallery
            </h1>
            
            <p className={`text-xl text-sepia-dark/80 leading-relaxed italic max-w-2xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Moments frozen in time—each image a quiet meditation on presence, performance, and the space between.
            </p>

            <div className="flex items-center justify-center mt-8">
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
              <div className="w-3 h-3 border border-vintage-gold rotate-45 mx-4"></div>
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-vintage-cream border-b border-vintage-gold/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`text-xs tracking-[0.25em] uppercase transition-all duration-300 pb-1 font-light ${
                  activeCategory === category.id
                    ? 'text-warm-brown border-b-2 border-vintage-gold'
                    : 'text-sepia-dark/50 hover:text-warm-brown'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
            {filteredGallery.map((item, index) => (
              <div
                key={item.id}
                className={`group cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative overflow-hidden mb-4">
                  <div className="absolute inset-0 border border-warm-brown/10 z-10 pointer-events-none group-hover:border-vintage-gold/40 transition-colors duration-300"></div>
                  
                  <img 
                    src={item.image}
                    alt={item.caption}
                    className="w-full h-[380px] object-cover grayscale-[35%] sepia-[18%] transition-all duration-700 group-hover:grayscale-[15%] group-hover:scale-105"
                  />
                  
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-warm-brown/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <p className="text-sm text-sepia-dark/60 group-hover:text-vintage-gold transition-colors duration-300 font-light text-center">
                  {item.caption}
                </p>
              </div>
            ))}
          </div>

          {filteredGallery.length === 0 && (
            <div className="text-center py-20">
              <p className="text-sepia-dark/50 text-lg italic">No images in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-warm-brown/97 z-50 flex items-center justify-center p-6 cursor-pointer animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-8 right-8 text-vintage-cream hover:text-vintage-gold transition-colors duration-300 z-10"
            onClick={() => setSelectedImage(null)}
            aria-label="Close"
          >
            <X size={32} strokeWidth={1.5} />
          </button>

          <div className="max-w-6xl max-h-[85vh] relative" onClick={(e) => e.stopPropagation()}>
            {/* Image with vintage frame */}
            <div className="relative">
              <div className="absolute -inset-2 border border-vintage-gold/30 pointer-events-none"></div>
              
              <img 
                src={selectedImage.image}
                alt={selectedImage.caption}
                className="w-full h-auto max-h-[75vh] object-contain grayscale-[25%] sepia-[12%]"
              />
              
              {/* Corner ornaments */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-vintage-gold"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-vintage-gold"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-vintage-gold"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-vintage-gold"></div>
            </div>
            
            {/* Caption */}
            <p className="text-vintage-cream text-center mt-8 text-lg font-light">
              {selectedImage.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
