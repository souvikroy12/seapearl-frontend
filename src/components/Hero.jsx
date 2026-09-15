import React, { useState, useEffect, useRef } from "react";
import { Hotel, Calendar, Users, MapPin, Search, Star, Plus, Minus, ChevronDown, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-custom.css";

// --- AI ChatBot Import ---
import AIChatBot from "./AIChatBot"; 

const images = [
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1920"
];

const Hero = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentImage, setCurrentImage] = useState(0);
  const [error, setError] = useState("");

  const [destination, setDestination] = useState("");
  const [showDestPopup, setShowDestPopup] = useState(false);
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const destRef = useRef(null);
  const guestRef = useRef(null);

  const trendingDestinations = [
    { city: "Kolkata", country: "India" },
    { city: "New Delhi", country: "India" },
    { city: "Varanasi", country: "India" },
    { city: "Darjeeling", country: "India" },
    { city: "Mumbai", country: "India" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (destRef.current && !destRef.current.contains(event.target)) setShowDestPopup(false);
      if (guestRef.current && !guestRef.current.contains(event.target)) setShowGuestPopup(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    let missing = [];
    if (!destination.trim()) missing.push("Destination");
    if (!startDate || !endDate) missing.push("Check-in/Out Dates");
    if (missing.length > 0) {
      setError(`Please select: ${missing.join(", ")}`);
      setTimeout(() => setError(""), 3000);
      return;
    }
    const checkin = startDate.toISOString().split('T')[0];
    const checkout = endDate.toISOString().split('T')[0];
    navigate(`/search?query=${encodeURIComponent(destination.trim())}&checkin=${checkin}&checkout=${checkout}`);
  };

  const updateCount = (type, operation) => {
    setGuests(prev => ({
      ...prev,
      [type]: operation === 'inc' ? prev[type] + 1 : Math.max(type === 'children' ? 0 : 1, prev[type] - 1)
    }));
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
  };

  return (
    <section className="relative min-h-[140vh] md:min-h-screen w-full flex flex-col items-center bg-black font-sans overflow-visible py-20">

      {/* BACKGROUND SLIDER */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black z-10"></div>
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Luxury"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2500ms] ${index === currentImage ? "opacity-60 scale-110" : "opacity-0 scale-100"}`}
          />
        ))}
      </div>

      {/* 1. HERO TEXT SECTION */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="relative z-20 text-center px-4 mb-10 mt-10">
      </motion.div>

      {/* 2. AI SEARCH BAR (Top Component) */}
      <div className="relative z-[60] w-full mb-12">
         <AIChatBot />
      </div>

      {/* 3. MANUAL SEARCH SYSTEM (Bottom Component) */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="relative w-full max-w-7xl px-6 z-50">
        <div className="mb-2 ml-1">
          <span className="text-[#C6A675] text-[10px] font-bold uppercase tracking-[3px] bg-black/60 px-4 py-2 backdrop-blur-md rounded-t-sm border-t border-x border-white/10 inline-flex items-center gap-2">
            <Hotel size={12} /> Or search manually
          </span>
        </div>

        <div className="bg-black/40 backdrop-blur-3xl border border-white/10 flex flex-col lg:flex-row items-stretch rounded-b-sm rounded-tr-sm shadow-2xl relative">
          <div className="flex flex-col lg:flex-row flex-grow items-stretch relative">
            {/* Destination */}
            <div className="flex-[1.5] px-6 py-5 lg:border-r border-white/10 relative group hover:bg-white/5 transition-all" ref={destRef}>
              <label className="text-[#C6A675] text-[10px] font-bold uppercase tracking-[2px] flex items-center gap-2 mb-2"><MapPin size={12} /> Destination</label>
              <input type="text" value={destination} onFocus={() => setShowDestPopup(true)} onChange={(e) => setDestination(e.target.value)} placeholder="Where are you going?" className="bg-transparent text-white text-sm font-light w-full outline-none placeholder:text-white/20" />
              <AnimatePresence>
                {showDestPopup && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-[105%] left-0 w-full md:w-[350px] bg-[#0F0F0F] border border-white/10 rounded-lg shadow-2xl py-4 z-[999]">
                    {trendingDestinations.map((dest, i) => (
                      <div key={i} onClick={() => { setDestination(dest.city); setShowDestPopup(false); }} className="flex items-center gap-4 px-6 py-3 hover:bg-[#C6A675]/10 cursor-pointer transition-all">
                        <MapPin size={14} className="text-[#C6A675]" />
                        <div><p className="text-white text-sm">{dest.city}</p></div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* DatePicker */}
            <div className="flex-1 px-6 py-5 lg:border-r border-white/10 hover:bg-white/5 transition-all">
              <label className="text-[#C6A675] text-[10px] font-bold uppercase tracking-[2px] flex items-center gap-2 mb-2"><Calendar size={12} /> Dates</label>
              <div className="flex items-center gap-2">
                <DatePicker selected={startDate} onChange={(d) => setStartDate(d)} selectsStart startDate={startDate} endDate={endDate} minDate={new Date()} placeholderText="Check-in" className="bg-transparent text-white text-xs outline-none w-full" />
                <DatePicker selected={endDate} onChange={(d) => setEndDate(d)} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} placeholderText="Check-out" className="bg-transparent text-white text-xs outline-none w-full" />
              </div>
            </div>

            {/* Guests */}
            <div className="flex-1 px-6 py-5 hover:bg-white/5 transition-all cursor-pointer relative" ref={guestRef}>
              <div onClick={() => setShowGuestPopup(!showGuestPopup)}>
                <label className="text-[#C6A675] text-[10px] font-bold uppercase tracking-[2px] flex items-center gap-2 mb-2"><Users size={12} /> Guests</label>
                <div className="text-white text-sm font-light flex items-center justify-between">{guests.adults} Adults, {guests.rooms} Room <ChevronDown size={14} className="text-[#C6A675]" /></div>
              </div>
              <AnimatePresence>
                {showGuestPopup && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-[105%] right-0 w-64 bg-[#0F0F0F] border border-white/10 rounded-lg p-4 z-[999]">
                    {['adults', 'rooms'].map((type) => (
                      <div key={type} className="flex justify-between items-center mb-4 last:mb-0">
                        <span className="text-white text-[10px] uppercase font-bold">{type}</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateCount(type, 'dec')} className="w-6 h-6 border border-white/10 text-[#C6A675] rounded-full">-</button>
                          <span className="text-white text-xs">{guests[type]}</span>
                          <button onClick={() => updateCount(type, 'inc')} className="w-6 h-6 border border-white/10 text-[#C6A675] rounded-full">+</button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button onClick={handleSearch} className="bg-[#C6A675] text-black font-black text-[11px] tracking-[4px] px-10 py-6 lg:py-0 hover:bg-white transition-all uppercase flex items-center justify-center gap-2">
            <Search size={18} /> Search
          </button>
        </div>
      </motion.div>

      {/* Error Popup */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-red-900 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl border border-red-500/50">
            <AlertCircle size={16} /> <span className="text-[10px] uppercase font-bold tracking-widest">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;