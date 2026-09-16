import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const showcaseContent = [
  {
    tagline: "LUXURY STAY",
    title: "Experience Unmatched \n Peace and Modern Comfort",
    description: "Experience the perfect blend of comfort and sophistication. Our premium stays offer serene ambiance & modern luxury.",
    searchQuery: "Mumbai"
  },
  {
    tagline: "ELITE ADVENTURE",
    title: "Discover The Wild \n In Absolute Luxury",
    description: "Explore the untouched beauty of nature without compromising on the world-class comfort you deserve.",
    searchQuery: "Kerala"
  },
  {
    tagline: "SERENE ESCAPE",
    title: "Your Private Oasis \n By The Blue Ocean",
    description: "Wake up to the sound of waves and enjoy a sanctuary designed for ultimate peace and rejuvenation.",
    searchQuery: "Goa"
  }
];

const Showcase = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const videoRef = useRef(null);

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6;
      videoRef.current.play().catch(() => {
        // Autoplay policy silent bypass
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % showcaseContent.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleExploreMore = () => {
    const targetQuery = showcaseContent[index].searchQuery;
    navigate(`/search?query=${encodeURIComponent(targetQuery)}`);
  };

  return (
    <section className="bg-[#050505] py-32 px-6 md:px-12 lg:px-20 overflow-hidden relative">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-24">
        
        {/* 1. LEFT TEXT CONTENT */}
        <div className="w-full lg:w-[40%] flex flex-col items-start min-h-[450px] lg:min-h-[500px] justify-start pt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-6"
            >
              <p className="text-[#C6A675] tracking-[6px] uppercase text-[11px] font-bold">
                {showcaseContent[index].tagline}
              </p>
              
              <h2 className="text-white text-5xl md:text-6xl lg:text-6xl font-serif leading-[1.1] tracking-tighter whitespace-pre-line min-h-[140px] md:min-h-[160px]">
                {showcaseContent[index].title}
              </h2>
              
              <div className="w-20 h-[1px] bg-[#C6A675]/40" />
              
              <p className="text-gray-400 text-base font-light leading-relaxed max-w-md min-h-[80px]">
                {showcaseContent[index].description}
              </p>

              <button 
                onClick={handleExploreMore}
                className="bg-[#C6A675] text-black px-12 py-4 mt-4 text-[11px] font-bold uppercase tracking-[3px] hover:bg-white transition-all duration-500 border-none outline-none cursor-pointer"
              >
                Explore More
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 2. RIGHT VIDEO FRAME */}
        <motion.div 
          className="w-full lg:w-[55%] relative group pt-10"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="absolute -inset-4 bg-[#C6A675]/5 rounded-3xl -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl h-[450px] md:h-[450px] w-full bg-[#0A0A0A]">
            <video 
              ref={videoRef}
              src="/videos/luxury.mp4" 
              onLoadedMetadata={handleVideoLoaded}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              autoPlay 
              muted 
              loop 
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Showcase;