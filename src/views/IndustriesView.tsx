import React from 'react';
import { PageTab } from '../types';
import { Reveal } from '../components/Reveal';
import { ArrowRight } from 'lucide-react';

interface IndustriesViewProps {
  onSelectTab: (tab: PageTab) => void;
}

const INDUSTRIES = [
  {
    icon: '🏥',
    name: 'Healthcare',
    challenge: 'Patient data management, diagnosis accuracy, and administrative overhead.',
    solution: 'Medical record AI, predictive diagnostics, automated scheduling, and clinical NLP.',
  },
  {
    icon: '💰',
    name: 'Finance & Banking',
    challenge: 'Fraud detection, risk assessment, and customer onboarding complexity.',
    solution: 'Real-time fraud detection, credit risk AI, automated KYC, and intelligent reporting.',
  },
  {
    icon: '🏛️',
    name: 'Government',
    challenge: 'Citizen service delivery, data silos, and process inefficiency.',
    solution: 'Citizen AI portals, document automation, predictive resource planning, and chatbots.',
  },
  {
    icon: '🛒',
    name: 'Retail & E-Commerce',
    challenge: 'Inventory management, customer churn, and personalization at scale.',
    solution: 'Demand forecasting, recommendation engines, churn prevention, and inventory AI.',
  },
  {
    icon: '📚',
    name: 'Education',
    challenge: 'Student engagement, personalized learning, and administrative load.',
    solution: 'Adaptive learning AI, student performance analytics, automated grading, and chatbots.',
  },
  {
    icon: '🏭',
    name: 'Manufacturing',
    challenge: 'Predictive maintenance, quality control, and supply chain visibility.',
    solution: 'Predictive maintenance AI, vision-based quality control, and supply chain optimization.',
  },
  {
    icon: '🚚',
    name: 'Logistics',
    challenge: 'Route optimization, delivery prediction, and warehouse management.',
    solution: 'AI route optimization, delivery ETA prediction, automated warehouse management.',
  },
];

export const IndustriesView: React.FC<IndustriesViewProps> = ({ onSelectTab }) => {
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
            <span className="eyebrow mb-4">Industry Solutions</span>
            <h1 className="display-1 mb-4" style={{ color: 'var(--fg)' }}>
              AI Solutions for <span className="grad-text">Every Industry</span>
            </h1>
            <p className="lede max-w-xl">
              Seven domains, each with its own operational friction and regulatory constraints. We build
              for the domain, not for a generic demo.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Industries Grid */}
      <section className="container-x section-y">
        <Reveal animation="fade-up" className="mb-12">
          <span className="eyebrow mb-2">Industries</span>
          <h2 className="display-2 mb-3" style={{ color: 'var(--fg)' }}>
            Domain-Specific <span className="grad-text">AI Solutions</span>
          </h2>
          <p className="lede max-w-xl">
            We understand that every industry has unique operational friction and regulatory standards.
            Our AI systems are built for your domain.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((ind, idx) => (
            <Reveal key={ind.name} animation="fade-up" delay={idx * 60}>
              <div className="card card-hover group h-full p-7">
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--line-soft)' }}
                >
                  {ind.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold" style={{ color: 'var(--fg)' }}>
                  {ind.name}
                </h3>
                <p className="mb-3 text-[12.5px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                  <span className="font-medium" style={{ color: 'var(--fg-soft)' }}>
                    Challenge:
                  </span>{' '}
                  {ind.challenge}
                </p>
                <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--accent-2-soft)' }}>
                  <span className="font-semibold" style={{ color: 'var(--accent-2)' }}>
                    AI Solution:
                  </span>{' '}
                  {ind.solution}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal animation="scale" delay={120}>
          <div
            className="mt-16 rounded-3xl p-8 text-center sm:p-12"
            style={{
              background: 'linear-gradient(120deg, rgba(124,92,255,0.16), rgba(0,212,255,0.12))',
              border: '1px solid var(--line-strong)',
            }}
          >
            <h3 className="display-3 mb-3" style={{ color: 'var(--fg)' }}>
              Don't see your industry?
            </h3>
            <p className="mx-auto mb-6 max-w-lg text-[14px]" style={{ color: 'var(--muted)' }}>
              The same engineering approach applies to any domain with structured data and a repeatable
              process. Tell us what you are trying to solve.
            </p>
            <button onClick={() => onSelectTab('contact')} className="btn btn-primary">
              Talk to an architect <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
};
