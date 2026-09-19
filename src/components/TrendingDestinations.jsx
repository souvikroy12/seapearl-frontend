import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

// --- FULL CURATED DATASET (100% Locked to Premium Uniform Indian Hotspots) ---
const destinationsData = [
  { 
    id: 1, 
    name: "SeaPearl Havelock Island", 
    searchQuery: "Andaman",
    image: "/havlock isl.jpg", 
    description: "Remote Luxury Stays, India", 
    featured: true 
  },
  { 
    id: 2, 
    name: "SeaPearl Backwaters", 
    searchQuery: "Alleppey",
    image: "/backwter.jpg", 
    description: "Exclusive Lagoons, India", 
    featured: true 
  },
  { 
    id: 3, 
    name: "SeaPearl Wilderness Lodge", 
    searchQuery: "Ranthambore",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200&auto=format&fit=crop", 
    description: "Authentic Wild Stays, India", 
    featured: false 
  },
  { 
    id: 4, 
    name: "SeaPearl Alpine Citadel", 
    searchQuery: "Ladakh",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop", 
    description: "High-Altitude Luxury, India", 
    featured: false 
  },
  { 
    id: 5, 
    name: "SeaPearl Desert Dunes", 
    searchQuery: "Jaisalmer",
    image: "/desert.jpg", 
    description: "Nomadic Grandeur, India", 
    featured: false 
  },
];

const TrendingDestinations = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="bg-[#0A0A0A] py-32 px-6 md:px-12 lg:px-24 border-b border-white/5">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div className="max-w-xl" variants={itemVariants}>
            <p className="text-[#C6A675] tracking-[5px] uppercase text-[10px] font-bold mb-3">Trending Stays</p>
            <h2 className="text-white text-4xl md:text-5xl font-serif">
              A World of <span className="italic text-[#C6A675]">Sublime Stays</span>
            </h2>
          </motion.div>
        </div>

        {/* Bento Grid Layer Definition */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 min-h-[600px]">
          {destinationsData.map((dest) => (
            <motion.div 
              key={dest.id} 
              variants={itemVariants}
              onClick={() => navigate(`/search?query=${encodeURIComponent(dest.searchQuery)}`)}
              className={`relative overflow-hidden group cursor-pointer aspect-square bg-[#1A1A1A] rounded-xl border border-white/5 ${
                dest.featured ? "lg:col-span-3" : "lg:col-span-2"
              }`}
            >
              {/* Image with fallbacks */}
              <img 
                src={dest.image} 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
                alt={dest.name}
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="absolute bottom-6 left-6 text-white z-10 p-2 border-l-2 border-[#C6A675] group-hover:border-white transition-colors duration-500">
                <div className="flex items-center gap-2 mb-1.5">
                  <MapPin size={10} className="text-[#C6A675]" />
                  <p className="text-[9px] uppercase tracking-[2px] text-white/70 font-bold">{dest.description}</p>
                </div>
                <h3 className="text-xl md:text-2xl font-serif tracking-tight">{dest.name}</h3>
              </div>

              {/* Luxury Detail Line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#C6A675] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TrendingDestinations;