import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const galleryImages = [
  { 
    id: 1, 
    title: "Luxury Suite", 
    desc: "Experience the pinnacle of coastal elegance and comfort.",
    src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    bg: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600" 
  },
  { 
    id: 2, 
    title: "Infinity Pool", 
    desc: "Swim under the stars in our signature heated infinity pool.",
    src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    bg: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600" 
  },
  { 
    id: 3, 
    title: "Fine Dining", 
    desc: "World-class chefs serving authentic and fresh coastal flavors.",
    src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    bg: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600" 
  },
  { 
    id: 4, 
    title: "Ocean View", 
    desc: "Wake up to the serene sound of waves every single morning.",
    src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    bg: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600" 
  },
  { 
    id: 5, 
    title: "Spa Retreat", 
    desc: "Rejuvenate your soul with our exclusive signature therapies.",
    src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    bg: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600" 
  },
  { 
    id: 6, 
    title: "Safari Tour", 
    desc: "Explore the wild side with our curated private safari tours.",
    src: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
    bg: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600" 
  },
  { 
    id: 7, 
    title: "Coastal Yoga", 
    desc: "Find your inner peace with morning yoga sessions by the sea.",
    src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
    bg: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600" 
  },
];

const Gallery = () => {
  const [index, setIndex] = useState(0);

  const getPosition = (i) => {
    let diff = i - index;
    const len = galleryImages.length;
    if (diff < -3) diff += len;
    if (diff > 3) diff -= len;
    return diff;
  };

  const updateIndex = (newIndex) => {
    setIndex((newIndex + galleryImages.length) % galleryImages.length);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      
      {/* 1. DYNAMIC BACKGROUND (Video Style) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${index}`}
          initial={{ opacity: 0, y: 20, scale: 1.05 }}
          animate={{ opacity: 0.6, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <img src={galleryImages[index].bg} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        </motion.div>
      </AnimatePresence>

      {/* --- SCROLL ENTRANCE WRAPPER ADDED HERE --- */}
      <motion.div 
        className="relative z-10 w-full flex flex-col items-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }} // Har baar scroll par animate hoga
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        
        {/* 2. TEXT ANIMATION */}
        <div className="text-center mb-10 h-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${index}`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[#C6A675] tracking-[5px] text-[10px] uppercase font-bold mb-2">SeaPearl Discovery</p>
              <h2 className="text-white text-5xl md:text-8xl font-serif italic mb-3 tracking-tighter">
                {galleryImages[index].title}
              </h2>
              <p className="text-white/60 text-xs md:text-sm max-w-md mx-auto px-4 font-light leading-relaxed">
                {galleryImages[index].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3. 3D CIRCULAR STACK */}
        <div className="relative h-[380px] w-full flex items-center justify-center" style={{ perspective: "1200px" }}>
          {galleryImages.map((img, i) => {
            const pos = getPosition(i);
            const absPos = Math.abs(pos);
            const isCenter = pos === 0;

            return (
              <motion.div
                key={img.id}
                onClick={() => updateIndex(i)} 
                animate={{
                  x: pos * 280,
                  scale: 1 - absPos * 0.18,
                  z: isCenter ? 0 : -absPos * 200,
                  rotateY: pos * -20, 
                  opacity: absPos > 3 ? 0 : 1 - absPos * 0.3,
                  zIndex: 50 - absPos,
                }}
                whileHover={isCenter ? {} : { scale: 1 - absPos * 0.15, opacity: 1 }}
                transition={{ type: "spring", stiffness: 90, damping: 20 }}
                className="absolute w-[280px] md:w-[550px] h-[320px] md:h-[380px] rounded-lg cursor-pointer overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-white/5"
              >
                <img src={img.src} className="w-full h-full object-cover" alt="" />
                {!isCenter && <div className="absolute inset-0 bg-black/60 transition-opacity duration-500" />}
              </motion.div>
            );
          })}
        </div>

        {/* 4. NAVIGATION BUTTONS */}
        <div className="flex gap-10 mt-12">
          <button 
            onClick={() => updateIndex(index - 1)}
            className="group flex items-center gap-3 text-white/30 hover:text-[#C6A675] transition-all"
          >
            <ChevronLeft size={40} strokeWidth={1} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => updateIndex(index + 1)}
            className="group flex items-center gap-3 text-white/30 hover:text-[#C6A675] transition-all"
          >
            <ChevronRight size={40} strokeWidth={1} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Gallery;