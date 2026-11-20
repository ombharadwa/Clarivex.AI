import React, { useState, useEffect } from 'react';
import { PageTab } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Cursor } from './components/Cursor';
import { FloatingChatbot } from './components/FloatingChatbot';
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { ServicesView } from './views/ServicesView';
import { IndustriesView } from './views/IndustriesView';
import { CareersView } from './views/CareersView';
import { ContactView } from './views/ContactView';
import { WorkspaceView } from './views/WorkspaceView';
import { updateDocumentSeo } from './utils/seo';
import { useLanguage } from './context/LanguageContext';

export const App: React.FC = () => {
  const { language } = useLanguage();
  const [currentTab, setCurrentTab] = useState<PageTab>(() => {
    const hash = window.location.hash.replace('#', '') as PageTab;
    if (['home', 'about', 'services', 'industries', 'careers', 'contact', 'workspace'].includes(hash)) {
      return hash;
    }
    if (window.location.pathname === '/ai-workspace' || window.location.pathname === '/ai-workspace.html') {
      return 'workspace';
    }
    return 'home';
  });

  const handleSelectTab = (tab: PageTab) => {
    setCurrentTab(tab);
    window.location.hash = tab === 'home' ? '' : tab;
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageTab;
      if (['home', 'about', 'services', 'industries', 'careers', 'contact', 'workspace'].includes(hash)) {
        setCurrentTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Dynamically update document title and SEO metadata when currentTab or language changes
  useEffect(() => {
    updateDocumentSeo(currentTab, language);
  }, [currentTab, language]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1020] text-[#F8FAFC] selection:bg-[#7C5CFF]/30 selection:text-white">
      <Cursor />
      <Navbar currentTab={currentTab} onSelectTab={handleSelectTab} />

      <main className="flex-1">
        {currentTab === 'home' && <HomeView onSelectTab={handleSelectTab} />}
        {currentTab === 'about' && <AboutView onSelectTab={handleSelectTab} />}
        {currentTab === 'services' && <ServicesView onSelectTab={handleSelectTab} />}
        {currentTab === 'industries' && <IndustriesView onSelectTab={handleSelectTab} />}
        {currentTab === 'careers' && <CareersView onSelectTab={handleSelectTab} />}
        {currentTab === 'contact' && <ContactView onSelectTab={handleSelectTab} />}
        {currentTab === 'workspace' && <WorkspaceView onSelectTab={handleSelectTab} />}
      </main>

      {currentTab !== 'workspace' && <Footer onSelectTab={handleSelectTab} />}
      {currentTab !== 'workspace' && <FloatingChatbot />}
    </div>
  );
};

export default App;
