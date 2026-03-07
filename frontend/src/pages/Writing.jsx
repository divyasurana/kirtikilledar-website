import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { siteData } from '../data/mockData';

const Writing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedWriting, setSelectedWriting] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl">
            <h1 className={`font-display text-5xl md:text-6xl lg:text-7xl text-charcoal mb-6 leading-tight transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Writing & Thoughts
            </h1>
            <p className={`text-xl text-charcoal/70 leading-relaxed transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Reflections on art, practice, and the creative life.
            </p>
          </div>
        </div>
      </section>

      {/* Writing List */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {siteData.writings.map((writing, index) => (
              <article
                key={writing.id}
                className={`mb-16 pb-16 border-b border-charcoal/10 last:border-0 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="mb-4">
                  <span className="text-xs tracking-widest uppercase text-charcoal/50">
                    {writing.date}
                  </span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-display text-charcoal mb-6 leading-tight hover:text-gold transition-colors duration-300">
                  {writing.title}
                </h2>
                
                {selectedWriting === writing.id ? (
                  <div>
                    <div className="prose prose-lg max-w-none mb-6">
                      {writing.content.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="text-lg text-charcoal/80 leading-relaxed mb-6">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    <button
                      onClick={() => setSelectedWriting(null)}
                      className="text-charcoal/60 hover:text-gold transition-colors duration-300 text-sm tracking-wider uppercase"
                    >
                      Read Less ↑
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg text-charcoal/70 leading-relaxed mb-6">
                      {writing.excerpt}
                    </p>
                    <button
                      onClick={() => setSelectedWriting(writing.id)}
                      className="text-charcoal border-b-2 border-gold hover:text-gold transition-colors duration-300 text-sm tracking-wider uppercase"
                    >
                      Continue Reading →
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-display text-charcoal mb-6">
              Stay Updated
            </h2>
            <p className="text-lg text-charcoal/70 mb-8">
              Occasional thoughts, new work, and upcoming performances delivered to your inbox.
            </p>
            <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-3 border border-charcoal/20 focus:border-gold focus:outline-none text-charcoal bg-ivory transition-colors duration-300"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gold text-ivory hover:bg-gold/90 transition-all duration-300 text-sm tracking-wider uppercase"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-charcoal/50 mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Writing;
