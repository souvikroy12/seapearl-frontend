import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Wifi, Users, Maximize } from "lucide-react";
import axios from "axios";

// 🚀 GLOBAL LIGHTWEIGHT EXCHANGE MULTIPLIER CONFIG MAP DEFINITION
const CURRENCY_MAP = {
  INR: { symbol: "₹", rate: 1, locale: "en-IN" },
  USD: { symbol: "$", rate: 84, locale: "en-US" },
  EUR: { symbol: "€", rate: 90, locale: "en-IE" },
  GBP: { symbol: "£", rate: 108, locale: "en-GB" }
};

// 🚀 HYBRID DATA CONFIG: Locked Premium Stays with High-End Mountain & Coastal Asset Overlays
const STYLISH_ROOMS_METADATA = [
  {
    searchQuery: "Goa Luxury Resort",
    redirectQuery: "Goa",
    defaultName: "SeaPearl Ocean Sanctuary",
    staticLocation: "Goa, India",
    image: "/oc.jpg",
    sq: "95 Sq.m",
    guests: "2-3 Guests",
    tag: "Most Popular",
    fallbackPrice: 32000
  },
  {
    searchQuery: "Ladakh Luxury Hotel",
    redirectQuery: "Ladakh",
    defaultName: "SeaPearl Zen Mountain Citadel",
    staticLocation: "Ladakh, India",
    image: "/ladhak.jpg",
    sq: "145 Sq.m",
    guests: "2-4 Guests",
    tag: "Luxury Escape",
    fallbackPrice: 48000
  },
  {
    searchQuery: "Munnar Luxury Resort",
    redirectQuery: "Munnar",
    defaultName: "SeaPearl Mountain Pavilion",
    staticLocation: "Munnar, India",
    image: "/munnar.jpg",
    sq: "120 Sq.m",
    guests: "2 Guests",
    tag: "Exclusive",
    fallbackPrice: 28000
  }
];

