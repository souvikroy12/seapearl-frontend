import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 1. Dynamic Hotel details fallback configuration
    const hotelInfo = location.state || {
        hotelName: "Hotel Lingzi - At The Mall Road & Newly Renovated",
        hotelImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
        hotelAddress: "Leh, Old Fort Road",
        totalPrice: "₹ 7,750",
        checkInDate: "Aug 20, 2026",
        checkOutDate: "Aug 23, 2026",
        totalNights: 3,
        guests: { adults: 2, children: 0 },
        rooms: 1,
        roomType: "Standard Luxury Pass"
    };

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: 'India',
        bookingFor: 'main'
    });

    const [loading, setLoading] = useState(false);

    // Sync logged-in user email as initial placeholder, but keep it editable
    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo");
        if (userInfo) {
            try {
                const parsed = JSON.parse(userInfo);
                const activeEmail = parsed.email || (parsed.user && parsed.user.email) || "";
                if (activeEmail) {
                    setFormData((prev) => ({ ...prev, email: activeEmail }));
                }
            } catch (e) {
                console.error("Failed to parse userInfo session:", e);
            }
        } else {
            // Guard: Agar bina session direct link khole toh login par bhej do
            navigate('/login', { state: { from: location.pathname, hotelData: hotelInfo } });
        }
    }, [navigate, location.pathname]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        const cleanFirstName = formData.firstName.trim();
        const cleanLastName = formData.lastName.trim();
        const cleanEmail = formData.email.trim();
        const cleanPhone = formData.phone.trim();

        const nameRegex = /^[A-Za-z\s]{2,30}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\+?[0-9]{10,14}$/;

        if (!nameRegex.test(cleanFirstName)) {
            return Swal.fire({
                title: 'INVALID FIRST NAME',
                text: 'First Name should only contain alphabets and be at least 2 characters long.',
                icon: 'warning',
                background: '#0A0A0A',
                color: '#fff',
                iconColor: '#C6A675',
                confirmButtonColor: '#C6A675',
                customClass: { popup: 'border border-white/10 rounded-2xl font-serif' }
            });
        }

        if (!nameRegex.test(cleanLastName)) {
            return Swal.fire({
                title: 'INVALID LAST NAME',
                text: 'Last Name should only contain alphabets and be at least 2 characters long.',
                icon: 'warning',
                background: '#0A0A0A',
                color: '#fff',
                iconColor: '#C6A675',
                confirmButtonColor: '#C6A675',
                customClass: { popup: 'border border-white/10 rounded-2xl font-serif' }
            });
        }

        if (!emailRegex.test(cleanEmail)) {
            return Swal.fire({
                title: 'INVALID EMAIL ADDRESS',
                text: 'Please enter a valid format email.',
                icon: 'warning',
                background: '#0A0A0A',
                color: '#fff',
                iconColor: '#C6A675',
                confirmButtonColor: '#C6A675',
                customClass: { popup: 'border border-white/10 rounded-2xl font-serif' }
            });
        }

        if (!phoneRegex.test(cleanPhone)) {
            return Swal.fire({
                title: 'INVALID PHONE NUMBER',
                text: 'Please enter a valid phone number containing 10 to 14 numeric digits.',
                icon: 'warning',
                background: '#0A0A0A',
                color: '#fff',
                iconColor: '#C6A675',
                confirmButtonColor: '#C6A675',
                customClass: { popup: 'border border-white/10 rounded-2xl font-serif' }
            });
        }

        setLoading(true);

        // Sanitize numeric price value from string (e.g., "₹ 7,750" -> 7750)
        const numericTotalPrice = Number(String(hotelInfo.totalPrice).replace(/[^0-9.-]+/g, "")) || 0;

        const finalBookingData = {
            firstName: cleanFirstName,
            lastName: cleanLastName,
            email: cleanEmail, // User ka custom ya pre-filled email
            phone: cleanPhone,
            country: formData.country,
            bookingFor: formData.bookingFor,
            hotelName: hotelInfo.hotelName,
            hotelAddress: hotelInfo.hotelAddress,
            totalPrice: numericTotalPrice,
            hotelImage: hotelInfo.hotelImage,
            checkInDate: hotelInfo.checkInDate || "Aug 20, 2026",
            checkOutDate: hotelInfo.checkOutDate || "Aug 23, 2026",
            totalNights: Number(hotelInfo.totalNights) || 1,
            guests: hotelInfo.guests || { adults: 2, children: 0 },
            rooms: Number(hotelInfo.rooms) || 1,
            roomType: hotelInfo.roomType || "Standard Luxury Pass"
        };

        try {
            const userInfo = localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo");
            const token = userInfo ? JSON.parse(userInfo).token : null;

            const config = {
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` })
                },
                withCredentials: true
            };

            const response = await axios.post('http://localhost:5000/api/bookings/book-hotel', finalBookingData, config);
            
            if (response.data.success || response.status === 200 || response.status === 201) {
                Swal.fire({
                    title: 'RESERVATION CONFIRMED',
                    html: `
                        <div style="color: rgba(255,255,255,0.6); font-size: 14px; margin-top: 10px;">
                            Thank you for booking with <b style="color: #C6A675;">SeaPearl</b>.<br><br>
                            Your stay at <b>${hotelInfo.hotelName}</b> has been securely registered in our system.
                        </div>
                    `,
                    icon: 'success',
                    background: '#0A0A0A',
                    color: '#fff',
                    iconColor: '#C6A675',
                    confirmButtonColor: '#C6A675',
                    confirmButtonText: 'VIEW MY BOOKINGS',
                    customClass: {
                        popup: 'border border-white/10 rounded-2xl font-serif',
                        confirmButton: 'text-black font-sans font-bold tracking-widest uppercase px-6 py-3 rounded-md'
                    }
                }).then(() => {
                    navigate('/bookings');
                });
            }
        } catch (error) {
            console.error("Frontend Booking Error:", error);
            Swal.fire({
                title: 'BOOKING FAILED',
                text: error.response?.data?.message || 'Something went wrong. Please try again.',
                icon: 'error',
                background: '#0A0A0A',
                color: '#fff',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            window.dispatchEvent(new Event("storage"));
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen pt-28 pb-16 px-6 md:px-16 lg:px-24 font-sans text-white">
            <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-10">

                {/* LEFT COLUMN: Booking Summary */}
                <div className="w-full lg:w-[35%] space-y-6">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
                        <h3 className="text-[#C6A675] text-sm tracking-widest uppercase mb-4">Your Booking Details</h3>

                        <div className="flex gap-4 mb-6 pb-6 border-b border-white/10">
                            <img
                                src={hotelInfo.hotelImage}
                                alt={hotelInfo.hotelName}
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div>
                                <h2 className="text-xl font-serif text-white">{hotelInfo.hotelName}</h2>
                                <p className="text-white/50 text-sm mt-1">{hotelInfo.hotelAddress}</p>
                                <div className="flex items-center gap-1 mt-2 text-xs text-[#C6A675]">
                                    <span>*****</span>
                                    <span className="text-white/40 ml-2">Exceptional</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between mb-6">
                            <div>
                                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Check-in</p>
                                <p className="font-semibold">{hotelInfo.checkInDate || "Aug 20, 2026"}</p>
                                <p className="text-white/40 text-sm">From 2:00 PM</p>
                            </div>
                            <div className="text-right">
                                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Check-out</p>
                                <p className="font-semibold">{hotelInfo.checkOutDate || "Aug 23, 2026"}</p>
                                <p className="text-white/40 text-sm">Until 12:00 PM</p>
                            </div>
                        </div>

                        <div className="pb-6 border-b border-white/10 mb-6">
                            <p className="text-white/80 font-medium">
                                {hotelInfo.totalNights || 3} {hotelInfo.totalNights > 1 ? 'nights' : 'night'}, {hotelInfo.rooms || 1} room for {hotelInfo.guests?.adults || 2} adults
                            </p>
                            <p className="text-[#C6A675] text-sm mt-1">{hotelInfo.roomType || 'Standard Luxury Pass'}</p>
                        </div>

                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-lg font-serif">Total Price</h3>
                                <p className="text-white/40 text-xs mt-1">+ Taxes and fees</p>
                            </div>
                            <div className="text-3xl font-serif text-[#C6A675]">{hotelInfo.totalPrice || "₹ 7,750"}</div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Enter Details Form */}
                <div className="w-full lg:w-[65%]">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8">
                        <h2 className="text-3xl font-serif mb-6">Enter your details</h2>

                        <form onSubmit={handleSubmit} noValidate className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-white/70">First Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text" name="firstName" value={formData.firstName} required
                                        className="bg-transparent border border-white/20 rounded-md p-3 text-white focus:border-[#C6A675] focus:outline-none transition-colors"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-white/70">Last Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text" name="lastName" value={formData.lastName} required
                                        className="bg-transparent border border-white/20 rounded-md p-3 text-white focus:border-[#C6A675] focus:outline-none transition-colors"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-white/70">Email Address <span className="text-red-500">*</span></label>
                                <input
                                    type="email" name="email" value={formData.email} required
                                    placeholder="Enter your email"
                                    className="bg-transparent border border-white/20 rounded-md p-3 text-white focus:border-[#C6A675] focus:outline-none transition-colors"
                                    onChange={handleInputChange}
                                />
                                <span className="text-xs text-white/40">Confirmation email will be sent to this address</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-white/70">Country/Region <span className="text-red-500">*</span></label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        className="bg-[#0A0A0A] border border-white/20 rounded-md p-3 text-white focus:border-[#C6A675] focus:outline-none transition-colors"
                                        onChange={handleInputChange}
                                    >
                                        <option value="India">India</option>
                                        <option value="USA">United States</option>
                                        <option value="UK">United Kingdom</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-white/70">Phone Number <span className="text-red-500">*</span></label>
                                    <input
                                        type="text" name="phone" value={formData.phone} required
                                        className="bg-transparent border border-white/20 rounded-md p-3 text-white focus:border-[#C6A675] focus:outline-none transition-colors"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <h3 className="font-serif text-xl mb-4">Who are you booking for?</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio" name="bookingFor" value="main"
                                            checked={formData.bookingFor === 'main'}
                                            className="accent-[#C6A675] w-4 h-4"
                                            onChange={handleInputChange}
                                        />
                                        <span className="text-white/80">I am the main guest</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio" name="bookingFor" value="other"
                                            checked={formData.bookingFor === 'other'}
                                            className="accent-[#C6A675] w-4 h-4"
                                            onChange={handleInputChange}
                                        />
                                        <span className="text-white/80">Booking is for someone else</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-8">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#C6A675] text-black font-bold uppercase tracking-widest py-4 rounded-md hover:bg-white transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Processing..." : "Confirm Reservation"}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default CheckoutPage;