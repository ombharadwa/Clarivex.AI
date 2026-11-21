import React, { useEffect, useState } from 'react';
import { PageTab } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, Sun, Moon, Sparkles, ArrowRight, Languages } from 'lucide-react';

interface NavbarProps {
  currentTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
}

const NAV_TABS: PageTab[] = ['home', 'about', 'services', 'workspace', 'industries', 'careers', 'contact'];

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage, setLanguage, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (tab: PageTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-5 transition-all duration-300 md:px-10"
        style={{
          height: 'var(--nav-h)',
          background: scrolled ? 'var(--elevated)' : 'transparent',
          borderBottom: `1px solid ${scrolled ? 'var(--line)' : 'transparent'}`,
          backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
        }}
      >
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('home')}
          className="group flex cursor-pointer items-center gap-2.5 text-left focus:outline-none"
          aria-label="Clarivex.AI home"
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105"
            style={{
              background: 'rgba(124,92,255,0.14)',
              border: '1px solid var(--line-strong)',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
              <defs>
                <linearGradient id="navGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="var(--accent-2)" />
                </linearGradient>
              </defs>
              <line x1="5" y1="5" x2="19" y2="19" stroke="url(#navGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="19" y1="5" x2="5" y2="19" stroke="url(#navGrad)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="12" cy="12" r="3" fill="url(#navGrad)" />
            </svg>
          </div>
          <span className="text-[16px] font-extrabold tracking-[1px]" style={{ color: 'var(--fg)' }}>
            CLARIVEX<span className="grad-text">.AI</span>
          </span>
        </button>

        {/* Desktop Links */}
        <div className="hidden items-center gap-6 lg:flex xl:gap-7">
          {NAV_TABS.map(tab => {
            const label = tab === 'workspace' ? t('nav.workspace') : t(`nav.${tab}`);
            const isActive = currentTab === tab;
            const isWorkspace = tab === 'workspace';
            return (
              <button
                key={tab}
                onClick={() => handleNav(tab)}
                className={`relative cursor-pointer py-1 text-[13px] font-medium tracking-wide transition-colors ${
                  isWorkspace ? 'flex items-center gap-1.5 font-semibold' : ''
                }`}
                style={{
                  color: isWorkspace
                    ? 'var(--accent-2)'
                    : isActive
                      ? 'var(--fg)'
                      : 'var(--muted)',
                }}
                onMouseEnter={e => {
                  if (!isActive && !isWorkspace) e.currentTarget.style.color = 'var(--fg)';
                }}
                onMouseLeave={e => {
                  if (!isActive && !isWorkspace) e.currentTarget.style.color = 'var(--muted)';
                }}
              >
                {isWorkspace && <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--accent-2)' }} />}
                {label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 h-[2px] w-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-2))' }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={toggleLanguage}
            id="desktop-language-toggle"
            className="group flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--line)' }}
            title={t('nav.switchLang')}
            aria-label={t('nav.switchLang')}
          >
            <Languages
              className="h-3.5 w-3.5 transition-transform group-hover:scale-110"
              style={{ color: 'var(--accent-2)' }}
            />
            <span style={{ color: language === 'en' ? 'var(--fg)' : 'var(--muted)', fontWeight: language === 'en' ? 700 : 500 }}>
              EN
            </span>
            <span style={{ color: 'var(--faint)' }}>/</span>
            <span style={{ color: language === 'hi' ? 'var(--accent-2)' : 'var(--muted)', fontWeight: language === 'hi' ? 700 : 500 }}>
              हिन्दी
            </span>
          </button>

          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--line)',
              color: 'var(--muted)',
            }}
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button onClick={() => handleNav('contact')} className="btn btn-primary !px-4 !py-2 !text-[13px]">
            {t('nav.bookConsultation')}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleLanguage}
            id="mobile-language-toggle"
            className="flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--line)' }}
            aria-label={t('nav.switchLang')}
            title={t('nav.switchLang')}
          >
            <Languages className="h-3.5 w-3.5" style={{ color: 'var(--accent-2)' }} />
            <span style={{ color: language === 'en' ? 'var(--fg)' : 'var(--muted)' }}>EN</span>
            <span style={{ color: 'var(--faint)' }}>|</span>
            <span style={{ color: language === 'hi' ? 'var(--accent-2)' : 'var(--muted)' }}>हि</span>
          </button>

          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--muted)' }}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="cursor-pointer p-2"
            style={{ color: 'var(--fg)' }}
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className="fixed left-0 right-0 z-40 flex flex-col gap-3 p-6 lg:hidden"
          style={{
            top: 'var(--nav-h)',
            background: 'var(--elevated)',
            borderBottom: '1px solid var(--line)',
            backdropFilter: 'blur(24px) saturate(160%)',
            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {(['home', 'about', 'services', 'industries', 'careers', 'contact'] as PageTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => handleNav(tab)}
              className="cursor-pointer border-b py-2.5 text-left text-[15px] transition-colors"
              style={{
                borderColor: 'var(--line-soft)',
                color: currentTab === tab ? 'var(--fg)' : 'var(--muted)',
                fontWeight: currentTab === tab ? 600 : 400,
              }}
            >
              {t(`nav.${tab}`)}
            </button>
          ))}
          <button
            onClick={() => handleNav('workspace')}
            className="flex cursor-pointer items-center justify-between border-b py-2.5 text-left text-[15px] font-semibold"
            style={{ borderColor: 'var(--line-soft)', color: 'var(--accent-2)' }}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              {t('nav.workspace')}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <div
            className="flex items-center justify-between border-t py-2 text-[14px]"
            style={{ borderColor: 'var(--line-soft)', color: 'var(--muted)' }}
          >
            <span className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--fg)' }}>
              <Languages className="h-4 w-4" style={{ color: 'var(--accent-2)' }} />
              {t('nav.language')}:
            </span>
            <div
              className="flex items-center gap-1.5 rounded-lg p-1"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--line)' }}
            >
              <button
                onClick={() => setLanguage('en')}
                className="cursor-pointer rounded px-2.5 py-1 text-xs font-semibold transition-all"
                style={
                  language === 'en'
                    ? { background: 'var(--accent)', color: '#fff' }
                    : { color: 'var(--muted)' }
                }
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className="cursor-pointer rounded px-2.5 py-1 text-xs font-semibold transition-all"
                style={
                  language === 'hi'
                    ? { background: 'var(--accent)', color: '#fff' }
                    : { color: 'var(--muted)' }
                }
              >
                हिन्दी
              </button>
            </div>
          </div>

          <button
            onClick={() => handleNav('contact')}
            className="btn btn-primary mt-2 w-full !py-3 !text-[14px]"
          >
            {t('nav.bookConsultation')} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
};
