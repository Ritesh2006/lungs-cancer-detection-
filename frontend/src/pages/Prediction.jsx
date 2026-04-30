import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
  User, Cigarette, HeartPulse, TrendingUp,
  ChevronRight, ChevronLeft, CheckCircle2, Loader2,
  AlertTriangle, RotateCcw, ShieldAlert, Check, Activity
} from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const STEPS = [
  { id: 1, label: 'Demographics', short: '01', icon: <User size={15} /> },
  { id: 2, label: 'Lifestyle',    short: '02', icon: <Cigarette size={15} /> },
  { id: 3, label: 'Symptoms',    short: '03', icon: <HeartPulse size={15} /> },
  { id: 4, label: 'Results',     short: '04', icon: <TrendingUp size={15} /> },
];

/* ── Progress Bar ── */
const StepBar = ({ current }) => (
  <div className="mb-8">
    {/* Mobile: simple text */}
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-semibold text-white">
        Step {Math.min(current, 3)} of 3
      </p>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {STEPS[Math.min(current, STEPS.length) - 1]?.label}
      </p>
    </div>

    {/* Track */}
    <div className="relative h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ background: 'var(--blue-500)' }}
        animate={{ width: `${(Math.min(current - 1, 3) / 3) * 100}%` }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      />
    </div>

    {/* Step dots */}
    <div className="flex justify-between mt-2">
      {STEPS.slice(0, 4).map(s => {
        const state = current > s.id ? 'done' : current === s.id ? 'active' : 'idle';
        return (
          <div key={s.id} className="flex flex-col items-center gap-1">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
              state === 'done' ? 'step-done' : state === 'active' ? 'step-active' : 'step-idle'
            }`}>
              {state === 'done'
                ? <Check size={10} className="text-green-300" />
                : <span className="text-[9px] font-bold">{s.short}</span>
              }
            </div>
            <span className="hidden sm:block text-[9px] font-medium transition-colors"
              style={{ color: state === 'active' ? 'var(--blue-400)' : state === 'done' ? '#86efac' : 'var(--text-faint)' }}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

/* ── Toggle Checkbox ── */
const ToggleBox = ({ name, value, onChange, label }) => (
  <div
    onClick={() => onChange({ target: { name, value: value === 1 ? 0 : 1 } })}
    className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all duration-150"
    style={{
      border: value === 1 ? '1px solid rgba(59,130,246,0.4)' : '1px solid var(--border-default)',
      background: value === 1 ? 'rgba(59,130,246,0.08)' : 'var(--bg-base)',
    }}
  >
    <div className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all duration-150"
      style={{
        background: value === 1 ? 'var(--blue-600)' : 'var(--bg-elevated)',
        border: value === 1 ? '1px solid var(--blue-500)' : '1px solid var(--border-default)',
      }}>
      {value === 1 && <Check size={10} className="text-white" />}
    </div>
    <span className="text-sm" style={{ color: value === 1 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
      {label}
    </span>
  </div>
);

/* ── Animated slide ── */
const slideVariants = {
  enter: d => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: d => ({ x: d > 0 ? -50 : 50, opacity: 0 }),
};

export default function Prediction() {
  const [step, setStep]       = useState(1);
  const [dir, setDir]         = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState('');

  const [form, setForm] = useState({
    age: 50, gender: 1, smoking_history: 0,
    chest_pain: 0, shortness_of_breath: 0, fatigue: 0, weight_loss: 0,
  });

  const handleChange = e =>
    setForm(p => ({ ...p, [e.target.name]: Number(e.target.value) }));

  const next = () => { setDir(1);  setStep(s => Math.min(s + 1, 4)); };
  const prev = () => { setDir(-1); setStep(s => Math.max(s - 1, 1)); };

  const submit = async () => {
    setLoading(true); setError('');
    setDir(1); setStep(4);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const { data } = await axios.post(`${API_URL}/predict`, form);
      setResult(data);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.detail || 'Unable to reach the prediction server. Ensure the backend and ML service are running.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setStep(1); setResult(null); setError(''); setDir(-1); };

  /* chart */
  const riskPct = result ? Math.round(result.risk_score * 100) : 0;
  const riskColor = result?.risk_level === 'High' ? '#f87171' : result?.risk_level === 'Medium' ? '#fbbf24' : '#34d399';

  const chartData = result ? {
    labels: ['Risk', 'Safe'],
    datasets: [{
      data: [riskPct, 100 - riskPct],
      backgroundColor: [`${riskColor}bb`, 'rgba(255,255,255,0.04)'],
      borderColor: [riskColor, 'rgba(255,255,255,0.05)'],
      borderWidth: 1.5,
    }],
  } : null;

  return (
    <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 py-8 sm:py-12">
        
        {/* Left Side: Form */}
        <div>
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue-400)' }} />
              <p className="label-overline mb-0">XGBoost v2.0 · Clinical Assessment</p>
            </div>
            <h1 className="text-3xl font-extrabold mb-3" style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>
              Risk Assessment
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', maxWidth: 440 }}>
              Answer the following clinical questions to receive an AI-powered 
              estimate of your lung cancer risk based on current research data.
            </p>
          </motion.div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 p-4 rounded-xl border mb-8 text-xs"
            style={{ background: 'rgba(248,113,113,0.06)', borderColor: 'rgba(248,113,113,0.2)', color: 'var(--red-400)' }}>
            <ShieldAlert size={14} className="shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Medical Disclaimer:</strong> This tool is intended for educational purposes only. 
              The results are not a clinical diagnosis. Always consult with a licensed healthcare 
              professional for medical concerns.
            </p>
          </div>

          {/* Main Assessment Card */}
          <div className="card-elevated rounded-2xl p-6 sm:p-10 border border-[var(--border-default)]">
            <StepBar current={step} />

            <div className="mt-8">
              <AnimatePresence mode="wait" custom={dir}>
                {/* ── Step 1 ── */}
                {step === 1 && (
                  <motion.div key="s1" custom={dir} variants={slideVariants}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
                        <User size={16} className="text-blue-400" />
                      </div>
                      <h2 className="text-base font-bold text-white">01. Demographics</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="form-label">Patient Age</label>
                        <input type="number" name="age" value={form.age}
                          onChange={handleChange} min="1" max="120" className="form-input" />
                      </div>
                      <div>
                        <label className="form-label">Biological Gender</label>
                        <select name="gender" value={form.gender} onChange={handleChange} className="form-select">
                          <option value={1}>Male</option>
                          <option value={0}>Female</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 2 ── */}
                {step === 2 && (
                  <motion.div key="s2" custom={dir} variants={slideVariants}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
                        <Cigarette size={16} className="text-amber-400" />
                      </div>
                      <h2 className="text-base font-bold text-white">02. Lifestyle Factors</h2>
                    </div>

                    <div>
                      <label className="form-label">Smoking History (Pack-Years)</label>
                      <input type="number" name="smoking_history" value={form.smoking_history}
                        onChange={handleChange} min="0" max="200" className="form-input"
                        placeholder="0 = never smoked" />
                      
                      <div className="mt-4 p-4 rounded-xl text-xs leading-relaxed"
                        style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-default)', color: 'var(--text-muted)' }}>
                        <strong style={{ color: 'var(--blue-400)' }}>How to calculate:</strong><br />
                        Pack-years = (packs per day) × (years smoked).<br />
                        <span className="italic mt-1 block">Example: 1 pack daily for 20 years = 20 pack-years.</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 3 ── */}
                {step === 3 && (
                  <motion.div key="s3" custom={dir} variants={slideVariants}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)' }}>
                        <HeartPulse size={16} className="text-red-400" />
                      </div>
                      <h2 className="text-base font-bold text-white">03. Clinical Symptoms</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <ToggleBox name="chest_pain"           value={form.chest_pain}           onChange={handleChange} label="Persistent Chest Pain" />
                      <ToggleBox name="shortness_of_breath"  value={form.shortness_of_breath}  onChange={handleChange} label="Shortness of Breath (Dyspnea)" />
                      <ToggleBox name="fatigue"              value={form.fatigue}              onChange={handleChange} label="Chronic Fatigue" />
                      <ToggleBox name="weight_loss"          value={form.weight_loss}          onChange={handleChange} label="Unexplained Weight Loss" />
                    </div>
                  </motion.div>
                )}

                {/* ── Step 4: Results ── */}
                {step === 4 && (
                  <motion.div key="s4" custom={dir} variants={slideVariants}
                    initial="enter" animate="center" exit="exit"
                    className="flex flex-col items-center justify-center min-h-[300px]"
                  >
                    {loading ? (
                      <div className="flex flex-col items-center gap-6">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>
                          <Loader2 size={48} className="text-blue-500" />
                        </motion.div>
                        <p className="text-sm font-medium text-[var(--text-secondary)]">Analyzing data points...</p>
                      </div>
                    ) : error ? (
                      <div className="text-center space-y-4">
                        <AlertTriangle size={48} className="text-red-400 mx-auto" />
                        <p className="text-sm text-[var(--text-secondary)]">{error}</p>
                        <button onClick={reset} className="btn-secondary mx-auto">Try Again</button>
                      </div>
                    ) : result && (
                      <div className="w-full space-y-8">
                        <div className="flex flex-col items-center">
                          <div className="relative w-40 h-40">
                            <Doughnut data={chartData} options={{ cutout: '78%', plugins: { legend: { display: false } } }} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-3xl font-black mono" style={{ color: riskColor }}>{riskPct}%</span>
                              <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">Risk Level</span>
                            </div>
                          </div>
                          <div className="mt-6 text-center">
                            <div style={{
                              display: 'inline-flex',
                              padding: '6px 16px',
                              borderRadius: 99,
                              background: `${riskColor}12`,
                              border: `1px solid ${riskColor}30`,
                              color: riskColor,
                              fontSize: 12,
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em'
                            }}>
                              {result.risk_level} Risk Category
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-[var(--bg-inset)] border border-[var(--border-default)]">
                            <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold mb-1">Confidence</p>
                            <p className="text-lg font-black mono text-[var(--blue-400)]">{result.confidence}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-[var(--bg-inset)] border border-[var(--border-default)]">
                            <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold mb-1">Algorithm</p>
                            <p className="text-sm font-bold text-white">XGBoost v2</p>
                          </div>
                        </div>

                        <button onClick={reset} className="btn-secondary w-full py-3 justify-center">
                          <RotateCcw size={16} /> New Assessment
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              {step < 4 && (
                <div className="flex justify-between items-center mt-12 pt-8 border-t border-[var(--border-default)]">
                  <button onClick={prev} disabled={step === 1} className="btn-secondary px-6 disabled:opacity-20">
                    <ChevronLeft size={18} /> Back
                  </button>
                  {step < 3 ? (
                    <button onClick={next} className="btn-primary px-8">
                      Next Step <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button onClick={submit} className="btn-primary px-8">
                      Run Analysis <Activity size={18} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Visual & Context (Desktop only) */}
        <div className="hidden lg:flex flex-col gap-8">
          <div style={{
            position: 'relative',
            borderRadius: 24,
            overflow: 'hidden',
            aspectRatio: '4/5',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-lg)',
          }}>
            <img 
              src="/assets/futuristic_risk_prediction_1777367415013.png" 
              alt="Futuristic Risk Prediction Analysis" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(13,17,23,0.8), transparent)',
            }} />
            <div style={{
              position: 'absolute',
              bottom: 32,
              left: 32,
              right: 32,
            }}>
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 size={18} className="text-green-400" />
                <span className="text-sm font-bold text-white">Evidence-Based Scoring</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                "Early screening is the most effective way to improve survival outcomes. 
                Knowing your risk profile is the first step toward proactive health management."
              </p>
            </div>
          </div>

          <div className="card-elevated rounded-2xl p-6 border border-[var(--border-default)]">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-400" /> 
              Why this assessment matters
            </h3>
            <ul className="space-y-4">
              {[
                { label: 'Validated Algorithm', text: 'Trained on large-scale clinical oncology datasets.' },
                { label: 'Privacy First', text: 'Your data is processed locally and never stored on our servers.' },
                { label: 'Instant Feedback', text: 'Receive your score in seconds, not days.' },
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-200">{item.label}</p>
                    <p className="text-[11px] text-gray-400">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
