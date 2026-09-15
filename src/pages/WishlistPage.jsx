import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Trash2, Hotel, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

const WishlistPage = () => {
    const [favourites, setFavourites] = useState([]);
    const [userEmail, setUserEmail] = useState("");
    const navigate = useNavigate();

    // LocalStorage se favorites data load karne ke liye
    useEffect(() => {
        //  STRICT LOGIN PROTECTION BOUNDARY: Check user session first
        const info = sessionStorage.getItem("userInfo") || localStorage.getItem("userInfo");
        if (!info) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(info);
        const email = parsedUser.email || (parsedUser.user && parsedUser.user.email);
        
        if (!email) {
            navigate('/login');
            return;
        }

        setUserEmail(email);

        //  FIXED: Read only user-specific wishlist storage key layout
        const savedFavs = localStorage.getItem(`seapearl_favourites_${email}`);
        if (savedFavs) {
            setFavourites(JSON.parse(savedFavs));
        } else {
            setFavourites([]);
        }
    }, [navigate]);

    // Sanctuary remove karne ka logic
    const handleRemoveFav = (id, e) => {
        e.stopPropagation(); // Card click event ko rokne ke liye

        if (!userEmail) return;

        const updatedFavs = favourites.filter(item => item.id !== id);
        setFavourites(updatedFavs);
        
        //  FIXED: Save only into the isolated email-specific storage slot
        localStorage.setItem(`seapearl_favourites_${userEmail}`, JSON.stringify(updatedFavs));
        
        // Header component ka badge number real-time refresh karne ke liye trigger
        window.dispatchEvent(new Event("favUpdated"));

        Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 2000,
            background: '#0A0A0A',
            color: '#fff',
            iconColor: '#C6A675',
            tier: 'premium-toast'
        }).fire({
            icon: 'info',
            title: 'Removed from your Sanctuaries.'
        });
    };

    // Card par click karne par direct usi hotel ke detail page par bhejne ka logic
    const handleCardClick = async (favItem) => {
        try {
            // SearchResults jaisa behavior match karne ke liye custom payload design kiya
            const hotelDataPayload = {
                hotel_id: favItem.id,
                name: favItem.name,
                location: favItem.location,
                image: favItem.image,
                price: favItem.price || 8450
            };
            
            navigate(`/hotel/${favItem.id}`, { state: { hotelData: hotelDataPayload } });
        } catch (error) {
            console.error("Navigation error from wishlist:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-36 pb-20 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 border-b border-white/5 pb-8">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-serif tracking-tight uppercase mb-2">
                            My <span className="text-[#C6A675] italic">Sanctuaries</span>
                        </h1>
                        <p className="text-white/40 text-[11px] uppercase tracking-[2px]">Your private collection of exclusive luxury estates</p>
                    </div>
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 border border-white/10 rounded-full px-5 py-2.5 text-[10px] uppercase tracking-widest font-bold text-white/60 hover:text-[#C6A675] hover:border-[#C6A675]/30 bg-transparent transition-all"
                    >
                        <ArrowLeft size={12} /> Back to Exploration
                    </button>
                </div>

                {/* Grid Layout for Saved Hotels */}
                {favourites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favourites.map((item) => (
                            <div 
                                key={item.id}
                                onClick={() => handleCardClick(item)}
                                className="group bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-[#C6A675]/30 transition-all duration-500 shadow-2xl flex flex-col justify-between"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>
                                    
                                    {/* Remove Button */}
                                    <button 
                                        onClick={(e) => handleRemoveFav(item.id, e)}
                                        className="absolute top-4 right-4 p-2.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white/60 hover:text-red-500 hover:border-red-500/20 transition-all"
                                        title="Remove Sanctuary"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-serif text-white group-hover:text-[#C6A675] transition-colors line-clamp-1 uppercase tracking-wide">
                                            {item.name}
                                        </h3>
                                        <p className="text-white/40 text-xs flex items-center gap-1">
                                            <MapPin size={12} className="text-[#C6A675]" />
                                            {item.location}
                                        </p>
                                    </div>
                                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-[9px] bg-[#C6A675]/10 text-[#C6A675] border border-[#C6A675]/20 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                                            Verified Estate
                                        </span>
                                        <span className="text-[#C6A675] text-[10px] font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                            View Details &rarr;
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State Screen */
                    <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                        <div className="bg-[#C6A675]/10 p-5 rounded-full text-[#C6A675] mb-4">
                            <Hotel size={32} />
                        </div>
                        <h3 className="text-xl font-serif uppercase tracking-wide text-white/80 mb-2">No Sanctuaries Saved Yet</h3>
                        <p className="text-white/30 text-xs max-w-sm leading-relaxed mb-8">
                            As you explore SeaPearl, click the heart icon on properties that resonate with you to curate your private list.
                        </p>
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-[#C6A675] text-black text-[10px] font-black uppercase tracking-widest px-8 py-3.5 rounded-sm hover:bg-white transition-all shadow-lg"
                        >
                            Start Exploring Estates
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;