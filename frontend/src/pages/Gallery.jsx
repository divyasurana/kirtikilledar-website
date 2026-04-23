import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { GalleryItem, GalleryLightbox } from '../components/GalleryItem';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Gallery = () => {
  useDocumentTitle('Gallery');
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openItem, setOpenItem] = useState(null); // single global lightbox target

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
    const fetchGallery = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/content/gallery`);
        setGallery(response.data || []);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'portraits', label: 'Portraits' },
    { id: 'moments', label: 'Moments' },
    { id: 'work', label: 'Work Stills' },
    { id: 'behind', label: 'Behind the Scenes' },
  ];

  const filteredGallery =
    activeCategory === 'all'
      ? gallery
      : gallery.filter((item) => item.category === activeCategory);

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

            <h1
              className={`font-display text-6xl md:text-7xl text-warm-brown mb-8 leading-tight transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Gallery
            </h1>

            <p
              className={`text-xl text-sepia-dark/80 leading-relaxed italic max-w-2xl mx-auto transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
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
                data-testid={`gallery-filter-${category.id}`}
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
          {loading ? (
            <div className="text-center py-12">
              <p className="text-sepia-dark/50">Loading gallery...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
                {filteredGallery.map((item) => (
                  <GalleryItem
                    key={item.id}
                    item={item}
                    onOpen={(it) => setOpenItem(it)}
                  />
                ))}
              </div>

              {filteredGallery.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-sepia-dark/50 text-lg italic">
                    No media in this category yet.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <GalleryLightbox item={openItem} onClose={() => setOpenItem(null)} />
    </div>
  );
};

export default Gallery;
