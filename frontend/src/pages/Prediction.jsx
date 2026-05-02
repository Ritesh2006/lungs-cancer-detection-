import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
  User, Cigarette, HeartPulse, TrendingUp,
  ChevronRight, ChevronLeft, CheckCircle2, Loader2,
  AlertTriangle, RotateCcw, ShieldAlert, Check, Activity, Info, Shield
} from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const STEPS = [
  { id: 1, label: 'Profile',    icon: <User size={16} /> },
  { id: 2, label: 'Exposure',   icon: <Activity size={16} /> },
  { id: 3, label: 'Lifestyle',  icon: <HeartPulse size={16} /> },
  { id: 4, label: 'Result',     icon: <TrendingUp size={16} /> },
];

const ToggleBox = ({ name, value, onChange, label }) => (
  <div
    onClick={() => onChange({ target: { name, value: value === 1 ? 0 : 1 } })}
    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none ${
      value === 1 ? 'bg-blue-600/10 border-blue-500/50' : 'bg-slate-900/50 border-white/5 hover:border-white/10'
    }`}
  >
    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
      value === 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'
    }`}>
      {value === 1 && <Check size={14} strokeWidth={3} />}
    </div>
    <span className={`text-sm font-semibold transition-colors ${value === 1 ? 'text-white' : 'text-slate-400'}`}>
      {label}
    </span>
  </div>
);

