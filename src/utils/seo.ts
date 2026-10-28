import { PageTab } from '../types';
import { Language } from '../context/translations';

export interface PageSeoMetadata {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export const SEO_METADATA_EN: Record<PageTab, PageSeoMetadata> = {
  home: {
    title: 'Clarivex.AI — AI-Driven Software & Digital Transformation',
    description: 'Clarivex.AI builds enterprise AI applications, intelligent workflow automation, and custom digital transformation platforms for modern businesses.',
    keywords: 'AI Software, Enterprise AI, Digital Transformation, AI Automation, Machine Learning, Clarivex',
    ogTitle: 'Clarivex.AI — AI-Driven Software & Digital Transformation',
    ogDescription: 'Clarivex.AI builds enterprise AI applications, intelligent workflow automation, and custom digital transformation platforms for modern businesses.',
  },
  about: {
    title: 'About Us — Clarivex.AI | Pioneers in Enterprise AI',
    description: 'Discover Clarivex.AI: our engineering philosophy, mission, research initiatives, and leadership team delivering human-centered AI transformation.',
    keywords: 'About Clarivex, AI Leadership, AI Research, Machine Learning Team, Enterprise Tech Pioneers',
    ogTitle: 'About Us — Clarivex.AI | Pioneers in Enterprise AI',
    ogDescription: 'Discover Clarivex.AI: our engineering philosophy, mission, research initiatives, and leadership team delivering human-centered AI transformation.',
  },
  services: {
    title: 'AI Services & Engineering Solutions — Clarivex.AI',
    description: 'Explore Clarivex.AI services: custom LLM fine-tuning, computer vision, predictive intelligence, enterprise integrations, and scalable AI infrastructure.',
    keywords: 'AI Consulting, Custom LLM, Computer Vision, Predictive Analytics, Cloud AI Architecture',
    ogTitle: 'AI Services & Engineering Solutions — Clarivex.AI',
    ogDescription: 'Explore Clarivex.AI services: custom LLM fine-tuning, computer vision, predictive intelligence, enterprise integrations, and scalable AI infrastructure.',
  },
  workspace: {
    title: 'AI Workspace & Multi-Agent Studio — Clarivex.AI',
    description: 'Collaborate with Clarivex.AI Workspace powered by Google Search Grounding, multimodal reasoning, code synthesis, and deep research agents.',
    keywords: 'AI Workspace, Gemini 3.8, Search Grounding, Multimodal AI, Code Assistant, Enterprise Chatbot',
    ogTitle: 'AI Workspace & Multi-Agent Studio — Clarivex.AI',
    ogDescription: 'Collaborate with Clarivex.AI Workspace powered by Google Search Grounding, multimodal reasoning, code synthesis, and deep research agents.',
  },
  industries: {
    title: 'Industry AI Solutions & Case Studies — Clarivex.AI',
    description: 'Tailored enterprise artificial intelligence across Healthcare, Fintech, Supply Chain, Manufacturing, Retail, and Clean Energy sectors.',
    keywords: 'Healthcare AI, Fintech AI, Supply Chain Optimization, Manufacturing Automation, Energy AI',
    ogTitle: 'Industry AI Solutions & Case Studies — Clarivex.AI',
    ogDescription: 'Tailored enterprise artificial intelligence across Healthcare, Fintech, Supply Chain, Manufacturing, Retail, and Clean Energy sectors.',
  },
  careers: {
    title: 'Careers at Clarivex.AI — Build the Future of AI',
    description: 'Join Clarivex.AI to solve foundational machine learning challenges. Explore open positions for ML engineers, AI researchers, and designers.',
    keywords: 'AI Careers, Machine Learning Jobs, AI Engineering Roles, Remote Tech Jobs, Clarivex Careers',
    ogTitle: 'Careers at Clarivex.AI — Build the Future of AI',
    ogDescription: 'Join Clarivex.AI to solve foundational machine learning challenges. Explore open positions for ML engineers, AI researchers, and designers.',
  },
  contact: {
    title: 'Contact Us & Schedule Consultation — Clarivex.AI',
    description: 'Connect with Clarivex.AI specialists. Request an enterprise demo, explore AI automation roadmaps, and accelerate your business transformation.',
    keywords: 'Contact Clarivex, AI Consultation, Enterprise Demo, AI Strategy Session, Hire AI Developers',
    ogTitle: 'Contact Us & Schedule Consultation — Clarivex.AI',
    ogDescription: 'Connect with Clarivex.AI specialists. Request an enterprise demo, explore AI automation roadmaps, and accelerate your business transformation.',
  },
};

export const SEO_METADATA_HI: Record<PageTab, PageSeoMetadata> = {
  home: {
    title: 'Clarivex.AI — एआई-संचालित सॉफ्टवेयर और डिजिटल समाधान',
    description: 'Clarivex.AI आधुनिक व्यवसायों के लिए एंटरप्राइज एआई सॉफ्टवेयर, वर्कफ़्लो ऑटोमेशन और उन्नत डिजिटल परिवर्तन समाधान विकसित करता है।',
    keywords: 'एआई सॉफ्टवेयर, एंटरप्राइज एआई, डिजिटल ट्रांसफॉर्मेशन, ऑटोमेशन, Clarivex AI',
    ogTitle: 'Clarivex.AI — एआई-संचालित सॉफ्टवेयर और डिजिटल समाधान',
    ogDescription: 'Clarivex.AI आधुनिक व्यवसायों के लिए एंटरप्राइज एआई सॉफ्टवेयर, वर्कफ़्लो ऑटोमेशन और उन्नत डिजिटल परिवर्तन समाधान विकसित करता है।',
  },
  about: {
    title: 'हमारे बारे में — Clarivex.AI | एंटरप्राइज एआई लीडर्स',
    description: 'Clarivex.AI के दृष्टिकोण, अनुसंधान और विशेषज्ञ टीम के बारे में जानें जो वैश्विक स्तर पर मानवीय बुद्धिमत्ता और तकनीकी नवाचार को आगे बढ़ा रही है।',
    keywords: 'Clarivex के बारे में, एआई टीम, अनुसंधान, मशीन लर्निंग इनोवेशन',
    ogTitle: 'हमारे बारे में — Clarivex.AI | एंटरप्राइज एआई लीडर्स',
    ogDescription: 'Clarivex.AI के दृष्टिकोण, अनुसंधान और विशेषज्ञ टीम के बारे में जानें जो वैश्विक स्तर पर मानवीय बुद्धिमत्ता और तकनीकी नवाचार को आगे बढ़ा रही है।',
  },
  services: {
    title: 'एआई सेवाएं एवं इंजीनियरिंग समाधान — Clarivex.AI',
    description: 'कस्टम एलएलएम फाइन-ट्यूनिंग, कंप्यूटर विज़न, प्रेडिक्टिव एनालिटिक्स और एंटरप्राइज क्लाउड वर्कफ़्लो ऑटोमेशन सेवाओं का अन्वेषण करें।',
    keywords: 'एआई सेवाएं, कस्टम एलएलएम, कंप्यूटर विजन, प्रेडिक्टिव इंटेलिजेंस',
    ogTitle: 'एआई सेवाएं एवं इंजीनियरिंग समाधान — Clarivex.AI',
    ogDescription: 'कस्टम एलएलएम फाइन-ट्यूनिंग, कंप्यूटर विज़न, प्रेडिक्टिव एनालिटिक्स और एंटरप्राइज क्लाउड वर्कफ़्लो ऑटोमेशन सेवाओं का अन्वेषण करें।',
  },
  workspace: {
    title: 'एआई वर्कस्पेस एवं मल्टी-एजेंट स्टूडियो — Clarivex.AI',
    description: 'गूगल सर्च ग्राउंडिंग, मल्टीमॉडल विश्लेषण, कोड जनरेशन और गहरी रिसर्च क्षमताओं से सुसज्जित Clarivex.AI वर्कस्पेस का उपयोग करें।',
    keywords: 'एआई वर्कस्पेस, चैटबॉट, सर्च ग्राउंडिंग, कोड असिस्टेंट',
    ogTitle: 'एआई वर्कस्पेस एवं मल्टी-एजेंट स्टूडियो — Clarivex.AI',
    ogDescription: 'गूगल सर्च ग्राउंडिंग, मल्टीमॉडल विश्लेषण, कोड जनरेशन और गहरी रिसर्च क्षमताओं से सुसज्जित Clarivex.AI वर्कस्पेस का उपयोग करें।',
  },
  industries: {
    title: 'उद्योग समाधान एवं केस स्टडीज — Clarivex.AI',
    description: 'हेल्थकेयर, फिनटेक, सप्लाई चेन, विनिर्माण और ऊर्जा क्षेत्रों के लिए विशेष रूप से डिज़ाइन किए गए मिशन-क्रिटिकल एआई सिस्टम।',
    keywords: 'हेल्थकेयर एआई, फिनटेक एआई, विनिर्माण ऑटोमेशन',
    ogTitle: 'उद्योग समाधान एवं केस स्टडीज — Clarivex.AI',
    ogDescription: 'हेल्थकेयर, फिनटेक, सप्लाई चेन, विनिर्माण और ऊर्जा क्षेत्रों के लिए विशेष रूप से डिज़ाइन किए गए मिशन-क्रिटिकल एआई सिस्टम।',
  },
  careers: {
    title: 'कैरियर के अवसर — Clarivex.AI के साथ भविष्य का निर्माण करें',
    description: 'मशीन लर्निंग और जनरेटिव एआई की सीमाओं को आगे बढ़ाने के लिए Clarivex.AI की वैश्विक टीम में शामिल हों। रिक्त पद देखें।',
    keywords: 'एआई नौकरियां, मशीन लर्निंग जॉब्स, टेक कैरियर',
    ogTitle: 'कैरियर के अवसर — Clarivex.AI के साथ भविष्य का निर्माण करें',
    ogDescription: 'मशीन लर्निंग और जनरेटिव एआई की सीमाओं को आगे बढ़ाने के लिए Clarivex.AI की वैश्विक टीम में शामिल हों। रिक्त पद देखें।',
  },
  contact: {
    title: 'संपर्क करें और परामर्श प्राप्त करें — Clarivex.AI',
    description: 'Clarivex.AI विशेषज्ञों से जुड़ें। एंटरप्राइज डेमो का अनुरोध करें और अपने व्यवसाय के लिए सही एआई रणनीति तैयार करें।',
    keywords: 'संपर्क, एआई कंसल्टेशन, एंटरप्राइज डेमो',
    ogTitle: 'संपर्क करें और परामर्श प्राप्त करें — Clarivex.AI',
    ogDescription: 'Clarivex.AI विशेषज्ञों से जुड़ें। एंटरप्राइज डेमो का अनुरोध करें और अपने व्यवसाय के लिए सही एआई रणनीति तैयार करें।',
  },
};

/**
 * Pure function to get SEO metadata for any given tab and language
 */
export function getPageSeo(tab: PageTab, lang: Language = 'en'): PageSeoMetadata {
  const dataset = lang === 'hi' ? SEO_METADATA_HI : SEO_METADATA_EN;
  return dataset[tab] || dataset.home;
}

/**
 * Updates DOM title, meta description, and OpenGraph/Twitter tags
 */
export function updateDocumentSeo(tab: PageTab, lang: Language = 'en'): PageSeoMetadata {
  const metadata = getPageSeo(tab, lang);

  if (typeof document === 'undefined') {
    return metadata;
  }

  // 1. Update Document Title
  document.title = metadata.title;

  // Helper to update or create a <meta> element
  const setMetaTag = (attributeName: 'name' | 'property', attributeValue: string, content: string) => {
    let element = document.querySelector<HTMLMetaElement>(`meta[${attributeName}="${attributeValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attributeName, attributeValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // 2. Standard Meta Description & Keywords
  setMetaTag('name', 'description', metadata.description);
  if (metadata.keywords) {
    setMetaTag('name', 'keywords', metadata.keywords);
  }

  // 3. OpenGraph tags
  setMetaTag('property', 'og:title', metadata.ogTitle || metadata.title);
  setMetaTag('property', 'og:description', metadata.ogDescription || metadata.description);
  setMetaTag('property', 'og:type', 'website');

  // 4. Twitter Card tags
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', metadata.ogTitle || metadata.title);
  setMetaTag('name', 'twitter:description', metadata.ogDescription || metadata.description);

  return metadata;
}
