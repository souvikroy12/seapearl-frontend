import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { 
  User, LogOut, ChevronDown, Bell, 
  Heart, Globe, Sparkles 
} from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  const [activeCurrency, setActiveCurrency] = useState(() => {
    return localStorage.getItem("seapearl_currency") || "INR";
  });
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  
  const [userData, setUserData] = useState(null); 
  const [favCount, setFavCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const notifRef = useRef(null);
  const currencyRef = useRef(null);

  const handleCurrencyChange = (currencyCode) => {
    setActiveCurrency(currencyCode);
    localStorage.setItem("seapearl_currency", currencyCode);
    setIsCurrencyMenuOpen(false);
    window.dispatchEvent(new Event("currencyUpdated"));
  };

  const updateFavCount = (currentEmail) => {
    if (!currentEmail) {
      setFavCount(0);
      return;
    }
    const savedFavs = localStorage.getItem(`seapearl_favourites_${currentEmail}`);
    if (savedFavs) {
      setFavCount(JSON.parse(savedFavs).length);
    } else {
      setFavCount(0);
    }
  };

  // FIXED: Token aur withCredentials ke sath secure call
  const fetchMyBookingsCount = async (email) => {
    if (!email) return;
    try {
      const info = sessionStorage.getItem("userInfo") || localStorage.getItem("userInfo");
      const token = info ? JSON.parse(info).token : null;

      const response = await axios.get(
        `http://localhost:5000/api/bookings/my-bookings?email=${email.trim()}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` })
          },
          withCredentials: true
        }
      );

      if (response && response.data) {
        let count = 0;
        if (Array.isArray(response.data)) {
          count = response.data.length;
        } else if (response.data.bookings && Array.isArray(response.data.bookings)) {
          count = response.data.bookings.length;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          count = response.data.data.length;
        } else if (typeof response.data === "object") {
          count = response.data.count || 0;
        }
        setBookingCount(count);
      }
    } catch (error) {
      console.error("Error fetching header bookings count:", error);
      setBookingCount(0);
    }
  };

  useEffect(() => {
    const info = sessionStorage.getItem("userInfo") || localStorage.getItem("userInfo");
    if (info) {
      const parsedUser = JSON.parse(info);
      setUserData(parsedUser);
      
      const userEmail = parsedUser.email || (parsedUser.user && parsedUser.user.email);
      
      if (userEmail) {
        fetchMyBookingsCount(userEmail);
        updateFavCount(userEmail);
      } else {
        setBookingCount(0);
        setFavCount(0);
      }

      setNotifications([
        { id: 1, text: `Welcome back, ${parsedUser.name || 'Member'}. Your luxury dashboard is active. ✨` },
        { id: 2, text: "Security Update: Your reservation ledger is synchronized. 🔒" }
      ]);
    } else {
      setUserData(null);
      setBookingCount(0);
      setFavCount(0);
      setNotifications([
        { id: 1, text: "Welcome to SeaPearl Sanctuary. Please login to reserve suites." }
      ]);
    }

    const handleStorageChange = () => {
      const liveInfo = sessionStorage.getItem("userInfo") || localStorage.getItem("userInfo");
      if (liveInfo) {
        const u = JSON.parse(liveInfo);
        const activeEmail = u.email || (u.user && u.user.email);
        if (activeEmail) {
          updateFavCount(activeEmail);
          fetchMyBookingsCount(activeEmail);
        }
      } else {
        setFavCount(0);
        setBookingCount(0);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("favUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("favUpdated", handleStorageChange);
    };
  }, [location]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Backend logout error:", err);
    }
    sessionStorage.removeItem("userInfo"); 
    localStorage.removeItem("userInfo"); 
    setUserData(null);
    setBookingCount(0);
    setFavCount(0);
    setIsUserMenuOpen(false);
    setIsNotificationOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setIsCurrencyMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainTabs = [
    { name: "Suites & Villas", path: "/" },
    { name: "Reservations", path: "/bookings" }
  ];

  const currenciesList = [
    { code: "INR", label: "🇮🇳 INR (₹)" },
    { code: "USD", label: "🇺🇸 USD ($)" },
    { code: "EUR", label: "🇪🇺 EUR (€)" },
    { code: "GBP", label: "🇬🇧 GBP (£)" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 border-b ${
        isScrolled 
          ? "bg-black/95 backdrop-blur-md border-white/10 py-3.5 shadow-2xl" 
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* BRAND IDENTITY */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center group">
            <span className="text-white text-2xl md:text-3xl font-serif tracking-tight">
              Sea<span className="text-[#C6A675] italic group-hover:text-white transition-colors duration-500">Pearl</span>
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-white/10">
            <Sparkles size={11} className="text-[#C6A675]/80" />
            <span className="text-white/40 text-[9px] uppercase tracking-[3px] font-mono">
              Private Havens
            </span>
          </div>
        </div>

        {/* CENTER LUXURY NAV */}
        <nav className="hidden md:flex items-center gap-2 p-1.5 bg-white/[0.02] border border-white/10 rounded-full backdrop-blur-md">
          {mainTabs.map((tab) => (
            <Link
              key={tab.name}
              to={tab.path}
              className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[2px] transition-all duration-300 ${
                location.pathname === tab.path 
                  ? "bg-[#C6A675] text-black shadow-[0_0_18px_rgba(198,166,117,0.35)]" 
                  : "text-white/70 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-5">
          
          {/* CURRENCY SELECTOR */}
          <div className="relative" ref={currencyRef}>
            <button 
              onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-[#C6A675] transition-colors outline-none border-none bg-transparent"
            >
              <Globe size={16} />
              <span className="text-[10px] font-bold tracking-widest">{activeCurrency}</span>
              <ChevronDown size={10} className={`transition-transform duration-300 ${isCurrencyMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCurrencyMenuOpen && (
              <div className="absolute right-0 mt-4 w-36 bg-[#0F0F0F] border border-white/10 rounded-sm py-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[110]">
                {currenciesList.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => handleCurrencyChange(curr.code)}
                    className={`w-full text-left px-4 py-2 text-[10px] uppercase font-bold tracking-wider transition-all border-none bg-transparent ${
                      activeCurrency === curr.code ? "text-[#C6A675] bg-white/[0.03]" : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    {curr.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <Link to="/wishlist" className="text-gray-400 hover:text-[#C6A675] transition-colors relative">
            <Heart size={18} />
            <span className="absolute -top-1.5 -right-1.5 bg-[#C6A675] text-black text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">{favCount}</span>
          </Link>

          {/* NOTIFICATIONS */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)} 
              className="text-gray-400 hover:text-white transition-colors relative outline-none border-none bg-transparent"
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-black" />
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-4 w-72 bg-[#0F0F0F] border border-white/10 rounded-sm py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[110]">
                <div className="px-4 pb-2 mb-2 border-b border-white/5">
                  <p className="text-white text-[10px] font-bold uppercase tracking-widest">Alert Central</p>
                </div>
                <div className="max-h-48 overflow-y-auto px-2 space-y-1">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-2 rounded-sm text-[10px] text-white/70 bg-white/[0.02] border border-white/5 font-sans leading-relaxed">
                      {notif.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AUTH LOGIC */}
          {!userData ? (
            <Link
              to="/login"
              className="flex items-center gap-2 text-white hover:text-[#C6A675] text-[11px] font-bold uppercase tracking-[2px] transition-all"
            >
              <User size={16} className="text-[#C6A675]" />
              Login
            </Link>
          ) : (
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 text-white group outline-none border-none bg-transparent"
              >
                <div className="w-8 h-8 rounded-full border border-[#C6A675] p-0.5 overflow-hidden transition-transform group-hover:scale-105">
                  <img src={`https://ui-avatars.com/api/?name=${userData.name}&background=C6A675&color=fff`} alt="Profile" className="w-full h-full rounded-full object-cover" />
                </div>
                <ChevronDown size={14} className={`text-[#C6A675] transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-4 w-56 bg-[#0F0F0F] border border-white/10 rounded-sm py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  <div className="px-4 pb-2 mb-2 border-b border-white/5">
                    <p className="text-white text-[10px] font-bold uppercase tracking-tighter">{userData.name}</p>
                    <p className="text-[#C6A675] text-[9px]">Premium Member</p>
                  </div>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-gray-400 hover:bg-[#C6A675]/10 hover:text-[#C6A675] transition-all uppercase tracking-widest text-[9px] font-bold"
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/bookings" 
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-gray-400 hover:bg-[#C6A675]/10 hover:text-[#C6A675] transition-all uppercase tracking-widest text-[9px] font-bold flex justify-between items-center"
                  >
                    My Bookings 
                    <span className="bg-[#C6A675] text-black px-1.5 py-0.5 rounded-full text-[8px] font-black">{bookingCount}</span>
                  </Link>
                  <hr className="my-2 border-white/5" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-500/10 transition-all uppercase tracking-widest text-[9px] font-bold flex items-center gap-2 border-none bg-transparent">
                    <LogOut size={12} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;