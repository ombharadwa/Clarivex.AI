import React from 'react';
import { PageTab } from '../types';
import { Reveal } from '../components/Reveal';
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
  ArrowRight
} from 'lucide-react';

interface ServicesViewProps {
  onSelectTab: (tab: PageTab) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onSelectTab }) => {
  const aiServices = [
    {
      num: '01',
      title: 'AI Chatbots',
      desc: 'Intelligent conversational agents for customer support, sales, and internal workflows. Multilingual and domain-trained.',
      icon: Bot,
      color: 'text-[#7C5CFF]',
      bg: 'bg-[#7C5CFF]/10',
    },
    {
      num: '02',
      title: 'AI Automation',
      desc: 'End-to-end intelligent process automation. Eliminate manual work and let AI handle complex decision-making.',
      icon: Zap,
      color: 'text-[#00D4FF]',
      bg: 'bg-[#00D4FF]/10',
    },
    {
      num: '03',
      title: 'AI Agents',
      desc: 'Autonomous AI agents that execute multi-step tasks, integrate with your enterprise systems, and learn from outcomes.',
      icon: Cpu,
      color: 'text-[#7C5CFF]',
      bg: 'bg-[#7C5CFF]/10',
    },
    {
      num: '04',
      title: 'Predictive Analytics',
      desc: 'ML-powered forecasting systems for revenue, churn, demand, risk, and key business metrics.',
      icon: TrendingUp,
      color: 'text-[#00D4FF]',
      bg: 'bg-[#00D4FF]/10',
    },
    {
      num: '05',
      title: 'Generative AI',
      desc: 'Custom generative AI solutions, LLM fine-tuning, RAG retrieval-augmented generation systems, and AI content pipelines.',
      icon: Sparkles,
      color: 'text-[#7C5CFF]',
      bg: 'bg-[#7C5CFF]/10',
    },
    {
      num: '06',
      title: 'NLP Solutions',
      desc: 'Natural language processing for document analysis, sentiment detection, entity extraction, and text classification.',
      icon: FileText,
      color: 'text-[#00D4FF]',
      bg: 'bg-[#00D4FF]/10',
    },
  ];

  const softwareSolutions = [
    {
      num: '07',
      title: 'Web Applications',
      desc: 'Scalable, modern web applications built with React, modern frameworks, and cloud-native architecture.',
      icon: Globe,
      color: 'text-[#7C5CFF]',
      bg: 'bg-[#7C5CFF]/10',
    },
    {
      num: '08',
      title: 'ERP / CRM Systems',
      desc: 'Custom enterprise resource planning and customer relationship management platforms tailored to your workflows.',
      icon: Layers,
      color: 'text-[#00D4FF]',
      bg: 'bg-[#00D4FF]/10',
    },
    {
      num: '09',
      title: 'SaaS Platforms',
      desc: 'End-to-end SaaS product development — from MVP to production-ready multi-tenant enterprise platforms.',
      icon: Cloud,
      color: 'text-[#7C5CFF]',
      bg: 'bg-[#7C5CFF]/10',
    },
    {
      num: '10',
      title: 'Mobile Applications',
      desc: 'Cross-platform mobile applications for iOS and Android with intelligent AI-powered features built in.',
      icon: Smartphone,
      color: 'text-[#00D4FF]',
      bg: 'bg-[#00D4FF]/10',
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
              What We Build
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              AI Services & <br />
              <span className="grad-text">Software Solutions</span>
            </h1>
          </Reveal>
        </div>
      </div>

      {/* AI Services */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Reveal animation="fade-up" className="mb-12">
          <div className="inline-flex items-center gap-2 text-[#00D4FF] text-[11px] font-bold tracking-[3px] uppercase mb-2">
            <span className="w-5 h-[1px] bg-[#00D4FF]" />
            AI Services
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            <span className="grad-text">Artificial Intelligence</span> Services
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiServices.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <Reveal key={idx} animation="fade-up" delay={idx * 70}>
                <div className="glass-card rounded-2xl p-7 hover:-translate-y-1.5 transition-all group h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold tracking-widest text-[#7C5CFF]">
                      {svc.num}
                    </span>
                    <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-[#7C5CFF]/15 text-[#A48BFF]">
                      AI
                    </span>
                  </div>
                  <div className={`w-11 h-11 rounded-xl ${svc.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 ${svc.color}`} />
                  </div>
                  <h3 className="text-[17px] font-bold text-white mb-2">{svc.title}</h3>
                  <p className="text-[13px] text-[#8892B0] leading-relaxed">{svc.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Software Development */}
      <section className="bg-[#151B35]/40 border-t border-[#7C5CFF]/15 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal animation="fade-up" className="mb-12">
            <div className="inline-flex items-center gap-2 text-[#00D4FF] text-[11px] font-bold tracking-[3px] uppercase mb-2">
              <span className="w-5 h-[1px] bg-[#00D4FF]" />
              Software Development
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Enterprise <span className="grad-text">Software Solutions</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {softwareSolutions.map((sol, idx) => {
              const Icon = sol.icon;
              return (
                <Reveal key={idx} animation="fade-up" delay={idx * 70}>
                  <div className="glass-card rounded-2xl p-7 hover:-translate-y-1.5 transition-all group h-full">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-bold tracking-widest text-[#7C5CFF]">
                        {sol.num}
                      </span>
                      <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-[#00D4FF]/10 text-[#7EEEFF]">
                        SOFTWARE
                      </span>
                    </div>
                    <div className={`w-11 h-11 rounded-xl ${sol.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${sol.color}`} />
                    </div>
                    <h3 className="text-[16px] font-bold text-white mb-2">{sol.title}</h3>
                    <p className="text-[12.5px] text-[#8892B0] leading-relaxed">{sol.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* CTA Banner */}
          <Reveal animation="scale" delay={150}>
            <div className="mt-16 bg-gradient-to-r from-[#7C5CFF]/15 to-[#00D4FF]/15 border border-[#7C5CFF]/30 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Need a Custom Solution for Your Enterprise?
              </h3>
              <p className="text-[14px] text-[#8892B0] max-w-lg mx-auto mb-6">
                Our architects and machine learning engineers will scope and build a production-ready solution tailored specifically to your business workflows.
              </p>
              <button
                onClick={() => onSelectTab('contact')}
                className="btn-grad text-white px-7 py-3 rounded-lg text-[13.5px] font-semibold inline-flex items-center gap-2 cursor-pointer shadow-lg"
              >
                Book Consultation <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
