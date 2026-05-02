import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Activity, MessageSquare, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-default)',
      background: 'var(--bg-surface)',
      marginTop: 'auto',
    }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Main footer grid */}
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6,
                background: 'var(--blue-600)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a2 2 0 0 0-2 2v6.5C7.5 11 5 13.5 5 17a5 5 0 0 0 10 0V4a2 2 0 0 0-2-2z"/>
                  <path d="M12 2a2 2 0 0 1 2 2v6.5c2.5.5 5 3 5 6.5a5 5 0 0 1-10 0V4a2 2 0 0 1 2-2z"/>
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>PulmoAI</span>
            </div>
            <p style={{ fontSize:12, color:'var(--text-muted)', lineHeight:1.65, maxWidth:280 }}>
              An open-source lung cancer risk assessment tool built with XGBoost and LLaMA 3.
              For educational use only — not a medical diagnostic device.
            </p>
          </div>

          {/* Links */}
          <div>
            <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--text-muted)', marginBottom:12 }}>
              Platform
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { to:'/predict', icon:<Activity size={13}/>, label:'Risk Assessment' },
                { to:'/chat',    icon:<MessageSquare size={13}/>, label:'AI Assistant' },
              ].map(({ to, icon, label }) => (
                <Link key={to} to={to} style={{
                  display:'flex', alignItems:'center', gap:8, fontSize:13,
                  color:'var(--text-secondary)', textDecoration:'none', transition:'color 0.12s',
                  padding: '4px 0',
                }}
                onMouseEnter={e=>e.currentTarget.style.color='var(--text-primary)'}
                onMouseLeave={e=>e.currentTarget.style.color='var(--text-secondary)'}
                >
                  {icon} {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div>
            <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--text-muted)', marginBottom:12 }}>
              Medical Notice
            </div>
            <p style={{ fontSize:12, color:'var(--text-muted)', lineHeight:1.7 }}>
              Results from this tool are not a clinical diagnosis.
              Always consult a licensed healthcare professional regarding
              your symptoms and medical history.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          paddingTop:16, borderTop:'1px solid var(--border-subtle)',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          flexWrap:'wrap', gap:8,
        }}>
          <span style={{ fontSize:11, color:'var(--text-muted)' }}>
            © 2026 PulmoAI · For educational use only
          </span>
          <span className="mono" style={{ fontSize:10, color:'var(--text-faint)' }}>
            v1.0.0 · XGBoost 2.0 · LLaMA 3
          </span>
        </div>
      </div>
    </footer>
  );
}