const slideVariants = {
  enter: d => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: d => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
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
    radon_exposure: 'Low', asbestos_exposure: 0, secondhand_smoke: 0,
    copd_diagnosis: 0, alcohol_consumption: 'None', family_history: 0
  });

  const handleChange = e => {
    const { name, value } = e.target;
    const stringFields = ['radon_exposure', 'alcohol_consumption'];
    setForm(p => ({ ...p, [name]: stringFields.includes(name) ? value : Number(value) }));
  };

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
      setError('Unable to connect to analysis engine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setStep(1); setResult(null); setError(''); setDir(-1); };

  const riskPct = result ? Math.round(result.risk_score * 100) : 0;
  const riskColor = result?.risk_level === 'High' ? '#ef4444' : result?.risk_level === 'Medium' ? '#f59e0b' : '#10b981';

  const chartData = result ? {
    labels: ['Risk', 'Safe'],
    datasets: [{
      data: [riskPct, 100 - riskPct],
      backgroundColor: [`${riskColor}`, 'rgba(255,255,255,0.05)'],
      borderColor: ['transparent', 'transparent'],
      borderWidth: 0,
    }],
  } : null;

  return (
    <div className="relative min-h-[calc(100vh-100px)] py-12 lg:py-20 overflow-hidden">
      <div className="glow-bg top-[-10%] left-[-5%] opacity-10" />
      
      <div className="mobile-container relative z-10">
        <div className="max-w-5xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* ── Left Column: Form ── */}
            <div className="lg:col-span-7">
              
              {/* Header */}
              <div className="mb-10">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
                  <Shield size={14} /> Clinical Analysis Engine
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">Risk Assessment</h1>
                <p className="text-slate-400 text-sm max-w-md">Complete the clinical profile to receive your AI-driven risk probability score.</p>
              </div>

              {/* Progress */}
              <div className="flex gap-2 mb-12">
                {STEPS.map(s => {
                  const active = step === s.id;
                  const done = step > s.id;
                  return (
                    <div key={s.id} className="flex-1 flex flex-col gap-2">
                      <div className={`h-1.5 rounded-full transition-all duration-500 ${active ? 'bg-blue-500' : done ? 'bg-blue-600/30' : 'bg-slate-800'}`} />
                      <div className={`flex items-center gap-2 ${active ? 'text-white' : 'text-slate-600'}`}>
                        <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">{s.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="glass-card p-6 sm:p-10 border-white/5">
                <AnimatePresence mode="wait" custom={dir}>
                  
                  {/* Step 1 */}
                  {step === 1 && (
                    <motion.div key="s1" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="text-blue-500" size={20} />
                        <h2 className="text-xl font-bold text-white">Biological Profile</h2>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Patient Age</label>
                          <input type="number" name="age" value={form.age} onChange={handleChange} className="input-premium" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Biological Gender</label>
                          <select name="gender" value={form.gender} onChange={handleChange} className="input-premium appearance-none">
                            <option value={1}>Male</option>
                            <option value={0}>Female</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <motion.div key="s2" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                      <div className="flex items-center gap-3 mb-2">
                        <Activity className="text-blue-500" size={20} />
                        <h2 className="text-xl font-bold text-white">Environmental Exposure</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ToggleBox name="family_history" value={form.family_history} onChange={handleChange} label="Family History" />
                        <ToggleBox name="copd_diagnosis" value={form.copd_diagnosis} onChange={handleChange} label="COPD Diagnosis" />
                        <ToggleBox name="asbestos_exposure" value={form.asbestos_exposure} onChange={handleChange} label="Asbestos" />
                        <ToggleBox name="secondhand_smoke" value={form.secondhand_smoke} onChange={handleChange} label="Secondhand Smoke" />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3 */}
                  {step === 3 && (
                    <motion.div key="s3" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                      <div className="flex items-center gap-3 mb-2">
                        <HeartPulse className="text-blue-500" size={20} />
                        <h2 className="text-xl font-bold text-white">Lifestyle & Symptoms</h2>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Smoking History (Pack-Years)</label>
                          <input type="number" name="smoking_history" value={form.smoking_history} onChange={handleChange} className="input-premium" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <ToggleBox name="chest_pain" value={form.chest_pain} onChange={handleChange} label="Chest Pain" />
                          <ToggleBox name="shortness_of_breath" value={form.shortness_of_breath} onChange={handleChange} label="Breath Shortness" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Result */}
                  {step === 4 && (
                    <motion.div key="s4" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className="py-4">
                      {loading ? (
                        <div className="flex flex-col items-center py-20 gap-6">
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                            <Loader2 size={48} className="text-blue-500" />
                          </motion.div>
                          <p className="font-bold text-slate-400 animate-pulse">Running Neural Diagnostics...</p>
                        </div>
                      ) : result ? (
                        <div className="space-y-10">
                          <div className="flex flex-col items-center gap-8">
                            <div className="relative w-48 h-48">
                              <Doughnut data={chartData} options={{ cutout: '85%', plugins: { legend: { display: false } } }} />
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black text-white">{riskPct}%</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Probability</span>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="inline-flex px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
                                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: riskColor }}>
                                  {result.risk_level} Risk Category
                                </span>
                              </div>
                              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                                Based on your inputs, the model predicts a {result.risk_level.toLowerCase()} probability of clinical findings.
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Model Confidence</p>
                              <p className="text-xl font-black text-blue-400">{result.confidence}</p>
                            </div>
                            <button onClick={reset} className="btn-outline border-blue-500/20 text-blue-400">
                              <RotateCcw size={18} /> Restart
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                          <p className="text-slate-400 mb-6">{error || 'Unexpected error occurred.'}</p>
                          <button onClick={() => setStep(3)} className="btn-premium px-8">Try Again</button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer Nav */}
                {step < 4 && (
                  <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
                    <button onClick={prev} disabled={step === 1} className="flex items-center gap-2 text-slate-500 font-bold hover:text-white disabled:opacity-0 transition-all">
                      <ChevronLeft size={20} /> Back
                    </button>
                    {step < 3 ? (
                      <button onClick={next} className="btn-premium px-10">
                        Continue <ChevronRight size={18} />
                      </button>
                    ) : (
                      <button onClick={submit} className="btn-premium px-10">
                        Generate Report <Activity size={18} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Right Column: Info ── */}
            <div className="lg:col-span-5 space-y-8">
              <div className="glass-card p-1 rounded-3xl overflow-hidden aspect-[4/5] hidden lg:block">
                <img src={IMGS.xray} alt="Scan analysis" className="w-full h-full object-cover rounded-[1.5rem]" />
              </div>
              <div className="glass-card p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <Info size={18} className="text-blue-400" />
                  <h3 className="font-bold text-white uppercase tracking-widest text-xs">Medical Disclaimer</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  This tool is designed for educational purposes and provides information based on statistical models. 
                  It is NOT a medical device and should not be used as a substitute for professional medical advice, 
                  diagnosis, or treatment. Always consult with a qualified healthcare provider for any health concerns.
                </p>
                <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-500/10">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1 text-center">Data Security</p>
                  <p className="text-[10px] text-slate-600 text-center">No health data is transmitted to or stored on our servers.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
