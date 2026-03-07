import React, { useEffect, useState } from 'react';
import { siteData } from '../data/mockData';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <h1 className={`font-display text-5xl md:text-6xl lg:text-7xl text-charcoal mb-6 max-w-3xl leading-tight transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            About
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Image Column */}
            <div className={`lg:col-span-2 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="sticky top-32">
                <img 
                  src={siteData.about.image}
                  alt={siteData.name}
                  className="w-full h-[600px] object-cover mb-8"
                />
                <div className="border-t border-charcoal/20 pt-6">
                  <h3 className="text-sm tracking-widest uppercase text-charcoal/60 mb-4">Connect</h3>
                  <a 
                    href={siteData.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-charcoal hover:text-gold transition-colors duration-300 inline-block mb-2"
                  >
                    Instagram →
                  </a>
                </div>
              </div>
            </div>

            {/* Text Column */}
            <div className={`lg:col-span-3 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="prose prose-lg max-w-none">
                {siteData.about.fullBio.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-lg text-charcoal/80 leading-relaxed mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Skills Section */}
              <div className="mt-16 pt-16 border-t border-charcoal/20">
                <h2 className="text-sm tracking-widest uppercase text-charcoal/60 mb-8">Areas of Practice</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {siteData.about.skills.map((skill, index) => (
                    <div 
                      key={index}
                      className="pb-4 border-b border-gold/30"
                    >
                      <p className="text-lg text-charcoal font-light">{skill}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Philosophy Section */}
              <div className="mt-16 pt-16 border-t border-charcoal/20">
                <h2 className="text-2xl font-display text-charcoal mb-6">Philosophy</h2>
                <blockquote className="text-xl text-charcoal/70 italic leading-relaxed border-l-2 border-gold pl-6">
                  "Art is not about perfection. It's about presence. It's about being brave enough to show up, to feel deeply, and to share that feeling with others."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-display text-charcoal mb-6">
            Let's Create Together
          </h2>
          <p className="text-lg text-charcoal/70 mb-8 max-w-2xl mx-auto">
            Open to collaborations, performances, and meaningful creative projects.
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

export default About;
