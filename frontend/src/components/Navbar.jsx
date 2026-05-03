import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, MessageSquare, Home, Menu, X, Sun, Moon, Shield, Wifi, WifiOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const LINKS = [
  { label: 'Home',       path: '/',        icon: Home },
  { label: 'Assessment', path: '/predict', icon: Activity },
  { label: 'AI Assistant', path: '/chat',   icon: MessageSquare },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [status, setStatus] = useState('checking'); // checking, online, partial, offline
  const isDark = theme === 'dark';

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    
    const checkStatus = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/status`);
        if (data.backend === 'ok' && data.ml_service === 'online' && data.model_loaded) {
          setStatus('online');
        } else if (data.backend === 'ok') {
          setStatus('partial');
        } else {
          setStatus('offline');
        }
      } catch {
        setStatus('offline');
      }
    };

    checkStatus();
    const timer = setInterval(checkStatus, 30000);
    
    return () => {
      window.removeEventListener('scroll', fn);
      clearInterval(timer);
    };
  }, [API_URL]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      
      {/* ── Desktop Backdrop ── */}
      <div className={`absolute inset-0 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl bg-slate-900/80 border-b border-white/5' : 'bg-transparent'}`} />

      <div className="relative mobile-container">
        <div className="flex items-center justify-between">
          
          {/* ── Logo ── */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 no-underline group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                <Shield size={22} className="text-white fill-white/10" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white leading-none">Pulmo<span className="text-blue-400">AI</span></span>
                <span className="hidden xs:block text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Clinical Diagnostics</span>
              </div>
            </Link>

            {/* Service Link Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <div className={`w-1.5 h-1.5 rounded-full ${
                status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse' : 
                status === 'partial' ? 'bg-yellow-500' : 
                status === 'checking' ? 'bg-slate-500 animate-pulse' : 'bg-red-500'
              }`} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {status === 'online' ? 'ML Core Linked' : status === 'partial' ? 'Base Online' : status === 'checking' ? 'Syncing...' : 'Link Severed'}
              </span>
            </div>
          </div>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/40 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
            {LINKS.map(({ label, path, icon: Icon }) => {
              const active = pathname === path;
              return (
                <Link key={path} to={path} className="no-underline">
                  <motion.div
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      active ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Theme Toggle */}
            <button 
              onClick={toggle}
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/20 transition-all duration-300"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Assessment Button (Desktop) */}
            <Link to="/predict" className="hidden lg:block no-underline">
              <button className="btn-premium px-5 py-2.5 h-10 min-h-0 text-xs uppercase tracking-widest">
                Get Started
              </button>
            </Link>

            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setMobileOpen(true)}
              className="md:hidden w-11 h-11 rounded-xl flex items-center justify-center bg-blue-600/10 border border-blue-500/20 text-blue-400"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[360px] bg-slate-900 z-[70] border-l border-white/5 shadow-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <span className="font-extrabold text-xl text-white">Menu</span>
                <button 
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {LINKS.map(({ label, path, icon: Icon }) => {
                  const active = pathname === path;
                  return (
                    <Link key={path} to={path} onClick={() => setMobileOpen(false)} className="no-underline">
                      <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${
                        active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 text-slate-400'
                      }`}>
                        <Icon size={20} />
                        <span className="font-bold">{label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-auto space-y-4">
                <div className="p-5 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-center">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">System Status</p>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500 animate-pulse' : status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                      {status === 'online' ? 'ML Neural Core Active' : status === 'partial' ? 'Base System Ready' : 'Connection Failure'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">Verified link between frontend and prediction microservices.</p>
                </div>
                <Link to="/predict" onClick={() => setMobileOpen(false)} className="no-underline">
                  <button className="btn-premium w-full py-4 uppercase tracking-[0.15em] text-xs">
                    Start Assessment
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
