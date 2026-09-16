import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// Swiper components and styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Dynamic Curated Blog Data Matrix (100% Context Mapped Luxury Assets)
const updates = [
  {
    id: 1,
    tag: "RESORT",
    date: "12 May 2026",
    title: "A Journey into Our Luxurious Resort",
    image: "/resort.jpg", //  FIXED: Pristine Luxury Villa Resort Overlooking Ocean
    searchPath: "/search?query=Luxury" 
  },
  {
    id: 2,
    tag: "DINING",
    date: "10 May 2026",
    title: "Exquisite Dining Experiences at Our Resort",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", //  FIXED: Michelin Star Elite Fine Dining Setup
    searchPath: "/search?query=Goa&facility=restaurant" 
  },
  {
    id: 3,
    tag: "SPA",
    date: "08 May 2026",
    title: "Rejuvenation Secrets from Our Spa",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80", // Premium Wellness Spa Treatment
    searchPath: "/search?query=Kerala&facility=pool" 
  },
  {
    id: 4,
    tag: "ROOMS",
    date: "05 May 2026",
    title: "Unveiling Our New Ocean Front Suites",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80", //  FIXED: High-End Ocean Front Master Suite Bedroom
    searchPath: "/search?query=Mumbai" 
  }
];

const LatestUpdates = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#050505] py-28 px-6 md:px-12 lg:px-24 relative overflow-hidden border-b border-white/5">
      
      {/* Header Section */}
      <motion.div 
        className="max-w-7xl mx-auto text-center mb-16 space-y-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-[#C6A675] tracking-[5px] uppercase text-[10px] font-bold">News & Events</p>
        <h2 className="text-white text-4xl md:text-5xl font-serif leading-tight">
          Explore Our Latest Updates
        </h2>
      </motion.div>

      {/* Swiper Slider Container */}
      <div className="max-w-7xl mx-auto relative group px-10">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          autoplay={{ delay: 4000 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="mySwiper"
        >
          {updates.map((item) => (
            <SwiperSlide key={item.id}>
              <div 
                onClick={() => navigate(item.searchPath)}
                className="flex flex-col gap-6 cursor-pointer group/card select-none"
              >
                {/* Image Wrapper */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/5 shadow-xl">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover grayscale-[20%] group-hover/card:grayscale-0 group-hover/card:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover/card:bg-transparent transition-all" />
                </div>

                {/* Info Text */}
                <div className="space-y-3 text-center">
                  <div className="flex items-center justify-center gap-3 text-[10px] text-[#C6A675] font-bold uppercase tracking-widest">
                    <span>{item.tag}</span>
                    <span className="w-1 h-1 bg-[#C6A675]/40 rounded-full" />
                    <span className="text-white/40">{item.date}</span>
                  </div>
                  <h3 className="text-white text-xl font-serif leading-snug px-4 group-hover/card:text-[#C6A675] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* --- CUSTOM NAVIGATION ARROWS --- */}
        <button className="swiper-button-prev-custom absolute top-1/2 -left-4 -translate-y-1/2 z-20 text-white/30 hover:text-[#C6A675] transition-all text-3xl bg-transparent border-none outline-none cursor-pointer select-none">
          &#8592; 
        </button>
        <button className="swiper-button-next-custom absolute top-1/2 -right-4 -translate-y-1/2 z-20 text-white/30 hover:text-[#C6A675] transition-all text-3xl bg-transparent border-none outline-none cursor-pointer select-none">
          &#8594; 
        </button>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-10 h-1/2 w-[1px] bg-white/5" />
    </section>
  );
};

export default LatestUpdates;