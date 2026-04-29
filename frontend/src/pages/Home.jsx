import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, MessageSquare, ShieldCheck, Clock, ChevronRight } from 'lucide-react';

/* ── Custom Futuristic Generated Assets ── */
const IMGS = {
  hero:    '/assets/futuristic_hero_1777367374271.png',
  doctor:  '/assets/futuristic_health_form_1777367398853.png', /* Health Questionnaire */
  xray:    '/assets/futuristic_risk_prediction_1777367415013.png', /* Risk Prediction */
  consult: '/assets/futuristic_ai_assistant_1777367433784.png', /* AI Chatbot */
  lab:     '/assets/futuristic_privacy_1777367452810.png', /* Privacy */
  team:    '/assets/futuristic_disclaimer_1777367469296.png', /* Disclaimer / Footer Banner */
};

/* Real stats sourced from CDC / WHO */
const STATS = [
  { value: '238,340', label: 'new lung cancer cases in the US in 2023', src: 'CDC 2023' },
  { value: '1 in 16', label: 'Americans will be diagnosed in their lifetime', src: 'NCI' },
  { value: '5-year',  label: 'survival rate improves 4× when caught early', src: 'ACS' },
  { value: '74%',     label: 'model classification accuracy on test data', src: 'PulmoAI' },
];

