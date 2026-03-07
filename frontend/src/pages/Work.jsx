import React, { useEffect, useState } from 'react';
import { siteData } from '../data/mockData';

const Work = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filteredWork = filter === 'all' 
    ? siteData.work 
    : siteData.work.filter(item => item.category === filter);

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl">
            <h1 className={`font-display text-5xl md:text-6xl lg:text-7xl text-charcoal mb-6 leading-tight transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Work
            </h1>
            <p className={`text-xl text-charcoal/70 leading-relaxed transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              A selection of recent performances, recordings, and creative projects.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b border-charcoal/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex gap-6 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`text-sm tracking-wider uppercase transition-all duration-300 pb-1 ${
                filter === 'all' 
                  ? 'text-charcoal border-b-2 border-gold' 
                  : 'text-charcoal/50 hover:text-charcoal'
              }`}
            >
              All Work
            </button>
            <button
              onClick={() => setFilter('singing')}
              className={`text-sm tracking-wider uppercase transition-all duration-300 pb-1 ${
                filter === 'singing' 
                  ? 'text-charcoal border-b-2 border-gold' 
                  : 'text-charcoal/50 hover:text-charcoal'
              }`}
            >
              Music
            </button>
            <button
              onClick={() => setFilter('acting')}
              className={`text-sm tracking-wider uppercase transition-all duration-300 pb-1 ${
                filter === 'acting' 
                  ? 'text-charcoal border-b-2 border-gold' 
                  : 'text-charcoal/50 hover:text-charcoal'
              }`}
            >
              Acting
            </button>
          </div>
        </div>
      </section>

      {/* Work Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
            {filteredWork.map((project, index) => (
              <div
                key={project.id}
                className={`group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="overflow-hidden mb-6">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs tracking-widest uppercase text-gold mb-2 block">
                      {project.type}
                    </span>
                    <h3 className="text-2xl font-display text-charcoal group-hover:text-gold transition-colors duration-300">
                      {project.title}
                    </h3>
                  </div>
                  <span className="text-sm text-charcoal/50">{project.year}</span>
                </div>
                
                <p className="text-charcoal/70 leading-relaxed">
                  {project.description}
                </p>
              </div>
            ))}
          </div>

          {filteredWork.length === 0 && (
            <div className="text-center py-16">
              <p className="text-charcoal/50 text-lg">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-display text-charcoal mb-6">
            Interested in Collaborating?
          </h2>
          <p className="text-lg text-charcoal/70 mb-8 max-w-2xl mx-auto">
            Always open to meaningful creative projects and performances.
          </p>
          <a 
            href="/contact" 
            className="inline-block px-8 py-3 bg-gold text-ivory hover:bg-gold/90 transition-all duration-300 text-sm tracking-wider uppercase"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
};

export default Work;
