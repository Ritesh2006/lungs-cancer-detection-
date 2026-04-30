import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Send, Bot, User, ShieldAlert, RefreshCw,
  MessageCircle, Lightbulb, Stethoscope, Clock
} from 'lucide-react';

const SUGGESTIONS = [
  "What are the early signs of lung cancer?",
  "How much does smoking increase risk?",
  "What is a low-dose CT scan screening?",
  "Are there hereditary lung cancer risks?",
  "What lifestyle changes help reduce risk?",
  "What does shortness of breath indicate?",
];

/* ── Typing indicator ── */
const TypingDots = () => (
  <div className="flex items-center gap-1.5 px-4 py-3.5">
    {[0, 1, 2].map(i => (
      <motion.span key={i}
        className="w-1.5 h-1.5 rounded-full inline-block"
        style={{ background: 'var(--teal-400)' }}
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 1, delay: i * 0.18 }}
      />
    ))}
  </div>
);

/* ── Chat bubble ── */
const Bubble = ({ msg, idx }) => {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className="shrink-0 w-9 h-9 rounded-xl overflow-hidden border border-[var(--border-default)] shadow-sm bg-[var(--bg-elevated)]">
        <img 
          src={isUser 
            ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' 
            : 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&auto=format&fit=crop&q=80'
          } 
          alt={isUser ? 'User' : 'Assistant'} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
        style={isUser
          ? { background: 'var(--blue-600)', color: '#fff', boxShadow: '0 2px 12px rgba(37,99,235,0.3)' }
          : { background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }
        }
      >
        <p className="whitespace-pre-wrap">{msg.content}</p>
      </div>
    </motion.div>
  );
};

/* ── Main Chatbot ── */
export default function Chatbot() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hello! I'm PulmoAI — your educational lung health assistant powered by LLaMA 3.\n\nI can help with questions about lung cancer risk factors, symptoms, prevention, and general respiratory health.\n\nReminder: I'm not a doctor. Always seek professional medical advice for health concerns.",
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    setShowSuggestions(false);

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
        content: 'I could not connect to the AI service. Please ensure Ollama is running locally with LLaMA 3.',
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const clear = () => {
    setMessages([{
      role: 'assistant',
      content: 'Chat cleared. Ask me anything about lung health, risk factors, or cancer prevention.',
    }]);
    setShowSuggestions(true);
  };

  return (
    <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 py-6 sm:py-10" style={{ height: 'calc(100dvh - 108px)', minHeight: 600 }}>
        
        {/* Left Side: Chat Interface */}
        <div className="flex flex-col h-full min-h-0">
          {/* Header */}
          <div className="shrink-0 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)' }}>
                  <Stethoscope size={22} className="text-blue-500" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 flex items-center justify-center"
                  style={{ background: 'var(--green-500)', borderColor: 'var(--bg-base)' }}>
                  <span className="w-1 h-1 rounded-full bg-white animate-ping absolute" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white leading-tight">PulmoAI Assistant</h1>
                <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Active · Specialist Knowledge
                </p>
              </div>
            </div>
            <button onClick={clear} className="btn-secondary text-xs px-4 py-2">
              <RefreshCw size={14} /> Clear Chat
            </button>
          </div>

          {/* Messages Area */}
          <div ref={chatRef}
            className="flex-grow overflow-y-auto rounded-3xl p-6 space-y-6 mb-4 no-scrollbar border border-[var(--border-default)] bg-[var(--bg-inset)]"
          >
            {messages.map((msg, i) => <Bubble key={i} msg={msg} idx={i} />)}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-[rgba(37,99,235,0.1)] border border-[rgba(37,99,235,0.2)] text-blue-400">
                  <Bot size={16} />
                </div>
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-2xl rounded-tl-sm">
                  <TypingDots />
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="shrink-0 rounded-2xl p-4 border border-[var(--border-default)] bg-[var(--bg-elevated)]"
          >
            <div className="flex items-end gap-3">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                disabled={loading}
                placeholder="Describe symptoms or ask about prevention..."
                className="form-input flex-grow resize-none py-3 min-h-[48px] max-h-32 text-sm bg-[var(--bg-inset)] border-[var(--border-default)]"
              />
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all disabled:opacity-20"
                style={{
                  background: input.trim() && !loading ? 'var(--blue-600)' : 'var(--bg-overlay)',
                  boxShadow: input.trim() && !loading ? 'var(--shadow-blue)' : 'none',
                }}
              >
                <Send size={18} className="text-white" />
              </motion.button>
            </div>
            <div className="flex items-center justify-between mt-3 px-1">
              <span className="text-[10px] text-[var(--text-faint)] flex items-center gap-1.5 uppercase font-bold tracking-wider">
                <MessageCircle size={10} className="text-blue-500" />
                LLaMA 3 · Educational Response
              </span>
              <span className="text-[10px] text-[var(--text-faint)] font-medium italic">Shift + Enter for new line</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Context & Suggestions (Desktop only) */}
        <div className="hidden lg:flex flex-col gap-6 h-full overflow-y-auto no-scrollbar pb-4">
          
          {/* Medical Image context */}
          <div className="relative rounded-3xl overflow-hidden aspect-video border border-[var(--border-default)] shadow-lg">
            <img 
              src="/assets/futuristic_ai_assistant_1777367433784.png" 
              alt="Futuristic AI Assistant" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,17,23,0.9)] to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-1">Safety First</p>
              <p className="text-xs text-white leading-relaxed">
                Our AI provides information based on medical literature, but it is not a doctor.
              </p>
            </div>
          </div>

          {/* Guidelines Card */}
          <div className="card-elevated rounded-2xl p-6 border border-[var(--border-default)]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldAlert size={14} className="text-amber-500" />
              Consultation Guide
            </h3>
            <ul className="space-y-4">
              {[
                { title: 'Educational Info', text: 'Ask about risk factors, types of lung cancer, or screening guidelines.' },
                { title: 'No Diagnosis', text: 'The AI cannot confirm if you have a medical condition.' },
                { title: 'Privacy', text: 'Chat history is local and deleted when you refresh.' },
              ].map((item, i) => (
                <li key={i}>
                  <p className="text-xs font-bold text-gray-200 mb-1">{item.title}</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Suggestion Grid */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-widest px-1">Common Questions</h3>
            <div className="grid grid-cols-1 gap-2">
              {SUGGESTIONS.map((s, i) => (
                <motion.button key={i}
                  whileHover={{ x: 4, background: 'rgba(37,99,235,0.08)' }}
                  onClick={() => send(s)}
                  className="text-left text-xs p-3 rounded-xl border border-[var(--border-default)] transition-all flex items-center gap-3"
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
                >
                  <Lightbulb size={12} className="text-amber-400 shrink-0" />
                  <span className="line-clamp-1">{s}</span>
                </motion.button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
