import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams(); // URL se token nikalne ke liye
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    if (password !== confirmPassword) {
      return setError("Passwords do not match!");
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.put(`https://seapearl-backend-1.onrender.com/api/auth/reset-password/${token}`, { password });
      setMessage(data.message);
      
      // 3 second baad login page pe bhej denge
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      if (err.response?.status === 429) {
        setIsLocked(true);
      }
      setError(err.response?.data?.message || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000')] bg-cover bg-center px-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 rounded-[40px] p-10 shadow-2xl text-center"
      >
        <div className="w-20 h-20 bg-[#C6A675]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#C6A675]/20">
          <Lock className="text-[#C6A675]" size={32} />
        </div>

        <h2 className="text-white text-3xl font-serif mb-2">Set New Password</h2>
        <p className="text-white/40 text-[10px] uppercase tracking-[3px] mb-8">
          Secure your account with a <span className="text-[#C6A675]">new sanctuary key</span>
        </p>

        {message ? (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="space-y-4">
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-2xl text-green-200 text-sm italic">
              {message}
            </div>
            <p className="text-white/20 text-[10px] animate-pulse">Redirecting to login...</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {error && <p className="text-red-400 text-[10px] text-center italic uppercase">{error}</p>}
            
            {/* New Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pr-3 border-r border-white/10">
                <Lock className="text-[#C6A675]" size={18} />
              </div>
              <input 
                required
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-12 text-white text-sm outline-none focus:border-[#C6A675]/50 transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#C6A675]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pr-3 border-r border-white/10">
                <CheckCircle className="text-[#C6A675]" size={18} />
              </div>
              <input 
                required
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-4 text-white text-sm outline-none focus:border-[#C6A675]/50 transition-all"
              />
            </div>

            <button 
              type="submit"
              disabled={loading || isLocked}
              className={`w-full font-black py-4 rounded-2xl uppercase text-[11px] tracking-[3px] transition-all flex items-center justify-center gap-2 ${
                isLocked
                  ? "bg-red-500/20 text-red-300 border border-red-500/30 cursor-not-allowed opacity-70"
                  : "bg-[#C6A675] text-black hover:bg-white active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : isLocked ? (
                "Attempts Exceeded (Locked)"
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;