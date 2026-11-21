import React from 'react';
import { PageTab } from '../types';
import { Reveal } from '../components/Reveal';
import { Cpu, Code, Palette, Briefcase, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface CareersViewProps {
  onSelectTab: (tab: PageTab) => void;
}

const JOBS: {
  id: string;
  title: string;
  location: string;
  type: string;
  experience: string;
  icon: LucideIcon;
  emailSubject: string;
}[] = [
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

export const CareersView: React.FC<CareersViewProps> = ({ onSelectTab }) => {
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
            <span className="eyebrow mb-4">Join The Team</span>
            <h1 className="display-1 mb-4" style={{ color: 'var(--fg)' }}>
              Build the Future <br />
              of <span className="grad-text">AI With Us</span>
            </h1>
            <p className="lede max-w-xl">
              Four open roles. Small team, deep ownership, and work that ships to real users.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Open Positions */}
      <section className="container-x section-y">
        <Reveal animation="fade-up" className="mb-12">
          <span className="eyebrow mb-2">Open Positions</span>
          <h2 className="display-2 mb-3" style={{ color: 'var(--fg)' }}>
            We Are <span className="grad-text">Hiring</span>
          </h2>
          <p className="lede max-w-xl">
            We're looking for co-builders — people who take deep ownership, move with urgency, and want to
            ship AI solutions that genuinely matter.
          </p>
        </Reveal>

        <div className="max-w-4xl space-y-4">
          {JOBS.map((job, idx) => {
            const Icon = job.icon;
            return (
              <Reveal key={job.id} animation="fade-up" delay={idx * 70}>
                <div className="card card-hover flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background: 'rgba(124,92,255,0.14)',
                        border: '1px solid var(--line-strong)',
                        color: 'var(--accent-soft)',
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-[16px] font-bold" style={{ color: 'var(--fg)' }}>
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="chip chip-accent">
                          <MapPin className="h-3 w-3" /> {job.location}
                        </span>
                        <span className="chip chip-cyan">
                          <Clock className="h-3 w-3" /> {job.type}
                        </span>
                        <span className="chip">{job.experience}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`mailto:hello@clarivex.ai?subject=${encodeURIComponent(job.emailSubject)}`}
                    className="btn btn-primary shrink-0 !px-5 !py-2.5 !text-[12.5px]"
                  >
                    Apply Now <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Open Application CTA */}
        <Reveal animation="scale" delay={150}>
          <div
            className="mt-14 max-w-4xl rounded-3xl p-8 text-center sm:p-12"
            style={{
              background: 'linear-gradient(120deg, rgba(124,92,255,0.16), rgba(0,212,255,0.12))',
              border: '1px solid var(--line-strong)',
            }}
          >
            <h3 className="display-3 mb-3" style={{ color: 'var(--fg)' }}>
              Don't see your specific role?
            </h3>
            <p className="mx-auto mb-6 max-w-md text-[14px]" style={{ color: 'var(--muted)' }}>
              We are always eager to meet high-caliber talent in systems engineering, AI research,
              distributed computing, and growth.
            </p>
            <a
              href="mailto:hello@clarivex.ai?subject=Open%20Application"
              className="btn btn-primary"
            >
              <Mail className="h-4 w-4" />
              Send Open Application
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
};
