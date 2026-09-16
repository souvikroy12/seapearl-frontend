import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, Sparkles, Loader2 } from 'lucide-react';

const AIChatBot = () => {
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // MULTILINGUAL VOICE LOGIC 
    const speak = (text, callback) => {
        if (!window.speechSynthesis) {
            if (callback) callback();
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);

        let voices = window.speechSynthesis.getVoices();

        const isBengali = /[\u0980-\u09FF]/.test(text);
        const isHindi = /[\u0900-\u097F]/.test(text);

        let selectedVoice = voices.find(v => {
            if (isBengali) return v.lang.includes('bn-IN') || v.lang.includes('bn-BD');
            if (isHindi) return v.lang.includes('hi-IN') || v.name.includes('Hindi');
            return v.lang.includes('en-IN') || v.name.includes('Google UK English Female');
        });

        if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang;
        }

        utterance.rate = 1.0;

        utterance.onend = () => {
            if (callback) callback();
        };

        window.speechSynthesis.speak(utterance);

        if (!selectedVoice && callback) {
            setTimeout(callback, 2000);
        }
    };

    const startVoiceAssistant = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return alert("Voice recognition not supported in this browser.");

        const recognition = new SpeechRecognition();
        recognition.lang = 'hi-IN, bn-IN, en-IN';
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (e) => handleSendMessage(e.results[0][0].transcript);
        recognition.start();
    };

    // SMART ROUTING & EXECUTION 
    const handleSendMessage = async (manualInput) => {
        // Double-click / Spam guard
        if (isLoading) return;

        const query = manualInput || input;
        if (!query.trim()) return;

        setInput(query);
        setIsLoading(true);

        try {
            const res = await axios.post('https://seapearl-backend-1.onrender.com/api/ai/chat', { message: query });
            const data = res.data;

            const executeAction = () => {
                if (data.action === "NAVIGATE" && data.path) {
                    navigate(data.path.toLowerCase().trim());
                }
                else if (data.action === "SEARCH" && data.location) {
                    const cleanCity = data.location.trim();
                    const params = new URLSearchParams(); 
                    params.append("query", cleanCity);
                    params.append("location", cleanCity);    
                    navigate(`/search?${params.toString()}`); 
                }
                setInput("");
            };

            if (data.reply) {
                speak(data.reply, executeAction);
            } else {
                executeAction();
            }

        } catch (err) {
            console.error("AI Error:", err);
            // Agar backend se rate-limit warning aayi ho toh wahi bol kar sunaye
            const rateLimitMsg = err.response?.data?.reply;
            if (rateLimitMsg) {
                speak(rateLimitMsg);
            } else {
                speak("Sorry, connection weak hai.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-6 pt-32 pb-16 text-center relative min-h-[60vh] flex flex-col justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C6A675]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10">
                <h1 className="text-5xl md:text-6xl font-serif text-white mb-8 tracking-tight leading-tight uppercase">
                    Where are you <span className="text-[#C6A675] italic">looking to go?</span>
                </h1>

                <div className="relative max-w-5xl mx-auto group">
                    <div className={`absolute -inset-0.5 bg-[#C6A675] rounded-full blur opacity-10 transition-all duration-700 ${isLoading ? 'opacity-40 animate-pulse' : 'group-hover:opacity-20'}`}></div>

                    <div className="relative flex items-center bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/10 rounded-full p-1.5 transition-all shadow-2xl">
                        <div className="pl-8 pr-2 text-white/20">
                            {isLoading ? <Loader2 className="animate-spin text-[#C6A675]" size={20} /> : <Search size={20} />}
                        </div>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                            placeholder='Find your thoughts, seek your destination...'
                            className="w-full bg-transparent text-white py-4 px-4 outline-none text-lg placeholder:text-white/20 font-light"
                            disabled={isLoading}
                        />

                        <div className="flex items-center gap-2 pr-2">
                            <button
                                onClick={startVoiceAssistant}
                                title="Use Voice Command"
                                disabled={isLoading}
                                className={`p-4 rounded-full transition-all ${isListening ? 'bg-red-500/20 text-red-500 scale-110 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'hover:bg-white/5 text-[#C6A675]'}`}
                            >
                                <Mic size={22} />
                            </button>
                            <button
                                onClick={() => handleSendMessage()}
                                title="Execute AI Command"
                                className="bg-[#C6A675] hover:bg-[#d4b78a] text-black p-4 rounded-full transition-all active:scale-95 shadow-lg flex items-center justify-center"
                                disabled={isLoading}
                            >
                                <Sparkles size={22} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    {['Login Page', 'Hotels in Digha'].map((hint, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSendMessage(hint)}
                            disabled={isLoading}
                            className="text-[10px] uppercase tracking-[3px] text-white/40 hover:text-[#C6A675] transition-colors border border-white/10 hover:border-[#C6A675]/50 px-5 py-2.5 rounded-full bg-white/5 disabled:opacity-30"
                        >
                            {hint}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AIChatBot;