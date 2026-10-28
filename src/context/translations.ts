export type Language = 'en' | 'hi';

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations: TranslationDictionary = {
  // Navigation
  'nav.home': { en: 'Home', hi: 'होम' },
  'nav.about': { en: 'About', hi: 'परिचय' },
  'nav.services': { en: 'Services', hi: 'सेवाएं' },
  'nav.workspace': { en: 'AI Workspace', hi: 'एआई वर्कस्पेस' },
  'nav.industries': { en: 'Industries', hi: 'उद्योग' },
  'nav.careers': { en: 'Careers', hi: 'करियर' },
  'nav.contact': { en: 'Contact', hi: 'संपर्क' },
  'nav.bookConsultation': { en: 'Book Consultation', hi: 'परामर्श बुक करें' },
  'nav.switchLang': { en: 'Switch to Hindi', hi: 'Switch to English' },
  'nav.language': { en: 'Language', hi: 'भाषा' },
  'nav.currentLangCode': { en: 'EN', hi: 'हिन्दी' },
  
  // Hero section
  'hero.badge': {
    en: 'AI-Driven Software & Digital Transformation',
    hi: 'एआई-संचालित सॉफ्टवेयर एवं डिजिटल ट्रांसफॉर्मेशन'
  },
  'hero.title_part1': {
    en: 'Enterprise Software Meets ',
    hi: 'एंटरप्राइज सॉफ्टवेयर और '
  },
  'hero.title_part2': {
    en: 'Artificial Intelligence',
    hi: 'आर्टिफिशियल इंटेलिजेंस'
  },
  'hero.subtitle': {
    en: 'Clarivex.AI helps businesses transform operations through AI-powered applications, enterprise software, and intelligent automation solutions.',
    hi: 'Clarivex.AI व्यवसायों को एआई-संचालित अनुप्रयोगों, एंटरप्राइज सॉफ्टवेयर और बुद्धिमान ऑटोमेशन समाधानों के माध्यम से रूपांतरित करता है।'
  },
  'hero.bookConsultation': { en: 'Book Consultation', hi: 'परामर्श बुक करें' },
  'hero.exploreServices': { en: 'Explore Services', hi: 'सेवाएं देखें' },
  'hero.projectsDelivered': { en: 'Projects Delivered', hi: 'सफल प्रोजेक्ट्स' },
  'hero.industriesServed': { en: 'Industries Served', hi: 'संबद्ध उद्योग' },
  'hero.aiProducts': { en: 'AI Products', hi: 'एआई उत्पाद' },
  'hero.aiAccuracy': { en: 'AI Accuracy', hi: 'एआई सटीकता' },
  'hero.activeNodes': { en: 'Enterprise Nodes', hi: 'एंटरप्राइज नोड्स' },
  'hero.liveMetrics': { en: 'Clarivex Live Intelligence Metrics', hi: 'क्लैरिवेक्स लाइव इंटेलिजेंस मेट्रिक्स' },
  'hero.realtimeAnalytics': { en: 'Real-time automation telemetry', hi: 'रीयल-टाइम ऑटोमेशन टेलीमेट्री' },
  'hero.askClarivex': { en: 'Ask Clarivex Assistant', hi: 'क्लैरिवेक्स सहायक से पूछें' },

  // Footer
  'footer.tagline': {
    en: 'AI-Driven Software & Digital Transformation Company. Building intelligent enterprise solutions, AI workflows, and software platforms for modern businesses.',
    hi: 'एआई-संचालित सॉफ्टवेयर एवं डिजिटल ट्रांसफॉर्मेशन कंपनी। आधुनिक व्यवसायों के लिए बुद्धिमान एंटरप्राइज समाधान और सॉफ्टवेयर प्लेटफॉर्म।'
  },
  'footer.company': { en: 'Company', hi: 'कंपनी' },
  'footer.services': { en: 'Services', hi: 'सेवाएं' },
  'footer.products': { en: 'Products & Tools', hi: 'उत्पाद और टूल्स' },
  'footer.headquarters': { en: 'Headquarters: Ahmedabad, Gujarat, India', hi: 'मुख्यालय: अहमदाबाद, गुजरात, भारत' },
  'footer.allRights': { en: 'Clarivex.AI. All rights reserved.', hi: 'Clarivex.AI. सर्वाधिकार सुरक्षित।' },
  'footer.builtWith': { en: 'Enterprise AI & Automation Architecture', hi: 'एंटरप्राइज एआई और ऑटोमेशन आर्किटेक्चर' },

  // Common Section Badges and Headings
  'common.learnMore': { en: 'Learn More', hi: 'अधिक जानें' },
  'common.getStarted': { en: 'Get Started', hi: 'शुरू करें' },
  'common.contactUs': { en: 'Contact Us', hi: 'संपर्क करें' },
  'about.badge': { en: 'WHO WE ARE', hi: 'हमारा परिचय' },
  'about.title': { en: 'Engineering the Next Era of Enterprise Intelligence', hi: 'उद्यम बुद्धिमत्ता के नए युग का निर्माण' },
  'services.badge': { en: 'END-TO-END CAPABILITIES', hi: 'समग्र क्षमताएं' },
  'services.title': { en: 'Cutting-Edge AI & Digital Services', hi: 'अत्याधुनिक एआई एवं डिजिटल सेवाएं' },
  'industries.badge': { en: 'SECTORS TRANSFORMED', hi: 'रूपांतरित क्षेत्र' },
  'industries.title': { en: 'Tailored for Every Industry', hi: 'प्रत्येक उद्योग के लिए अनुकूलित' },
  'careers.badge': { en: 'JOIN OUR MISSION', hi: 'हमारी टीम से जुड़ें' },
  'careers.title': { en: 'Shape the Future of Enterprise AI', hi: 'एंटरप्राइज एआई के भविष्य को आकार दें' },
  'contact.badge': { en: "LET'S COLLABORATE", hi: 'आइए सहयोग करें' },
  'contact.title': { en: "Let's Build Something Intelligent", hi: 'आइए कुछ बुद्धिमत्तापूर्ण बनाएं' },
};

export function getTranslation(key: string, lang: Language, fallback?: string): string {
  const item = translations[key];
  if (!item) return fallback !== undefined ? fallback : key;
  return item[lang] || item['en'] || fallback || key;
}
