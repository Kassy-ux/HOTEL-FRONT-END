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
      {/* Image Carousel with enhanced smooth transitions */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${images[currentImage]})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-fuchsia-800/40 to-violet-900/50"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content with luxurious purple/pink theme */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.span 
              className="text-lg font-light tracking-widest text-pink-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              STAYLUXE COLLECTION
            </motion.span>
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-pink-400"
            >
              Where Dreams Take Residence
            </motion.h1>

          </motion.div>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-2xl mx-auto font-light text-purple-100"
          >
            Experience the pinnacle of luxury with our hand-selected global retreats
          </motion.p>

          {/* Call to Action */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex gap-4 justify-center"
          >
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full font-medium hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl">
              Explore Properties
            </button>
            <button className="px-8 py-3 border border-pink-300 rounded-full font-medium hover:bg-white/10 transition-all duration-300">
              View Collections
            </button>
          </motion.div>
        </div>

        {/* Carousel Indicators - redesigned */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`relative w-12 h-1 rounded-full transition-all duration-300 ${currentImage === index ? 'bg-gradient-to-r from-pink-400 to-purple-500' : 'bg-white/30'}`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {currentImage === index && (
                <motion.span 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4.8, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Scroll Indicator - redesigned */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-pink-200"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center"
          >
            <span className="text-xs tracking-widest mb-1">EXPLORE MORE</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Glitter effect */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-pink-400 opacity-20"
            style={{
              width: Math.random() * 5 + 1 + 'px',
              height: Math.random() * 5 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </section>
  );
};