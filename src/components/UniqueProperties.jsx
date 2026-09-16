import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CURRENCY_MAP = {
  INR: { symbol: "₹", rate: 1, locale: "en-IN" },
  USD: { symbol: "$", rate: 84, locale: "en-US" },
  EUR: { symbol: "€", rate: 90, locale: "en-IE" },
  GBP: { symbol: "£", rate: 108, locale: "en-GB" }
};

const TARGET_PROPERTIES = [
  {
    searchQuery: "ITC Royal Bengal",
    image: "/itc royal bengal kolkata.jpg",
    fallbackLocation: "Kolkata, India",
    type: "Luxury",
    stars: 5,
    fallbackRating: 9.4,
    fallbackReviews: 842
  },
  {
    searchQuery: "Taj Palace New Delhi",
    image: "/taj palace D.jpg",
    fallbackLocation: "New Delhi, India",
    type: "Premium",
    stars: 5,
    fallbackRating: 9.2,
    fallbackReviews: 654
  },
  {
    searchQuery: "The Taj Mahal Palace Mumbai",
    image: "/Mumbai-India-Taj-Mahal-Palace.jpg",
    fallbackLocation: "Mumbai, India",
    type: "Heritage",
    stars: 5,
    fallbackRating: 9.6,
    fallbackReviews: 1245
  },
  {
    searchQuery: "Taj Fisherman's Cove Resort",
    image: "/taj fisherman's.jpg",
    fallbackLocation: "Chennai, India",
    type: "Resort",
    stars: 5,
    fallbackRating: 9.1,
    fallbackReviews: 694
  }
];

const UniqueProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCurrency, setActiveCurrency] = useState(() => {
    return localStorage.getItem("seapearl_currency") || "INR";
  });

  // ================= ANTI-CRASH SEQUENTIAL CACHED API PIPELINE =================
  useEffect(() => {
    let isMounted = true;

    const fetchHybridProperties = async () => {
      try {
        setLoading(true);

        const cachedUniqueData = sessionStorage.getItem("seapearl_cached_unique_properties");
        if (cachedUniqueData) {
          if (isMounted) {
            setProperties(JSON.parse(cachedUniqueData));
            setLoading(false);
          }
          return;
        }

        const finalPayload = [];

        for (let i = 0; i < TARGET_PROPERTIES.length; i++) {
          const target = TARGET_PROPERTIES[i];
          let apiSuccess = false;

          try {
            const destRes = await axios.get(`https://seapearl-backend-1.onrender.com/api/hotels/search-destination?name=${encodeURIComponent(target.searchQuery)}`);
            // FIXED: searchRes replaced with destRes
            if (destRes.data && destRes.data.length > 0) {
              const { dest_id, dest_type } = destRes.data[0];

              const listRes = await axios.get(`https://seapearl-backend-1.onrender.com/api/hotels/list`, {
                params: { dest_id, dest_type, sort_by: "popularity" }
              });

              const hotelsList = listRes.data.hotels || listRes.data || [];

              if (hotelsList.length > 0) {
                const liveHotel = hotelsList[0];

                const rawApiPrice = liveHotel.priceBreakdown?.grossAmount?.value ||
                  liveHotel.property?.priceBreakdown?.grossAmount?.value ||
                  liveHotel.price || 0;

                const enrichedHotelObj = {
                  ...liveHotel,
                  id: liveHotel.hotel_id || liveHotel.id || `unique-${i}`,
                  hotel_id: liveHotel.hotel_id || liveHotel.id || `unique-${i}`,
                  image: target.image,
                  photoMainUrl: target.image,
                  name: target.searchQuery,
                  location: liveHotel.location || target.fallbackLocation,
                  price: Number(rawApiPrice) || (25000 + (i * 3000)),
                  reviewScore: liveHotel.reviewScore || liveHotel.rating || target.fallbackRating,
                  reviewCount: liveHotel.reviewCount || liveHotel.reviews || target.fallbackReviews
                };

                finalPayload.push({
                  id: liveHotel.hotel_id || liveHotel.id || `unique-${i}`,
                  name: target.searchQuery,
                  location: liveHotel.location || target.fallbackLocation,
                  type: target.type,
                  stars: target.stars,
                  rating: liveHotel.reviewScore || liveHotel.rating || target.fallbackRating,
                  reviews: liveHotel.reviewCount || liveHotel.reviews || target.fallbackReviews,
                  price: Number(rawApiPrice) || (25000 + (i * 3000)),
                  image: target.image,
                  rawHotelObj: enrichedHotelObj
                });
                apiSuccess = true;
              }
            }
          } catch (innerErr) {
            // Silent fallback boundary
          }

          if (!apiSuccess) {
            finalPayload.push({
              id: `fallback-${i}`,
              name: target.searchQuery,
              location: target.fallbackLocation,
              type: target.type,
              stars: target.stars,
              rating: target.fallbackRating,
              reviews: target.fallbackReviews,
              price: 25000 + (i * 4500),
              image: target.image,
              rawHotelObj: {
                id: `fallback-${i}`,
                hotel_id: `fallback-${i}`,
                name: target.searchQuery,
                price: 25000 + (i * 4500),
                location: target.fallbackLocation,
                image: target.image,
                photoMainUrl: target.image
              }
            });
          }
        }

        if (isMounted) {
          setProperties(finalPayload);
          sessionStorage.setItem("seapearl_cached_unique_properties", JSON.stringify(finalPayload));
        }

      } catch (err) {
        console.error("Critical Hybrid API failure:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHybridProperties();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const handleCurrencySwitch = () => {
      setActiveCurrency(localStorage.getItem("seapearl_currency") || "INR");
    };
    window.addEventListener("storage", handleCurrencySwitch);
    window.addEventListener("currencyUpdated", handleCurrencySwitch);
    return () => {
      window.removeEventListener("storage", handleCurrencySwitch);
      window.removeEventListener("currencyUpdated", handleCurrencySwitch);
    };
  }, []);

  const formatLocalizedPrice = (priceInINR) => {
    const currentMeta = CURRENCY_MAP[activeCurrency] || CURRENCY_MAP.INR;
    const convertedPrice = Math.round(priceInINR / currentMeta.rate);
    return `${currentMeta.symbol}${convertedPrice.toLocaleString(currentMeta.locale)}`;
  };

  if (loading) return null;

  return (
    <section className="bg-black py-24 px-6 md:px-12 lg:px-24 border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-white text-3xl md:text-4xl font-serif mb-3 tracking-tight">
            Stay at our top unique properties
          </h2>
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-[#C6A675]" />
            <p className="text-white/40 text-sm font-light tracking-wide italic">
              From castles and villas to boats and igloos, we have it all
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {properties.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -12 }}
              transition={{ duration: 0.5 }}
              className="group cursor-pointer bg-[#0A0A0A] border border-white/5 overflow-hidden rounded-xl shadow-2xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[#C6A675] text-[10px] font-black uppercase tracking-[2px]">{item.type}</span>
                    <h3 className="text-white text-lg font-bold leading-tight group-hover:text-[#C6A675] transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </div>
                  <div className="flex shrink-0">
                    {[...Array(item.stars)].map((_, i) => (
                      <Star key={i} size={10} className="fill-[#C6A675] text-[#C6A675]" />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <MapPin size={12} className="text-[#C6A675]" />
                  <span className="font-light line-clamp-1">{item.location}</span>
                </div>

                <div className="flex items-center gap-3 bg-white/[0.03] p-2 rounded-lg border border-white/5">
                  <div className="bg-[#1A3B70] text-white font-bold px-2 py-1 rounded text-xs shadow-lg">
                    {item.rating}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-[11px] font-bold tracking-wide">Exquisite</span>
                    <span className="text-white/30 text-[10px]">{item.reviews} reviews</span>
                  </div>
                </div>

                <div className="flex items-end justify-between border-t border-white/5 pt-4">
                  <div className="flex flex-col">
                    <span className="text-white/30 text-[9px] uppercase tracking-widest">Nightly</span>
                    <p className="text-white font-bold text-xl tracking-tight">{formatLocalizedPrice(item.price)}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/hotel/${item.id}`, { state: { hotelData: item.rawHotelObj } })}
                    className="text-[#C6A675] text-[10px] font-bold uppercase tracking-[2px] hover:text-white transition-colors border-none bg-transparent outline-none cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UniqueProperties;