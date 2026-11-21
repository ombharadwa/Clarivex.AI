import React from 'react';
import { PageTab } from '../types';
import { Reveal } from '../components/Reveal';
import { ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onSelectTab: (tab: PageTab) => void;
}

const VALUES = [
  {
    title: 'AI-First Always',
    desc: 'Every product we build starts and ends with AI at the core — not as an add-on, but as the foundation.',
  },
  {
    title: 'Radical Simplicity',
    desc: 'Complex AI should feel simple. We obsess over removing friction from every user experience.',
  },
  {
    title: 'Enterprise Grade',
    desc: 'We build for scale, security, and performance from day one — not as an afterthought.',
  },
  {
    title: 'India-Built, World-Class',
    desc: 'Proud of our roots. Delivering world-class AI solutions from Ahmedabad to the globe.',
  },
];

const FACTS = [
  { value: '2025', label: 'Founded' },
  { value: 'Ahmedabad', label: 'HQ' },
  { value: '7+', label: 'Industries' },
  { value: 'Global', label: 'Vision' },
];

export const AboutView: React.FC<AboutViewProps> = ({ onSelectTab }) => {
  return (
    <div className="page-top min-h-screen">
      {/* Hero Banner */}
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
            <span className="eyebrow mb-4">Our Story</span>
            <h1 className="display-1 mb-4" style={{ color: 'var(--fg)' }}>
              Built to Make AI <span className="grad-text">Accessible</span>
              <br />
              to Every Business
            </h1>
            <p className="lede max-w-xl">
              An AI-driven software and digital transformation company, headquartered in Ahmedabad, India.
            </p>
          </Reveal>
        </div>
      </div>

      {/* About Company Grid */}
      <section className="container-x section-y">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Brand Visual */}
          <Reveal animation="fade-left">
            <div
              className="relative flex h-[380px] items-center justify-center overflow-hidden rounded-3xl"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line-strong)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 50% 40%, rgba(124,92,255,0.18), transparent 65%)',
                }}
              />
              <div className="relative z-10 text-center">
                <svg className="animate-orb1 mx-auto h-24 w-24" viewBox="0 0 100 100" fill="none">
                  <defs>
                    <linearGradient id="aboutGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" />
                      <stop offset="100%" stopColor="var(--accent-2)" />
                    </linearGradient>
                  </defs>
                  <rect width="100" height="100" rx="22" fill="rgba(124,92,255,0.15)" />
                  <rect
                    width="100"
                    height="100"
                    rx="22"
                    fill="none"
                    stroke="url(#aboutGrad)"
                    strokeWidth="1"
                  />
                  <line
                    x1="28"
                    y1="28"
                    x2="72"
                    y2="72"
                    stroke="var(--accent)"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <line
                    x1="72"
                    y1="28"
                    x2="28"
                    y2="72"
                    stroke="var(--accent-2)"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <circle cx="50" cy="50" r="8" fill="url(#aboutGrad)" />
                </svg>
                <div
                  className="mt-5 text-[18px] font-extrabold tracking-[1px]"
                  style={{ color: 'var(--fg)' }}
                >
                  CLARIVEX<span className="grad-text">.AI</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* About Description */}
          <Reveal animation="fade-right">
            <div>
              <span className="eyebrow mb-2">About Us</span>
              <h2 className="display-2 mb-6" style={{ color: 'var(--fg)' }}>
                AI-Driven Software &<br />
                <span className="grad-text">Digital Transformation</span>
              </h2>
              <p className="mb-4 text-[15px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                Clarivex.AI is an AI-driven software and digital transformation company headquartered in
                Ahmedabad, India. We help enterprises across industries harness the power of artificial
                intelligence to modernize operations, automate workflows, and build intelligent products.
              </p>
              <p className="mb-8 text-[15px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                From custom AI systems to full-stack enterprise software, we are your end-to-end
                technology partner for the intelligent future.
              </p>

              {/* Quick Facts */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {FACTS.map(f => (
                  <div key={f.label} className="card-flat p-4 text-center">
                    <div className="grad-text text-2xl font-extrabold">{f.value}</div>
                    <div
                      className="mt-1 text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--muted)' }}
                    >
                      {f.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values Section */}
      <section
        className="border-y py-20"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
      >
        <div className="container-x">
          <Reveal animation="fade-up">
            <div className="mb-12">
              <span className="eyebrow mb-2">Our Values</span>
              <h2 className="display-2" style={{ color: 'var(--fg)' }}>
                What <span className="grad-text">Drives Us</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
            {VALUES.map((val, idx) => (
              <Reveal key={val.title} animation="fade-up" delay={idx * 70}>
                <div className="card-flat flex h-full items-start gap-4 p-6">
                  <div
                    className="mt-1.5 h-3 w-3 shrink-0 rounded-full"
                    style={{
                      background:
                        idx % 2 === 0
                          ? 'linear-gradient(135deg, var(--accent), var(--accent-soft))'
                          : 'linear-gradient(135deg, var(--accent-2), var(--accent-3))',
                    }}
                  />
                  <div>
                    <h4 className="mb-1.5 text-[16px] font-bold" style={{ color: 'var(--fg)' }}>
                      {val.title}
                    </h4>
                    <p className="text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {val.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership / Founder Section */}
      <section className="container-x section-y">
        <Reveal animation="fade-up">
          <div className="mb-12">
            <span className="eyebrow mb-2">Leadership</span>
            <h2 className="display-2" style={{ color: 'var(--fg)' }}>
              Meet the <span className="grad-text">Founder</span>
            </h2>
          </div>
        </Reveal>

        <Reveal animation="scale">
          <div className="card max-w-xl p-8">
            <div className="mb-6 flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-extrabold text-white"
                style={{
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                  boxShadow: '0 10px 30px -12px rgba(124,92,255,0.8)',
                }}
              >
                OB
              </div>
              <div>
                <div className="text-xl font-extrabold" style={{ color: 'var(--fg)' }}>
                  Om Bharadwa
                </div>
                <div
                  className="mt-1 text-[11px] font-bold tracking-[2px]"
                  style={{ color: 'var(--accent-soft)' }}
                >
                  FOUNDER &amp; CEO
                </div>
              </div>
            </div>

            <p className="mb-6 text-[13.5px] leading-relaxed" style={{ color: 'var(--muted)' }}>
              Visionary technologist and entrepreneur building the future of AI-powered enterprise
              software in India. Om founded Clarivex.AI to make intelligent, AI-driven digital
              transformation accessible to every business — from high-growth startups to large
              enterprise operations.
            </p>

            <a
              href="https://www.linkedin.com/company/clarivex-ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost !px-4 !py-2.5 !text-[12.5px]"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              Connect on LinkedIn
            </a>
          </div>
        </Reveal>

        <Reveal animation="fade-up" delay={120}>
          <div className="mt-14 flex flex-wrap gap-3">
            <button onClick={() => onSelectTab('services')} className="btn btn-primary">
              Explore our services <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => onSelectTab('contact')} className="btn btn-ghost">
              Get in touch
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
};
