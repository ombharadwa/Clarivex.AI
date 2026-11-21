import React, { useState } from 'react';
import { PageTab } from '../types';
import { Reveal } from '../components/Reveal';
import { MapPin, Mail, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

interface ContactViewProps {
  onSelectTab: (tab: PageTab) => void;
}

const EMPTY_FORM = {
  name: '',
  company: '',
  industry: '',
  projectType: '',
  budget: '',
  timeline: '',
  message: '',
};

const INDUSTRIES = [
  'Healthcare',
  'Finance & Banking',
  'Government',
  'Retail & E-Commerce',
  'Education',
  'Manufacturing',
  'Logistics',
  'Other',
];

const PROJECT_TYPES = [
  'AI Chatbot',
  'AI Automation',
  'AI Agents',
  'Predictive Analytics',
  'Generative AI',
  'NLP Solutions',
  'Custom Enterprise Software',
  'SaaS Platform',
  'Mobile Application',
  'Digital Transformation',
  'Other',
];

const BUDGETS = ['Under ₹5L', '₹5L – ₹15L', '₹15L – ₹50L', '₹50L+'];
const TIMELINES = ['ASAP (< 1 month)', '1–3 months', '3–6 months', '6+ months'];

export const ContactView: React.FC<ContactViewProps> = ({ onSelectTab }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const set = (key: keyof typeof EMPTY_FORM) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setFormData(prev => ({ ...prev, [key]: e.target.value }));

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
    <div className="page-top min-h-screen">
      {/* Hero */}
      <div
        className="relative overflow-hidden border-b py-20"
        style={{ background: 'var(--bg-soft)', borderColor: 'var(--line)' }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="orb orb-violet -right-20 -top-24 h-[450px] w-[450px]" />
          <div className="grid-backdrop absolute inset-0" />
        </div>

        <div className="container-x relative z-10">
          <Reveal animation="fade-up">
            <span className="eyebrow mb-4">Get In Touch</span>
            <h1 className="display-1 mb-4" style={{ color: 'var(--fg)' }}>
              Let's Build Something <br />
              <span className="grad-text">Intelligent Together</span>
            </h1>
            <p className="lede max-w-xl">
              Ready to transform your business with AI? Book a free consultation with our technical
              specialists.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Contact Grid */}
      <section className="container-x section-y">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Contact Details */}
          <div className="lg:col-span-5">
            <Reveal animation="fade-left" className="space-y-5">
              <div className="card-flat flex items-start gap-4 p-6">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: 'rgba(124,92,255,0.14)',
                    border: '1px solid var(--line-strong)',
                    color: 'var(--accent-soft)',
                  }}
                >
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div
                    className="mb-1 text-[10px] font-bold uppercase tracking-[1.5px]"
                    style={{ color: 'var(--faint)' }}
                  >
                    Location
                  </div>
                  <div className="text-[14px] font-medium" style={{ color: 'var(--fg)' }}>
                    Ahmedabad, Gujarat, India
                  </div>
                </div>
              </div>

              <div className="card-flat flex items-start gap-4 p-6">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: 'rgba(124,92,255,0.14)',
                    border: '1px solid var(--line-strong)',
                    color: 'var(--accent-soft)',
                  }}
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </div>
                <div>
                  <div
                    className="mb-1 text-[10px] font-bold uppercase tracking-[1.5px]"
                    style={{ color: 'var(--faint)' }}
                  >
                    LinkedIn
                  </div>
                  <a
                    href="https://www.linkedin.com/company/clarivex-ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] font-medium hover:underline"
                    style={{ color: 'var(--accent-soft)' }}
                  >
                    linkedin.com/company/clarivex-ai
                  </a>
                </div>
              </div>

              <div className="card-flat flex items-start gap-4 p-6">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: 'rgba(124,92,255,0.14)',
                    border: '1px solid var(--line-strong)',
                    color: 'var(--accent-soft)',
                  }}
                >
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div
                    className="mb-1 text-[10px] font-bold uppercase tracking-[1.5px]"
                    style={{ color: 'var(--faint)' }}
                  >
                    Business Email
                  </div>
                  <a
                    href="mailto:hello@clarivex.ai"
                    className="text-[14px] font-medium hover:underline"
                    style={{ color: 'var(--fg)' }}
                  >
                    hello@clarivex.ai
                  </a>
                </div>
              </div>

              <div
                className="rounded-2xl p-6"
                style={{
                  background: 'rgba(124,92,255,0.1)',
                  border: '1px solid var(--line-strong)',
                }}
              >
                <div
                  className="mb-1.5 flex items-center gap-2 text-[14px] font-bold"
                  style={{ color: 'var(--fg)' }}
                >
                  <Zap className="h-4 w-4" style={{ color: 'var(--accent-2)' }} /> Quick Response
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                  We respond to all enterprise and project enquiries within 24 business hours. Book a
                  consultation below for same-day coordination.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <Reveal animation="fade-right">
              <div className="card p-8 sm:p-10">
                <div
                  className="mb-8 h-[2px] w-full rounded-full opacity-70"
                  style={{
                    background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
                  }}
                />

                {submitted ? (
                  <div className="space-y-4 py-12 text-center">
                    <div
                      className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                      style={{
                        background: 'rgba(34,211,166,0.12)',
                        border: '1px solid rgba(34,211,166,0.32)',
                        color: 'var(--accent-3)',
                      }}
                    >
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="display-3" style={{ color: 'var(--fg)' }}>
                      Consultation Booked!
                    </h3>
                    <p className="mx-auto max-w-sm text-[14px]" style={{ color: 'var(--muted)' }}>
                      Thank you,{' '}
                      <span className="font-semibold" style={{ color: 'var(--fg)' }}>
                        {formData.name}
                      </span>
                      ! Our technology team will reach out within 24 hours to schedule your strategy
                      session.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData(EMPTY_FORM);
                      }}
                      className="btn btn-ghost mt-6"
                    >
                      Submit Another Request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {errorMsg && <div className="field-error">{errorMsg}</div>}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="field-label" htmlFor="contact-name">
                          Full Name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          placeholder="Your name"
                          value={formData.name}
                          onChange={set('name')}
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="field-label" htmlFor="contact-company">
                          Company *
                        </label>
                        <input
                          id="contact-company"
                          type="text"
                          required
                          placeholder="Company name"
                          value={formData.company}
                          onChange={set('company')}
                          className="field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="field-label" htmlFor="contact-industry">
                        Industry
                      </label>
                      <select
                        id="contact-industry"
                        value={formData.industry}
                        onChange={set('industry')}
                        className="field"
                      >
                        <option value="">Select your industry…</option>
                        {INDUSTRIES.map(i => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="field-label" htmlFor="contact-project">
                        Project Type
                      </label>
                      <select
                        id="contact-project"
                        value={formData.projectType}
                        onChange={set('projectType')}
                        className="field"
                      >
                        <option value="">What are you looking to build?</option>
                        {PROJECT_TYPES.map(p => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="field-label" htmlFor="contact-budget">
                          Estimated Budget
                        </label>
                        <select
                          id="contact-budget"
                          value={formData.budget}
                          onChange={set('budget')}
                          className="field"
                        >
                          <option value="">Select budget range…</option>
                          {BUDGETS.map(b => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="field-label" htmlFor="contact-timeline">
                          Timeline
                        </label>
                        <select
                          id="contact-timeline"
                          value={formData.timeline}
                          onChange={set('timeline')}
                          className="field"
                        >
                          <option value="">Expected timeline…</option>
                          {TIMELINES.map(t => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="field-label" htmlFor="contact-message">
                        AI / Software Requirements
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        placeholder="Describe your goals, existing tech stack, or specific AI requirements…"
                        value={formData.message}
                        onChange={set('message')}
                        className="field"
                      />
                    </div>

                    <button type="submit" className="btn btn-primary w-full !py-3.5 !text-[14px]">
                      Book Free Consultation <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};
