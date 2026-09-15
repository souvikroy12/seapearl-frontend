import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Flower2, Dumbbell, WavesLadder, Briefcase, Bell } from 'lucide-react';

const services = [
  { icon: <Utensils size={32} strokeWidth={1.5} />, title: "Restaurant & Bar", desc: "Exceptional dining awaits at our resort. Immerse yourself in exquisite flavors." },
  { icon: <Flower2 size={32} strokeWidth={1.5} />, title: "Spa & Wellness", desc: "Discover serenity at our spa. Indulge in blissful treatments and unwind." },
  { icon: <Dumbbell size={32} strokeWidth={1.5} />, title: "Fitness Center", desc: "Stay active in our state-of-the-art facility with professional guidance." },
  { icon: <WavesLadder size={32} strokeWidth={1.5} />, title: "Infinity Pool", desc: "Surrender to breathtaking views and pure relaxation in our infinity pool." },
  { icon: <Briefcase size={32} strokeWidth={1.5} />, title: "Conference Center", desc: "Stay productive with our well-equipped business event center." },
  { icon: <Bell size={32} strokeWidth={1.5} />, title: "24/7 Room Service", desc: "Delight in round-the-clock service, catering to your needs at any hour." }
];

const Services = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="bg-[#050505] py-24 px-6 md:px-12 lg:px-24">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }} // Repeat on every scroll
        variants={containerVariants}
      >
        <motion.div className="text-center mb-20" variants={itemVariants}>
          <p className="text-[#C6A675] tracking-[4px] uppercase text-[11px] font-bold mb-4">Why Choose SeaPearl</p>
          <h2 className="text-white text-4xl md:text-5xl font-serif leading-tight">Unveiling Unmatched Coastal Luxury</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-20">
          {services.map((service, index) => (
            <motion.div key={index} className="group flex flex-col items-start" variants={itemVariants}>
              <div className="text-[#C6A675] mb-6 transition-transform duration-500 group-hover:-translate-y-2">{service.icon}</div>
              <h3 className="text-white text-xl font-serif mb-4 group-hover:text-[#C6A675] transition-colors">{service.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Services;