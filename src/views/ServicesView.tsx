import React, { useEffect, useState } from 'react';
import { PageTab } from '../types';
import { Reveal } from '../components/Reveal';
import { AI_SERVICES, SOFTWARE_SOLUTIONS } from '../data/services';
import type { ServiceItem } from '../types';
import {
  Bot,
  Zap,
  Cpu,
  TrendingUp,
  Sparkles,
  FileText,
  Globe,
  Layers,
  Cloud,
  Smartphone,
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Bot,
  Zap,
  Cpu,
  TrendingUp,
  Sparkles,
  FileText,
  Globe,
  Layers,
  Cloud,
  Smartphone,
};

interface ServicesViewProps {
  onSelectTab: (tab: PageTab) => void;
}

const ServiceCard: React.FC<{
  service: ServiceItem;
  index: number;
  onOpen: (service: ServiceItem) => void;
}> = ({ service, index, onOpen }) => {
  const Icon = ICONS[service.icon] ?? Bot;
  const isAI = service.tag === 'AI SERVICE';

  return (
    <Reveal animation="fade-up" delay={index * 60}>
      <button
        type="button"
        onClick={() => onOpen(service)}
        aria-label={`View details for ${service.name}`}
        className="card card-hover group h-full w-full p-7 text-left cursor-pointer"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-widest" style={{ color: 'var(--accent)' }}>
            {service.num}
          </span>
          <span className={isAI ? 'chip chip-accent' : 'chip chip-cyan'}>
            {isAI ? 'AI' : 'SOFTWARE'}
          </span>
        </div>

        <div
          className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{
            background: isAI ? 'rgba(124,92,255,0.12)' : 'rgba(0,212,255,0.1)',
            color: isAI ? 'var(--accent-soft)' : 'var(--accent-2-soft)',
          }}
        >
          <Icon className="h-5 w-5" />
        </div>

        <h3 className="mb-2 text-[17px] font-bold" style={{ color: 'var(--fg)' }}>
          {service.name}
        </h3>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>
          {service.desc}
        </p>

        <span
          className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold transition-transform duration-300 group-hover:translate-x-1"
          style={{ color: 'var(--accent-2)' }}
        >
          View details <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </button>
    </Reveal>
  );
};

const ServiceDetail: React.FC<{
  service: ServiceItem;
  onClose: () => void;
  onSelectTab: (tab: PageTab) => void;
}> = ({ service, onClose, onSelectTab }) => {
  const Icon = ICONS[service.icon] ?? Bot;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto p-4 sm:p-8"
      style={{ background: 'rgba(4,7,18,0.72)', backdropFilter: 'blur(8px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-detail-title"
      onClick={onClose}
    >
      <div
        className="card my-auto w-full max-w-3xl p-6 sm:p-9"
        style={{ background: 'var(--elevated)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'rgba(124,92,255,0.14)', color: 'var(--accent-soft)' }}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-widest" style={{ color: 'var(--accent)' }}>
                  {service.num}
                </span>
                <span className={service.tag === 'AI SERVICE' ? 'chip chip-accent' : 'chip chip-cyan'}>
                  {service.tag}
                </span>
              </div>
              <h2 id="service-detail-title" className="display-3" style={{ color: 'var(--fg)' }}>
                {service.name}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="btn btn-quiet shrink-0 !p-2.5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-7 text-[14px] leading-relaxed" style={{ color: 'var(--fg-soft)' }}>
          {service.detail.overview}
        </p>

        <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {service.detail.outcomes.map(o => (
            <div key={o.label} className="card-flat p-4">
              <div className="text-[15px] font-bold" style={{ color: 'var(--fg)' }}>
                {o.value}
              </div>
              <div className="mt-0.5 text-[11px] uppercase tracking-wider" style={{ color: 'var(--faint)' }}>
                {o.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-7">
          <h3 className="mb-3 text-[13px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-2)' }}>
            What you get
          </h3>
          <ul className="space-y-2.5">
            {service.detail.deliverables.map(d => (
              <li key={d} className="flex items-start gap-2.5 text-[13.5px]" style={{ color: 'var(--fg-soft)' }}>
                <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--accent-3)' }} />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-7">
          <h3 className="mb-3 text-[13px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-2)' }}>
            Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {service.detail.stack.map(s => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div
          className="mb-7 flex items-center gap-2.5 rounded-xl px-4 py-3"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--line-soft)' }}
        >
          <Clock className="h-4 w-4" style={{ color: 'var(--accent-2)' }} />
          <span className="text-[13px]" style={{ color: 'var(--fg-soft)' }}>
            Typical timeline: <strong style={{ color: 'var(--fg)' }}>{service.detail.timeline}</strong>
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectTab('contact');
            }}
            className="btn btn-primary"
          >
            Discuss this service <ArrowRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={onClose} className="btn btn-ghost">
            <ArrowLeft className="h-4 w-4" /> Back to all services
          </button>
        </div>
      </div>
    </div>
  );
};

export const ServicesView: React.FC<ServicesViewProps> = ({ onSelectTab }) => {
  const [active, setActive] = useState<ServiceItem | null>(null);

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
            <span className="eyebrow mb-4">What We Build</span>
            <h1 className="display-1 mb-4" style={{ color: 'var(--fg)' }}>
              AI Services &<br />
              <span className="grad-text">Software Solutions</span>
            </h1>
            <p className="lede max-w-xl">
              Ten capabilities, one engineering team. Select any service to see exactly what we deliver,
              the stack we use, and how long it takes.
            </p>
          </Reveal>
        </div>
      </div>

      {/* AI Services */}
      <section className="container-x section-y">
        <Reveal animation="fade-up" className="mb-12">
          <span className="eyebrow mb-2">AI Services</span>
          <h2 className="display-2" style={{ color: 'var(--fg)' }}>
            <span className="grad-text">Artificial Intelligence</span> Services
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {AI_SERVICES.map((svc, idx) => (
            <ServiceCard key={svc.id} service={svc} index={idx} onOpen={setActive} />
          ))}
        </div>
      </section>

      {/* Software Development */}
      <section
        className="border-t py-20"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }}
      >
        <div className="container-x">
          <Reveal animation="fade-up" className="mb-12">
            <span className="eyebrow mb-2">Software Development</span>
            <h2 className="display-2" style={{ color: 'var(--fg)' }}>
              Enterprise <span className="grad-text">Software Solutions</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {SOFTWARE_SOLUTIONS.map((sol, idx) => (
              <ServiceCard key={sol.id} service={sol} index={idx} onOpen={setActive} />
            ))}
          </div>

          {/* CTA Banner */}
          <Reveal animation="scale" delay={150}>
            <div
              className="relative mt-16 overflow-hidden rounded-3xl p-8 text-center sm:p-12"
              style={{
                background: 'linear-gradient(120deg, rgba(124,92,255,0.16), rgba(0,212,255,0.12))',
                border: '1px solid var(--line-strong)',
              }}
            >
              <h3 className="display-3 mb-3" style={{ color: 'var(--fg)' }}>
                Need a Custom Solution for Your Enterprise?
              </h3>
              <p className="mx-auto mb-6 max-w-lg text-[14px]" style={{ color: 'var(--muted)' }}>
                Our architects and machine learning engineers will scope and build a production-ready
                solution tailored specifically to your business workflows.
              </p>
              <button onClick={() => onSelectTab('contact')} className="btn btn-primary">
                Book Consultation <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {active && (
        <ServiceDetail service={active} onClose={() => setActive(null)} onSelectTab={onSelectTab} />
      )}
    </div>
  );
};
