import React from 'react';
import { PageTab } from '../types';

interface IndustriesViewProps {
  onSelectTab: (tab: PageTab) => void;
}

export const IndustriesView: React.FC<IndustriesViewProps> = ({ onSelectTab }) => {
  const industries = [
    {
      icon: '🏥',
      name: 'Healthcare',
      challenge: 'Patient data management, diagnosis accuracy, and administrative overhead.',
      solution: 'Medical record AI, predictive diagnostics, automated scheduling, and clinical NLP.',
      color: 'bg-red-500/10 border-red-500/20 text-red-400',
    },
    {
      icon: '💰',
      name: 'Finance & Banking',
      challenge: 'Fraud detection, risk assessment, and customer onboarding complexity.',
      solution: 'Real-time fraud detection, credit risk AI, automated KYC, and intelligent reporting.',
      color: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    },
    {
      icon: '🏛️',
      name: 'Government',
      challenge: 'Citizen service delivery, data silos, and process inefficiency.',
      solution: 'Citizen AI portals, document automation, predictive resource planning, and chatbots.',
      color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    },
    {
      icon: '🛒',
      name: 'Retail & E-Commerce',
      challenge: 'Inventory management, customer churn, and personalization at scale.',
      solution: 'Demand forecasting, recommendation engines, churn prevention, and inventory AI.',
      color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    },
    {
      icon: '📚',
      name: 'Education',
      challenge: 'Student engagement, personalized learning, and administrative load.',
      solution: 'Adaptive learning AI, student performance analytics, automated grading, and chatbots.',
      color: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
    },
    {
      icon: '🏭',
      name: 'Manufacturing',
      challenge: 'Predictive maintenance, quality control, and supply chain visibility.',
      solution: 'Predictive maintenance AI, vision-based quality control, and supply chain optimization.',
      color: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    },
    {
      icon: '🚚',
      name: 'Logistics',
      challenge: 'Route optimization, delivery prediction, and warehouse management.',
      solution: 'AI route optimization, delivery ETA prediction, automated warehouse management.',
      color: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#7C5CFF]/10 border border-[#7C5CFF]/30 text-[#A48BFF] text-[11px] font-semibold tracking-[2px] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
            Industry Solutions
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            AI Solutions for <span className="grad-text">Every Industry</span>
          </h1>
        </div>
      </div>

      {/* Industries Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 text-[#00D4FF] text-[11px] font-bold tracking-[3px] uppercase mb-2">
            <span className="w-5 h-[1px] bg-[#00D4FF]" />
            Industries
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Domain-Specific <span className="grad-text">AI Solutions</span>
          </h2>
          <p className="text-[15px] text-[#8892B0] max-w-xl font-light">
            We understand that every industry has unique operational friction and regulatory standards. Our AI systems are built for your domain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind, idx) => (
            <div
              key={idx}
              className="bg-[#151B35]/70 border border-[#7C5CFF]/20 rounded-2xl p-7 hover:-translate-y-1.5 hover:border-[#00D4FF]/40 transition-all shadow-xl group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
                {ind.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{ind.name}</h3>
              <p className="text-[12.5px] text-[#8892B0] mb-3 leading-relaxed">
                <span className="text-white/60 font-medium">Challenge:</span> {ind.challenge}
              </p>
              <p className="text-[12.5px] text-[#7EEEFF] leading-relaxed">
                <span className="text-[#00D4FF] font-semibold">AI Solution:</span> {ind.solution}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
