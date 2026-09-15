import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    id: 1,
    question: "What are the check-in and check-out times at SeaPearl?",
    answer: "Check-in is from 2:00 PM, and check-out is until 12:00 PM. Early check-in or late check-out is subject to availability.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
  },
  {
    id: 2,
    question: "Is parking available, and is there a fee?",
    answer: "Yes, we offer complimentary secure valet parking for all our staying guests in our private facility.",
    image: "https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=800&q=80"
  },
  {
    id: 3,
    question: "Are pets allowed in the resort suites?",
    answer: "We have specific pet-friendly suites available. Please contact our concierge to make arrangements in advance.",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80"
  },
  {
    id: 4,
    question: "Is there a fitness center in the resort?",
    answer: "Our state-of-the-art fitness center is open 24/7 and features a variety of cardio and strength equipment.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
  }
];

const FAQ = () => {
  const [index, setIndex] = useState(0);

  // 🚀 FIXED: Dropped automatic setInterval trigger pipeline loops to guarantee uninterrupted readability states

  return (
    <section className="bg-[#050505] py-32 px-6 md:px-16 lg:px-24 overflow-hidden relative border-b border-white/5">
      
      {/* items-start ensures the top alignment stays fixed even if accordion expands */}
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-20 xl:gap-32 items-start">
        
        {/* 1. LEFT IMAGE CONTENT FRAME */}
        <div className="w-full lg:w-[45%] h-[500px] md:h-[650px] relative lg:sticky lg:top-32">
          <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/5 shadow-2xl bg-[#0A0A0A]">
            <AnimatePresence mode="wait">
              <motion.img 
                key={index}
                src={faqData[index].image}
                alt="Luxury Resort Detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover grayscale-[15%]"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        </div>

        {/* 2. RIGHT INTERACTIVE CONTENT BOX */}
        <div className="w-full lg:w-[55%] flex flex-col min-h-[700px]">
          
          <div className="mb-14 space-y-4">
            <p className="text-[#C6A675] tracking-[6px] uppercase text-[10px] font-bold">
              Common Inquiries
            </p>
            <h2 className="text-white text-4xl md:text-5xl xl:text-6xl font-serif leading-[1.15] tracking-tight max-w-2xl">
              Explore Our Frequently <br className="hidden md:block" /> Asked Questions
            </h2>
          </div>

          <div className="space-y-1">
            {faqData.map((item, i) => (
              <motion.div
                layout 
                key={item.id}
                onClick={() => setIndex(i)}
                className="py-8 border-b border-white/5 cursor-pointer transition-all duration-500 group select-none"
              >
                <div className="flex items-center gap-6">
                  <span className={`h-[1px] transition-all duration-500 ${index === i ? "w-10 bg-[#C6A675]" : "w-4 bg-white/20"}`} />
                  
                  <h3 className={`text-sm md:text-xl font-light tracking-wide transition-all duration-500 ${index === i ? "text-white translate-x-2" : "text-white/40 group-hover:text-white/70"}`}>
                    {item.question}
                  </h3>
                </div>

                <AnimatePresence initial={false}>
                  {index === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-6 pl-16 text-gray-400 text-sm md:text-lg font-light leading-relaxed max-w-lg">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default FAQ;