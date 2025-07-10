import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Image Carousel */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${images[currentImage]})` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6"
          >
            Discover <span className="text-gold-500">Luxury</span> Beyond Imagination
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-2xl mx-auto font-light"
          >
            Curated accommodations for the discerning traveler
          </motion.p>

          {/* Search Form */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden"
          >
            <form className="grid grid-cols-1 md:grid-cols-4 divide-x divide-gray-200/50">
              <div className="p-4 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Destination</label>
                <input
                  type="text"
                  placeholder="Where to?"
                  className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-gold-500 bg-transparent text-gray-800"
                />
              </div>
              <div className="p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Dates</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-gold-500 bg-transparent text-gray-800"
                />
              </div>
              <div className="p-0">
                <button
                  type="submit"
                  className="w-full h-full bg-gray-900 hover:bg-gray-800 text-white font-medium flex items-center justify-center transition-colors"
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    Search
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-3 h-3 rounded-full transition-colors ${currentImage === index ? 'bg-white' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-sm mb-1">Scroll</span>
          <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </motion.div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce { animation: bounce 2s infinite; }
      `}</style>
    </section>
  );
};