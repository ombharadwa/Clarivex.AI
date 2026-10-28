import React, { useState } from 'react';
import { PageTab } from '../types';
import { MapPin, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

interface ContactViewProps {
  onSelectTab: (tab: PageTab) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onSelectTab }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    industry: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.company.trim()) {
      setErrorMsg('Please provide your name and company.');
      return;
    }
    setErrorMsg('');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-[70px]">
      {/* Hero */}
      <div className="relative py-20 bg-[#0B1020] border-b border-[#7C5CFF]/15 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[450px] h-[450px] -right-20 -top-20 rounded-full bg-radial from-[#7C5CFF]/20 to-transparent blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(124,92,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(124,92,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#7C5CFF]/10 border border-[#7C5CFF]/30 text-[#A48BFF] text-[11px] font-semibold tracking-[2px] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
            Get In Touch
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Let's Build Something <br />
            <span className="grad-text">Intelligent Together</span>
          </h1>
          <p className="text-[16px] text-[#8892B0] max-w-xl font-light mt-4">
            Ready to transform your business with AI? Book a free consultation with our technical specialists.
          </p>
        </div>
      </div>

      {/* Contact Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#151B35]/70 border border-[#7C5CFF]/20 rounded-2xl p-6 flex items-start gap-4 shadow-xl">
              <div className="w-11 h-11 rounded-xl bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 flex items-center justify-center text-[#A48BFF] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-[#8892B0] tracking-[1.5px] uppercase font-bold mb-1">
                  Location
                </div>
                <div className="text-[14px] text-white font-medium">
                  Ahmedabad, Gujarat, India
                </div>
              </div>
            </div>

            <div className="bg-[#151B35]/70 border border-[#7C5CFF]/20 rounded-2xl p-6 flex items-start gap-4 shadow-xl">
              <div className="w-11 h-11 rounded-xl bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 flex items-center justify-center text-[#A48BFF] shrink-0">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
              <div>
                <div className="text-[10px] text-[#8892B0] tracking-[1.5px] uppercase font-bold mb-1">
                  LinkedIn
                </div>
                <a
                  href="https://www.linkedin.com/company/clarivex-ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-[#A48BFF] hover:underline font-medium"
                >
                  linkedin.com/company/clarivex-ai
                </a>
              </div>
            </div>

            <div className="bg-[#151B35]/70 border border-[#7C5CFF]/20 rounded-2xl p-6 flex items-start gap-4 shadow-xl">
              <div className="w-11 h-11 rounded-xl bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 flex items-center justify-center text-[#A48BFF] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-[#8892B0] tracking-[1.5px] uppercase font-bold mb-1">
                  Business Email
                </div>
                <div className="text-[14px] text-white font-medium">
                  hello@clarivex.ai
                </div>
              </div>
            </div>

            <div className="bg-[#7C5CFF]/10 border border-[#7C5CFF]/25 rounded-2xl p-6">
              <div className="text-[14px] font-bold text-white mb-1.5 flex items-center gap-2">
                <span>⚡</span> Quick Response
              </div>
              <p className="text-[13px] text-[#8892B0] leading-relaxed">
                We respond to all enterprise and project enquiries within 24 business hours. Book a consultation below for same-day coordination.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-[#0B1020]/90 border border-[#7C5CFF]/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
            <div className="h-[2px] w-full bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] mb-8 opacity-60 rounded-full" />

            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Consultation Booked!
                </h3>
                <p className="text-[14px] text-[#8892B0] max-w-sm mx-auto">
                  Thank you, <span className="text-white font-semibold">{formData.name}</span>! Our technology team will reach out within 24 hours to schedule your strategy session.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      company: '',
                      industry: '',
                      projectType: '',
                      budget: '',
                      timeline: '',
                      message: '',
                    });
                  }}
                  className="mt-6 px-6 py-2.5 rounded-lg border border-[#7C5CFF]/40 text-[#A48BFF] text-[13px] font-medium hover:bg-[#7C5CFF]/10 transition-all cursor-pointer"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10.5px] uppercase tracking-[1.5px] text-white/50 mb-1.5 font-bold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-[#7C5CFF]/20 focus:border-[#7C5CFF] rounded-xl px-4 py-3 text-[13px] text-white placeholder-white/30 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] uppercase tracking-[1.5px] text-white/50 mb-1.5 font-bold">
                      Company *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Company name"
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-white/5 border border-[#7C5CFF]/20 focus:border-[#7C5CFF] rounded-xl px-4 py-3 text-[13px] text-white placeholder-white/30 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase tracking-[1.5px] text-white/50 mb-1.5 font-bold">
                    Industry
                  </label>
                  <select
                    value={formData.industry}
                    onChange={e => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full bg-[#151B35] border border-[#7C5CFF]/20 focus:border-[#7C5CFF] rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none transition-all"
                  >
                    <option value="">Select your industry…</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance & Banking">Finance & Banking</option>
                    <option value="Government">Government</option>
                    <option value="Retail & E-Commerce">Retail & E-Commerce</option>
                    <option value="Education">Education</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase tracking-[1.5px] text-white/50 mb-1.5 font-bold">
                    Project Type
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full bg-[#151B35] border border-[#7C5CFF]/20 focus:border-[#7C5CFF] rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none transition-all"
                  >
                    <option value="">What are you looking to build?</option>
                    <option value="AI Chatbot">AI Chatbot</option>
                    <option value="AI Automation">AI Automation</option>
                    <option value="Predictive Analytics">Predictive Analytics</option>
                    <option value="Custom Enterprise Software">Custom Enterprise Software</option>
                    <option value="SaaS Platform">SaaS Platform</option>
                    <option value="Digital Transformation">Digital Transformation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10.5px] uppercase tracking-[1.5px] text-white/50 mb-1.5 font-bold">
                      Estimated Budget
                    </label>
                    <select
                      value={formData.budget}
                      onChange={e => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-[#151B35] border border-[#7C5CFF]/20 focus:border-[#7C5CFF] rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none transition-all"
                    >
                      <option value="">Select budget range…</option>
                      <option value="Under ₹5L">Under ₹5L</option>
                      <option value="₹5L – ₹15L">₹5L – ₹15L</option>
                      <option value="₹15L – ₹50L">₹15L – ₹50L</option>
                      <option value="₹50L+">₹50L+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10.5px] uppercase tracking-[1.5px] text-white/50 mb-1.5 font-bold">
                      Timeline
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full bg-[#151B35] border border-[#7C5CFF]/20 focus:border-[#7C5CFF] rounded-xl px-4 py-3 text-[13px] text-white focus:outline-none transition-all"
                    >
                      <option value="">Expected timeline…</option>
                      <option value="ASAP (< 1 month)">ASAP (&lt; 1 month)</option>
                      <option value="1–3 months">1–3 months</option>
                      <option value="3–6 months">3–6 months</option>
                      <option value="6+ months">6+ months</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] uppercase tracking-[1.5px] text-white/50 mb-1.5 font-bold">
                    AI / Software Requirements
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your goals, existing tech stack, or specific AI requirements…"
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/5 border border-[#7C5CFF]/20 focus:border-[#7C5CFF] rounded-xl px-4 py-3 text-[13px] text-white placeholder-white/30 focus:outline-none transition-all resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-grad text-white py-3.5 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xl"
                >
                  Book Free Consultation <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
