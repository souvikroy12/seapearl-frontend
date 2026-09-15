import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Calendar,
  User,
  Receipt,
  ArrowRight,
  Loader2,
  Compass,
  Trash2,
  AlertTriangle,
  X,
  Download
} from "lucide-react";

// Global Lightweight Exchange Multiplier Config Map Definition
const CURRENCY_MAP = {
  INR: { symbol: "₹", rate: 1, locale: "en-IN" },
  USD: { symbol: "$", rate: 84, locale: "en-US" },
  EUR: { symbol: "€", rate: 90, locale: "en-IE" },
  GBP: { symbol: "£", rate: 108, locale: "en-GB" }
};

const BookingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  // Custom Modal State
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [cancelError, setCancelError] = useState("");

  // Dynamic Localized Currency Active Context State
  const [activeCurrency, setActiveCurrency] = useState(() => {
    return localStorage.getItem("seapearl_currency") || "INR";
  });

  // SYNC REFRESH LISTENER FOR HEADER SWITCH 
  useEffect(() => {
    const handleCurrencySwitch = () => {
      const nextCurrency = localStorage.getItem("seapearl_currency") || "INR";
      setActiveCurrency(nextCurrency);
    };
    window.addEventListener("storage", handleCurrencySwitch);
    window.addEventListener("currencyUpdated", handleCurrencySwitch);
    return () => {
      window.removeEventListener("storage", handleCurrencySwitch);
      window.removeEventListener("currencyUpdated", handleCurrencySwitch);
    };
  }, []);

  // HELPER FORMATTER PIPELINE 
  const formatLocalizedPrice = (rawPrice) => {
    if (!rawPrice) rawPrice = 8450;
    const cleanNumericPrice = Number(rawPrice.toString().replace(/[^0-9.-]+/g, ""));
    const currentMeta = CURRENCY_MAP[activeCurrency] || CURRENCY_MAP.INR;
    const convertedPrice = Math.round(cleanNumericPrice / currentMeta.rate);
    return `${currentMeta.symbol}${convertedPrice.toLocaleString(currentMeta.locale)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    if (typeof dateString === 'string' && isNaN(Date.parse(dateString)) === false && dateString.length < 15) {
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

  // CLIENT-SIDE INVOICE PDF EXPORT DISPATCHER
  const handleDownloadInvoice = (booking) => {
    const referenceId = booking._id || booking.id || "SP-LEDGER";
    const refShort = `SP-${referenceId.toString().slice(-6).toUpperCase()}`;
    const hotelTitle = booking.hotelName || booking.name || "SeaPearl Luxury Estate";
    const hotelLoc = booking.hotelAddress || booking.address || "Exclusive Sanctuary";
    const guestName = `${booking.firstName || ''} ${booking.lastName || ''}`.trim() || "Valued Patron";
    const guestEmail = booking.email || "Registered Patron";
    const guestPhone = booking.phone || "N/A";
    const checkIn = formatDate(booking.checkInDate || booking.startDate) || formatDate(booking.bookedAt) || "Aug 20, 2026";
    const checkOut = formatDate(booking.checkOutDate || booking.endDate) || "Aug 23, 2026";
    const duration = booking.totalNights || 1;
    const guests = booking.guests?.adults || 2;
    const rooms = booking.rooms || 1;
    const category = booking.roomType || "Standard Luxury Pass";
    const priceDisplay = formatLocalizedPrice(booking.totalPrice);

    const invoiceWindow = window.open("", "_blank");
    if (!invoiceWindow) {
      alert("Please allow popups to preview and save your SeaPearl invoice.");
      return;
    }

    invoiceWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>SeaPearl_Invoice_${refShort}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
            body { background: #080808; color: #ffffff; padding: 40px 20px; min-height: 100vh; }
            
            .no-print { 
              display: flex; 
              justify-content: center; 
              gap: 12px; 
              margin-bottom: 24px; 
            }
            .print-btn { 
              background: #C6A675; 
              color: #000; 
              border: none; 
              padding: 12px 28px; 
              font-size: 11px; 
              font-weight: bold; 
              letter-spacing: 2px; 
              text-transform: uppercase; 
              border-radius: 8px; 
              cursor: pointer; 
              transition: all 0.2s ease;
            }
            .print-btn:hover {
              background: #ffffff;
            }
            .close-btn { 
              background: rgba(255,255,255,0.06); 
              color: #fff; 
              border: 1px solid rgba(255,255,255,0.15); 
              padding: 12px 24px; 
              font-size: 11px; 
              font-weight: bold; 
              letter-spacing: 1.5px; 
              text-transform: uppercase; 
              border-radius: 8px; 
              cursor: pointer; 
            }
            .close-btn:hover {
              background: rgba(255,255,255,0.12);
            }

            .container { 
              max-width: 720px; 
              margin: 0 auto; 
              background: #0d0d0d; 
              border: 1px solid rgba(198, 166, 117, 0.25); 
              border-radius: 20px; 
              padding: 40px; 
              box-shadow: 0 25px 50px rgba(0,0,0,0.8); 
            }
            .header { 
              display: flex; 
              justify-content: space-between; 
              align-items: flex-start; 
              border-bottom: 1px solid rgba(255,255,255,0.08); 
              padding-bottom: 24px; 
              margin-bottom: 28px; 
            }
            .brand h1 { color: #C6A675; font-size: 26px; letter-spacing: 5px; font-weight: 300; text-transform: uppercase; margin-bottom: 4px; }
            .brand p { color: rgba(255,255,255,0.4); font-size: 9px; letter-spacing: 2px; text-transform: uppercase; }
            .badge { background: rgba(198, 166, 117, 0.1); border: 1px solid rgba(198, 166, 117, 0.3); color: #C6A675; padding: 6px 12px; border-radius: 6px; font-size: 10px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; }
            
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; font-size: 12px; }
            .meta-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; }
            .meta-label { color: rgba(255,255,255,0.4); font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px; display: block; }
            .meta-val { color: #ffffff; font-weight: 600; font-size: 13px; }
            
            .hotel-card { background: rgba(198, 166, 117, 0.04); border: 1px solid rgba(198, 166, 117, 0.15); border-radius: 14px; padding: 20px; margin-bottom: 28px; }
            .hotel-card h3 { color: #C6A675; font-size: 18px; font-weight: 500; margin-bottom: 4px; }
            .hotel-card p { color: rgba(255,255,255,0.5); font-size: 12px; }
            
            table { width: 100%; border-collapse: collapse; margin-bottom: 28px; font-size: 13px; }
            th { text-align: left; color: rgba(255,255,255,0.4); font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); }
            td { padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.04); color: rgba(255,255,255,0.8); }
            .total-row td { border-bottom: none; border-top: 1px solid rgba(198, 166, 117, 0.3); padding-top: 18px; color: #C6A675; font-size: 16px; font-weight: bold; }
            
            .footer { text-align: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px; color: rgba(255,255,255,0.3); font-size: 10px; line-height: 1.6; }

            @media print { 
              .no-print { display: none !important; } 
              body { padding: 0; background: #fff !important; color: #000 !important; } 
              .container { border: none !important; box-shadow: none !important; background: #fff !important; color: #000 !important; max-width: 100%; } 
              .brand h1 { color: #9B783E !important; } 
              .badge { color: #9B783E !important; border-color: #9B783E !important; background: transparent !important; } 
              .meta-card, .hotel-card { background: #f8f8f8 !important; border-color: #eee !important; } 
              .hotel-card h3 { color: #9B783E !important; } 
              .hotel-card p, .meta-label, th, .footer { color: #666 !important; } 
              .meta-val, td { color: #000 !important; } 
              .total-row td { color: #9B783E !important; border-top-color: #9B783E !important; } 
            }
          </style>
        </head>
        <body>
          <div class="no-print">
            <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
            <button class="close-btn" onclick="window.close()">Close Pass</button>
          </div>

          <div class="container">
            <div class="header">
              <div class="brand">
                <h1>SEAPEARL</h1>
                <p>Luxury Sanctuaries & Global Estates</p>
              </div>
              <div class="badge">Confirmed & Paid</div>
            </div>

            <div class="meta-grid">
              <div class="meta-card">
                <span class="meta-label">Reservation Voucher ID</span>
                <span class="meta-val">${refShort}</span>
              </div>
              <div class="meta-card">
                <span class="meta-label">Primary Guest</span>
                <span class="meta-val">${guestName}</span>
                <div style="color: rgba(255,255,255,0.5); font-size: 11px; margin-top: 2px;">${guestEmail} &bull; ${guestPhone}</div>
              </div>
            </div>

            <div class="hotel-card">
              <h3>${hotelTitle}</h3>
              <p>${hotelLoc}</p>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Booking Specification</th>
                  <th style="text-align: right;">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Check-In Date</td>
                  <td style="text-align: right;">${checkIn} (From 2:00 PM)</td>
                </tr>
                <tr>
                  <td>Check-Out Date</td>
                  <td style="text-align: right;">${checkOut} (Until 12:00 PM)</td>
                </tr>
                <tr>
                  <td>Stay Duration & Category</td>
                  <td style="text-align: right;">${duration} Night(s) &bull; ${category}</td>
                </tr>
                <tr>
                  <td>Guest Capacity & Rooms</td>
                  <td style="text-align: right;">${guests} Adults &bull; ${rooms} Room</td>
                </tr>
                <tr class="total-row">
                  <td>Total Ledger Amount</td>
                  <td style="text-align: right;">${priceDisplay}</td>
                </tr>
              </tbody>
            </table>

            <div class="footer">
              <p>&copy; 2026 SeaPearl Global Reservations. This document serves as your verified check-in pass.</p>
              <p>For concierge assistance: concierge@seapearl.com</p>
            </div>
          </div>
        </body>
      </html>
    `);
    invoiceWindow.document.close();
  };

  useEffect(() => {
    // LocalStorage ko priority dekar naye tab ke state loss ko handle karein
    const info = sessionStorage.getItem("userInfo");
    if (!info) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(info);

    const fetchMyBookings = async () => {
      try {
        if (parsedUser.email) {
          const res = await axios.get(
            `http://localhost:5000/api/bookings/my-bookings?email=${parsedUser.email}`,
            {
              headers: {
                ...(parsedUser.token && { Authorization: `Bearer ${parsedUser.token}` })
              },
              withCredentials: true
            }
          );
          if (res.data) {
            let extractedBookings = [];
            if (Array.isArray(res.data)) {
              extractedBookings = res.data;
            } else if (res.data.bookings && Array.isArray(res.data.bookings)) {
              extractedBookings = res.data.bookings;
            } else if (res.data.data && Array.isArray(res.data.data)) {
              extractedBookings = res.data.data;
            }
            setBookings(extractedBookings);

            // Agar URL query mein direct bookingId maujood hai toh uska invoice pop up karein
            const searchParams = new URLSearchParams(location.search);
            const targetId = searchParams.get("bookingId");
            if (targetId && extractedBookings.length > 0) {
              const matched = extractedBookings.find(
                (b) => String(b._id) === String(targetId) || String(b.id) === String(targetId)
              );
              if (matched) {
                handleDownloadInvoice(matched);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error loading itineraries inside bookings dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [navigate, location.search]);

  // CANCEL / DELETE BOOKING CONFIRMATION ACTION
  const confirmCancelBooking = async () => {
    if (!selectedBookingForCancel) return;
    const bookingId = selectedBookingForCancel._id || selectedBookingForCancel.id;

    try {
      setCancellingId(bookingId);
      setCancelError("");
      const res = await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, { withCredentials: true });

      if (res.status === 200 || res.data.success) {
        setBookings((prev) => prev.filter((b) => (b._id || b.id) !== bookingId));
        setSelectedBookingForCancel(null);
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      setCancelError(error.response?.data?.message || "Failed to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#C6A675]" size={36} />
        <p className="text-[10px] uppercase tracking-[4px] text-white/40">Syncing Luxury Itineraries...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-36 pb-20 px-6 lg:px-12 relative">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* PAGE HEADER */}
        <div className="border-b border-white/5 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[#C6A675] text-[10px] uppercase tracking-[3px] font-black">Member Registry</p>
            <h1 className="text-3xl md:text-4xl font-serif tracking-tight uppercase">Your Booking Ledger</h1>
          </div>
          <div className="bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl text-xs text-white/50 tracking-wide font-light">
            Total Reservations: <span className="text-[#C6A675] font-bold">{bookings.length}</span>
          </div>
        </div>

        {/* 1. ZERO STATE */}
        {bookings.length === 0 ? (
          <div className="border border-white/5 bg-[#0A0A0A] rounded-[32px] p-12 md:p-20 text-center flex flex-col items-center justify-center space-y-6 max-w-2xl mx-auto shadow-2xl">
            <div className="bg-[#C6A675]/5 p-6 rounded-full text-[#C6A675] border border-[#C6A675]/10 animate-pulse">
              <Compass size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-serif text-white uppercase tracking-wide">No active sanctuaries reserved</h3>
              <p className="text-white/40 text-xs max-w-sm mx-auto leading-relaxed font-light">
                Your private travel ledger is currently empty. Your luxury gateway passport is waiting for its next destination.
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="bg-[#C6A675] text-black font-black text-[10px] uppercase tracking-[2px] px-8 py-4 rounded-xl hover:bg-white transition-all flex items-center gap-2"
            >
              Explore Sanctuaries <ArrowRight size={14} />
            </button>
          </div>
        ) : (

          // 2. ACTIVE VIEW: ITINERARY CARDS
          <div className="space-y-6">
            {bookings.map((booking, idx) => {
              const referenceId = booking._id || booking.id || `SP-${10000 + idx}`;
              const checkInDisplay = formatDate(booking.checkInDate || booking.startDate) || formatDate(booking.bookedAt) || "Aug 20, 2026";
              const checkOutDisplay = formatDate(booking.checkOutDate || booking.endDate) || "Aug 23, 2026";
              const nightsCount = booking.totalNights || 3;
              const adultCount = booking.guests?.adults || 2;
              const roomCount = booking.rooms || 1;

              return (
                <div
                  key={referenceId}
                  className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6 items-center hover:border-[#C6A675]/20 transition-all duration-500 shadow-xl group"
                >
                  {/* LEFT COLUMN: IMAGE & BADGE */}
                  <div className="relative h-40 w-full lg:h-full rounded-2xl overflow-hidden border border-white/5 shadow-inner">
                    <img
                      src={booking.hotelImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80"}
                      alt="Sanctuary Thumbnail"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    <span className="absolute bottom-3 left-3 bg-emerald-500/10 text-emerald-400 text-[8px] font-black px-2.5 py-1 uppercase tracking-[1.5px] border border-emerald-500/20 backdrop-blur-md rounded-md flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Confirmed Stay
                    </span>
                  </div>

                  {/* CENTER COLUMN: CORE DETAILS */}
                  <div className="lg:col-span-2 space-y-4 lg:px-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-serif text-[#C6A675] group-hover:text-white transition-colors uppercase tracking-tight">
                        {booking.hotelName || booking.name || "Premium SeaPearl Property"}
                      </h3>
                      <p className="text-white/40 text-[11px] font-light flex items-center gap-1.5 tracking-wide">
                        <MapPin size={12} className="text-[#C6A675]/50" />
                        {booking.hotelAddress || booking.address || "Exclusive Location"}
                      </p>
                    </div>

                    {/* Timeline Box with Duration Badge */}
                    <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl grid grid-cols-2 gap-4 text-center relative overflow-hidden">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <span className="bg-[#0A0A0A] border border-white/10 text-[#C6A675] text-[9px] font-mono font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-md">
                          {nightsCount} {nightsCount > 1 ? "Nights" : "Night"}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[8px] uppercase tracking-[1.5px] text-white/30 font-bold block">Check-In</span>
                        <span className="text-xs font-sans font-bold text-white/80">{checkInDisplay}</span>
                      </div>
                      <div className="space-y-0.5 border-l border-white/5">
                        <span className="text-[8px] uppercase tracking-[1.5px] text-white/30 font-bold block">Check-Out</span>
                        <span className="text-xs font-sans font-bold text-white/80">{checkOutDisplay}</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: BILL & ACTIONS */}
                  <div className="border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8 h-full flex flex-col justify-between space-y-4 text-right items-end lg:justify-center">

                    <div className="space-y-0.5 text-right">
                      <div className="text-white/60 text-[10px] uppercase tracking-wider flex items-center justify-end gap-1.5 font-medium">
                        <User size={12} className="text-[#C6A675]" />
                        <span>{adultCount} Adults · {roomCount} Room</span>
                      </div>
                      <span className="text-[9px] text-[#C6A675]/80 uppercase tracking-widest font-light block">
                        {booking.roomType || "Standard Luxury Pass"}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-2xl font-serif text-[#C6A675]">
                        {formatLocalizedPrice(booking.totalPrice)}
                      </p>
                      <p className="text-[8px] text-white/20 uppercase tracking-[1.5px] font-bold">All-Inclusive Ledger Price</p>
                    </div>

                    <div className="flex items-center gap-2 w-full justify-end flex-wrap">
                      <div className="text-white/20 text-[9px] font-mono tracking-tighter bg-white/[0.02] px-2 py-1 border border-white/5 rounded-md">
                        Ref: <span className="text-white/40 font-bold select-all">{referenceId.substring(0, 8)}</span>
                      </div>

                      {/* DOWNLOAD INVOICE BUTTON */}
                      <button
                        onClick={() => handleDownloadInvoice(booking)}
                        className="bg-[#C6A675]/10 hover:bg-[#C6A675]/20 text-[#C6A675] border border-[#C6A675]/20 px-2.5 py-1.5 rounded-md text-[9px] uppercase tracking-wider font-bold transition-all flex items-center gap-1 hover:scale-105 active:scale-95"
                        title="Download Invoice PDF"
                      >
                        <Download size={11} />
                        <span>Invoice</span>
                      </button>

                      {/* CANCEL TRIGGER BUTTON */}
                      <button
                        onClick={() => {
                          setCancelError("");
                          setSelectedBookingForCancel(booking);
                        }}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-2.5 py-1.5 rounded-md text-[9px] uppercase tracking-wider font-bold transition-all flex items-center gap-1 hover:scale-105 active:scale-95"
                        title="Cancel this reservation"
                      >
                        <Trash2 size={11} />
                        <span>Cancel</span>
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* SEAPEARL SIGNATURE CONFIRMATION MODAL */}
      <AnimatePresence>
        {selectedBookingForCancel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!cancellingId) setSelectedBookingForCancel(null);
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-md bg-[#0F0F0F] border border-white/10 rounded-[32px] p-8 shadow-2xl text-center space-y-6 overflow-hidden"
            >
              <button
                onClick={() => setSelectedBookingForCancel(null)}
                disabled={Boolean(cancellingId)}
                className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors disabled:opacity-30"
              >
                <X size={18} />
              </button>

              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400 shadow-inner">
                <AlertTriangle size={28} />
              </div>

              <div className="space-y-2">
                <p className="text-[#C6A675] text-[10px] uppercase tracking-[3px] font-black">
                  Reservation Protocol
                </p>
                <h3 className="text-2xl font-serif text-white uppercase tracking-tight">
                  Cancel Sanctuary?
                </h3>
                <p className="text-white/40 text-xs leading-relaxed font-light">
                  Are you sure you want to revoke your stay at <span className="text-[#C6A675] font-medium">{selectedBookingForCancel.hotelName || "this property"}</span>? This ledger entry will be permanently removed.
                </p>
              </div>

              {cancelError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] rounded-xl text-center font-medium">
                  {cancelError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForCancel(null)}
                  disabled={Boolean(cancellingId)}
                  className="w-full bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/10 font-bold py-3.5 rounded-xl uppercase text-[10px] tracking-[2px] transition-all disabled:opacity-50"
                >
                  Retain Stay
                </button>

                <button
                  type="button"
                  onClick={confirmCancelBooking}
                  disabled={Boolean(cancellingId)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-3.5 rounded-xl uppercase text-[10px] tracking-[2px] transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancellingId ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    "Revoke Pass"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingsPage;