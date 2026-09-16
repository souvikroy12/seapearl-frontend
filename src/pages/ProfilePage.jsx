import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { User, Mail, Lock, Shield, Heart, Briefcase, Eye, EyeOff, Loader2 } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [favCount, setFavCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);

  // Password update states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Google User Check
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  useEffect(() => {
    const info = sessionStorage.getItem("userInfo") || localStorage.getItem("userInfo");
    if (!info) {
      navigate("/login");
      return;
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(info);
    } catch (e) {
      navigate("/login");
      return;
    }

    // Set Profile Information
    setName(parsedUser.name || (parsedUser.user && parsedUser.user.name) || "");
    const userEmail = parsedUser.email || (parsedUser.user && parsedUser.user.email);
    setEmail(userEmail || "");

    // Robust Google Authentication Check
    const isOAuthUser = Boolean(
      parsedUser.googleId ||
      parsedUser.isGoogleUser === true ||
      parsedUser.authType === "google" ||
      parsedUser.user?.googleId ||
      (parsedUser.picture && parsedUser.picture.includes("googleusercontent.com")) ||
      (parsedUser.image && parsedUser.image.includes("googleusercontent.com"))
    );

    setIsGoogleUser(isOAuthUser);

    // Dynamic Favourites count
    if (userEmail) {
      const savedFavs = localStorage.getItem(`seapearl_favourites_${userEmail}`);
      if (savedFavs) {
        setFavCount(JSON.parse(savedFavs).length);
      } else {
        const oldFavs = localStorage.getItem("seapearl_favourites");
        if (oldFavs) setFavCount(JSON.parse(oldFavs).length);
        else setFavCount(0);
      }
    }

    // Fetch bookings count with Bearer token
    const fetchBookings = async () => {
      if (!userEmail) return;
      try {
        const token = parsedUser.token || (parsedUser.user && parsedUser.user.token);

        const res = await axios.get(
          `https://seapearl-backend-1.onrender.com/api/bookings/my-bookings?email=${userEmail.trim()}`,
          {
            headers: {
              ...(token && { Authorization: `Bearer ${token}` })
            },
            withCredentials: true
          }
        );

        if (res && res.data) {
          let count = 0;
          if (Array.isArray(res.data)) {
            count = res.data.length;
          } else if (res.data.bookings && Array.isArray(res.data.bookings)) {
            count = res.data.bookings.length;
          } else if (res.data.data && Array.isArray(res.data.data)) {
            count = res.data.data.length;
          } else if (typeof res.data === "object") {
            count = res.data.count || 0;
          }
          setBookingCount(count);
        }
      } catch (err) {
        console.error("Error loading dashboard count logs:", err);
      }
    };

    fetchBookings();
  }, [navigate]);
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const info = sessionStorage.getItem("userInfo") || localStorage.getItem("userInfo");
      const parsed = info ? JSON.parse(info) : null;
      const token = parsed ? (parsed.token || (parsed.user && parsed.user.token)) : null;

      if (!token) throw new Error("Session expired. Please log in again.");

      const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      };

      await axios.put("https://seapearl-backend-1.onrender.com/api/auth/profile", { oldPassword, newPassword }, config);

      Swal.fire({
        title: "SECURITY ALERT",
        text: "Access credentials modified successfully.",
        icon: "success",
        background: "#0A0A0A",
        color: "#fff",
        confirmButtonColor: "#C6A675"
      });

      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      Swal.fire({
        title: "UPDATE ERROR",
        text: err.response?.data?.message || "Verification failed.",
        icon: "error",
        background: "#0A0A0A",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-36 pb-20 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* BANNER CARD */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0F0F0F] via-[#141414] to-[#0F0F0F] border border-white/10 rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row items-center gap-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C6A675]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-24 h-24 rounded-full border-2 border-[#C6A675] p-1 shadow-[0_0_30px_rgba(198,166,117,0.2)]">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Member")}&background=C6A675&color=fff&size=128`}
              alt="Profile Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          <div className="text-center md:text-left space-y-2">
            <span className="bg-[#C6A675]/10 text-[#C6A675] text-[9px] font-black px-3 py-1 uppercase tracking-[3px] border border-[#C6A675]/20 rounded-full">
              SeaPearl Inner Circle
            </span>
            <h1 className="text-3xl md:text-4xl font-serif tracking-tight uppercase mt-2">
              Hi, <span className="text-[#C6A675] italic">{name || "Valued Member"}</span>
            </h1>
            <p className="text-white/40 text-xs tracking-wide">Premium sanctuary account access active</p>
          </div>
        </div>

        {/* QUICK COUNTERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div onClick={() => navigate("/bookings")} className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6 flex items-center justify-between cursor-pointer hover:border-[#C6A675]/20 transition-all group">
            <div className="space-y-1">
              <p className="text-white/40 text-[10px] uppercase tracking-[2px] font-bold">Active Bookings</p>
              <p className="text-3xl font-serif text-[#C6A675]">{bookingCount}</p>
            </div>
            <div className="bg-[#C6A675]/5 p-4 rounded-xl text-[#C6A675] group-hover:bg-[#C6A675]/10 transition-colors">
              <Briefcase size={20} />
            </div>
          </div>

          <div onClick={() => navigate("/wishlist")} className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6 flex items-center justify-between cursor-pointer hover:border-[#C6A675]/20 transition-all group">
            <div className="space-y-1">
              <p className="text-white/40 text-[10px] uppercase tracking-[2px] font-bold">Saved Estates</p>
              <p className="text-3xl font-serif text-[#C6A675]">{favCount}</p>
            </div>
            <div className="bg-red-500/5 p-4 rounded-xl text-red-500 group-hover:bg-red-500/10 transition-colors">
              <Heart size={20} />
            </div>
          </div>

          <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-white/40 text-[10px] uppercase tracking-[2px] font-bold">Security Status</p>
              <p className="text-sm font-sans font-bold uppercase tracking-wider text-green-400 flex items-center gap-1.5 mt-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Encrypted Session
              </p>
            </div>
            <div className="bg-green-500/5 p-4 rounded-xl text-green-400">
              <Shield size={20} />
            </div>
          </div>
        </div>

        {/* SETTINGS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">

          {/* Identity Info */}
          <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-[3px] text-[#C6A675] border-b border-white/5 pb-4">
              Personal Identity
            </h3>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-white/40 text-[10px] uppercase tracking-[2px] font-bold flex items-center gap-2">
                  <User size={12} /> Legal Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  disabled
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-4 px-5 text-white/50 text-sm outline-none cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white/40 text-[10px] uppercase tracking-[2px] font-bold flex items-center gap-2">
                  <Mail size={12} /> Registered Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-4 px-5 text-white/50 text-sm outline-none cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-white/20 italic">Note: Profile fields linked with federated auth configurations are read-only.</p>
            </div>
          </div>

          {/* Security Box */}
          <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
            <h3 className="text-sm font-bold uppercase tracking-[3px] text-[#C6A675] border-b border-white/5 pb-4">
              Security Controls
            </h3>

            {isGoogleUser ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3 bg-white/[0.01] border border-white/5 rounded-2xl my-auto">
                <Shield size={36} className="text-[#C6A675] animate-pulse" />
                <p className="text-xs uppercase tracking-[2px] font-bold text-white/80">Secured via Google Auth</p>
                <p className="text-[11px] text-white/40 max-w-xs leading-relaxed">
                  Your SeaPearl profile is locked via corporate Google verification. No separate local password management is required.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-white/40 text-[10px] uppercase tracking-[2px] font-bold flex items-center gap-2">
                    <Lock size={12} /> Current Access Key
                  </label>
                  <input
                    required
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 px-5 text-white text-sm outline-none focus:border-[#C6A675]/30 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white/40 text-[10px] uppercase tracking-[2px] font-bold flex items-center gap-2">
                    <Lock size={12} /> New Access Key
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 px-5 text-white text-sm outline-none focus:border-[#C6A675]/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#C6A675]"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C6A675] text-black font-black py-4 rounded-xl uppercase text-[10px] tracking-[2px] flex items-center justify-center gap-2 hover:bg-white transition-all mt-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : "Update Security Credentials"}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;