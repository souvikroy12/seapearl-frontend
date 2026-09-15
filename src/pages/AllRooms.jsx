import React, { useState } from "react";
import { Filter, SlidersHorizontal, ChevronDown } from "lucide-react";
// Hum purane room cards reuse kar sakte hain ya yahan naya list design bana sakte hain

const AllRooms = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 border-b border-white/5 pb-10">
          <p className="text-[#C6A675] tracking-[5px] uppercase text-[10px] font-bold mb-3">Explore Our Stays</p>
          <h1 className="text-white text-5xl md:text-7xl font-serif">All Suites & <span className="italic text-[#C6A675]">Villas</span></h1>
        </div>

        {/* Professional Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 bg-white/5 p-4 backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-6 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {["All", "Suites", "Villas", "Ocean View", "Penthouse"].map((filter) => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`text-[10px] uppercase tracking-[2px] font-bold transition-all whitespace-nowrap ${
                  activeFilter === filter ? "text-[#C6A675]" : "text-white/40 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <button className="flex items-center gap-2 text-white/60 text-[10px] uppercase tracking-[2px] border border-white/10 px-4 py-2 hover:bg-white/5">
              <SlidersHorizontal size={14} /> Sort By <ChevronDown size={12} />
            </button>
          </div>
        </div>

        {/* Yahan aapke saare Rooms render honge */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           {/* Abhi ke liye aap wahi Rooms wala loop yahan bhi chala sakte hain 
               taaki ye khali na dikhe */}
           <p className="text-white/20 uppercase tracking-widest text-xs">More rooms loading...</p>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;