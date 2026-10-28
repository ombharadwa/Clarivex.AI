import React from 'react';
import { PageTab } from '../types';

interface AboutViewProps {
  onSelectTab: (tab: PageTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onSelectTab }) => {
  return (
    <div className="min-h-screen pt-[70px]">
      {/* Hero Banner */}
      <div className="relative py-20 bg-[#0B1020] border-b border-[#7C5CFF]/15 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[450px] h-[450px] -right-20 -top-20 rounded-full bg-radial from-[#7C5CFF]/20 to-transparent blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(124,92,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(124,92,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#7C5CFF]/10 border border-[#7C5CFF]/30 text-[#A48BFF] text-[11px] font-semibold tracking-[2px] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
            Our Story
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Built to Make AI <span className="grad-text">Accessible</span>
            <br />
            to Every Business
          </h1>
        </div>
      </div>

      {/* About Company Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Brand Visual */}
          <div className="h-[380px] rounded-3xl bg-[#151B35]/80 border border-[#7C5CFF]/25 flex items-center justify-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-radial from-[#7C5CFF]/15 via-transparent to-transparent" />
            <div className="relative z-10 text-center">
              <svg className="w-24 h-24 mx-auto animate-orb1" viewBox="0 0 100 100" fill="none">
                <defs>
                  <linearGradient id="aboutGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7C5CFF" />
                    <stop offset="100%" stopColor="#00D4FF" />
                  </linearGradient>
                </defs>
                <rect width="100" height="100" rx="22" fill="rgba(124,92,255,0.15)" />
                <rect width="100" height="100" rx="22" fill="none" stroke="url(#aboutGrad)" strokeWidth="1" />
                <line x1="28" y1="28" x2="72" y2="72" stroke="#7C5CFF" strokeWidth="10" strokeLinecap="round" />
                <line x1="72" y1="28" x2="28" y2="72" stroke="#00D4FF" strokeWidth="10" strokeLinecap="round" />
                <circle cx="50" cy="50" r="8" fill="url(#aboutGrad)" />
              </svg>
              <div className="font-extrabold text-[18px] tracking-[1px] text-white mt-5">
                CLARIVEX<span className="grad-text">.AI</span>
              </div>
            </div>
          </div>

          {/* About Description */}
          <div>
            <div className="inline-flex items-center gap-2 text-[#00D4FF] text-[11px] font-bold tracking-[3px] uppercase mb-2">
              <span className="w-5 h-[1px] bg-[#00D4FF]" />
              About Us
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
              AI-Driven Software & <br />
              <span className="grad-text">Digital Transformation</span>
            </h2>
            <p className="text-[15px] text-[#8892B0] leading-relaxed mb-4">
              Clarivex.AI is an AI-driven software and digital transformation company headquartered in Ahmedabad, India. We help enterprises across industries harness the power of artificial intelligence to modernize operations, automate workflows, and build intelligent products.
            </p>
            <p className="text-[15px] text-[#8892B0] leading-relaxed mb-8">
              From custom AI systems to full-stack enterprise software, we are your end-to-end technology partner for the intelligent future.
            </p>

            {/* Quick Facts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#151B35]/70 border border-[#7C5CFF]/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-extrabold grad-text">2025</div>
                <div className="text-[10px] text-[#8892B0] font-semibold mt-1 uppercase">Founded</div>
              </div>
              <div className="bg-[#151B35]/70 border border-[#7C5CFF]/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-extrabold grad-text">Ahmedabad</div>
                <div className="text-[10px] text-[#8892B0] font-semibold mt-1 uppercase">HQ</div>
              </div>
              <div className="bg-[#151B35]/70 border border-[#7C5CFF]/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-extrabold grad-text">7+</div>
                <div className="text-[10px] text-[#8892B0] font-semibold mt-1 uppercase">Industries</div>
              </div>
              <div className="bg-[#151B35]/70 border border-[#7C5CFF]/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-extrabold grad-text">Global</div>
                <div className="text-[10px] text-[#8892B0] font-semibold mt-1 uppercase">Vision</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-[#151B35]/40 border-y border-[#7C5CFF]/15 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 text-[#00D4FF] text-[11px] font-bold tracking-[3px] uppercase mb-2">
              <span className="w-5 h-[1px] bg-[#00D4FF]" />
              Our Values
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              What <span className="grad-text">Drives Us</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {[
              {
                title: 'AI-First Always',
                desc: 'Every product we build starts and ends with AI at the core — not as an add-on, but as the foundation.',
                color: 'bg-[#7C5CFF]',
              },
              {
                title: 'Radical Simplicity',
                desc: 'Complex AI should feel simple. We obsess over removing friction from every user experience.',
                color: 'bg-[#00D4FF]',
              },
              {
                title: 'Enterprise Grade',
                desc: 'We build for scale, security, and performance from day one — not as an afterthought.',
                color: 'bg-[#7C5CFF]',
              },
              {
                title: 'India-Built, World-Class',
                desc: 'Proud of our roots. Delivering world-class AI solutions from Ahmedabad to the globe.',
                color: 'bg-[#00D4FF]',
              },
            ].map((val, idx) => (
              <div
                key={idx}
                className="bg-[#0B1020]/80 border border-[#7C5CFF]/20 rounded-2xl p-6 flex items-start gap-4"
              >
                <div className={`w-3 h-3 rounded-full ${val.color} shrink-0 mt-1.5`} />
                <div>
                  <h4 className="text-[16px] font-bold text-white mb-1.5">{val.title}</h4>
                  <p className="text-[13px] text-[#8892B0] leading-relaxed">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership / Founder Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 text-[#00D4FF] text-[11px] font-bold tracking-[3px] uppercase mb-2">
            <span className="w-5 h-[1px] bg-[#00D4FF]" />
            Leadership
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Meet the <span className="grad-text">Founder</span>
          </h2>
        </div>

        <div className="max-w-xl bg-[#151B35]/80 border border-[#7C5CFF]/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#7C5CFF] to-[#00D4FF] flex items-center justify-center font-extrabold text-white text-xl shadow-md">
              OB
            </div>
            <div>
              <div className="text-xl font-extrabold text-white">Om Bharadwa</div>
              <div className="text-[11px] font-bold tracking-[2px] text-[#A48BFF] mt-1">
                FOUNDER & CEO
              </div>
            </div>
          </div>

          <p className="text-[13.5px] text-[#8892B0] leading-relaxed mb-6">
            Visionary technologist and entrepreneur building the future of AI-powered enterprise software in India. Om founded Clarivex.AI to make intelligent, AI-driven digital transformation accessible to every business — from high-growth startups to large enterprise operations.
          </p>

          <a
            href="https://www.linkedin.com/company/clarivex-ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 text-[#A48BFF] hover:bg-[#7C5CFF]/25 hover:text-white text-[12.5px] font-semibold transition-all"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            Connect on LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
};
