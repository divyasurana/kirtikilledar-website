import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { siteData } from '../data/mockData';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-charcoal opacity-5"></div>
        
        <div className={`container mx-auto px-6 lg:px-12 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-4xl">
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-charcoal mb-6 tracking-tight leading-tight">
              {siteData.name}
            </h1>
            <p className="text-2xl md:text-3xl text-charcoal/70 font-light mb-8 max-w-2xl">
              {siteData.bio}
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link 
                to="/work" 
                className="inline-block px-8 py-3 border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory transition-all duration-300 text-sm tracking-wider uppercase"
              >
                View Work
              </Link>
              <Link 
                to="/contact" 
                className="inline-block px-8 py-3 bg-gold text-ivory hover:bg-gold/90 transition-all duration-300 text-sm tracking-wider uppercase"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-12 right-12 w-32 h-32 border border-gold/30 hidden lg:block"></div>
      </section>

      {/* Featured Image Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <img 
                src={siteData.heroImage}
                alt={siteData.name}
                className="w-full h-[600px] object-cover"
              />
            </div>
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <h2 className="text-4xl md:text-5xl font-display text-charcoal mb-6 leading-tight">
                Singer & Actress
              </h2>
              <p className="text-lg text-charcoal/70 leading-relaxed mb-6">
                Exploring the intersection of classical tradition and contemporary expression through voice and performance.
              </p>
              <p className="text-lg text-charcoal/70 leading-relaxed mb-8">
                Every performance is an invitation—to feel, to question, to connect with something larger than ourselves.
              </p>
              <Link 
                to="/about" 
                className="inline-block text-charcoal border-b-2 border-gold hover:text-gold transition-colors duration-300 text-sm tracking-wider uppercase"
              >
                Read More About Kirti →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Work Preview */}
      <section className="py-24 bg-ivory">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-sm tracking-widest uppercase text-charcoal/60 mb-12">Recent Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {siteData.work.slice(0, 2).map((project, index) => (
              <Link
                key={project.id}
                to="/work"
                className={`group transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                <div className="overflow-hidden mb-4">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-display text-charcoal group-hover:text-gold transition-colors duration-300">
                    {project.title}
                  </h3>
                  <span className="text-sm text-charcoal/50">{project.year}</span>
                </div>
                <p className="text-charcoal/70 leading-relaxed">
                  {project.description}
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              to="/work" 
              className="inline-block px-8 py-3 border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory transition-all duration-300 text-sm tracking-wider uppercase"
            >
              View All Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
