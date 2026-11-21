import React from 'react';
import { PageTab } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onSelectTab: (tab: PageTab) => void;
}

const COMPANY_LINKS: { tab: PageTab; key: string }[] = [
  { tab: 'home', key: 'nav.home' },
  { tab: 'about', key: 'nav.about' },
  { tab: 'workspace', key: 'nav.workspace' },
  { tab: 'careers', key: 'nav.careers' },
  { tab: 'contact', key: 'nav.contact' },
];

const SERVICE_LINKS = ['AI Chatbots', 'AI Automation', 'Enterprise Software', 'SaaS Platforms'];
const INDUSTRY_LINKS = ['Healthcare', 'Finance & Banking', 'Retail & E-Commerce', 'Manufacturing'];

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const { t } = useLanguage();

  const handleNav = (tab: PageTab) => {
    onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const linkStyle: React.CSSProperties = { color: 'var(--muted)' };

  const LinkButton: React.FC<{ tab: PageTab; children: React.ReactNode; accent?: boolean }> = ({
    tab,
    children,
    accent,
  }) => (
    <button
      onClick={() => handleNav(tab)}
      className="cursor-pointer text-left transition-colors"
      style={accent ? { color: 'var(--accent-2)', fontWeight: 500 } : linkStyle}
      onMouseEnter={e => (e.currentTarget.style.color = accent ? 'var(--fg)' : 'var(--accent-soft)')}
      onMouseLeave={e =>
        (e.currentTarget.style.color = accent ? 'var(--accent-2)' : 'var(--muted)')
      }
    >
      {children}
    </button>
  );

  return (
    <footer style={{ background: 'var(--bg-soft)', borderTop: '1px solid var(--line)' }}>
      <div className="container-x grid grid-cols-1 gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        {/* Brand */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2.5">
            <div
              className="flex h-[34px] w-[34px] items-center justify-center rounded-lg"
              style={{ background: 'rgba(124,92,255,0.14)', border: '1px solid var(--line-strong)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-[17px] w-[17px]">
                <defs>
                  <linearGradient id="footerGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="var(--accent-2)" />
                  </linearGradient>
                </defs>
                <line x1="5" y1="5" x2="19" y2="19" stroke="url(#footerGrad)" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="19" y1="5" x2="5" y2="19" stroke="url(#footerGrad)" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="12" cy="12" r="3" fill="url(#footerGrad)" />
              </svg>
            </div>
            <span className="text-[17px] font-extrabold tracking-[1px]" style={{ color: 'var(--fg)' }}>
              CLARIVEX<span className="grad-text">.AI</span>
            </span>
          </div>
          <p className="mb-6 max-w-sm text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>
            {t('footer.tagline')}
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/company/clarivex-ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-all"
              style={{
                background: 'rgba(124,92,255,0.1)',
                border: '1px solid var(--line)',
                color: 'var(--accent-soft)',
              }}
              title="Clarivex.AI on LinkedIn"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href="mailto:hello@clarivex.ai"
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-all"
              style={{
                background: 'rgba(0,212,255,0.1)',
                border: '1px solid var(--line)',
                color: 'var(--accent-2-soft)',
              }}
              title="Email Clarivex.AI"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 6 10-6" />
              </svg>
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h4
            className="mb-4 text-[12px] font-bold uppercase tracking-[1.5px]"
            style={{ color: 'var(--fg)' }}
          >
            {t('footer.company')}
          </h4>
          <ul className="space-y-2.5 text-[13px]">
            {COMPANY_LINKS.map(l => (
              <li key={l.tab}>
                <LinkButton tab={l.tab} accent={l.tab === 'workspace'}>
                  {t(l.key)}
                </LinkButton>
              </li>
            ))}
          </ul>
        </div>

        {/* Services Links */}
        <div>
          <h4
            className="mb-4 text-[12px] font-bold uppercase tracking-[1.5px]"
            style={{ color: 'var(--fg)' }}
          >
            {t('footer.services')}
          </h4>
          <ul className="space-y-2.5 text-[13px]">
            {SERVICE_LINKS.map(s => (
              <li key={s}>
                <LinkButton tab="services">{s}</LinkButton>
              </li>
            ))}
          </ul>
        </div>

        {/* Industries Links */}
        <div>
          <h4
            className="mb-4 text-[12px] font-bold uppercase tracking-[1.5px]"
            style={{ color: 'var(--fg)' }}
          >
            {t('nav.industries')}
          </h4>
          <ul className="space-y-2.5 text-[13px]">
            {INDUSTRY_LINKS.map(i => (
              <li key={i}>
                <LinkButton tab="industries">{i}</LinkButton>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid var(--line-soft)' }} className="px-6 py-4">
        <div
          className="container-x flex flex-col items-center justify-between gap-3 text-[12px] sm:flex-row"
          style={{ color: 'var(--faint)' }}
        >
          <div>
            © 2026 Clarivex.AI · {t('footer.headquarters')} · {t('footer.allRights')}
          </div>
          <div className="text-[11px] font-semibold tracking-[2px]">
            CLARITY · INTELLIGENCE · IMPACT
          </div>
        </div>
      </div>
    </footer>
  );
};
