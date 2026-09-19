import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ChevronRight, Loader2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Bulletproof Dynamic Redirect Resolver
  const getRedirectDestination = () => {
    const targetPath = location.state?.from || sessionStorage.getItem("redirect_after_login") || "/";

    let targetHotelData = location.state?.hotelData;
    if (!targetHotelData) {
      const cached = sessionStorage.getItem("redirect_hotel_data");
      if (cached) {
        try {
          targetHotelData = JSON.parse(cached);
        } catch (e) {
          targetHotelData = null;
        }
      }
    }

    sessionStorage.removeItem("redirect_after_login");
    sessionStorage.removeItem("redirect_hotel_data");

    return {
      path: targetPath,
      options: targetHotelData ? { state: { hotelData: targetHotelData } } : {}
    };
  };

  // 1. Standard Form Login (Sets isGoogleUser: false)
  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(
        "https://seapearl-backend-1.onrender.com/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const rawUser = data.user ? { ...data.user, token: data.token } : data;
      const userPayload = {
        ...rawUser,
        email: rawUser.email || email,
        isGoogleUser: false
      };

      sessionStorage.setItem("userInfo", JSON.stringify(userPayload));
      localStorage.setItem("userInfo", JSON.stringify(userPayload));

      const destination = getRedirectDestination();
      navigate(destination.path, destination.options);
    } catch (err) {
      if (err.response?.status === 429) {
        setIsLocked(true);
      }

      let displayError = "Invalid email or password.";
      if (err.response?.data?.message) {
        displayError = err.response.data.message;
      } else if (err.message?.includes("401") || err.response?.status === 401) {
        displayError = "Invalid email or password.";
      } else if (err.message?.includes("400") || err.response?.status === 400) {
        displayError = "Please fill in all fields correctly.";
      } else if (err.request) {
        displayError = "Server is unreachable. Please try again later.";
      }

      setError(displayError);
    } finally {
      setLoading(false);
    }
  };

  // 2. Google OAuth Custom Trigger
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError("");
      try {
        const userInfoRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          withCredentials: false,
        });
        const googleUser = userInfoRes.data;

        const { data } = await axios.post(
          "https://seapearl-backend-1.onrender.com/api/auth/google-login",
          { name: googleUser.name, email: googleUser.email, image: googleUser.picture },
          { withCredentials: true }
        );

        const rawUser = data.user ? { ...data.user, token: data.token } : data;
        const userPayload = {
          ...rawUser,
          email: rawUser.email || googleUser.email,
          isGoogleUser: true
        };

        sessionStorage.setItem("userInfo", JSON.stringify(userPayload));
        localStorage.setItem("userInfo", JSON.stringify(userPayload));

        const destination = getRedirectDestination();
        navigate(destination.path, destination.options);
      } catch (err) {
        if (err.response?.status === 429) {
          setIsLocked(true);
        }
        let displayError = "Google Authentication failed.";
        if (err.response?.data?.message) {
          displayError = err.response.data.message;
        } else if (err.request) {
          displayError = "Server connection lost during Google Auth.";
        }
        setError(displayError);
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google Identity Token generation failed."),
  });

  return (
    <div className="relative min-h-[920px] w-full flex items-center justify-center bg-[#0A0A0A] overflow-hidden px-6 pt-24 pb-16">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=2000')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/85 backdrop-blur-[4px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[480px] flex flex-col bg-[#0F0F0F]/95 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 pb-4 text-center">
          <h2 className="text-white text-3xl md:text-4xl font-serif mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-white/40 text-[10px] text-sm font-light italic">Unlock exclusive sanctuary prices.</p>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-8 md:px-12 pb-10 custom-scrollbar">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center italic uppercase tracking-[1px]">
              ⚠️ {error}
            </div>
          )}

          {/* Standard Clean Google Button */}
          <div className="flex justify-center mb-8">
            <button
              type="button"
              onClick={() => triggerGoogleLogin()}
              className="w-[320px] h-[44px] bg-[#131314] hover:bg-[#1a1a1c] border border-white/15 rounded-full flex items-center justify-center gap-3 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-white text-sm font-semibold tracking-wide">Sign in with Google</span>
            </button>
          </div>

          <div className="relative mb-8 flex items-center justify-center">
            <div className="absolute w-full border-t border-white/5"></div>
            <span className="relative bg-[#0F0F0F] px-4 text-[9px] text-white/20 uppercase tracking-[4px] font-bold">or use email</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[#C6A675] text-[10px] uppercase tracking-[2px] font-bold ml-1 flex items-center gap-2">
                <Mail size={12} /> Email Address
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 text-white text-base outline-none focus:border-[#C6A675]/50 transition-all placeholder:text-white/5"
                placeholder="e.g. james@seapearl.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#C6A675] text-[10px] uppercase tracking-[2px] font-bold ml-1 flex items-center gap-2">
                <Lock size={12} /> Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-5 pr-12 text-white text-base outline-none focus:border-[#C6A675]/50 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#C6A675]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Link to="/forgot-password" className="text-[#C6A675] text-[12px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || isLocked}
              className={`w-full py-4 rounded-2xl uppercase text-[11px] tracking-[2px] flex items-center justify-center gap-2 transition-all mt-4 font-black ${isLocked
                  ? "bg-red-500/20 text-red-400 border border-red-500/30 cursor-not-allowed opacity-70"
                  : "bg-[#C6A675] text-black hover:bg-white active:scale-[0.98]"
                }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : isLocked ? (
                "Attempts Exceeded (Locked)"
              ) : (
                <>Sign In <ChevronRight size={18} /></>
              )}
            </button>
          </form>

          <p className="text-center text-white/30 text-[14px] mt-8 tracking-wide">
            New to SeaPearl?{" "}
            <Link to="/register" className="text-[#C6A675] font-black hover:text-white ml-1 uppercase">Create Account</Link>
          </p>
        </div>
      </motion.div>

      {/* Custom Scrollbar Styling */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(198, 166, 117, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(198, 166, 117, 0.3); }
      `}} />
    </div>
  );
};

export default LoginPage;