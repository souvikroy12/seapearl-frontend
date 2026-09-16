import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { 
  FaFacebookF, FaInstagram,
  FaArrowRight, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt 
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [userData, setUserData] = useState(null);

  // Exact Header Synchronization: checks both sessionStorage and localStorage
  const getActiveUser = () => {
    try {
      const info = sessionStorage.getItem("userInfo") || localStorage.getItem("userInfo");
      return info ? JSON.parse(info) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const syncUser = () => {
      setUserData(getActiveUser());
    };

    syncUser();

    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, [location.pathname]);

  const handleProtectedNavigation = (targetPath) => {
    const current = getActiveUser();
    if (current) {
      navigate(targetPath);
    } else {
      navigate("/login");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSimpleNavigation = (targetPath) => {
    navigate(targetPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialChannels = [
    { label: "Instagram Sanctuary", Icon: FaInstagram, href: "https://instagram.com" },
    { label: "X Luxury Circle", Icon: FaXTwitter, href: "https://x.com" },
    { label: "Facebook Presence", Icon: FaFacebookF, href: "https://facebook.com" }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 2500,
        background: "#0A0A0A",
        color: "#fff",
        iconColor: "#C6A675",
      }).fire({
        icon: "warning",
        title: "Please enter a valid email address.",
      });
      return;
    }

    Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      background: "#0A0A0A",
      color: "#fff",
      iconColor: "#C6A675",
    }).fire({
      icon: "success",
      title: "Welcome to the Inner Circle!",
    });

    setNewsletterEmail("");
  };

  return (
    <footer className="bg-[#050505] text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#C6A675]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* 1. BRAND STORY */}
          <div className="space-y-8">
            <div 
              onClick={() => handleSimpleNavigation("/")} 
              className="inline-block group cursor-pointer"
            >
              <h2 className="text-3xl font-serif tracking-tighter">
                Sea<span className="text-[#C6A675] italic">Pearl</span>
              </h2>
            </div>
            <p className="text-white/40 text-sm leading-[1.8] font-light">
              Crafting unforgettable journeys since 2026. A sanctuary where luxury 
              meets the horizon, providing world-class hospitality for the global traveler.
            </p>

            <div className="flex gap-4">
              {socialChannels.map(({ Icon, href, label }, i) => (
                <a 
                  key={i} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#C6A675] hover:border-[#C6A675] transition-all duration-500 hover:scale-105 active:scale-95"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. DYNAMIC EXPLORATION */}
          <div className="space-y-8">
            <h4 className="text-[#C6A675] uppercase text-[10px] font-bold tracking-[4px]">Exploration</h4>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => handleSimpleNavigation("/")}
                  className="group flex items-center text-sm text-white/40 hover:text-white transition-all duration-300 bg-transparent border-none p-0 cursor-pointer text-left"
                >
                  <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 text-[#C6A675]">
                    <FaArrowRight size={10} className="mr-2" />
                  </span>
                  Luxury Sanctuaries
                </button>
              </li>

              {/* My Booking Ledger */}
              <li>
                <button 
                  onClick={() => handleProtectedNavigation("/bookings")}
                  className="group flex items-center text-sm text-white/40 hover:text-white transition-all duration-300 bg-transparent border-none p-0 cursor-pointer text-left"
                >
                  <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 text-[#C6A675]">
                    <FaArrowRight size={10} className="mr-2" />
                  </span>
                  My Booking Ledger
                </button>
              </li>

              {/* Logged-In: Profile | Logged-Out: Member Sign In */}
              {userData ? (
                <li>
                  <button 
                    onClick={() => handleSimpleNavigation("/profile")}
                    className="group flex items-center text-sm text-white/40 hover:text-[#C6A675] transition-all duration-300 bg-transparent border-none p-0 cursor-pointer text-left"
                  >
                    <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 text-[#C6A675]">
                      <FaArrowRight size={10} className="mr-2" />
                    </span>
                    My Profile ({userData.name?.split(" ")[0] || "Member"})
                  </button>
                </li>
              ) : (
                <li>
                  <button 
                    onClick={() => handleSimpleNavigation("/login")}
                    className="group flex items-center text-sm text-white/40 hover:text-white transition-all duration-300 bg-transparent border-none p-0 cursor-pointer text-left"
                  >
                    <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 text-[#C6A675]">
                      <FaArrowRight size={10} className="mr-2" />
                    </span>
                    Member Sign In
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* 3. CONTACT CONCIERGE */}
          <div className="space-y-8">
            <h4 className="text-[#C6A675] uppercase text-[10px] font-bold tracking-[4px]">Concierge</h4>
            <div className="space-y-6 text-sm text-white/40 font-light">
              <div className="flex items-start gap-4 group">
                <FaMapMarkerAlt className="mt-1 group-hover:text-[#C6A675] transition-colors flex-shrink-0" />
                <p className="group-hover:text-white transition-colors">
                  SeaPearl Sanctuaries, Luxury Atoll <br/> 2026 Global Terminal
                </p>
              </div>

              <a 
                href="tel:+9118002008888" 
                className="flex items-center gap-4 group transition-colors cursor-pointer"
              >
                <FaPhoneAlt className="group-hover:text-[#C6A675] transition-colors flex-shrink-0" />
                <p className="group-hover:text-white transition-colors text-white/60 font-mono tracking-wider">
                  1800 200 8888 (Toll Free)
                </p>
              </a>

              <a 
                href="mailto:concierge@seapearlsanctuaries.com" 
                className="flex items-center gap-4 group transition-colors cursor-pointer"
              >
                <FaEnvelope className="group-hover:text-[#C6A675] transition-colors flex-shrink-0" />
                <p className="group-hover:text-white transition-colors text-white/60 font-mono">
                  concierge@seapearlsanctuaries.com
                </p>
              </a>
            </div>
          </div>

          {/* 4. NEWSLETTER */}
          <div className="space-y-8">
            <h4 className="text-[#C6A675] uppercase text-[10px] font-bold tracking-[4px]">Newsletter</h4>
            <p className="text-white/40 text-xs italic font-light">Join the circle for exclusive travel updates.</p>
            <form onSubmit={handleNewsletterSubmit} className="relative">
              <input 
                type="email" 
                value={newsletterEmail} 
                onChange={(e) => setNewsletterEmail(e.target.value)} 
                placeholder="EMAIL ADDRESS" 
                className="w-full bg-transparent border-b border-white/10 py-4 text-[10px] tracking-[2px] focus:border-[#C6A675] outline-none transition-all placeholder:text-white/20 text-white pr-10" 
              />
              <button 
                type="submit" 
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:translate-x-1 transition-transform outline-none border-none bg-transparent cursor-pointer"
              >
                <FaArrowRight className="text-[#C6A675]" size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* BOTTOM BAR - PRODUCTION LUXURY STANDARD */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <p className="text-[10px] text-white/30 tracking-[3px] uppercase font-medium">
              © {currentYear} SEAPEARL RESORT GROUP
            </p>
            <div className="hidden sm:block w-px h-3 bg-white/10" />
            <div className="flex gap-6 text-[10px] text-white/30 tracking-[2px] uppercase">
              <Link to="/privacy" className="hover:text-[#C6A675] transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-[#C6A675] transition-colors">Terms of Service</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-[10px] text-white/30 tracking-[2px] uppercase">
              Architecture & Engineering by{" "}
              <span className="text-[#C6A675] font-semibold tracking-[2.5px] hover:text-white transition-colors cursor-default">
                Souvik Roy
              </span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#C6A675]/60 animate-pulse ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;