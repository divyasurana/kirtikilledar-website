import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { siteData } from '../data/mockData';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-vintage-cream">
      {/* Hero Section - Charulata style */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Column */}
            <div className={`order-2 lg:order-1 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="max-w-xl">
                {/* Decorative vintage element */}
                <div className="w-16 h-0.5 bg-vintage-gold mb-8"></div>
                
                <h1 className="font-display text-7xl md:text-8xl lg:text-9xl text-warm-brown mb-6 tracking-tight leading-none">
                  Kirti
                </h1>
                
                <p className="text-2xl md:text-3xl text-sepia-dark/80 font-light italic mb-8 leading-relaxed">
                  A quiet observer of people, stories, and moments.
                </p>
                
                <div className="w-16 h-0.5 bg-vintage-gold mb-8"></div>
                
                <p className="text-lg text-sepia-dark/70 leading-relaxed mb-8">
                  There is a certain magic in watching people—the way they move through the world, the stories they carry in their eyes, the silences between their words. I've always been drawn to these moments, these quiet revelations of character.
                </p>
                
                <p className="text-lg text-sepia-dark/70 leading-relaxed mb-12">
                  Through music and performance, I seek to explore the depth of human emotion, to give voice to what often remains unspoken. My work is an attempt to bridge the distance between inner feeling and outward expression.
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
                {/* Vintage frame effect */}
                <div className="absolute -inset-4 border-2 border-vintage-gold/30 hidden lg:block"></div>
                <div className="absolute -inset-2 border border-vintage-gold/20 hidden lg:block"></div>
                
                <img 
                  src={siteData.heroImage}
                  alt="Kirti Killedar"
                  className="w-full h-[600px] lg:h-[700px] object-cover relative grayscale-[20%] contrast-[1.1] sepia-[10%]"
                />
                
                {/* Vintage corner ornaments */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-vintage-gold"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-vintage-gold"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-vintage-gold"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-vintage-gold"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Work Section */}
      <section className="py-20 bg-vintage-paper">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-0.5 bg-vintage-gold"></div>
              <h2 className="text-sm tracking-[0.3em] uppercase text-sepia-dark font-light">Selected Work</h2>
              <div className="w-12 h-0.5 bg-vintage-gold"></div>
            </div>
            <p className="text-lg text-sepia-dark/70 italic max-w-2xl mx-auto">
              A selection of recent performances and creative endeavors
            </p>
          </div>

          {/* Work Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {siteData.work.slice(0, 3).map((project, index) => (
              <div
                key={project.id}
                className={`group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${(index + 4) * 150}ms` }}
              >
                <div className="relative mb-6 overflow-hidden">
                  {/* Vintage border */}
                  <div className="absolute inset-0 border border-warm-brown/20 z-10 pointer-events-none"></div>
                  
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-[380px] object-cover grayscale-[30%] sepia-[15%] transition-all duration-700 group-hover:grayscale-[10%] group-hover:scale-105"
                  />
                  
                  {/* Corner accents */}
                  <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-vintage-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-vintage-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="text-center">
                  <span className="text-xs tracking-widest uppercase text-vintage-gold mb-2 block font-light">
                    {project.type}
                  </span>
                  <h3 className="text-xl font-display text-warm-brown mb-3 leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-sepia-dark/70 leading-relaxed text-sm">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/work" 
              className="inline-block text-warm-brown border-b border-vintage-gold hover:text-vintage-gold transition-colors duration-300 text-sm tracking-wider uppercase font-light"
            >
              View All Work →
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-20 bg-vintage-cream">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-0.5 bg-vintage-gold"></div>
              <h2 className="text-sm tracking-[0.3em] uppercase text-sepia-dark font-light">Gallery</h2>
              <div className="w-12 h-0.5 bg-vintage-gold"></div>
            </div>
            <p className="text-lg text-sepia-dark/70 italic max-w-2xl mx-auto">
              Moments captured in time
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {siteData.gallery.slice(0, 4).map((item, index) => (
              <div
                key={item.id}
                className="relative group cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 border border-warm-brown/20 z-10 pointer-events-none"></div>
                
                <img 
                  src={item.image}
                  alt={item.caption}
                  className="w-full h-[280px] object-cover grayscale-[40%] sepia-[20%] transition-all duration-500 group-hover:grayscale-[15%] group-hover:scale-110"
                />
                
                {/* Vintage vignette overlay */}
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-warm-brown/10"></div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/gallery" 
              className="inline-block text-warm-brown border-b border-vintage-gold hover:text-vintage-gold transition-colors duration-300 text-sm tracking-wider uppercase font-light"
            >
              View Full Gallery →
            </Link>
          </div>
        </div>
      </section>

      {/* Writing / Thoughts Section */}
      <section className="py-20 bg-antique-white">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-0.5 bg-vintage-gold"></div>
              <h2 className="text-sm tracking-[0.3em] uppercase text-sepia-dark font-light">Writing & Thoughts</h2>
              <div className="w-12 h-0.5 bg-vintage-gold"></div>
            </div>
            <p className="text-lg text-sepia-dark/70 italic max-w-2xl mx-auto">
              Reflections on art, life, and the creative process
            </p>
          </div>

          {/* Writing Excerpts */}
          <div className="max-w-4xl mx-auto space-y-12">
            {siteData.writings.slice(0, 2).map((writing, index) => (
              <article
                key={writing.id}
                className="pb-12 border-b border-vintage-gold/30 last:border-0"
              >
                <div className="mb-4">
                  <span className="text-xs tracking-widest uppercase text-vintage-gold font-light">
                    {writing.date}
                  </span>
                </div>
                
                <h3 className="text-3xl font-display text-warm-brown mb-6 leading-tight">
                  {writing.title}
                </h3>
                
                <p className="text-lg text-sepia-dark/80 leading-relaxed italic mb-6">
                  {writing.excerpt}
                </p>
                
                <Link
                  to="/writing"
                  className="text-warm-brown border-b border-vintage-gold hover:text-vintage-gold transition-colors duration-300 text-sm tracking-wider uppercase font-light"
                >
                  Continue Reading →
                </Link>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/writing" 
              className="inline-block px-8 py-3 border-2 border-warm-brown text-warm-brown hover:bg-warm-brown hover:text-vintage-cream transition-all duration-300 text-sm tracking-widest uppercase font-light"
            >
              All Writings
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-vintage-paper">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            {/* Decorative ornament */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-3 h-3 border border-vintage-gold rotate-45 mr-4"></div>
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
              <div className="w-5 h-5 border border-vintage-gold rotate-45 mx-4"></div>
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
              <div className="w-3 h-3 border border-vintage-gold rotate-45 ml-4"></div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display text-warm-brown mb-6 leading-tight">
              Let's Create Together
            </h2>
            
            <p className="text-lg text-sepia-dark/70 leading-relaxed mb-8 max-w-2xl mx-auto">
              I am always interested in meaningful collaborations—whether for performance, recording, or creative projects that explore new artistic territory. If you have an idea or simply wish to connect, I would be delighted to hear from you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link 
                to="/contact" 
                className="inline-block px-8 py-3 bg-warm-brown text-vintage-cream hover:bg-burnt-sienna transition-all duration-300 text-sm tracking-widest uppercase font-light"
              >
                Get in Touch
              </Link>
              
              <a 
                href={siteData.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 border-2 border-warm-brown text-warm-brown hover:bg-warm-brown hover:text-vintage-cream transition-all duration-300 text-sm tracking-widest uppercase font-light"
              >
                Follow on Instagram
              </a>
            </div>
            
            {/* Decorative ornament */}
            <div className="flex items-center justify-center mt-8">
              <div className="w-3 h-3 border border-vintage-gold rotate-45 mr-4"></div>
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
              <div className="w-5 h-5 border border-vintage-gold rotate-45 mx-4"></div>
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
              <div className="w-3 h-3 border border-vintage-gold rotate-45 ml-4"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
