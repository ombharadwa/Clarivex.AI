import React from 'react';
import { PageTab } from '../types';

interface FooterProps {
  onSelectTab: (tab: PageTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const handleNav = (tab: PageTab) => {
    onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B1020] border-t border-[#7C5CFF]/15 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-[34px] h-[34px] rounded-lg bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-[17px] h-[17px]">
                <defs>
                  <linearGradient id="footerGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7C5CFF" />
                    <stop offset="100%" stopColor="#00D4FF" />
                  </linearGradient>
                </defs>
                <line x1="5" y1="5" x2="19" y2="19" stroke="url(#footerGrad)" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="19" y1="5" x2="5" y2="19" stroke="url(#footerGrad)" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="12" cy="12" r="3" fill="url(#footerGrad)" />
              </svg>
            </div>
            <span className="font-extrabold text-[17px] tracking-[1px] text-white">
              CLARIVEX<span className="grad-text">.AI</span>
            </span>
          </div>
          <p className="text-[13px] text-[#8892B0] leading-relaxed max-w-sm mb-6">
            AI-Driven Software & Digital Transformation Company. Building intelligent enterprise solutions, AI workflows, and software platforms for modern businesses.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/company/clarivex-ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 flex items-center justify-center text-[#A48BFF] hover:bg-[#7C5CFF]/25 hover:border-[#7C5CFF]/40 transition-all"
              title="Clarivex.AI on LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="font-bold text-[12px] tracking-[1.5px] text-white mb-4 uppercase">
            Company
          </h4>
          <ul className="space-y-2.5 text-[13px]">
            <li>
              <button onClick={() => handleNav('home')} className="text-[#8892B0] hover:text-[#A48BFF] transition-colors cursor-pointer">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('about')} className="text-[#8892B0] hover:text-[#A48BFF] transition-colors cursor-pointer">
                About Us
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('workspace')} className="text-[#00D4FF] hover:text-white transition-colors cursor-pointer font-medium">
                AI Workspace
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('careers')} className="text-[#8892B0] hover:text-[#A48BFF] transition-colors cursor-pointer">
                Careers
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('contact')} className="text-[#8892B0] hover:text-[#A48BFF] transition-colors cursor-pointer">
                Contact
              </button>
            </li>
          </ul>
        </div>

        {/* Services Links */}
        <div>
          <h4 className="font-bold text-[12px] tracking-[1.5px] text-white mb-4 uppercase">
            Services
          </h4>
          <ul className="space-y-2.5 text-[13px]">
            <li>
              <button onClick={() => handleNav('services')} className="text-[#8892B0] hover:text-[#A48BFF] transition-colors cursor-pointer">
                AI Chatbots
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('services')} className="text-[#8892B0] hover:text-[#A48BFF] transition-colors cursor-pointer">
                AI Automation
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('services')} className="text-[#8892B0] hover:text-[#A48BFF] transition-colors cursor-pointer">
                Enterprise Software
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('services')} className="text-[#8892B0] hover:text-[#A48BFF] transition-colors cursor-pointer">
                SaaS Platforms
              </button>
            </li>
          </ul>
        </div>

        {/* Industries Links */}
        <div>
          <h4 className="font-bold text-[12px] tracking-[1.5px] text-white mb-4 uppercase">
            Industries
          </h4>
          <ul className="space-y-2.5 text-[13px]">
            <li>
              <button onClick={() => handleNav('industries')} className="text-[#8892B0] hover:text-[#A48BFF] transition-colors cursor-pointer">
                Healthcare
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('industries')} className="text-[#8892B0] hover:text-[#A48BFF] transition-colors cursor-pointer">
                Finance & Banking
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('industries')} className="text-[#8892B0] hover:text-[#A48BFF] transition-colors cursor-pointer">
                Retail & E-Commerce
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('industries')} className="text-[#8892B0] hover:text-[#A48BFF] transition-colors cursor-pointer">
                Manufacturing
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-white/30">
          <div>© 2026 Clarivex.AI · Ahmedabad, India · All rights reserved.</div>
          <div className="tracking-[2px] font-semibold text-[11px] text-white/20">
            CLARITY · INTELLIGENCE · IMPACT
          </div>
        </div>
      </div>
    </footer>
  );
};
