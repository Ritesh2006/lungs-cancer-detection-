import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, MessageSquare, Home, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const LINKS = [
  { label: 'Home',       path: '/',        icon: Home },
  { label: 'Assessment', path: '/predict', icon: Activity },
  { label: 'AI Chat',    path: '/chat',    icon: MessageSquare },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 6);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header className="sticky top-0 z-50">

      {/* ── Medical disclaimer strip ── */}
      <div style={{
        background: isDark ? '#161b22' : '#f6f8fa',
        borderBottom: `1px solid ${isDark ? '#21262d' : '#d0d7de'}`,
        padding: '5px 0',
        textAlign: 'center',
        fontSize: 11,
        color: isDark ? '#6e7681' : '#57606a',
        letterSpacing: '0.01em',
        lineHeight: 1,
      }}>
        ⚕&nbsp; For educational awareness only — not a substitute for professional medical diagnosis or treatment
      </div>

      {/* ── Main navigation ── */}
      <nav style={{
        background: scrolled
          ? isDark ? 'rgba(13,17,23,0.97)' : 'rgba(255,255,255,0.97)'
          : isDark ? 'rgba(13,17,23,0.88)' : 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${isDark ? '#21262d' : '#d0d7de'}`,
        boxShadow: scrolled
          ? isDark ? '0 1px 16px rgba(0,0,0,0.4)' : '0 1px 16px rgba(0,0,0,0.08)'
          : 'none',
        transition: 'background 0.2s, box-shadow 0.2s',
      }}>
        <div style={{
          maxWidth: 1152,
          margin: '0 auto',
          padding: '0 24px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}>

          {/* ── Logo ── */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {/* Icon */}
            <div style={{
              width: 32, height: 32,
              borderRadius: 8,
              background: 'var(--blue-600)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {/* Lung icon as SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a2 2 0 0 0-2 2v6.5C7.5 11 5 13.5 5 17a5 5 0 0 0 10 0V4a2 2 0 0 0-2-2z"/>
                <path d="M12 2a2 2 0 0 1 2 2v6.5c2.5.5 5 3 5 6.5a5 5 0 0 1-10 0V4a2 2 0 0 1 2-2z"/>
              </svg>
            </div>
            {/* Brand name */}
            <div>
              <div style={{
                fontSize: 15, fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}>
                PulmoAI
              </div>
              <div style={{
                fontSize: 9, fontWeight: 500,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}>
                Lung Health
              </div>
            </div>
          </Link>

          {/* ── Center nav links (desktop) ── */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="hidden md:flex">
            {LINKS.map(({ label, path, icon: Icon }) => {
              const active = pathname === path;
              return (
                <Link key={path} to={path} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: active ? 'var(--bg-elevated)' : 'transparent',
                    borderBottom: `2px solid ${active ? 'var(--blue-500)' : 'transparent'}`,
                    transition: 'all 0.12s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'var(--bg-surface)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                  >
                    <Icon size={13} style={{ color: active ? 'var(--blue-400)' : 'inherit', flexShrink: 0 }} />
                    {label}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* ── Right side controls ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={toggle}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                width: 34, height: 34, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-elevated)',
                border: `1px solid ${isDark ? '#30363d' : '#d0d7de'}`,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'background 0.12s, border-color 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-overlay)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.span key="sun"
                    initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 30 }} transition={{ duration: 0.15 }}>
                    <Sun size={15} color="#d29922" />
                  </motion.span>
                ) : (
                  <motion.span key="moon"
                    initial={{ opacity: 0, rotate: 30 }} animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -30 }} transition={{ duration: 0.15 }}>
                    <Moon size={15} color="var(--blue-500)" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Primary CTA — desktop */}
            <Link to="/predict" style={{ textDecoration: 'none' }} className="hidden sm:block">
              <motion.div
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'var(--blue-600)',
                  color: '#fff',
                  padding: '7px 16px',
                  borderRadius: 8,
                  fontSize: 13, fontWeight: 600,
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 0 0 1px var(--blue-700), inset 0 1px 0 rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'filter 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; }}
              >
                <Activity size={13} />
                Get Assessment
              </motion.div>
            </Link>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden"
              style={{
                width: 34, height: 34, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-elevated)',
                border: `1px solid ${isDark ? '#30363d' : '#d0d7de'}`,
                cursor: 'pointer', color: 'var(--text-secondary)',
              }}
            >
              <AnimatePresence mode="wait">
                {mobileOpen
                  ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X size={16} />
                    </motion.span>
                  : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu size={16} />
                    </motion.span>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              style={{
                overflow: 'hidden',
                borderTop: `1px solid ${isDark ? '#21262d' : '#d0d7de'}`,
                background: isDark ? '#161b22' : '#f6f8fa',
              }}
            >
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {LINKS.map(({ label, path, icon: Icon }) => {
                  const active = pathname === path;
                  return (
                    <Link key={path} to={path} style={{ textDecoration: 'none' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 14px', borderRadius: 8,
                        fontSize: 13, fontWeight: active ? 600 : 400,
                        color: active ? 'var(--blue-400)' : 'var(--text-secondary)',
                        background: active ? 'rgba(31,111,235,0.08)' : 'transparent',
                        borderLeft: `3px solid ${active ? 'var(--blue-500)' : 'transparent'}`,
                      }}>
                        <Icon size={14} /> {label}
                      </div>
                    </Link>
                  );
                })}
                {/* Mobile CTA */}
                <Link to="/predict" style={{ textDecoration: 'none', marginTop: 8 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '11px 16px', borderRadius: 8,
                    background: 'var(--blue-600)', color: '#fff',
                    fontSize: 13, fontWeight: 600,
                  }}>
                    <Activity size={14} /> Get Assessment
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
