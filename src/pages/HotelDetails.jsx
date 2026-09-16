import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    MapPin, Star, Check, Wifi, Coffee, ParkingCircle, Waves, Dumbbell,
    Shield, Tv, Wind, Bath, User, Clock, Heart, Share2, Info, Calendar, Utensils
} from 'lucide-react';

const ICON_MAP = {
    "wifi": <Wifi size={20} />,
    "internet": <Wifi size={20} />,
    "parking": <ParkingCircle size={20} />,
    "breakfast": <Coffee size={20} />,
    "restaurant": <Utensils size={20} />,
    "pool": <Waves size={20} />,
    "gym": <Dumbbell size={20} />,
    "fitness": <Dumbbell size={20} />,
    "security": <Shield size={20} />,
    "tv": <Tv size={20} />,
    "air conditioning": <Wind size={20} />,
    "bath": <Bath size={20} />,
    "reception": <User size={20} />,
    "desk": <User size={20} />,
    "housekeeping": <Check size={20} />,
    "service": <Clock size={20} />,
};

const HotelDetails = () => {
    const [isSticky, setIsSticky] = useState(false);
    const [hotelPhotos, setHotelPhotos] = useState([]);
    const [description, setDescription] = useState("");
    const [cleanTitle, setCleanTitle] = useState("");
    const [facilities, setFacilities] = useState([]);
    const [descLoading, setDescLoading] = useState(true);

    const [rules, setRules] = useState({ checkin: "14:00 PM", checkout: "12:00 PM" });

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000));
    const [roomData, setRoomData] = useState([]);
    const [roomsLoading, setRoomsLoading] = useState(false);
    const [guests, setGuests] = useState(2);
    const [error, setError] = useState(null);

    const [isFavourite, setIsFavourite] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    const hotel = location.state?.hotelData;

    const hotelId = hotel?.hotel_id || hotel?.id || '101';

    // Helper: Local date formatter (avoids UTC timezone shift bug)
    const formatISODate = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Dynamic Google Maps redirect using real hotel details
    const handleOpenMap = () => {
        const query = encodeURIComponent(`${cleanTitle || hotel?.name || "Hotel"} ${hotel?.location || ""}`);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    };

    useEffect(() => {
        const info = sessionStorage.getItem("userInfo") || localStorage.getItem("userInfo");
        if (info) {
            const parsedUser = JSON.parse(info);
            const email = parsedUser.email || (parsedUser.user && parsedUser.user.email);
            if (email) {
                setUserEmail(email);
                const currentFavs = JSON.parse(localStorage.getItem(`seapearl_favourites_${email}`)) || [];
                const exists = currentFavs.some(item => item.id === hotelId);
                setIsFavourite(exists);
                return;
            }
        }
        setIsFavourite(false);
        setUserEmail("");
    }, [hotelId, location]);

    const handleStartDateChange = (date) => {
        setStartDate(date);
        if (date >= endDate) {
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            setEndDate(nextDay);
        }
    };

    useEffect(() => {
        const fetchAllDetails = async () => {
            setDescLoading(true);
            try {
                const photoResponse = await axios.get(`https://seapearl-backend-1.onrender.com/api/hotels/hotel-photos?hotelId=${hotelId}`);
                if (Array.isArray(photoResponse.data)) {
                    setHotelPhotos(photoResponse.data);
                }

                const descResponse = await axios.get(`https://seapearl-backend-1.onrender.com/api/hotels/hotel-description`, {
                    params: { hotelId, hotelName: hotel?.name, hotelCity: hotel?.location }
                });

                if (descResponse.data) {
                    setDescription(descResponse.data.text || "");
                    setFacilities(descResponse.data.facilities || []);
                    setCleanTitle(descResponse.data.title || hotel?.name);

                    setRules({
                        checkin: descResponse.data.checkin || "14:00 PM",
                        checkout: descResponse.data.checkout || "12:00 PM"
                    });
                }
            } catch (error) {
                console.error("Error fetching hotel details:", error);
            } finally {
                setDescLoading(false);
            }
        };
        if (hotelId) fetchAllDetails();
    }, [hotelId, hotel?.name, hotel?.location]);

    const fetchRooms = useCallback(async () => {
        if (!hotelId) return;
        setRoomsLoading(true);
        setError(null);
        try {
            const res = await axios.get(`https://seapearl-backend-1.onrender.com/api/hotels/hotel-rooms`, {
                params: {
                    hotelId,
                    checkinDate: formatISODate(startDate),
                    checkoutDate: formatISODate(endDate),
                    guests
                }
            });
            setRoomData(res.data);
        } catch (err) {
            console.error("Room fetch error:", err);
            setError("Failed to sync live rates. Please try again.");
        } finally {
            setRoomsLoading(false);
        }
    }, [hotelId, startDate, endDate, guests]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchRooms();
        }, 500);
        return () => clearTimeout(timer);
    }, [fetchRooms]);

    const getFacilityIcon = (facilityName) => {
        const name = facilityName.toLowerCase();
        const key = Object.keys(ICON_MAP).find(k => name.includes(k));
        return key ? ICON_MAP[key] : <Check size={20} />;
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 500) setIsSticky(true);
            else setIsSticky(false);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    const navItems = [
        { id: 'overview', label: 'Overview' },
        { id: 'availability', label: 'Info & Prices' },
        { id: 'facilities', label: 'Facilities' },
        { id: 'rules', label: 'House Rules' }
    ];

    const formatDisplayDate = (d) => {
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
        });
    };

    // Dynamic Photos Array Resolution
    const displayPhotos = hotelPhotos.length > 0
        ? hotelPhotos.map(p => p.url || p)
        : [hotel?.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"];

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans pb-20">
            <Helmet>
                <title>{`${cleanTitle || hotel?.name || "Premium Hotel"} | SeaPearl`}</title>
                <meta property="og:title" content={cleanTitle || hotel?.name || "Premium Hotel"} />
                <meta property="og:description" content={`Book your luxury stay at ${hotel?.location || "SeaPearl sanctuaries"}.`} />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:image" content={displayPhotos[0]} />
                <meta property="og:type" content="website" />
            </Helmet>
            <style>{`
                .react-datepicker { background-color: #0a0a0a; border: 1px solid rgba(198, 166, 117, 0.2); color: white; border-radius: 12px; }
                .react-datepicker__header { background-color: #111; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .react-datepicker__current-month, .react-datepicker__day-name { color: #C6A675 !important; font-size: 0.7rem; text-transform: uppercase; }
                .react-datepicker__day { color: white; }
                .react-datepicker__day:hover { background-color: #C6A675; color: black; }
                .react-datepicker__day--selected { background-color: #C6A675 !important; color: black !important; }
                .react-datepicker__day--disabled { color: rgba(255,255,255,0.1) !important; }
            `}</style>

            <div className={`fixed top-[64px] left-0 w-full z-[90] transition-all duration-300 ${isSticky ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 opacity-100' : 'bg-transparent opacity-0 pointer-events-none'}`}>
                <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 lg:px-12 h-16">
                    <div className="flex gap-8 items-center py-2">
                        {navItems.map((item) => (
                            <button key={item.id} onClick={() => scrollToSection(item.id)} className="text-[10px] uppercase tracking-[2px] font-bold text-white/60 hover:text-[#C6A675] transition-all relative group outline-none border-none bg-transparent">
                                {item.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C6A675] transition-all group-hover:w-full"></span>
                            </button>
                        ))}
                    </div>
                    <button onClick={() => scrollToSection('availability')} className="bg-[#C6A675] text-black text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-sm hover:bg-white transition-all">
                        Reserve Now
                    </button>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-32 md:pt-40">
                <div id="overview" className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-[#C6A675]/10 text-[#C6A675] text-[9px] font-bold px-2 py-1 uppercase tracking-widest border border-[#C6A675]/20">Hotel</span>
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={12} className="fill-[#C6A675] text-[#C6A675]" />)}
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif uppercase tracking-tight mb-3 leading-tight max-w-[800px]">
                            {cleanTitle || hotel?.name || "Premium Hotel"}
                        </h1>
                        <div className="flex items-center gap-4 text-white/50 text-[11px] uppercase tracking-wider">
                            <p className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-[#C6A675]" />
                                {hotel?.location || "Prime Location"}
                            </p>
                            {/* DYNAMIC GOOGLE MAP TRIGGER */}
                            <button
                                onClick={handleOpenMap}
                                className="text-[#C6A675] hover:text-white cursor-pointer border-b border-[#C6A675]/30 pb-0.5 bg-transparent border-t-0 border-x-0 outline-none transition-colors"
                            >
                                Show on map
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                if (!userEmail) {
                                    return navigate('/login');
                                }

                                let currentFavs = JSON.parse(localStorage.getItem(`seapearl_favourites_${userEmail}`)) || [];
                                const currentHotelId = hotelId;

                                const isExist = currentFavs.some(item => item.id === currentHotelId);
                                let updatedFavs = [];

                                if (isExist) {
                                    updatedFavs = currentFavs.filter(item => item.id !== currentHotelId);
                                    setIsFavourite(false);
                                } else {
                                    const favHotelObj = {
                                        id: currentHotelId,
                                        name: cleanTitle || hotel?.name || "Premium Hotel",
                                        location: hotel?.location || "Prime Location",
                                        image: displayPhotos[0]
                                    };
                                    updatedFavs = [...currentFavs, favHotelObj];
                                    setIsFavourite(true);
                                }

                                localStorage.setItem(`seapearl_favourites_${userEmail}`, JSON.stringify(updatedFavs));
                                window.dispatchEvent(new Event("favUpdated"));

                                Swal.mixin({
                                    toast: true,
                                    position: 'bottom-end',
                                    showConfirmButton: false,
                                    timer: 2500,
                                    background: '#0A0A0A',
                                    color: '#fff',
                                    iconColor: '#C6A675',
                                }).fire({
                                    icon: !isExist ? 'success' : 'info',
                                    title: !isExist ? 'Added to your Sanctuaries!' : 'Removed from your Sanctuaries.'
                                });
                            }}
                            className={`p-3 border border-white/10 rounded-full transition-all duration-300 ${isFavourite ? 'bg-[#C6A675]/10 text-red-500 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'hover:bg-white/5 text-[#C6A675] bg-transparent'}`}
                        >
                            <Heart size={18} className={isFavourite ? "fill-red-500 text-red-500" : ""} />
                        </button>

                        <button
                            onClick={() => {
                                const currentUrl = window.location.href;
                                const hotelName = cleanTitle || hotel?.name || "Premium Hotel";
                                const hotelLocation = hotel?.location || "Prime Location";
                                const hotelImgSrc = displayPhotos[0];

                                const shareMessage = encodeURIComponent(
                                    `Look at this incredible sanctuary I found on SeaPearl:\n\n${hotelName}\n${hotelLocation}\n\nCheck out the luxury experience here:\n${currentUrl}`
                                );
                                const whatsappUrl = `https://api.whatsapp.com/send?text=${shareMessage}`;

                                Swal.fire({
                                    title: 'SHARE SANCTUARY',
                                    html: `
                                        <div style="color: rgba(255,255,255,0.6); font-size: 13px; margin-bottom: 20px; font-family: sans-serif;">
                                            Share this exquisite property with your network or inner circle.
                                        </div>

                                        <div style="display: flex; gap: 15px; background-color: #111; border: 1px solid rgba(255,255,255,0.08); padding: 12px; border-radius: 12px; margin-bottom: 25px; text-align: left; align-items: center;">
                                            <img src="${hotelImgSrc}" style="width: 85px; height: 85px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(198, 166, 117, 0.2);" alt="Hotel Preview" />
                                            <div style="font-family: sans-serif; overflow: hidden;">
                                                <h4 style="color: #C6A675; margin: 0 0 4px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${hotelName}</h4>
                                                <p style="color: rgba(255,255,255,0.5); margin: 0; font-size: 11px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${hotelLocation}</p>
                                                <span style="display: inline-block; margin-top: 8px; color: #fff; font-size: 10px; background: rgba(198, 166, 117, 0.1); border: 1px solid rgba(198, 166, 117, 0.2); padding: 2px 8px; border-radius: 4px; letter-spacing: 1px; font-weight: bold;">SEAPEARL EXCLUSIVE</span>
                                            </div>
                                        </div>

                                        <div style="display: flex; gap: 12px; flex-direction: column;">
                                            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" 
                                               style="display: flex; align-items: center; justify-content: center; gap: 10px; background-color: #25D366; color: white; padding: 14px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; font-family: sans-serif;">
                                                SHARE VIA WHATSAPP
                                            </a>
                                            <button id="copy-link-btn" 
                                               style="display: flex; align-items: center; justify-content: center; gap: 10px; background-color: transparent; border: 1px solid rgba(255,255,200,0.1); color: #C6A675; padding: 14px; border-radius: 6px; font-weight: bold; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; font-family: sans-serif;">
                                                COPY EXCLUSIVE LINK
                                            </button>
                                        </div>
                                    `,
                                    showConfirmButton: false,
                                    showCloseButton: true,
                                    background: '#0A0A0A',
                                    closeButtonHtml: '<span style="color: rgba(255,255,255,0.4);">&times;</span>',
                                    customClass: {
                                        popup: 'border border-white/10 rounded-2xl font-serif px-4 py-6',
                                    },
                                    didOpen: () => {
                                        const copyBtn = document.getElementById('copy-link-btn');
                                        if (copyBtn) {
                                            copyBtn.addEventListener('click', () => {
                                                const plainText = `Luxury Estate Finder: ${hotelName} - ${hotelLocation}. Explore at: ${currentUrl}`;
                                                navigator.clipboard.writeText(plainText);

                                                Swal.mixin({
                                                    toast: true,
                                                    position: 'bottom-end',
                                                    showConfirmButton: false,
                                                    timer: 2000,
                                                    background: '#0A0A0A',
                                                    color: '#fff',
                                                    iconColor: '#C6A675',
                                                }).fire({
                                                    icon: 'success',
                                                    title: 'Link copied successfully!'
                                                });
                                            });
                                        }
                                    }
                                });
                            }}
                            className="p-3 border border-white/10 rounded-full hover:bg-white/5 text-[#C6A675] bg-transparent transition-colors"
                        >
                            <Share2 size={18} />
                        </button>

                        <div className="bg-[#111] border border-white/10 p-2 pl-4 rounded-xl flex items-center gap-4 ml-2">
                            <div className="text-right leading-tight">
                                <p className="text-[#C6A675] font-black text-sm uppercase">Excellent</p>
                                <p className="text-white/30 text-[9px] uppercase tracking-tighter">{hotel?.reviews || "450"} Reviews</p>
                            </div>
                            <div className="bg-[#C6A675] text-black font-black text-xl w-12 h-12 flex items-center justify-center rounded-lg shadow-[0_0_20px_rgba(198,166,117,0.3)]">
                                {hotel?.rating || "8.9"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ACCURATE & DYNAMIC PHOTO GALLERY (NO FALSE COUNT) */}
                <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[500px] mb-12 rounded-3xl overflow-hidden border border-white/5">
                    {/* Main Featured Photo */}
                    <div className={`${displayPhotos.length > 1 ? "col-span-2 row-span-2" : "col-span-4 row-span-2"} relative group overflow-hidden`}>
                        <img src={displayPhotos[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Master View" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>

                    {/* Additional Photos (Render only if present) */}
                    {displayPhotos.length > 1 && [1, 2, 3].map((idx) => {
                        const img = displayPhotos[idx];
                        if (!img) return null;
                        return (
                            <div key={idx} className="col-span-1 row-span-1 overflow-hidden group">
                                <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={`Detail ${idx}`} />
                            </div>
                        );
                    })}

                    {/* 5th Slot (Clean Photo - No +5 Overlay) */}
                    {displayPhotos.length >= 5 && (
                        <div className="col-span-1 row-span-1 relative group overflow-hidden">
                            <img src={displayPhotos[4]} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="More Photos" />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-10">
                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-xl font-serif uppercase tracking-widest text-[#C6A675] mb-4">Property Description</h3>
                            <p className="text-white/60 leading-relaxed font-light whitespace-pre-line">
                                {descLoading ? "Refining luxury details..." : (description || "Welcome to our premium property.")}
                            </p>
                        </div>

                        <div id="facilities" className="pt-10 border-t border-white/5">
                            <h3 className="text-xl font-serif uppercase tracking-widest text-[#C6A675] mb-6">World-Class Facilities</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {!descLoading ? (
                                    facilities.length > 0 ? (
                                        facilities.slice(0, 9).map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-white/80 text-[11px] uppercase tracking-wide bg-white/5 p-4 rounded-xl border border-white/5 hover:border-[#C6A675]/30 transition-all">
                                                <span className="text-[#C6A675]">{getFacilityIcon(item)}</span>
                                                {item}
                                            </div>
                                        ))
                                    ) : <p className="text-white/30 text-[10px] italic">Standard luxury amenities included.</p>
                                ) : (
                                    <div className="col-span-full flex gap-2 items-center">
                                        <div className="w-2 h-2 bg-[#C6A675] animate-ping rounded-full"></div>
                                        <p className="text-[#C6A675] text-[10px] uppercase tracking-widest animate-pulse">Syncing Details...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[#0a0a0a] border border-[#C6A675]/30 p-8 rounded-3xl sticky top-24 shadow-2xl">
                            <h4 className="text-[11px] uppercase tracking-[4px] font-black text-[#C6A675] mb-8 flex items-center gap-2"><Info size={14} /> Highlights</h4>
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="bg-[#C6A675]/10 p-3 rounded-lg text-[#C6A675]"><MapPin size={20} /></div>
                                    <div>
                                        <h5 className="text-sm font-bold mb-1 uppercase tracking-wider">Top Location</h5>
                                        <p className="text-white/40 text-[11px]">Perfectly located in {hotel?.location?.split(',').pop() || "the city"}.</p>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <p className="text-[10px] uppercase tracking-[3px] text-white/30 mb-2 font-bold">Starts from</p>
                                    <p className="text-4xl font-serif text-[#C6A675]">₹ {hotel?.price?.toLocaleString() || "8,450"}<span className="text-xs text-white/40 font-sans tracking-normal">/ night</span></p>
                                </div>
                                <button onClick={() => scrollToSection('availability')} className="w-full bg-[#C6A675] text-black font-black uppercase tracking-[3px] py-5 rounded-xl hover:bg-white transition-all text-xs border-none outline-none">Check Availability</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="availability" className="mt-24 scroll-mt-24">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-4">
                            <h2 className="text-3xl font-serif uppercase tracking-tighter text-white">Available Rooms</h2>
                            <div className="hidden md:block w-20 h-[1px] bg-gradient-to-r from-[#C6A675] to-transparent"></div>
                        </div>

                        <div className="flex flex-col md:flex-row items-stretch bg-[#111] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                            <div className="flex flex-col px-6 py-3 border-r border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                                <span className="text-[9px] uppercase tracking-[2px] text-[#C6A675] font-bold mb-1">Check-In</span>
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-[#C6A675]" />
                                    <DatePicker
                                        selected={startDate}
                                        onChange={handleStartDateChange}
                                        selectsStart
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={new Date()}
                                        dateFormat="dd/MM/yyyy"
                                        className="bg-transparent text-[11px] uppercase font-black outline-none border-none text-white w-24 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col px-6 py-3 border-r border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                                <span className="text-[9px] uppercase tracking-[2px] text-[#C6A675] font-bold mb-1">Check-Out</span>
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-[#C6A675]" />
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        selectsEnd
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={startDate}
                                        dateFormat="dd/MM/yyyy"
                                        className="bg-transparent text-[11px] uppercase font-black outline-none border-none text-white w-24 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col px-6 py-3 hover:bg-white/5 transition-colors">
                                <span className="text-[9px] uppercase tracking-[2px] text-[#C6A675] font-bold mb-1">Guests</span>
                                <div className="flex items-center gap-2">
                                    <User size={14} className="text-[#C6A675]" />
                                    <select
                                        value={guests}
                                        onChange={(e) => setGuests(Number(e.target.value))}
                                        className="bg-transparent text-[11px] font-black uppercase outline-none border-none text-white cursor-pointer appearance-none"
                                    >
                                        {[1, 2, 3, 4].map(n => <option key={n} value={n} className="bg-[#111]">{n} Adults</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0a0a0a] rounded-3xl border border-white/5 overflow-hidden">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#111] text-[10px] uppercase tracking-[3px] text-white/40">
                                    <th className="p-6 text-left border-b border-white/5 font-bold">Room Selection</th>
                                    <th className="p-6 text-center border-b border-white/5 font-bold"><User size={14} className="mx-auto" /></th>
                                    <th className="p-6 text-left border-b border-white/5 font-bold">Benefits</th>
                                    <th className="p-6 text-right border-b border-white/5 font-bold">Rate</th>
                                    <th className="p-6 text-center border-b border-white/5 font-bold">Reserve</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roomsLoading ? (
                                    <tr>
                                        <td colSpan="5" className="p-20 text-center">
                                            <div className="inline-block w-8 h-8 border-2 border-[#C6A675]/20 border-t-[#C6A675] rounded-full animate-spin mb-4"></div>
                                            <p className="text-[10px] uppercase tracking-[4px] text-white/20">Syncing Live Rates...</p>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="5" className="p-10 text-center text-red-400 text-xs uppercase tracking-widest">{error}</td>
                                    </tr>
                                ) : roomData.length > 0 ? (
                                    roomData.map((room, idx) => {
                                        // Calculate total nights dynamically
                                        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
                                        const calculatedNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

                                        // Accurate total price for guests AND nights
                                        const totalStayPrice = room.price * guests * calculatedNights;

                                        return (
                                            <tr key={room.id || idx} className="hover:bg-white/[0.02] border-b border-white/5 group transition-colors">
                                                <td className="p-8 align-top">
                                                    <h4 className="text-xl font-serif text-[#C6A675] mb-2">
                                                        {room.roomName}
                                                    </h4>
                                                    <p className="text-[10px] text-white/30 uppercase tracking-widest">{room.bedConfig}</p>
                                                </td>
                                                <td className="p-8 align-top text-center">
                                                    <div className="flex justify-center gap-1 text-white/40">
                                                        {Array.from({ length: Math.min(room.capacity, 4) }).map((_, i) => <User key={i} size={16} />)}
                                                    </div>
                                                </td>
                                                <td className="p-8 align-top text-left text-white/60 text-xs font-light">
                                                    <ul className="space-y-1.5">
                                                        {room.benefits && room.benefits.map((b, i) => (
                                                            <li key={i} className="flex items-center gap-2 italic">
                                                                <Check size={12} className="text-[#C6A675]" />
                                                                {b}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td className="p-8 align-top text-right">
                                                    <p className="text-2xl font-serif text-[#C6A675]">
                                                        ₹ {totalStayPrice.toLocaleString()}
                                                    </p>
                                                    <p className="text-[9px] text-white/20 uppercase tracking-widest">
                                                        Total for {guests} {guests > 1 ? 'guests' : 'guest'} ({calculatedNights} {calculatedNights > 1 ? 'nights' : 'night'})
                                                    </p>
                                                </td>
                                                <td className="p-8 align-top text-center">
                                                    <button
                                                        onClick={() => {
                                                            const userInfo = sessionStorage.getItem("userInfo") || localStorage.getItem("userInfo");
                                                            const token = userInfo ? JSON.parse(userInfo).token : null;
                                                            if (!token) {
                                                                Swal.fire({
                                                                    title: 'LOGIN REQUIRED',
                                                                    html: `
            <div style="color: rgba(255,255,255,0.6); font-size: 14px; margin-top: 10px;">
                Please login to your <b style="color: #C6A675;">SeaPearl</b> account to secure and finalize your room reservation.
            </div>
        `,
                                                                    icon: 'warning',
                                                                    background: '#0A0A0A',
                                                                    color: '#fff',
                                                                    iconColor: '#C6A675',
                                                                    confirmButtonColor: '#C6A675',
                                                                    confirmButtonText: 'LOGIN NOW',
                                                                    showCancelButton: true,
                                                                    cancelButtonColor: '#1A1A1A',
                                                                    cancelButtonText: 'CANCEL',
                                                                    customClass: {
                                                                        popup: 'border border-white/10 rounded-2xl font-serif',
                                                                        confirmButton: 'text-black font-sans font-bold tracking-widest uppercase px-6 py-3 rounded-md',
                                                                        cancelButton: 'text-white/60 font-sans font-bold tracking-widest uppercase px-6 py-3 rounded-md border border-white/10'
                                                                    }
                                                                }).then((result) => {
                                                                    if (result.isConfirmed) {
                                                                        // FIXED: Send current path and hotel context to LoginPage
                                                                        navigate('/login', {
                                                                            state: {
                                                                                from: location.pathname,
                                                                                hotelData: hotel
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            } else {
                                                                navigate('/checkout', {
                                                                    state: {
                                                                        hotelName: cleanTitle || hotel?.name || "Swarn Hotel",
                                                                        hotelImage: displayPhotos[0],
                                                                        hotelAddress: hotel?.location || "New Delhi, India",
                                                                        totalPrice: `₹ ${totalStayPrice.toLocaleString()}`,
                                                                        checkInDate: formatDisplayDate(startDate),
                                                                        checkOutDate: formatDisplayDate(endDate),
                                                                        totalNights: calculatedNights,
                                                                        guests: { adults: guests, children: 0 },
                                                                        rooms: 1,
                                                                        roomType: room.roomName || "Standard Luxury Pass"
                                                                    }
                                                                });
                                                            }
                                                        }}
                                                        className="bg-[#C6A675] text-black font-semibold text-sm uppercase py-3 px-6 rounded-md w-full"
                                                    >
                                                        Reserve Room
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-20 text-center">
                                            <p className="text-white/20 italic text-sm">
                                                No properties found for these dates. Try adjusting check-in or guests.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="rules" className="mt-24">
                    <h3 className="text-2xl font-serif uppercase tracking-widest text-[#C6A675] mb-10">House Rules</h3>
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-4 border-b border-white/5">
                            <div className="p-8 bg-[#111] text-[10px] uppercase tracking-[3px] font-black text-white/40 flex items-center gap-3">
                                <Clock size={18} className="text-[#C6A675]" /> Check-in
                            </div>
                            <div className="p-8 md:col-span-3 text-sm text-white/70">From {rules.checkin} onwards</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 border-b border-white/5">
                            <div className="p-8 bg-[#111] text-[10px] uppercase tracking-[3px] font-black text-white/40 flex items-center gap-3">
                                <Clock size={18} className="text-[#C6A675]" /> Check-out
                            </div>
                            <div className="p-8 md:col-span-3 text-sm text-white/70">Until {rules.checkout} noon</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;