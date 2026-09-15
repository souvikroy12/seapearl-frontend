import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";

// --- FULL CURATED DATASET (100% Uniform "City, India" Format) ---
const plannerData = {
  Historical: [
    { id: 11, searchQuery: "Udaipur", name: "SeaPearl Fort Heritage", location: "Udaipur, India", dist: "10 KM FROM LAKE PICHOLA", image: "/udaipur.jpg" },
    { id: 12, searchQuery: "Hampi", name: "SeaPearl Temple Villa", location: "Hampi, India", dist: "2 KM FROM RUINS CENTER", image: "/hampi.jpg" },
    { id: 13, searchQuery: "Mysore", name: "SeaPearl Colonial Stay", location: "Mysore, India", dist: "5 KM FROM CITY CENTER", image: "/mysore.jpg" },
    { id: 14, searchQuery: "Jaipur", name: "SeaPearl Palace Grounds", location: "Jaipur, India", dist: "12 KM FROM AMER FORT", image: "/jaipur.jpg" },
  ],
  Tranquil: [
    { id: 21, searchQuery: "Rishikesh", name: "SeaPearl Mountain Spa", location: "Rishikesh, India", dist: "45 KM FROM DEHRADUN", image: "/rishikesh.jpg" },
    { id: 22, searchQuery: "Munnar", name: "SeaPearl Zen Gardens", location: "Munnar, India", dist: "15 KM FROM TEA ESTATES", image: "/munnar.jpg" },
    { id: 23, searchQuery: "Jaisalmer", name: "SeaPearl Desert Retreat", location: "Jaisalmer, India", dist: "15 KM FROM SAND DUNES", image: "/jaisle.jpg" },
    { id: 24, searchQuery: "Wayanad", name: "SeaPearl Forest Cabin", location: "Wayanad, India", dist: "8 KM FROM SOOCHIPARA FALLS", image: "/wayand.jpg" },
  ],
  Romantic: [
    { id: 31, searchQuery: "Andaman", name: "SeaPearl Overwater Villa", location: "Andaman, India", dist: "DIRECT BEACH ACCESS", image: "/andaman.jpg" },
    { id: 32, searchQuery: "Shimla", name: "SeaPearl Snow View", location: "Shimla, India", dist: "1 KM FROM MALL ROAD", image: "/shimla.jpg" },
    { id: 33, searchQuery: "Goa", name: "SeaPearl Sunset Cliffs", location: "Goa, India", dist: "CLIFFSIDE LUXURY RESORT", image: "/goa.jpg" },
    { id: 34, searchQuery: "Kumarakom", name: "SeaPearl Backwater Lagoon", location: "Kumarakom, India", dist: "PRIVATE LAKEVIEW POOL", image: "/kumrakom.jpg" },
  ],
};

const vibeTabs = [
  { id: "Historical", label: "Heritage Stays" },
  { id: "Tranquil", label: "Tranquil Retreats" },
  { id: "Romantic", label: "Romantic Getaways" },
];

const VibePlanner = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Historical");

  // Redirects user straight to active search query state pipelines inside India bounds
  const handleVibeClick = (item) => {
    navigate(`/search?query=${encodeURIComponent(item.searchQuery)}&vibe=${activeTab}`);
  };

  return (
    <section className="bg-black py-32 px-4 md:px-10 lg:px-20 border-b border-white/5">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <p className="text-[#C6A675] tracking-[5px] uppercase text-[10px] font-bold mb-4">Discovery</p>
          <h2 className="text-white text-4xl md:text-5xl font-serif mb-4">Luxury Vibe Planner</h2>
          <p className="text-white/40 text-sm font-light italic max-w-xl mx-auto">
            Pick a vibe and explore our curated destinations across India
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center items-center gap-3 mb-20 overflow-x-auto no-scrollbar pb-4">
          {vibeTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-3.5 text-[10px] font-bold uppercase tracking-[3px] rounded-full border transition-all duration-500 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id 
                  ? "bg-[#C6A675] text-black border-[#C6A675]" 
                  : "text-white/30 border-white/10 hover:text-white bg-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Grid - Force 4 images in a row on Desktop */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap lg:flex-nowrap justify-center gap-5 lg:gap-6"
            >
              {plannerData[activeTab].map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => handleVibeClick(item)}
                  className="group cursor-pointer w-full sm:w-[calc(48%-10px)] lg:w-1/4"
                >
                  {/* Image Card */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-5">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                  </div>

                  {/* Info */}
                  <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-[#C6A675] text-[10px] font-bold tracking-[2px] uppercase">
                      <MapPin size={10} />
                      {item.location}
                    </div>
                    <h4 className="text-white text-lg font-serif group-hover:text-[#C6A675] transition-colors duration-500 truncate px-2">
                      {item.name}
                    </h4>
                    <p className="text-white/30 text-[8px] font-medium tracking-[1.5px] uppercase">
                      {item.dist}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default VibePlanner;