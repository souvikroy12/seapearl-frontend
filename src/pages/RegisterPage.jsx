import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader2, CheckCircle2 } from "lucide-react"; 
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  // --- States for Form Data ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLocked, setIsLocked] = useState(false); // Rate limit lock state
  
  const navigate = useNavigate();

  // --- Registration Logic ---
  const handleRegister = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);
    setError("");

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      };

      // Backend API Call
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password },
        config
      );

      console.log("Registration Success & Email Triggered! ✅", data);

      // 1. LocalStorage mein data save karo (Auto-login)
      sessionStorage.setItem("userInfo", JSON.stringify(data));

      // 2. Success message ke baad redirect
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      if (err.response?.status === 429) {
        setIsLocked(true);
      }
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=2000')] bg-cover bg-center px-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] p-10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <h2 className="text-white text-4xl font-serif mb-2">Join SeaPearl</h2>
          <p className="text-white/50 text-sm font-light italic text-[11px] uppercase tracking-widest">Start your luxury journey today</p>
        </div>

        {/* Error or Success Messages */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 text-red-200 text-xs rounded-xl text-center italic">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pr-3 border-r border-white/10">
               <User className="text-[#C6A675]" size={18} />
            </div>
            <input 
              required
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-4 text-white text-sm outline-none focus:border-[#C6A675]/50 transition-all placeholder:text-white/20"
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pr-3 border-r border-white/10">
               <Mail className="text-[#C6A675]" size={18} />
            </div>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-4 text-white text-sm outline-none focus:border-[#C6A675]/50 transition-all placeholder:text-white/20"
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pr-3 border-r border-white/10">
               <Lock className="text-[#C6A675]" size={18} />
            </div>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create Password" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-4 text-white text-sm outline-none focus:border-[#C6A675]/50 transition-all placeholder:text-white/20"
            />
          </div>

          <button 
            type="submit"
            disabled={loading || isLocked}
            className={`w-full font-black py-4 rounded-2xl uppercase text-[11px] tracking-[3px] transition-all shadow-xl shadow-[#C6A675]/20 mt-4 flex items-center justify-center gap-2 ${
              isLocked
                ? "bg-red-500/20 text-red-300 border border-red-500/30 cursor-not-allowed opacity-70"
                : "bg-[#C6A675] text-black hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : isLocked ? (
              "Attempts Exceeded (Locked)"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-white/5">
            <p className="text-white/40 text-[10px] uppercase tracking-widest">
              Already have an account? <Link to="/login" className="text-[#C6A675] font-bold hover:text-white transition-colors ml-1">Login</Link>
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;