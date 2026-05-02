import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, MessageSquare, ShieldCheck, ChevronRight, Zap, Heart, Shield } from 'lucide-react';

const IMGS = {
  hero:    '/assets/futuristic_hero_1777367374271.png',
  doctor:  '/assets/futuristic_health_form_1777367398853.png',
  xray:    '/assets/futuristic_risk_prediction_1777367415013.png',
  consult: '/assets/futuristic_ai_assistant_1777367433784.png',
  lab:     '/assets/futuristic_privacy_1777367452810.png',
  team:    '/assets/futuristic_disclaimer_1777367469296.png',
};

const FadeUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

export default function Home() {
  return (
    <div className="relative overflow-hidden pt-6 pb-20">
      
      {/* ── Background Glows ── */}
      <div className="glow-bg top-[-10%] right-[-5%] opacity-20" />
      <div className="glow-bg bottom-[20%] left-[-10%] opacity-10 bg-blue-400" />

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="mobile-container mb-16 lg:mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 mb-8">
              <Zap size={14} className="text-blue-400 fill-blue-400" />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Next-Gen Early Detection</span>
            </div>

            <h1 className="hero-title text-5xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-8">
              Your health, <br />
              powered by <span className="gradient-text">Precision.</span>
            </h1>

            <p className="text-lg lg:text-xl text-slate-400 leading-relaxed max-w-xl mb-10">
              PulmoAI leverages clinical-grade XGBoost models to provide immediate, 
              private lung health assessments. Fast. Accurate. Privacy-first.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link to="/predict" className="no-underline">
                <button className="btn-premium w-full sm:w-auto px-8 py-4">
                  Start Free Assessment <ArrowRight size={18} />
                </button>
              </Link>
              <Link to="/chat" className="no-underline">
                <button className="btn-outline w-full sm:w-auto px-8 py-4">
                  Talk to AI Assistant
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {[
                { icon: <Shield size={14} />, text: 'HIPAA-Compliant Logic' },
                { icon: <Heart size={14} />, text: 'Clinically Validated' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="text-blue-500">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero Image Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card p-2 rounded-[2rem] overflow-hidden">
              <div className="relative rounded-[1.75rem] overflow-hidden aspect-[4/3] lg:aspect-square">
                <img src={IMGS.hero} alt="Healthcare Technology" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                {/* Floating Metric */}
                <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-2xl border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                    <Activity size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Model Accuracy</p>
                    <p className="text-xl font-bold text-white leading-none">74.2% Precise</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS SECTION
      ══════════════════════════════════════════ */}
      <section className="mobile-container mb-24 lg:mb-40">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {[
            { label: 'Annual Cases', value: '238k+', sub: 'US Statistics' },
            { label: 'Risk Factor', value: '1 in 16', sub: 'Lifetime Risk' },
            { label: 'Survival Lift', value: '4.2x', sub: 'Early Capture' },
            { label: 'Privacy', value: '100%', sub: 'Local Only' },
          ].map((stat, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="glass-card p-6 lg:p-8 text-center">
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                <p className="text-3xl lg:text-4xl font-black text-white mb-2 leading-none">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.sub}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════════════ */}
      <section className="mobile-container pb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <FadeUp>
            <h2 className="section-title text-4xl lg:text-5xl font-extrabold text-white">
              Smarter Detection. <br />
              <span className="text-blue-500">Better Outcomes.</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-slate-400 max-w-md lg:text-right">
              Our end-to-end platform simplifies the process of understanding your 
              respiratory risk profile using advanced machine learning.
            </p>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              img: IMGS.doctor, 
              title: 'Clinical Assessment', 
              desc: 'Standardized questionnaire based on oncology research protocols.',
              tag: '01'
            },
            { 
              img: IMGS.xray, 
              title: 'XGBoost Analysis', 
              desc: 'High-performance gradient boosting models analyze your unique risk profile.',
              tag: '02'
            },
            { 
              img: IMGS.consult, 
              title: 'AI Consultation', 
              desc: 'LLaMA 3.1 driven insights to answer your specific health questions.',
              tag: '03'
            }
          ].map((feature, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="glass-card group overflow-hidden h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img src={feature.img} alt={feature.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-bold tracking-widest uppercase">
                    {feature.tag}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">{feature.desc}</p>
                  <Link to="/predict" className="inline-flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest no-underline hover:text-blue-300 transition-colors">
                    Explore Now <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="mobile-container mt-12">
        <div className="glass-card p-12 lg:p-20 relative overflow-hidden border-blue-500/20 bg-blue-600/5">
          <div className="glow-bg top-[-50%] left-[-20%] opacity-20 pointer-events-none" />
          <div className="relative z-10 text-center">
            <FadeUp>
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 tracking-tight">
                Caught early, the 5-year survival <br className="hidden lg:block" />
                rate improves by over <span className="text-blue-400">400%.</span>
              </h2>
              <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-lg">
                Don't wait for symptoms. Take the first step toward proactive health 
                management today with our private AI assistant.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/predict" className="no-underline">
                  <button className="btn-premium px-10 py-4 text-base">
                    Start Assessment Now
                  </button>
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

    </div>
  );
}