const Rooms = () => {
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Localized Currency Active Context State
  const [activeCurrency, setActiveCurrency] = useState(() => {
    return localStorage.getItem("seapearl_currency") || "INR";
  });

  // ================= HYBRID ANTI-CRASH SEQUENTIAL CACHED PIPELINE =================
  useEffect(() => {
    let isMounted = true;

    const fetchPureDynamicLuxury = async () => {
      try {
        setLoading(true);

        // CACHE INTERCEPTOR: Intercept request pipeline using localized session memory banks
        const cachedRoomsData = sessionStorage.getItem("seapearl_cached_accommodations");
        if (cachedRoomsData) {
          const parsedData = JSON.parse(cachedRoomsData);

          // 🚀 FIXED: Dynamic Local Asset Sync Matrix
          // Maps the fresh localized public asset images over the cache block to break layout freezes instantly
          const synchronizedPayload = parsedData.map((room, idx) => ({
            ...room,
            image: STYLISH_ROOMS_METADATA[idx]?.image || room.image
          }));

          if (isMounted) {
            setRoomData(synchronizedPayload);
            setLoading(false);
          }
          return;
        }

        const finalPayload = [];

        // SEQUENTIAL LOOP: Requests fire sequentially to prevent rate limits and ensure maximum payload stability
        for (let i = 0; i < STYLISH_ROOMS_METADATA.length; i++) {
          const target = STYLISH_ROOMS_METADATA[i];
          let apiSuccess = false;

          try {
          const destRes = await axios.get(`https://seapearl-backend-1.onrender.com/api/hotels/search-destination?name=${encodeURIComponent(target.searchQuery)}`);
            if (destRes.data && destRes.data.length > 0) {
              const { dest_id, dest_type } = destRes.data[0];

              const response = await axios.get(`https://seapearl-backend-1.onrender.com/api/hotels/list`, {
                params: { dest_id, dest_type, sort_by: "price" }
              });

              const rawHotels = response.data.hotels || response.data || [];

              if (Array.isArray(rawHotels) && rawHotels.length > 0) {
                const liveHotel = rawHotels[rawHotels.length - 1];

                const rawApiPrice = liveHotel.priceBreakdown?.grossAmount?.value ||
                  liveHotel.property?.priceBreakdown?.grossAmount?.value ||
                  liveHotel.price || 0;

                finalPayload.push({
                  id: liveHotel.hotel_id || liveHotel.id || `live-lux-${i}`,
                  name: target.defaultName,
                  location: target.staticLocation,
                  price: Number(rawApiPrice) || target.fallbackPrice,
                  image: target.image,
                  sq: target.sq,
                  guests: target.guests,
                  tag: target.tag,
                  redirectQuery: target.redirectQuery
                });
                apiSuccess = true;
              }
            }
          } catch (innerErr) {
            // Safe silent handler boundary
          }

          if (!apiSuccess) {
            finalPayload.push({
              id: `fallback-lux-${i}`,
              name: target.defaultName,
              location: target.staticLocation,
              price: target.fallbackPrice,
              image: target.image,
              sq: target.sq,
              guests: target.guests,
              tag: target.tag,
              redirectQuery: target.redirectQuery
            });
          }
        }

        if (isMounted) {
          setRoomData(finalPayload);
          sessionStorage.setItem("seapearl_cached_accommodations", JSON.stringify(finalPayload));
        }
      } catch (err) {
        console.error("Pure API pipeline failure:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPureDynamicLuxury();
    return () => { isMounted = false; };
  }, []);

  // ================= SYNC REFRESH LISTENER FOR HEADER SWITCH =================
  useEffect(() => {
    const handleCurrencySwitch = () => {
      const nextCurrency = localStorage.getItem("seapearl_currency") || "INR";
      setActiveCurrency(nextCurrency);
    };
    window.addEventListener("storage", handleCurrencySwitch);
    window.addEventListener("currencyUpdated", handleCurrencySwitch);
    return () => {
      window.removeEventListener("storage", handleCurrencySwitch);
      window.removeEventListener("currencyUpdated", handleCurrencySwitch);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  if (loading) return null;

  return (
    <section className="bg-[#0A0A0A] py-32 px-6 md:px-12 lg:px-24 overflow-hidden border-b border-white/5">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-6">
          <motion.div className="max-w-4xl" variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-12 bg-[#C6A675]"></span>
              <p className="text-[#C6A675] tracking-[5px] uppercase text-[10px] font-black">Accommodations</p>
            </div>
            <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif leading-tight tracking-tight">
              Quiet Luxury & <span className="italic text-[#C6A675]">Sublime Comfort</span>
            </h2>
          </motion.div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {roomData.map((room) => (
            <motion.div key={room.id} className="group" variants={itemVariants}>

              {/* Image Container */}
              <div className="relative overflow-hidden aspect-[4/5] w-full mb-8 rounded-xl shadow-2xl border border-white/5">
                {/* Badge */}
                <div className="absolute top-6 left-6 z-20 bg-[#C6A675] text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-sm">
                  {room.tag}
                </div>

                <img
                  src={room.image}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                  alt={room.name}
                />

                {/* Gradient Shading Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
              </div>

              {/* Content Details */}
              <div className="px-2 space-y-4">

                <h3 className="text-white text-2xl font-serif tracking-tight group-hover:text-[#C6A675] transition-colors duration-500 line-clamp-1">
                  {room.name}
                </h3>

                <p className="text-white/40 text-[11px] uppercase tracking-wider font-light line-clamp-1">
                  {room.location}
                </p>

                {/* Icons Feature Bar */}
                <div className="flex items-center gap-6 text-white/40 border-b border-white/5 pb-6 pt-2">
                  <div className="flex items-center gap-2">
                    <Maximize size={13} className="text-[#C6A675]" />
                    <span className="text-[10px] font-medium tracking-widest uppercase">{room.sq}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={13} className="text-[#C6A675]" />
                    <span className="text-[10px] font-medium tracking-widest uppercase">{room.guests}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi size={13} className="text-[#C6A675]" />
                    <span className="text-[10px] font-medium tracking-widest uppercase">Inbound</span>
                  </div>
                </div>

                {/* Secure Pipeline Click Handler Route */}
                <button
                  onClick={() => navigate(`/search?query=${encodeURIComponent(room.redirectQuery)}`)}
                  className="w-full relative overflow-hidden group/btn border border-white/10 py-5 text-[10px] font-bold uppercase tracking-[4px] text-white transition-all duration-500 hover:border-[#C6A675] bg-transparent outline-none cursor-pointer rounded-lg"
                >
                  <span className="relative z-10 group-hover/btn:text-black transition-colors duration-500">Examine Details</span>
                  <div className="absolute inset-0 bg-[#C6A675] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Rooms;