import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

const CURRENCY_MAP = {
    INR: { symbol: "₹", rate: 1, locale: "en-IN" },
    USD: { symbol: "$", rate: 84, locale: "en-US" },
    EUR: { symbol: "€", rate: 90, locale: "en-IE" },
    GBP: { symbol: "£", rate: 108, locale: "en-GB" }
};

const InvoicePage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const activeCurrency = localStorage.getItem("seapearl_currency") || "INR";

    const formatLocalizedPrice = (rawPrice) => {
        if (!rawPrice) rawPrice = 8450;
        const cleanNumericPrice = Number(rawPrice.toString().replace(/[^0-9.-]+/g, ""));
        const currentMeta = CURRENCY_MAP[activeCurrency] || CURRENCY_MAP.INR;
        const convertedPrice = Math.round(cleanNumericPrice / currentMeta.rate);
        return `${currentMeta.symbol}${convertedPrice.toLocaleString(currentMeta.locale)}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        if (typeof dateString === "string" && !isNaN(Date.parse(dateString)) && dateString.length < 15) {
            return dateString;
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };
    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/bookings/public-invoice/${bookingId}`);
                const data = res.data?.booking || res.data;
                if (data) {
                    setBooking(data);

                    // Dynamic Title set karo jo browser PDF save ke time use karega
                    const refId = data._id || data.id || bookingId;
                    const refShort = `SP-${refId.toString().slice(-6).toUpperCase()}`;
                    document.title = `SeaPearl_Invoice_${refShort}`;
                }
            } catch (err) {
                console.error("Invoice load error:", err);
                setError("Unable to load invoice. The booking link may be invalid or expired.");
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) {
            fetchInvoice();
        }

        // Page unmount hone par original title restore
        return () => {
            document.title = "SeaPearl | Luxury Sanctuaries & Global Estates";
        };
    }, [bookingId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-[#C6A675]" size={36} />
                <p className="text-[10px] uppercase tracking-[4px] text-white/40 font-mono">Generating Official Voucher Pass...</p>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center gap-4 px-6 text-center">
                <h2 className="text-2xl font-serif text-[#C6A675]">Voucher Not Found</h2>
                <p className="text-white/40 text-xs max-w-md">{error || "This reservation record could not be retrieved."}</p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 bg-[#C6A675] text-black font-bold uppercase tracking-widest text-[10px] px-6 py-3 rounded-lg hover:bg-white transition-all"
                >
                    Return to Sanctuary
                </button>
            </div>
        );
    }

    const referenceId = booking._id || booking.id || "SP-LEDGER";
    const refShort = `SP-${referenceId.toString().slice(-6).toUpperCase()}`;
    const hotelTitle = booking.hotelName || "SeaPearl Luxury Estate";
    const hotelLoc = booking.hotelAddress || "Exclusive Sanctuary";
    const guestName = `${booking.firstName || ""} ${booking.lastName || ""}`.trim() || "Valued Patron";
    const guestEmail = booking.email || "Registered Patron";
    const guestPhone = booking.phone || "N/A";
    const checkIn = formatDate(booking.checkInDate) || formatDate(booking.bookedAt) || "Aug 21, 2026";
    const checkOut = formatDate(booking.checkOutDate) || "Aug 26, 2026";
    const duration = booking.totalNights || 1;
    const guests = booking.guests?.adults || 2;
    const rooms = booking.rooms || 1;
    const category = booking.roomType || "Standard Luxury Pass";
    const priceDisplay = formatLocalizedPrice(booking.totalPrice);

    return (
        <div className="min-h-screen bg-[#080808] text-white py-10 px-4 flex flex-col items-center font-sans">
            {/* Top Controls */}
            <div className="flex justify-center gap-3 mb-6 print:hidden">
                <button
                    onClick={() => window.print()}
                    className="bg-[#C6A675] hover:bg-white text-black font-bold text-[11px] tracking-[2px] uppercase px-7 py-3 rounded-lg transition-all"
                >
                    Print / Save as PDF
                </button>
                <button
                    onClick={() => navigate("/bookings")}
                    className="bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/15 font-bold text-[11px] tracking-[1.5px] uppercase px-6 py-3 rounded-lg transition-all"
                >
                    Go To Bookings
                </button>
            </div>

            {/* Main Luxury Invoice Card (Exact Match to Your Screenshot) */}
            <div className="w-full max-w-[720px] bg-[#0d0d0d] border border-[#C6A675]/25 rounded-[20px] p-8 md:p-10 shadow-[0_25px_50px_rgba(0,0,0,0.8)] print:bg-white print:text-black print:border-none print:shadow-none print:p-0">

                {/* Header */}
                <div className="flex justify-between items-start border-b border-white/[0.08] pb-6 mb-7 print:border-neutral-200">
                    <div>
                        <h1 className="text-[#C6A675] text-2xl md:text-3xl font-light tracking-[5px] uppercase mb-1 print:text-[#9B783E]">
                            SeaPearl
                        </h1>
                        <p className="text-white/40 text-[9px] tracking-[2px] uppercase print:text-neutral-500">
                            Luxury Sanctuaries &amp; Global Estates
                        </p>
                    </div>
                    <span className="bg-[#C6A675]/10 border border-[#C6A675]/30 text-[#C6A675] text-[10px] font-bold px-3 py-1.5 rounded-md tracking-[1.5px] uppercase print:border-[#9B783E] print:text-[#9B783E]">
                        Confirmed &amp; Paid
                    </span>
                </div>

                {/* Meta Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7 text-xs">
                    <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl print:bg-neutral-50 print:border-neutral-200">
                        <span className="text-white/40 text-[9px] uppercase tracking-[1.5px] block mb-1 print:text-neutral-500">
                            Reservation Voucher ID
                        </span>
                        <span className="text-white font-bold text-[13px] print:text-black">{refShort}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl print:bg-neutral-50 print:border-neutral-200">
                        <span className="text-white/40 text-[9px] uppercase tracking-[1.5px] block mb-1 print:text-neutral-500">
                            Primary Guest
                        </span>
                        <span className="text-white font-bold text-[13px] print:text-black">{guestName}</span>
                        <div className="text-white/50 text-[11px] mt-0.5 print:text-neutral-600">
                            {guestEmail} &bull; {guestPhone}
                        </div>
                    </div>
                </div>

                {/* Hotel Card */}
                <div className="bg-[#C6A675]/[0.04] border border-[#C6A675]/15 rounded-xl p-5 mb-7 print:bg-neutral-50 print:border-neutral-200">
                    <h3 className="text-[#C6A675] text-lg font-medium mb-1 print:text-[#9B783E]">{hotelTitle}</h3>
                    <p className="text-white/50 text-xs print:text-neutral-600">{hotelLoc}</p>
                </div>

                {/* Specification Table */}
                <table className="w-full border-collapse mb-7 text-xs sm:text-sm">
                    <thead>
                        <tr className="border-b border-white/[0.08] print:border-neutral-200">
                            <th className="text-left text-white/40 text-[9px] uppercase tracking-[1.5px] pb-3 print:text-neutral-500">
                                Booking Specification
                            </th>
                            <th className="text-right text-white/40 text-[9px] uppercase tracking-[1.5px] pb-3 print:text-neutral-500">
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-white/[0.04] print:border-neutral-100">
                            <td className="py-3.5 text-white/80 print:text-neutral-800">Check-In Date</td>
                            <td className="py-3.5 text-right text-white/80 print:text-neutral-800">{checkIn} (From 2:00 PM)</td>
                        </tr>
                        <tr className="border-b border-white/[0.04] print:border-neutral-100">
                            <td className="py-3.5 text-white/80 print:text-neutral-800">Check-Out Date</td>
                            <td className="py-3.5 text-right text-white/80 print:text-neutral-800">{checkOut} (Until 12:00 PM)</td>
                        </tr>
                        <tr className="border-b border-white/[0.04] print:border-neutral-100">
                            <td className="py-3.5 text-white/80 print:text-neutral-800">Stay Duration &amp; Category</td>
                            <td className="py-3.5 text-right text-white/80 print:text-neutral-800">{duration} Night(s) &bull; {category}</td>
                        </tr>
                        <tr className="border-b border-white/[0.04] print:border-neutral-100">
                            <td className="py-3.5 text-white/80 print:text-neutral-800">Guest Capacity &amp; Rooms</td>
                            <td className="py-3.5 text-right text-white/80 print:text-neutral-800">{guests} Adults &bull; {rooms} Room</td>
                        </tr>
                        <tr className="border-t border-[#C6A675]/30 print:border-neutral-300">
                            <td className="pt-4 text-[#C6A675] text-base font-bold print:text-[#9B783E]">Total Ledger Amount</td>
                            <td className="pt-4 text-right text-[#C6A675] text-base font-bold print:text-[#9B783E]">{priceDisplay}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Footer */}
                <div className="text-center border-t border-white/[0.08] pt-6 text-white/30 text-[10px] leading-relaxed print:text-neutral-400 print:border-neutral-200">
                    <p>&copy; 2026 SeaPearl Global Reservations. This document serves as your verified check-in pass.</p>
                    <p>For concierge assistance: concierge@seapearl.com</p>
                </div>
            </div>
        </div>
    );
};

export default InvoicePage;