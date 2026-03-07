import React, { useEffect, useState } from 'react';
import { siteData } from '../data/mockData';

const Gallery = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <h1 className={`font-display text-5xl md:text-6xl lg:text-7xl text-charcoal mb-6 leading-tight transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Gallery
          </h1>
          <p className={`text-xl text-charcoal/70 leading-relaxed max-w-2xl transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Moments captured in time—portraits, performances, and glimpses behind the scenes.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteData.gallery.map((item, index) => (
              <div
                key={item.id}
                className={`group cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => setSelectedImage(item)}
              >
                <div className="overflow-hidden">
                  <img 
                    src={item.image}
                    alt={item.caption}
                    className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="text-sm text-charcoal/60 mt-3 group-hover:text-gold transition-colors duration-300">
                  {item.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-charcoal/95 z-50 flex items-center justify-center p-6 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-6xl max-h-[90vh] relative">
            <img 
              src={selectedImage.image}
              alt={selectedImage.caption}
              className="w-full h-full object-contain"
            />
            <p className="text-ivory text-center mt-6 text-lg">
              {selectedImage.caption}
            </p>
            <button 
              className="absolute top-4 right-4 text-ivory text-4xl hover:text-gold transition-colors duration-300"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