/* Fade-up animation */
const FadeUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export default function Home() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ══════════════════════════════════════════
          HERO — Split, real photo, warm copy
      ══════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════
          HERO — Perfectly aligned, humanized
      ══════════════════════════════════════════ */}
      <section style={{
        borderBottom: '1px solid var(--border-default)',
        background: 'var(--bg-base)',
        overflow: 'hidden',
      }}>
        <div style={{
          maxWidth: 1152,
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: 600,
        }} className="hero-grid">

          {/* Left — content aligned with logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '64px 0',
              paddingRight: 48,
            }}
          >
            {/* Eyebrow */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 12, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--blue-400)',
              marginBottom: 24,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--green-400)',
                boxShadow: '0 0 12px var(--green-400)',
                display: 'inline-block',
              }} />
              AI-Powered · Precision Diagnostics
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(2.5rem, 4.2vw, 3.75rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              marginBottom: 24,
            }}>
              Detection starts<br />
              with <span style={{ color: 'var(--blue-400)' }}>awareness.</span>
            </h1>

            <p style={{
              fontSize: 16, lineHeight: 1.6,
              color: 'var(--text-secondary)',
              maxWidth: 460, marginBottom: 36,
            }}>
              PulmoAI combines clinical-grade XGBoost models with LLaMA 3 
              intelligence to provide immediate, private risk assessments 
              from the comfort of your home.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              <Link to="/predict" style={{ textDecoration: 'none' }}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="btn-primary" style={{ padding: '12px 28px', fontSize: 14 }}>
                  <Activity size={16} />
                  Start Free Assessment
                  <ArrowRight size={14} />
                </motion.div>
              </Link>
              <Link to="/chat" style={{ textDecoration: 'none' }}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="btn-secondary" style={{ padding: '12px 28px', fontSize: 14 }}>
                  <MessageSquare size={16} />
                  Ask AI Assistant
                </motion.div>
              </Link>
            </div>

            {/* Trust markers */}
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[
                'HIPAA-inspired privacy',
                'Local-only processing',
                'Instant clinical insight',
              ].map((t, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 12, color: 'var(--text-muted)',
                  fontWeight: 500,
                }}>
                  <ShieldCheck size={14} style={{ color: 'var(--blue-500)' }} /> {t}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Proper matching image */}
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              height: '85%',
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-default)',
            }}>
              <img
                src={IMGS.hero}
                alt="Doctor showing lung health data to patient"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 60%, rgba(13,17,23,0.4))',
              }} />
              
              {/* Floating badge for extra "humanize" feel */}
              <div style={{
                position: 'absolute',
                bottom: 24,
                right: 24,
                background: 'rgba(13, 17, 23, 0.85)',
                backdropFilter: 'blur(12px)',
                padding: '12px 16px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--blue-500)' }}>
                  <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&auto=format&fit=crop&q=80" alt="Doctor" />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Validated Model</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>74.2% Test Accuracy</div>
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div style={{
              position: 'absolute',
              top: '10%',
              right: '-5%',
              width: 120,
              height: 120,
              background: 'var(--blue-600)',
              filter: 'blur(80px)',
              opacity: 0.3,
              zIndex: -1,
            }} />
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          STATS ROW — real numbers, sourced
      ══════════════════════════════════════════ */}
      <section style={{
        borderBottom: '1px solid var(--border-default)',
        padding: '0',
      }}>
        <div className="max-w-6xl mx-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }} id="stats-row">
          {STATS.map(({ value, label, src }, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div style={{
                padding: '28px 24px',
                borderRight: i < 3 ? '1px solid var(--border-default)' : 'none',
              }}>
                <div style={{
                  fontSize: 28, fontWeight: 800,
                  letterSpacing: '-0.04em',
                  color: 'var(--text-primary)',
                  fontFamily: "'JetBrains Mono', monospace",
                  marginBottom: 6,
                }}>{value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 4 }}>
                  {label}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.03em' }}>
                  Source: {src}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PHOTO FEATURE GRID
          Two large + two small — editorial layout
      ══════════════════════════════════════════ */}
      <section style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div className="max-w-6xl mx-auto" style={{ padding: '64px clamp(16px, 4vw, 24px)' }}>

          <FadeUp>
            <div style={{ marginBottom: 40 }}>
              <div style={{
                fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: 'var(--blue-400)', marginBottom: 10,
              }}>How it works</div>
              <h2 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                fontWeight: 700, letterSpacing: '-0.025em',
                color: 'var(--text-primary)', maxWidth: 520,
              }}>
                Three steps from concern to clarity
              </h2>
            </div>
          </FadeUp>

          {/* Large feature row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

            {/* Card 1 — large photo */}
            <FadeUp delay={0.05}>
              <div style={{
                borderRadius: 12, overflow: 'hidden',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-surface)',
              }}>
                <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                  <img src={IMGS.doctor} alt="Doctor reviewing patient data"
                    style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                  <div style={{
                    position: 'absolute', top: 14, left: 14,
                    background: 'rgba(13,17,23,0.72)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 6, padding: '4px 10px',
                    fontSize: 10, fontWeight: 700,
                    color: '#fff', letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}>Step 01</div>
                </div>
                <div style={{ padding: '20px 22px' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.01em' }}>
                    Answer a brief health questionnaire
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    Share your age, smoking history, and any symptoms you've noticed.
                    The form takes under 5 minutes and requires no medical records.
                  </p>
                  <Link to="/predict" style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      marginTop: 14, fontSize: 12, fontWeight: 600,
                      color: 'var(--blue-400)',
                    }}>
                      Start the assessment <ChevronRight size={13} />
                    </div>
                  </Link>
                </div>
              </div>
            </FadeUp>

            {/* Card 2 — large photo */}
            <FadeUp delay={0.12}>
              <div style={{
                borderRadius: 12, overflow: 'hidden',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-surface)',
              }}>
                <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                  <img src={IMGS.xray} alt="Chest X-ray being reviewed"
                    style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                  <div style={{
                    position: 'absolute', top: 14, left: 14,
                    background: 'rgba(13,17,23,0.72)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 6, padding: '4px 10px',
                    fontSize: 10, fontWeight: 700,
                    color: '#fff', letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}>Step 02</div>
                </div>
                <div style={{ padding: '20px 22px' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.01em' }}>
                    Get your AI-generated risk estimate
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    Our XGBoost model processes your inputs and returns a probability score with
                    a visual breakdown of the contributing factors.
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Bottom row — 3 cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {[
              {
                img: IMGS.consult,
                step: 'Step 03',
                title: 'Ask the AI assistant follow-up questions',
                desc: 'Our locally-hosted LLaMA 3 model explains your results and answers questions about lung cancer risk, symptoms, and next steps.',
                link: '/chat',
                linkLabel: 'Open AI chat',
              },
              {
                img: IMGS.lab,
                step: 'Privacy',
                title: 'Your data never leaves your device',
                desc: 'Every calculation happens locally via Ollama. No cloud APIs. No account. No tracking. The model runs entirely on your machine.',
                link: null,
              },
              {
                img: IMGS.team,
                step: 'Disclaimer',
                title: 'Always follow up with a real physician',
                desc: 'This tool is for educational awareness only. If your risk score is elevated, book an appointment with a licensed pulmonologist immediately.',
                link: null,
                accent: '#f85149',
              },
            ].map(({ img, step, title, desc, link, linkLabel, accent }, i) => (
              <FadeUp key={i} delay={0.05 + i * 0.08}>
                <div style={{
                  borderRadius: 10, overflow: 'hidden',
                  border: `1px solid ${accent ? 'rgba(248,81,73,0.25)' : 'var(--border-default)'}`,
                  background: 'var(--bg-surface)',
                  height: '100%', display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ position: 'relative', height: 140, overflow: 'hidden', flexShrink: 0 }}>
                    <img src={img} alt={title}
                      style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                    <div style={{
                      position: 'absolute', top: 10, left: 10,
                      background: accent ? 'rgba(248,81,73,0.85)' : 'rgba(13,17,23,0.72)',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 4, padding: '3px 8px',
                      fontSize: 9, fontWeight: 700, color: '#fff',
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}>{step}</div>
                  </div>
                  <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: '-0.01em', lineHeight: 1.35 }}>
                      {title}
                    </h3>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.65, flex: 1 }}>
                      {desc}
                    </p>
                    {link && (
                      <Link to={link} style={{ textDecoration: 'none' }}>
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          marginTop: 12, fontSize: 11, fontWeight: 600,
                          color: 'var(--blue-400)',
                        }}>
                          {linkLabel} <ChevronRight size={12} />
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>


      <section style={{ position: 'relative', height: 340, overflow: 'hidden' }}>
        <img src={IMGS.team} alt="Medical team discussing patient care"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 30%', display:'block' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(13,17,23,0.9) 0%, rgba(13,17,23,0.6) 50%, rgba(13,17,23,0.2) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center',
          padding: '0 clamp(24px, 8vw, 96px)',
        }}>
          <FadeUp>
            <div style={{ maxWidth: 480 }}>
              <p style={{
                fontSize: 'clamp(1.3rem, 2.8vw, 2rem)',
                fontWeight: 700, lineHeight: 1.3,
                color: '#fff', letterSpacing: '-0.02em',
                marginBottom: 20,
              }}>
                "Early detection increases the 5-year survival rate from 7% to 59%."
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
                — American Cancer Society, 2023
              </p>
              <Link to="/predict" style={{ textDecoration: 'none' }}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="btn-primary" style={{ fontSize: 13, padding: '10px 22px' }}>
                  <Activity size={14} /> Take the free assessment <ArrowRight size={13} />
                </motion.div>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BOTTOM CTA — clean, warm
      ══════════════════════════════════════════ */}
      <section style={{
        borderTop: '1px solid var(--border-default)',
        padding: 'clamp(32px, 5vw, 64px) clamp(16px, 4vw, 24px)',
      }}>
        <div className="max-w-6xl mx-auto" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}
          id="cta-row">
          <FadeUp>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 6 }}>
                Ready to understand your lung health better?
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Free. Private. Takes 5 minutes. No account required.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <Link to="/predict" style={{ textDecoration: 'none' }}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="btn-primary" style={{ fontSize: 13, padding: '10px 20px' }}>
                  <Activity size={14} /> Start assessment
                </motion.div>
              </Link>
              <Link to="/chat" style={{ textDecoration: 'none' }}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="btn-secondary" style={{ fontSize: 13, padding: '10px 20px' }}>
                  <MessageSquare size={14} /> Ask AI
                </motion.div>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Responsive override */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-img-panel { min-height: 240px !important; }
          #stats-row { grid-template-columns: 1fr 1fr !important; }
          #cta-row { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          #stats-row { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

    </div>
  );
}
