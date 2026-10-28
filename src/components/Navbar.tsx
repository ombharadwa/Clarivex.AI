import React, { useState } from 'react';
import { PageTab } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Sun, Moon, Sparkles, ArrowRight } from 'lucide-react';

interface NavbarProps {
  currentTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const handleNav = (tab: PageTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-[70px] flex items-center justify-between px-5 md:px-12 bg-[#0B1020]/90 dark:bg-[#0B1020]/90 backdrop-blur-xl border-b border-[#7C5CFF]/15 transition-all">
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-[36px] h-[36px] rounded-lg bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
              <defs>
                <linearGradient id="navGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7C5CFF" />
                  <stop offset="100%" stopColor="#00D4FF" />
                </linearGradient>
              </defs>
              <line x1="5" y1="5" x2="19" y2="19" stroke="url(#navGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="19" y1="5" x2="5" y2="19" stroke="url(#navGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="12" cy="12" r="3" fill="url(#navGrad)" />
            </svg>
          </div>
          <span className="font-extrabold text-[16px] tracking-[1px] text-white">
            CLARIVEX<span className="grad-text">.AI</span>
          </span>
        </button>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-7">
          {(['home', 'about', 'services', 'workspace', 'industries', 'careers', 'contact'] as PageTab[]).map(tab => {
            const label = tab === 'workspace' ? 'AI Workspace' : tab.charAt(0).toUpperCase() + tab.slice(1);
            const isActive = currentTab === tab;
            return (
              <button
                key={tab}
                onClick={() => handleNav(tab)}
                className={`text-[13px] font-medium tracking-wide transition-all relative py-1 cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-[#8892B0] hover:text-white'
                } ${tab === 'workspace' ? 'flex items-center gap-1.5 text-[#00D4FF] font-semibold' : ''}`}
              >
                {tab === 'workspace' && <Sparkles className="w-3.5 h-3.5 text-[#00D4FF]" />}
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right CTA & Theme Toggle */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-[#151B35]/80 border border-[#7C5CFF]/20 flex items-center justify-center text-[#8892B0] hover:text-white hover:border-[#7C5CFF]/50 transition-all cursor-pointer"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => handleNav('contact')}
            className="px-4 py-2 rounded-lg bg-[#7C5CFF] hover:bg-[#A48BFF] text-white text-[13px] font-semibold tracking-wide transition-all shadow-md hover:shadow-indigo-500/30 cursor-pointer"
          >
            Book Consultation
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-[#151B35] border border-[#7C5CFF]/20 flex items-center justify-center text-[#8892B0] hover:text-white cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:text-[#7C5CFF] cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed top-[70px] left-0 right-0 z-40 bg-[#0B1020]/95 backdrop-blur-2xl border-b border-[#7C5CFF]/20 p-6 lg:hidden flex flex-col gap-3 shadow-2xl animate-in slide-in-from-top">
          {(['home', 'about', 'services', 'industries', 'careers', 'contact'] as PageTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => handleNav(tab)}
              className={`text-left py-2.5 text-[15px] border-b border-white/5 transition-colors cursor-pointer ${
                currentTab === tab ? 'text-white font-semibold' : 'text-[#8892B0]'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <button
            onClick={() => handleNav('workspace')}
            className="text-left py-2.5 text-[15px] font-semibold text-[#00D4FF] flex items-center justify-between border-b border-white/5 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00D4FF]" />
              AI Workspace
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleNav('contact')}
            className="w-full mt-2 py-3 rounded-lg bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white text-[14px] font-semibold text-center cursor-pointer"
          >
            Book Consultation →
          </button>
        </div>
      )}
    </>
  );
};
