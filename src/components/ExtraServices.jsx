import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const extraServices = [
  {
    id: 1,
    title: "Infinity Pool & Wellness", // 🚀 FIXED: Replaced Conference Hall with Ultra-Luxury Pool Vibe
    desc: "Immerse yourself in pure serenity with our temperature-controlled infinity pools and spa.",
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80", // Premium Pool Asset URL
    searchFilter: "pool" // Mapped safely to dynamic database tags
  },
  {
    id: 2,
    title: "Bar & Restaurant",
    desc: "Experience culinary excellence with our signature cocktails and world-class dining.",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
    searchFilter: "restaurant" 
  },
  {
    id: 3,
    title: "Direct Beach Access",
    desc: "Step right from your suite onto the pristine white sands of the private coast.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    searchFilter: "beach" 
  },
];

const ExtraServices = () => {
  const navigate = useNavigate();

  // FIXED SYSTEM ACTION: Triggers highly context-filtered search layout states based on selection rules
  const handleServiceRedirect = (item) => {
    navigate(`/search?query=Luxury&facility=${encodeURIComponent(item.searchFilter)}`);
  };

  return (
    <section className="bg-[#0A0A0A] py-24 px-4 md:px-10 overflow-hidden border-b border-white/5">
      {/* 1. HEADER ANIMATION ON SCROLL */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-[#C6A675] tracking-[4px] uppercase text-[10px] font-bold mb-3">Excellence</p>
        <h2 className="text-white text-3xl md:text-5xl font-serif leading-tight tracking-tight">
          Your Every Hotel Need, Met with <br /> Our Diverse Services
        </h2>
      </motion.div>

      {/* 2. GRID ANIMATION ON SCROLL */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
      >
        {extraServices.map((item) => (
          <motion.div
            key={item.id}
            initial="initial"
            whileHover="hover"
            onClick={() => handleServiceRedirect(item)}
            className="relative h-[600px] w-full overflow-hidden cursor-pointer rounded-xl border border-white/5 shadow-2xl"
          >
            {/* Image Zoom Animation */}
            <motion.img
              src={item.image}
              alt={item.title}
              variants={{
                initial: { scale: 1 },
                hover: { scale: 1.05 }
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark Overlay */}
            <motion.div 
              className="absolute inset-0 flex flex-col justify-end p-10 text-center z-10"
              variants={{
                initial: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
                hover: { backgroundColor: "rgba(0, 0, 0, 0.85)" }
              }}
              transition={{ duration: 0.4 }}
            >
              {/* Content Reveal on Hover */}
              <div className="overflow-hidden space-y-2">
                <motion.h3
                  variants={{
                    initial: { y: 10, opacity: 0.9 },
                    hover: { y: 0, opacity: 1 }
                  }}
                  transition={{ duration: 0.5 }}
                  className="text-white text-3xl font-serif tracking-tight group-hover:text-[#C6A675] transition-colors"
                >
                  {item.title}
                </motion.h3>

                <motion.p
                  variants={{
                    initial: { y: 60, opacity: 0 },
                    hover: { y: 0, opacity: 1 }
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-gray-400 text-sm leading-relaxed font-light"
                >
                  {item.desc}
                </motion.p>
                
                <motion.div
                  variants={{
                    initial: { width: 0 },
                    hover: { width: "60px" }
                  }}
                  className="h-[1px] bg-[#C6A675] mx-auto mt-6"
                />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ExtraServices;