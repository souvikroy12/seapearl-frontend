import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // Success message
  const [error, setError] = useState("");     // Error message
  const [isLocked, setIsLocked] = useState(false); // Rate limit lock state

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data } = await axios.post("https://seapearl-backend-1.onrender.com/api/auth/forgot-password", { email }); 
      setMessage(data.message); // "Reset link sent to your email! "
    } catch (err) {
      if (err.response?.status === 429) {
        setIsLocked(true);
      }
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=2000')] bg-cover bg-center px-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] p-10 shadow-2xl text-center"
      >
        {/* Animated Icon Container */}
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          className="w-20 h-20 bg-[#C6A675]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#C6A675]/30 shadow-inner"
        >
          {message ? (
            <CheckCircle2 className="text-[#C6A675]" size={32} />
          ) : (
            <Mail className="text-[#C6A675]" size={32} />
          )}
        </motion.div>

        <h2 className="text-white text-3xl font-serif mb-3">Forgot Password?</h2>
        <p className="text-white/40 text-[11px] uppercase tracking-widest leading-relaxed mb-8">
          {message ? "Check your inbox for further instructions" : "Enter your email and we'll send you a"} <br />
          <span className="text-[#C6A675] font-semibold">{message ? email : "secure recovery link"}</span>
        </p>

        <AnimatePresence mode="wait">
          {!message ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6 text-left"
            >
              {/* Error Message Alert */}
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-200 text-[10px] rounded-xl text-center italic tracking-widest uppercase">
                  {error}
                </div>
              )}

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pr-3 border-r border-white/10 group-focus-within:border-[#C6A675]/50 transition-colors">
                  <Mail className="text-[#C6A675]" size={18} />
                </div>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-4 text-white text-sm outline-none focus:border-[#C6A675]/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading || isLocked}
                className={`w-full font-black py-4 rounded-2xl uppercase text-[11px] tracking-[3px] transition-all flex items-center justify-center gap-2 ${
                  isLocked
                    ? "bg-red-500/20 text-red-300 border border-red-500/30 cursor-not-allowed opacity-70"
                    : "bg-[#C6A675] text-black hover:bg-white active:scale-[0.98] shadow-xl shadow-[#C6A675]/20"
                }`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : isLocked ? (
                  "Attempts Exceeded (Locked)"
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-[#C6A675]/10 border border-[#C6A675]/30 rounded-2xl"
            >
              <p className="text-[#C6A675] text-xs font-light tracking-wide italic">
                {message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 pt-6 border-t border-white/5">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest hover:text-[#C6A675] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;