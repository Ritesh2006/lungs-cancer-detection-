import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Send, Bot, User, ShieldAlert, RefreshCw,
  MessageCircle, Lightbulb, Stethoscope, Clock, ChevronDown, Shield, Trash2
} from 'lucide-react';

const SUGGESTIONS = [
  "Early signs of lung cancer?",
  "How much does smoking increase risk?",
  "What is LDCT screening?",
  "Hereditary risk factors?",
  "Lifestyle changes to reduce risk?",
];

const TypingDots = () => (
  <div className="flex items-center gap-1.5 px-3 py-2">
    {[0, 1, 2].map(i => (
      <motion.span key={i}
        className="w-1.5 h-1.5 rounded-full bg-blue-500"
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 1, delay: i * 0.18 }}
      />
    ))}
  </div>
);

const Bubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 sm:gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border shadow-sm ${
        isUser ? 'bg-blue-600 border-blue-500' : 'bg-slate-800 border-white/10'
      }`}>
        {isUser ? <User size={18} className="text-white" /> : <Bot size={18} className="text-blue-400" />}
      </div>

      <div
        className={`max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-lg ${
          isUser 
            ? 'bg-blue-600 text-white rounded-tr-none' 
            : 'bg-slate-800/80 backdrop-blur-md border border-white/5 text-slate-300 rounded-tl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{msg.content}</p>
      </div>
    </motion.div>
  );
};

export default function Chatbot() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hello! I'm PulmoAI — your educational lung health assistant. How can I help you today?",
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');

    const updated = [...messages, { role: 'user', content: msg }];
    setMessages(updated);
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const { data } = await axios.post(`${API_URL}/chat`, {
        message: msg,
        history: messages,
      });
      setMessages([...updated, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([...updated, {
        role: 'assistant',
        content: 'Connection error. Please ensure the backend services are active.',
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const clear = () => {
    setMessages([{
      role: 'assistant',
      content: 'Conversation history cleared. Ask me anything about lung health.',
    }]);
  };

  return (
    <div className="relative h-[calc(100vh-80px)] overflow-hidden flex flex-col py-6 sm:py-10">
      <div className="glow-bg top-[-5%] right-[-5%] opacity-10" />
      
      <div className="mobile-container flex-grow flex flex-col min-h-0">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
              <Stethoscope className="text-blue-400" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white leading-none mb-1">Health Assistant</h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Specialist AI</span>
              </div>
            </div>
          </div>
          <button onClick={clear} className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-slate-500 hover:text-red-400 transition-colors">
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
          
          {/* Main Chat Area */}
          <div className="lg:col-span-8 flex flex-col min-h-0">
            <div className="flex-grow overflow-y-auto no-scrollbar space-y-6 pr-2 mb-6">
              {messages.map((msg, i) => <Bubble key={i} msg={msg} />)}
              {loading && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center">
                    <Bot size={18} className="text-blue-400" />
                  </div>
                  <div className="bg-slate-800/80 backdrop-blur-md border border-white/5 rounded-2xl rounded-tl-none">
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="glass-card p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                disabled={loading}
                placeholder="Ask your health question..."
                className="flex-grow bg-transparent border-none outline-none text-sm text-white px-4 py-3 resize-none min-h-[48px] max-h-32"
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  input.trim() && !loading ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-800 text-slate-600'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>

          {/* Right Sidebar Info */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-6 overflow-y-auto no-scrollbar">
            <div className="glass-card p-6 border-blue-500/10">
              <div className="flex items-center gap-3 mb-4">
                <ShieldAlert size={18} className="text-blue-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Safety Guidelines</h3>
              </div>
              <ul className="space-y-4">
                {[
                  { title: 'Educational Purpose', text: 'This assistant provides general health information based on medical literature.' },
                  { title: 'No Diagnosis', text: 'It cannot diagnose medical conditions. Consult a professional for that.' },
                  { title: 'Data Privacy', text: 'Your conversation is encrypted and not stored permanently.' }
                ].map((item, i) => (
                  <li key={i} className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-200">{item.title}</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2">Common Inquiries</p>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => send(s)}
                  className="w-full text-left p-4 rounded-2xl glass-card text-xs font-semibold text-slate-400 hover:text-white transition-all flex items-center justify-between group"
                >
                  {s}
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
