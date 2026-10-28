import React from 'react';
import { PageTab } from '../types';
import { Reveal } from '../components/Reveal';
import { Cpu, Code, Palette, Briefcase, Mail } from 'lucide-react';

interface CareersViewProps {
  onSelectTab: (tab: PageTab) => void;
}

export const CareersView: React.FC<CareersViewProps> = ({ onSelectTab }) => {
  const jobs = [
    {
      id: '1',
      title: 'AI / ML Engineer',
      location: 'Remote / Ahmedabad',
      type: 'Full-time',
      experience: '2+ Years',
      icon: Cpu,
      emailSubject: 'Application: AI/ML Engineer',
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      location: 'Remote / Ahmedabad',
      type: 'Full-time',
      experience: '2+ Years',
      icon: Code,
      emailSubject: 'Application: Full Stack Developer',
    },
    {
      id: '3',
      title: 'Product Designer (UI/UX)',
      location: 'Remote / Ahmedabad',
      type: 'Full-time',
      experience: '2+ Years',
      icon: Palette,
      emailSubject: 'Application: Product Designer',
    },
    {
      id: '4',
      title: 'Business Development Executive',
      location: 'Ahmedabad (Hybrid)',
      type: 'Full-time',
      experience: '1–3 Years',
      icon: Briefcase,
      emailSubject: 'Application: Business Development',
    },
  ];

  return (
    <div className="min-h-screen pt-[70px]">
      {/* Hero */}
      <div className="relative py-20 bg-[#0B1020] border-b border-[#7C5CFF]/15 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[450px] h-[450px] -right-20 -top-20 rounded-full bg-radial from-[#7C5CFF]/20 to-transparent blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(124,92,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(124,92,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Reveal animation="fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#7C5CFF]/10 border border-[#7C5CFF]/30 text-[#A48BFF] text-[11px] font-semibold tracking-[2px] uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
              Join The Team
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Build the Future <br />
              of <span className="grad-text">AI With Us</span>
            </h1>
          </Reveal>
        </div>
      </div>

      {/* Open Positions */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Reveal animation="fade-up" className="mb-12">
          <div className="inline-flex items-center gap-2 text-[#00D4FF] text-[11px] font-bold tracking-[3px] uppercase mb-2">
            <span className="w-5 h-[1px] bg-[#00D4FF]" />
            Open Positions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            We Are <span className="grad-text">Hiring</span>
          </h2>
          <p className="text-[15px] text-[#8892B0] max-w-xl font-light">
            We're looking for co-builders — people who take deep ownership, move with urgency, and want to ship AI solutions that genuinely matter.
          </p>
        </Reveal>

        <div className="space-y-4 max-w-4xl">
          {jobs.map((job, idx) => {
            const Icon = job.icon;
            return (
              <Reveal key={job.id} animation="fade-up" delay={idx * 80}>
                <div className="bg-[#151B35]/70 border border-[#7C5CFF]/20 hover:border-[#7C5CFF]/45 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:-translate-y-1 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 flex items-center justify-center text-[#A48BFF] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-white mb-2">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-[#7C5CFF]/15 text-[#A48BFF] text-[10.5px] font-medium">
                          {job.location}
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-[#00D4FF]/10 text-[#7EEEFF] text-[10.5px] font-medium">
                          {job.type}
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-white/5 text-[#8892B0] text-[10.5px] font-medium">
                          {job.experience}
                        </span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`mailto:hello@clarivex.ai?subject=${encodeURIComponent(job.emailSubject)}`}
                    className="px-5 py-2.5 rounded-lg bg-[#7C5CFF] hover:bg-[#A48BFF] text-white text-[12.5px] font-semibold text-center transition-all shrink-0 cursor-pointer shadow-md"
                  >
                    Apply Now
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Open Application CTA */}
        <Reveal animation="scale" delay={150}>
          <div className="mt-14 max-w-4xl bg-gradient-to-r from-[#151B35] to-[#1a2244] border border-[#7C5CFF]/25 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <h3 className="text-2xl font-extrabold text-white mb-3">
              Don't see your specific role?
            </h3>
            <p className="text-[14px] text-[#8892B0] max-w-md mx-auto mb-6">
              We are always eager to meet high-caliber talent in systems engineering, AI research, distributed computing, and growth.
            </p>
            <a
              href="mailto:hello@clarivex.ai?subject=Open%20Application"
              className="btn-grad text-white px-7 py-3 rounded-lg text-[13.5px] font-semibold inline-flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Mail className="w-4 h-4" />
              Send Open Application
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
};
