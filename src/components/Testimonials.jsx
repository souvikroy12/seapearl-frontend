import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "August Reid",
    role: "Guest",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Exceptional resort! From the exquisite dining to the serene spa and the captivating infinity pool, every moment was pure bliss. Impeccable service and breathtaking views – a perfect escape!",
    stars: 5
  },
  {
    id: 2,
    name: "James Wilson",
    role: "Traveler",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "The attention to detail here is unmatched. The staff anticipates your every need before you even ask. The ocean view suites are worth every penny.",
    stars: 5
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    role: "Business Guest",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "Perfect for both business and leisure. The conference facilities are top-notch, and the 24/7 room service made my late-night work sessions much easier.",
    stars: 5
  },
  {
    id: 4,
    name: "Michael Chen",
    role: "Family Guest",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    text: "Our kids loved the pool and the activities. It's rare to find a place that feels so luxurious yet so welcoming to families. We'll definitely be back.",
    stars: 5
  },
  {
    id: 5,
    name: "Elena Rodriguez",
    role: "Luxury Explorer",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    text: "I've stayed in many 5-star hotels, but SeaPearl has a soul. The architectural design combined with the natural beauty of the coast is stunning.",
    stars: 5
  }
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#0A0A0A] py-24 px-6 overflow-hidden relative">
      <motion.div 
        className="max-w-4xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        
        {/* Background Quote Icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 24 24" fill="#C6A675">
            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017C10.4647 13 10.017 12.5523 10.017 12V5C10.017 4.44772 10.4647 4 11.017 4H19.017C20.6739 4 22.017 5.34315 22.017 7V15C22.017 18.866 18.883 22 15.017 22H14.017V21ZM5.017 21L5.017 18C5.017 16.8954 5.91243 16 7.017 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.017C5.46472 8 5.017 8.44772 5.017 9V12C5.017 12.5523 4.56929 13 4.017 13H2.017C1.46472 13 1.017 12.5523 1.017 12V5C1.017 4.44772 1.46472 4 2.017 4H10.017C11.6739 4 13.017 5.34315 13.017 7V15C13.017 18.866 9.88301 22 6.017 22H5.017V21Z" />
          </svg>
        </div>

        {/* Yahan 'min-h-[450px]' add kiya hai. 
          Isse container ka size fix rahega aur site hilegi nahi. 
        */}
        <div className="min-h-[450px] md:min-h-[400px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonials[index].id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="text-center"
            >
              {/* User Image */}
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-[#C6A675] p-1">
                  <img 
                    src={testimonials[index].image} 
                    alt={testimonials[index].name}
                    className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>

              <h4 className="text-white text-lg font-serif mb-1 italic tracking-wide">
                {testimonials[index].name}
              </h4>
              <p className="text-[#C6A675] text-[10px] uppercase tracking-[3px] font-bold mb-8">
                {testimonials[index].role}
              </p>

              {/* Text area is the main cause of jumping, kept inside the min-h flex box */}
              <blockquote className="text-gray-300 text-lg md:text-2xl font-serif italic leading-relaxed mb-8 px-4 md:px-10">
                "{testimonials[index].text}"
              </blockquote>

              <div className="flex justify-center gap-1">
                {[...Array(testimonials[index].stars)].map((_, i) => (
                  <Star key={i} size={14} fill="#C6A675" color="#C6A675" />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination Dots - Section ke niche move kiya taaki jump na kare */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-[2px] transition-all duration-500 ${
                index === i ? "w-8 bg-[#C6A675]" : "w-4 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Testimonials;