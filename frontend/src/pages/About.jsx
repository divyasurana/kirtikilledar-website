import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useDocumentTitle from '../hooks/useDocumentTitle';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const About = () => {
  useDocumentTitle('About');
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState({
    portrait_image: 'https://images.unsplash.com/photo-1634595477722-7bc68dd410fd',
    background_text: 'I was born and raised in Mumbai, in a household where music was not just entertainment but a way of understanding the world. My mother sang around the house—old film songs, Marathi folk songs, bhajans. My father played the harmonium and had a deep love for Hindustani classical music. I didn\'t think of it as special at the time; it was simply the air I breathed.\n\nAs I grew older, I found myself drawn to storytelling in all its forms: theatre, film, literature. I realized that whether I was singing or acting, I was doing the same thing—trying to understand and express the complexity of being human. My artistic instinct has always been to look beneath the surface, to find what is unspoken, to give voice to what often remains silent.',
    approach_text: 'My working philosophy is simple: listen deeply, observe quietly, and trust what you find.\n\nBefore I step into a character or interpret a piece of music, I spend time in silence. I watch people. I listen to the rhythms of their speech, the hesitations, the moments when words fail them. I notice the way hands move when someone is nervous, the way eyes shift when someone is hiding something, the micro-expressions that reveal what the mouth won\'t say.\n\nI believe that truth lives in small moments—a held breath, a pause before speaking, the way someone looks away. These are the details that make a performance feel real. These are the details that connect us to each other.',
    influences_text: 'I draw inspiration from many sources, each teaching me different ways to see and understand the world.\n\nCinema has been a profound teacher—particularly the work of Satyajit Ray, whose films understand that the most powerful moments are often the quietest. The way Madhabi Mukherjee conveyed an entire interior world through a glance in Charulata changed how I think about performance.\n\nLiterature taught me the rhythm of language and the power of interiority. I return often to the poetry of Rumi, the short stories of Chekhov, and the novels of Jhumpa Lahiri—writers who understand loneliness, longing, and the distance between what we feel and what we can express.\n\nMy gurus in Hindustani classical music taught me discipline, patience, and the importance of riyaaz—daily practice not as drudgery but as meditation, as a way of life. They showed me that mastery comes not from brilliance but from devotion.',
    quote: 'The best stories are not told—they are observed, felt, and lived. My work is simply an attempt to bear witness to the quiet magnificence of being human.',
    skills: [
      "Hindustani Classical Vocal",
      "Light Classical & Semi-Classical",
      "Playback Singing",
      "Theatre & Screen Acting",
      "Voice Modulation & Dubbing"
    ]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/content/about`);
      if (response.data && Object.keys(response.data).length > 0) {
        setContent(response.data);
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vintage-cream">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-vintage-paper">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Decorative element */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
              <div className="w-3 h-3 border border-vintage-gold rotate-45 mx-4"></div>
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
            </div>
            
            <h1 className={`font-display text-6xl md:text-7xl text-warm-brown mb-8 leading-tight transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              About
            </h1>
            
            <div className={`max-w-3xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-xl text-sepia-dark/80 leading-relaxed italic mb-6">
                I approach my work with a commitment to emotional honesty—to express what is true, even when it is uncomfortable, even when it is quiet.
              </p>
              <p className="text-xl text-sepia-dark/80 leading-relaxed italic">
                I am endlessly curious about people: what drives them, what they hide, what they reveal without knowing. This curiosity shapes everything I do.
              </p>
            </div>

            {/* Decorative element */}
            <div className="flex items-center justify-center mt-8">
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
              <div className="w-3 h-3 border border-vintage-gold rotate-45 mx-4"></div>
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto space-y-20">
            
            {/* Background Section */}
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-0.5 bg-vintage-gold"></div>
                  <h2 className="text-sm tracking-[0.3em] uppercase text-sepia-dark font-light">Background</h2>
                </div>
              </div>
              
              <div className="space-y-6">
                {content.background_text ? (
                  content.background_text.split('\n\n').map((para, i) => (
                    <p key={i} className="text-lg text-sepia-dark/80 leading-relaxed">{para}</p>
                  ))
                ) : (
                  <>
                    <p className="text-lg text-sepia-dark/80 leading-relaxed">
                      I grew up in a household where music was not just entertainment, but a way of understanding the world. My earliest memories are of listening to my grandmother sing—her voice carrying stories of longing, joy, and the passage of time. I didn't know then that I was being taught the language of emotion.
                    </p>
                    
                    <p className="text-lg text-sepia-dark/80 leading-relaxed">
                      Classical music became my foundation. The discipline of learning ragas taught me patience, precision, and the art of restraint. But it was the spaces between the notes—the silences—that fascinated me most. That's where meaning lives. That's where truth hides.
                    </p>
                    
                    <p className="text-lg text-sepia-dark/80 leading-relaxed">
                      As I grew older, I found myself drawn to storytelling in all its forms: theatre, film, literature. I realized that whether I was singing or acting, I was doing the same thing—trying to understand and express the complexity of being human. My artistic instinct has always been to look beneath the surface, to find what is unspoken, to give voice to what often remains silent.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Decorative Divider */}
            <div className="flex justify-center">
              <div className="w-2 h-2 border border-vintage-gold rotate-45"></div>
            </div>

            {/* Approach Section */}
            <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-0.5 bg-vintage-gold"></div>
                  <h2 className="text-sm tracking-[0.3em] uppercase text-sepia-dark font-light">Approach</h2>
                </div>
              </div>
              
              <div className="space-y-6">
                {content.approach_text ? (
                  content.approach_text.split('\n\n').map((para, i) => (
                    <p key={i} className="text-lg text-sepia-dark/80 leading-relaxed" dangerouslySetInnerHTML={{
                      __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-warm-brown">$1</strong>').replace(/_(.*?)_/g, '<em>$1</em>')
                    }} />
                  ))
                ) : (
                  <>
                    <p className="text-lg text-sepia-dark/80 leading-relaxed">
                      My working philosophy is simple: <em>listen deeply, observe quietly, and trust what you find.</em>
                    </p>
                    
                    <p className="text-lg text-sepia-dark/80 leading-relaxed">
                      Before I step into a character or interpret a piece of music, I spend time in silence. I watch people. I listen to the rhythms of their speech, the hesitations, the moments when words fail them. I notice the way hands move when someone is nervous, the way eyes shift when someone is hiding something, the micro-expressions that reveal what the mouth won't say.
                    </p>
                    
                    <p className="text-lg text-sepia-dark/80 leading-relaxed">
                      I believe that truth lives in small moments—a held breath, a pause before speaking, the way someone looks away. These are the details that make a performance feel real. These are the details that connect us to each other.
                    </p>
                    
                    <p className="text-lg text-sepia-dark/80 leading-relaxed">
                      I don't perform to impress. I perform to communicate something true. If even one person in the audience feels seen, feels understood, feels less alone—then I have done my job.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Decorative Divider */}
            <div className="flex justify-center">
              <div className="w-2 h-2 border border-vintage-gold rotate-45"></div>
            </div>

            {/* Skills Section */}
            <div className={`transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Skills/Practices */}
              <div className="bg-antique-white p-8 border border-vintage-gold/20">
                <h3 className="text-xs tracking-[0.3em] uppercase text-vintage-gold mb-6 font-light">Areas of Practice</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.skills && content.skills.map((skill, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <div className="w-1.5 h-1.5 bg-vintage-gold mt-2 flex-shrink-0"></div>
                      <p className="text-sepia-dark/80 font-light">{skill}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portrait & Quote Section */}
      <section className="py-20 bg-vintage-paper">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
              {/* Portrait */}
              <div className="lg:col-span-2">
                <div className="relative">
                  {/* Vintage frame */}
                  <div className="absolute -inset-3 border border-vintage-gold/30"></div>
                  
                  <img 
                    src={content.portrait_image || content.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80'}
                    alt="Kirti Killedar"
                    className="w-full h-[500px] object-cover relative grayscale-[30%] sepia-[15%]"
                  />
                  
                  {/* Corner ornaments */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-vintage-gold"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-vintage-gold"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-vintage-gold"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-vintage-gold"></div>
                </div>
              </div>

              {/* Quote */}
              <div className="lg:col-span-3 flex items-center">
                <div>
                  {/* Decorative quote mark */}
                  <div className="mb-6">
                    <svg width="40" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 32V19.2C0 12.8 1.6 7.46667 4.8 3.2C8 1.06667 11.7333 0 16 0V6.4C13.3333 6.4 11.2 7.2 9.6 8.8C8 10.4 7.2 12.5333 7.2 15.2V16H16V32H0ZM24 32V19.2C24 12.8 25.6 7.46667 28.8 3.2C32 1.06667 35.7333 0 40 0V6.4C37.3333 6.4 35.2 7.2 33.6 8.8C32 10.4 31.2 12.5333 31.2 15.2V16H40V32H24Z" fill="#b8935e" fillOpacity="0.3"/>
                    </svg>
                  </div>
                  
                  <blockquote className="text-2xl md:text-3xl font-display text-warm-brown leading-relaxed mb-8">
                    {content.quote || 'The best stories are not told—they are observed, felt, and lived. My work is simply an attempt to bear witness to the quiet magnificence of being human.'}
                  </blockquote>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-0.5 bg-vintage-gold"></div>
                    <p className="text-sm tracking-widest uppercase text-sepia-dark/60 font-light">Kirti Killedar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="py-16 bg-vintage-cream">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-sepia-dark/70 leading-relaxed mb-8">
              If you're interested in working together or simply wish to connect, I'd love to hear from you.
            </p>
            <a 
              href="/contact" 
              className="inline-block px-8 py-3 border-2 border-warm-brown text-warm-brown hover:bg-warm-brown hover:text-vintage-cream transition-all duration-300 text-sm tracking-widest uppercase font-light"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
