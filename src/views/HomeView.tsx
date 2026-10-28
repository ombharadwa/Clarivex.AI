import React, { useState, useEffect, useRef } from 'react';
import { PageTab } from '../types';
import { Reveal } from '../components/Reveal';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowRight, 
  Bot, 
  Zap, 
  TrendingUp, 
  Sparkles, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Send,
  Building,
} from 'lucide-react';

interface HomeViewProps {
  onSelectTab: (tab: PageTab) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectTab }) => {
  const { t } = useLanguage();
  // Counters state
  const [stats, setStats] = useState({ projects: 0, industries: 0, products: 0 });
  const [queriesDay, setQueriesDay] = useState(0);
  const [automations, setAutomations] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  // Demo chat state
  const [demoMsgs, setDemoMsgs] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: "Hi! I'm the Clarivex AI assistant. Ask me about our services, pricing, or how we can transform your business! 🚀",
    },
  ]);
  const [demoInput, setDemoInput] = useState('');
  const [demoTyping, setDemoTyping] = useState(false);
  const [showDemoSugs, setShowDemoSugs] = useState(true);

  // Particles canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Animate stats
    const timer1 = setInterval(() => {
      setStats(prev => ({
        projects: Math.min(prev.projects + 1, 10),
        industries: Math.min(prev.industries + 1, 7),
        products: Math.min(prev.products + 1, 4),
      }));
    }, 80);

    const timer2 = setInterval(() => {
      setQueriesDay(prev => Math.min(prev + 140, 2847));
      setAutomations(prev => Math.min(prev + 18, 340));
      setAccuracy(prev => Math.min(prev + 5, 98));
    }, 50);

    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
    };
  }, []);

  // Particle background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 92, 255, ${p.opacity})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleDemoSend = (textToSend?: string) => {
    const text = (textToSend || demoInput).trim();
    if (!text || demoTyping) return;

    setDemoMsgs(prev => [...prev, { role: 'user', text }]);
    setDemoInput('');
    setShowDemoSugs(false);
    setDemoTyping(true);

    setTimeout(() => {
      setDemoTyping(false);
      let reply = "Great question! For specific technical architectures or project scoping, feel free to book a free consultation with our team on our Contact page.";
      const lower = text.toLowerCase();
      if (lower.includes('what can clarivex do')) {
        reply = "Clarivex.AI builds AI-powered enterprise software — including AI chatbots, automation workflows, predictive analytics, LLM integrations, and custom software platforms for all industries. 🚀";
      } else if (lower.includes('pricing')) {
        reply = "Our AI solutions start from ₹4,999/mo for starter tiers up to custom enterprise deployments. Book a consultation for a tailor-made proposal!";
      } else if (lower.includes('demo')) {
        reply = "We'd love to show you a deep dive! Head to our Contact page or message hello@clarivex.ai to schedule a live walkthrough within 24 hours. 📅";
      }
      setDemoMsgs(prev => [...prev, { role: 'assistant', text: reply }]);
    }, 800);
  };

  const chartBars = [45, 72, 38, 85, 62, 91, 55, 78, 88, 42, 95, 67];

  return (
    <div className="min-h-screen pt-[70px]">
      {/* ── HERO ── */}
      <div className="relative min-h-[calc(100vh-70px)] flex items-center overflow-hidden bg-[#0B1020]">
        {/* Background Gradients & Canvas */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[500px] h-[500px] -right-24 -top-24 rounded-full bg-radial from-[#7C5CFF]/20 to-transparent blur-3xl animate-orb1" />
          <div className="absolute w-[400px] h-[400px] -left-20 -bottom-20 rounded-full bg-radial from-[#00D4FF]/15 to-transparent blur-3xl animate-orb2" />
          <div className="absolute w-[300px] h-[300px] right-1/3 top-1/4 rounded-full bg-radial from-[#00D4FF]/10 to-transparent blur-3xl animate-orb3" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(124,92,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(124,92,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <canvas ref={canvasRef} className="absolute inset-0" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <Reveal animation="fade-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#7C5CFF]/10 border border-[#7C5CFF]/30 text-[#A48BFF] text-[11px] font-semibold tracking-[2px] uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
              {t('hero.badge')}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight mb-6">
              {t('hero.title_part1')}
              <span className="grad-text">{t('hero.title_part2')}</span>
            </h1>

            <p className="text-[#8892B0] text-[16px] sm:text-[17px] font-light leading-relaxed max-w-xl mb-8">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              <button
                onClick={() => onSelectTab('contact')}
                className="btn-grad text-white px-7 py-3.5 rounded-lg text-[14px] font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/30"
              >
                {t('hero.bookConsultation')}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectTab('services')}
                className="px-7 py-3.5 rounded-lg border border-[#7C5CFF]/30 text-white hover:text-[#A48BFF] hover:border-[#7C5CFF] text-[14px] font-medium transition-all cursor-pointer bg-white/[0.02]"
              >
                {t('hero.exploreServices')}
              </button>
            </div>

            {/* Key Metrics Counters */}
            <div className="flex items-center gap-8 pt-6 border-t border-white/10 flex-wrap">
              <div>
                <div className="text-3xl font-extrabold grad-text">
                  {stats.projects}+
                </div>
                <div className="text-[10px] text-[#8892B0] tracking-[1.5px] uppercase mt-1">
                  {t('hero.projectsDelivered')}
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold grad-text">
                  {stats.industries}+
                </div>
                <div className="text-[10px] text-[#8892B0] tracking-[1.5px] uppercase mt-1">
                  {t('hero.industriesServed')}
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold grad-text">
                  {stats.products}+
                </div>
                <div className="text-[10px] text-[#8892B0] tracking-[1.5px] uppercase mt-1">
                  {t('hero.aiProducts')}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Interactive Intelligence Dashboard */}
          <Reveal animation="fade-right">
            <div className="relative">
              {/* Top floating badge */}
              <div className="absolute -top-3 right-4 z-20 bg-[#151B35]/90 border border-[#7C5CFF]/30 rounded-xl px-3.5 py-2 backdrop-blur-md shadow-lg animate-pulse-slow">
                <div className="text-[10px] text-[#8892B0] font-medium uppercase tracking-wider">{t('hero.aiAccuracy')}</div>
                <div className="text-[14px] font-bold grad-text">98.7%</div>
              </div>

              {/* Dashboard Box */}
              <div className="bg-[#151B35]/75 border border-[#7C5CFF]/25 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF]" />

                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-bold tracking-wider text-white">
                    CLARIVEX INTELLIGENCE DASHBOARD
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 rounded-xl p-3 text-center">
                    <div className="text-lg font-black grad-text">{queriesDay.toLocaleString()}</div>
                    <div className="text-[9px] text-[#8892B0] font-semibold tracking-wider mt-1">QUERIES/DAY</div>
                  </div>
                  <div className="bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 rounded-xl p-3 text-center">
                    <div className="text-lg font-black grad-text">{automations}</div>
                    <div className="text-[9px] text-[#8892B0] font-semibold tracking-wider mt-1">AUTOMATIONS</div>
                  </div>
                  <div className="bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 rounded-xl p-3 text-center">
                    <div className="text-lg font-black grad-text">{accuracy}%</div>
                    <div className="text-[9px] text-[#8892B0] font-semibold tracking-wider mt-1">ACCURACY</div>
                  </div>
                </div>

                {/* Dynamic Chart Visualizer */}
                <div className="bg-black/25 rounded-xl h-24 flex items-end gap-1.5 p-3 mb-4">
                  {chartBars.map((val, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 rounded-t-sm transition-all duration-700 ${
                        idx === 10
                          ? 'bg-gradient-to-t from-[#7C5CFF] to-[#00D4FF]'
                          : 'bg-[#7C5CFF]/30 hover:bg-[#7C5CFF]/60'
                      }`}
                      style={{ height: `${val}%` }}
                    />
                  ))}
                </div>

                {/* Live Status indicator */}
                <div className="flex items-center gap-2.5 bg-[#00D4FF]/5 border border-[#00D4FF]/20 rounded-lg px-3.5 py-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
                  <span className="text-[11.5px] text-[#7EEEFF]">
                    AI processing 2,847 data points in real-time…
                  </span>
                </div>
              </div>

              {/* Bottom floating badge */}
              <div className="absolute -bottom-3 left-4 z-20 bg-[#151B35]/90 border border-[#00D4FF]/30 rounded-xl px-3.5 py-2 backdrop-blur-md shadow-lg">
                <div className="text-[10px] text-[#8892B0] font-medium uppercase tracking-wider">Automation Rate</div>
                <div className="text-[14px] font-bold text-[#00D4FF]">+340%</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── TRUST BAR / MARQUEE ── */}
      <div className="bg-[#151B35] border-y border-[#7C5CFF]/15 py-4 px-6 overflow-hidden flex items-center gap-8">
        <span className="text-[11px] font-semibold tracking-[2px] text-[#8892B0] shrink-0 uppercase">
          Industries We Serve
        </span>
        <div className="flex gap-10 whitespace-nowrap animate-trust">
          {[
            { icon: '🏥', label: 'Healthcare' },
            { icon: '💰', label: 'Finance & Banking' },
            { icon: '🏛️', label: 'Government' },
            { icon: '🛒', label: 'Retail & E-Commerce' },
            { icon: '📚', label: 'Education' },
            { icon: '🏭', label: 'Manufacturing' },
            { icon: '🚚', label: 'Logistics' },
            { icon: '🏥', label: 'Healthcare' },
            { icon: '💰', label: 'Finance & Banking' },
            { icon: '🏛️', label: 'Government' },
            { icon: '🛒', label: 'Retail & E-Commerce' },
            { icon: '📚', label: 'Education' },
            { icon: '🏭', label: 'Manufacturing' },
            { icon: '🚚', label: 'Logistics' },
          ].map((item, idx) => (
            <span key={idx} className="flex items-center gap-2 text-[13px] text-white/50 tracking-wide font-medium">
              <span>{item.icon}</span>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── SERVICES OVERVIEW ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <Reveal animation="fade-up">
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 text-[#00D4FF] text-[11px] font-bold tracking-[3px] uppercase mb-2">
              <span className="w-5 h-[1px] bg-[#00D4FF]" />
              What We Build
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              AI Services & <span className="grad-text">Software Solutions</span>
            </h2>
            <p className="text-[#8892B0] text-[15px] max-w-xl font-light">
              From intelligent AI systems to enterprise-grade software — we build what modern businesses need to scale.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              num: '01',
              tag: 'AI SERVICE',
              title: 'AI Chatbots',
              desc: 'Intelligent conversational agents that handle customer queries, support, and sales 24/7.',
              icon: Bot,
              color: 'text-[#7C5CFF]',
              bg: 'bg-[#7C5CFF]/10',
            },
            {
              num: '02',
              tag: 'AI SERVICE',
              title: 'AI Automation',
              desc: 'End-to-end workflow automation using AI that learns and adapts to your business processes.',
              icon: Zap,
              color: 'text-[#00D4FF]',
              bg: 'bg-[#00D4FF]/10',
            },
            {
              num: '03',
              tag: 'AI SERVICE',
              title: 'Predictive Analytics',
              desc: 'ML-powered forecasting for sales, demand, churn, and key business metrics.',
              icon: TrendingUp,
              color: 'text-[#7C5CFF]',
              bg: 'bg-[#7C5CFF]/10',
            },
            {
              num: '04',
              tag: 'AI SERVICE',
              title: 'Generative AI & LLMs',
              desc: 'Custom LLM integration, fine-tuning, and generative AI products for your domain.',
              icon: Sparkles,
              color: 'text-[#00D4FF]',
              bg: 'bg-[#00D4FF]/10',
            },
            {
              num: '05',
              tag: 'SOFTWARE',
              title: 'Enterprise Software',
              desc: 'Custom ERP, CRM, portals, dashboards, and enterprise-grade web applications.',
              icon: Layers,
              color: 'text-[#7C5CFF]',
              bg: 'bg-[#7C5CFF]/10',
            },
            {
              num: '06',
              tag: 'SOFTWARE',
              title: 'SaaS Platforms',
              desc: 'Full-stack SaaS product development — from MVP to production-ready scalable platforms.',
              icon: Cpu,
              color: 'text-[#00D4FF]',
              bg: 'bg-[#00D4FF]/10',
            },
          ].map((svc, i) => {
            const Icon = svc.icon;
            return (
              <Reveal key={i} animation="fade-up" delay={i * 80}>
                <div
                  onClick={() => onSelectTab('services')}
                  className="glass-card rounded-2xl p-7 cursor-pointer hover:-translate-y-1.5 transition-all group h-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold tracking-widest text-[#7C5CFF]">
                      {svc.num}
                    </span>
                    <span
                      className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded ${
                        svc.tag === 'AI SERVICE'
                          ? 'bg-[#7C5CFF]/15 text-[#A48BFF]'
                          : 'bg-[#00D4FF]/10 text-[#7EEEFF]'
                      }`}
                    >
                      {svc.tag}
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

      {/* ── LIVE AI EXPERIENCE (DEMO SECTION) ── */}
      <section className="bg-[#151B35]/50 border-y border-[#7C5CFF]/15 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Reveal animation="fade-up">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 text-[#00D4FF] text-[11px] font-bold tracking-[3px] uppercase mb-2">
                <span className="w-5 h-[1px] bg-[#00D4FF]" />
                Live AI Experience
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                See Our <span className="grad-text">AI In Action</span>
              </h2>
              <p className="text-[#8892B0] text-[15px] max-w-xl font-light">
                Interact with our AI assistant and analytics engine — powered by real intelligence, not scripted demos.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Interactive Demo Chat Box */}
            <Reveal animation="fade-left">
              <div className="bg-[#0B1020]/90 border border-[#7C5CFF]/25 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[440px]">
                <div className="p-4 bg-[#7C5CFF]/10 border-b border-[#7C5CFF]/20 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] flex items-center justify-center font-bold text-xs text-white">
                    CX
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-white">Clarivex AI Assistant</div>
                    <div className="text-[10px] text-[#00D4FF]">● Online — Powered by Google Gemini</div>
                  </div>
                </div>

                {/* Messages scroll */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {demoMsgs.map((m, idx) => (
                    <div
                      key={idx}
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-[12px] leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-[#7C5CFF] text-white self-end ml-auto rounded-br-xs'
                          : 'bg-[#7C5CFF]/12 text-white/90 border border-[#7C5CFF]/20 self-start mr-auto rounded-bl-xs'
                      }`}
                    >
                      {m.text}
                    </div>
                  ))}
                  {demoTyping && (
                    <div className="bg-[#7C5CFF]/12 border border-[#7C5CFF]/20 px-3.5 py-2 rounded-xl rounded-bl-xs w-16 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A48BFF] animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A48BFF] animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A48BFF] animate-bounce [animation-delay:0.4s]" />
                    </div>
                  )}
                </div>

                {/* Suggestions */}
                {showDemoSugs && (
                  <div className="p-2.5 border-t border-white/5 flex gap-2 flex-wrap">
                    {['What can Clarivex do?', 'AI chatbot pricing', 'Book a demo'].map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleDemoSend(sug)}
                        className="text-[11px] px-3 py-1 rounded-md bg-[#7C5CFF]/10 hover:bg-[#7C5CFF]/20 text-[#A48BFF] border border-[#7C5CFF]/20 transition-colors cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="p-3 border-t border-[#7C5CFF]/15 flex items-center gap-2">
                  <input
                    type="text"
                    value={demoInput}
                    onChange={e => setDemoInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleDemoSend()}
                    placeholder="Ask anything about our AI…"
                    className="flex-1 bg-white/5 border border-[#7C5CFF]/20 rounded-lg px-3.5 py-2 text-[12px] text-white placeholder-white/30 focus:outline-none focus:border-[#7C5CFF]"
                  />
                  <button
                    onClick={() => handleDemoSend()}
                    className="w-9 h-9 rounded-lg bg-[#7C5CFF] hover:bg-[#A48BFF] text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Performance Analytics & Workflows Cards */}
            <Reveal animation="fade-right">
              <div className="space-y-6">
                <div className="bg-[#0B1020]/90 border border-[#7C5CFF]/25 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[12px] font-bold text-white tracking-wider">
                      REAL-TIME AI PERFORMANCE
                    </span>
                    <span className="text-[10px] text-[#00D4FF] bg-[#00D4FF]/10 px-2.5 py-0.5 rounded-full font-bold">
                      LIVE
                    </span>
                  </div>

                  <div className="flex items-end gap-1.5 h-16 mb-5">
                    {[60, 45, 80, 55, 90, 70, 85, 65, 95, 75, 88, 92].map((v, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-t-sm transition-all duration-500 ${
                          i >= 9 ? 'bg-gradient-to-t from-[#7C5CFF] to-[#00D4FF]' : 'bg-[#7C5CFF]/30'
                        }`}
                        style={{ height: `${v}%` }}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#7C5CFF]/10 rounded-xl p-3 text-center">
                      <div className="text-lg font-bold grad-text">98.7%</div>
                      <div className="text-[9px] text-[#8892B0] font-semibold mt-1">AI ACCURACY</div>
                    </div>
                    <div className="bg-[#7C5CFF]/10 rounded-xl p-3 text-center">
                      <div className="text-lg font-bold grad-text">1.2s</div>
                      <div className="text-[9px] text-[#8892B0] font-semibold mt-1">AVG RESPONSE</div>
                    </div>
                    <div className="bg-[#7C5CFF]/10 rounded-xl p-3 text-center">
                      <div className="text-lg font-bold grad-text">2.8K</div>
                      <div className="text-[9px] text-[#8892B0] font-semibold mt-1">QUERIES/DAY</div>
                    </div>
                    <div className="bg-[#7C5CFF]/10 rounded-xl p-3 text-center">
                      <div className="text-lg font-bold grad-text">340%</div>
                      <div className="text-[9px] text-[#8892B0] font-semibold mt-1">AUTOMATION GAIN</div>
                    </div>
                  </div>
                </div>

                {/* Workflow Status */}
                <div className="bg-[#0B1020]/90 border border-[#7C5CFF]/25 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[12px] font-bold text-white tracking-wider">
                      WORKFLOW AUTOMATION STATUS
                    </span>
                    <span className="text-[10px] text-[#A48BFF] bg-[#7C5CFF]/15 px-2.5 py-0.5 rounded-full font-bold">
                      ACTIVE
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-[12px] mb-1.5">
                        <span className="text-[#8892B0]">Data Processing</span>
                        <span className="text-emerald-400 font-semibold">✓ Running</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] rounded-full w-[87%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[12px] mb-1.5">
                        <span className="text-[#8892B0]">Predictive Engine</span>
                        <span className="text-emerald-400 font-semibold">✓ Running</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#00D4FF] to-[#7C5CFF] rounded-full w-[72%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[12px] mb-1.5">
                        <span className="text-[#8892B0]">NLP Pipeline</span>
                        <span className="text-emerald-400 font-semibold">✓ Running</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] rounded-full w-[94%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── DEVELOPMENT PROCESS ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <Reveal animation="fade-up">
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 text-[#00D4FF] text-[11px] font-bold tracking-[3px] uppercase mb-2">
              <span className="w-5 h-[1px] bg-[#00D4FF]" />
              How We Work
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Our <span className="grad-text">Development Process</span>
            </h2>
            <p className="text-[#8892B0] text-[15px] max-w-xl font-light">
              A battle-tested agile methodology turning complex enterprise challenges into deployed intelligent systems.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { num: '01', title: 'Discovery', desc: 'Business requirement analysis & scoping' },
            { num: '02', title: 'Strategy', desc: 'Solution architecture & planning' },
            { num: '03', title: 'Design', desc: 'Wireframes & UI/UX design' },
            { num: '04', title: 'Development', desc: 'Agile AI implementation' },
            { num: '05', title: 'Testing', desc: 'QA & performance optimization' },
            { num: '06', title: 'Deployment', desc: 'Production launch & go-live' },
            { num: '07', title: 'Support', desc: 'Continuous maintenance & growth' },
          ].map((step, idx) => (
            <Reveal key={idx} animation="fade-up" delay={idx * 60}>
              <div
                className="bg-[#151B35]/60 border border-[#7C5CFF]/15 hover:border-[#7C5CFF]/40 rounded-2xl p-5 text-center flex flex-col items-center transition-all hover:-translate-y-1 h-full"
              >
                <div className="w-12 h-12 rounded-full bg-[#0B1020] border border-[#7C5CFF]/30 flex items-center justify-center font-extrabold text-[#7C5CFF] text-[15px] mb-3 shadow-inner">
                  {step.num}
                </div>
                <h4 className="text-[13px] font-bold text-white mb-1.5">{step.title}</h4>
                <p className="text-[11px] text-[#8892B0] leading-snug">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── WHY ENTERPRISES CHOOSE US ── */}
      <section className="bg-[#151B35]/40 border-t border-[#7C5CFF]/15 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal animation="fade-up">
            <div className="mb-14">
              <div className="inline-flex items-center gap-2 text-[#00D4FF] text-[11px] font-bold tracking-[3px] uppercase mb-2">
                <span className="w-5 h-[1px] bg-[#00D4FF]" />
                Why Clarivex.AI
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Why Enterprises <span className="grad-text">Choose Us</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'AI-First Development',
                desc: 'Every solution is built AI-native from the ground up, not bolted-on as an afterthought.',
                icon: Zap,
              },
              {
                title: 'Enterprise Scalability',
                desc: 'Architecture designed to handle 10x growth without performance degradation.',
                icon: TrendingUp,
              },
              {
                title: 'Rapid Delivery',
                desc: 'Agile methodology with 2-week sprints. MVP delivery in 6–8 weeks, not months.',
                icon: ArrowRight,
              },
              {
                title: 'Enterprise Security',
                desc: 'Bank-grade encryption, data privacy compliance, and secure cloud infrastructure.',
                icon: ShieldCheck,
              },
              {
                title: 'Multi-Domain Expertise',
                desc: 'Cross-industry experience across 7+ verticals including healthcare, finance, and retail.',
                icon: Building,
              },
              {
                title: 'Dedicated Support',
                desc: 'Dedicated account manager and 24/7 technical support post-deployment.',
                icon: Sparkles,
              },
            ].map((why, i) => {
              const Icon = why.icon;
              return (
                <Reveal key={i} animation="fade-up" delay={i * 80}>
                  <div className="glass-card rounded-2xl p-7 hover:-translate-y-1.5 transition-all h-full">
                    <div className="w-11 h-11 rounded-xl bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 flex items-center justify-center mb-5 text-[#A48BFF]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-[16px] font-bold text-white mb-2">{why.title}</h3>
                    <p className="text-[13px] text-[#8892B0] leading-relaxed">{why.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
