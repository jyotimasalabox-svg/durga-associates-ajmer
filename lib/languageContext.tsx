'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'hi' | 'en';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  hi: {
    brandName: 'दुर्गा एसोसिएट्स एंड प्रॉपर्टी डीलर',
    brandSub: 'अजमेर, राजस्थान (पंजीकृत संपत्ति सलाहकार एवं दस्तावेज़ विशेषज्ञ)',
    callUs: 'कॉल करें',
    whatsapp: 'WhatsApp परामर्श',
    navHome: 'मुख्य पृष्ठ',
    navServices: 'हमारी सेवाएँ',
    navProcess: 'पंजीयन प्रक्रिया',
    navDocuments: 'आवश्यक कागजात',
    navCalculator: 'शुल्क अनुमान',
    navContact: 'संपर्क करें',
    navAdmin: 'एडमिन लॉगिन',
    heroTag: 'विश्वसनीय • पारदर्शी • कानूनी रूप से प्रमाणित',
    heroTitle: 'अजमेर में प्रॉपर्टी रजिस्ट्रेशन, बैनामा व कानूनी दस्तावेज़ों का संपूर्ण समाधान',
    heroDesc: 'राजस्थान ई-पंजीयन (e-Panjiyan) के नवीनतम नियमों, वास्तविक डीएलसी दरों और सही सरकारी स्टाम्प शुल्क के अनुसार आपकी रजिस्ट्री का पूर्ण व सुरक्षित कार्य।',
    bookAppointment: 'अपॉइंटमेंट बुक करें',
    calculateNow: 'रजिस्ट्री शुल्क जानें',
    servicesTitle: 'हमारी प्रमुख सेवाएँ',
    servicesSubtitle: 'राजस्थान सरकार के नियमों के अनुरूप प्रत्येक दस्तावेज़ का अनुभवी विशेषज्ञों द्वारा प्रमाणीकरण',
    processTitle: 'प्रॉपर्टी रजिस्ट्रेशन प्रक्रिया (चरण दर चरण)',
    processSubtitle: 'सब-रजिस्ट्रार कार्यालय अजमेर में रजिस्ट्री कैसे संपन्न होती है?',
    docsTitle: 'रजिस्ट्री हेतु आवश्यक दस्तावेज़ चेकलिस्ट',
    docsSubtitle: 'सब-रजिस्ट्रार पेशी से पूर्व इन अनिवार्य कागजात को तैयार रखें',
    contactTitle: 'हमसे संपर्क करें व कार्यालय पधारें',
    contactSubtitle: 'प्रॉपर्टी रजिस्ट्री, बैनामा, गिफ्ट डीड अथवा डीएलसी दर परामर्श हेतु आज ही संपर्क करें',
    name: 'आपका पूरा नाम',
    phone: 'मोबाइल नंबर',
    email: 'ईमेल पता (वैकल्पिक)',
    serviceType: 'सेवा का प्रकार चुनें',
    location: 'संपत्ति का स्थान / कॉलोनी (अजमेर)',
    message: 'आपका प्रश्न या विवरण',
    submit: 'पूछताछ भेजें',
    submitting: 'भेजा जा रहा है...',
    successMsg: 'धन्यवाद! आपकी पूछताछ प्राप्त हो गई है। हमारी टीम शीघ्र संपर्क करेगी।',
    phone1: '9829261354',
    phone2: '8003987152',
    addressText: 'दुर्गा एसोसिएट्स, कलेक्ट्री परिसर एवं सब-रजिस्ट्रार कार्यालय के निकट, अजमेर (राजस्थान)',
    hoursText: 'सोमवार - शनिवार: प्रातः 09:30 से सायं 07:00 बजे तक'
  },
  en: {
    brandName: 'Durga Associates & Property Dealer',
    brandSub: 'Ajmer, Rajasthan (Registered Property Consultants & Legal Deed Specialists)',
    callUs: 'Call Us',
    whatsapp: 'WhatsApp Inquiry',
    navHome: 'Home',
    navServices: 'Services',
    navProcess: 'Registration Process',
    navDocuments: 'Documents Checklist',
    navCalculator: 'Fee Estimator',
    navContact: 'Contact Us',
    navAdmin: 'Admin Portal',
    heroTag: 'Trusted • Transparent • Legally Certified',
    heroTitle: 'Comprehensive Property Registration & Legal Deed Services in Ajmer',
    heroDesc: 'Flawless property deeds, gift deeds, release deeds & authentic stamp duty calculations strictly adhering to Rajasthan e-Panjiyan regulations & DLC valuations.',
    bookAppointment: 'Book Appointment',
    calculateNow: 'Calculate Registration Cost',
    servicesTitle: 'Our Premier Services',
    servicesSubtitle: 'Expert drafting and registration in accordance with Rajasthan State Laws',
    processTitle: 'Step-by-Step Registration Guide',
    processSubtitle: 'How property registration is completed at Sub-Registrar Ajmer',
    docsTitle: 'Mandatory Documents Checklist',
    docsSubtitle: 'Keep these documents ready prior to Sub-Registrar appearance',
    contactTitle: 'Contact Us & Visit Office',
    contactSubtitle: 'Reach out today for property registry, deed drafting or DLC consultation',
    name: 'Full Name',
    phone: 'Mobile Number',
    email: 'Email (Optional)',
    serviceType: 'Select Service Type',
    location: 'Property Location / Colony (Ajmer)',
    message: 'Your Query / Details',
    submit: 'Send Inquiry',
    submitting: 'Sending...',
    successMsg: 'Thank you! Your inquiry has been received. Our team will contact you shortly.',
    phone1: '9829261354',
    phone2: '8003987152',
    addressText: 'Durga Associates, Near Collectorate & Sub-Registrar Office, Ajmer (Rajasthan)',
    hoursText: 'Monday - Saturday: 09:30 AM to 07:00 PM'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'hi',
  toggleLang: () => {},
  setLang: () => {},
  t: () => ''
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('hi');

  useEffect(() => {
    const saved = localStorage.getItem('durga_lang') as Language;
    if (saved && (saved === 'hi' || saved === 'en')) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('durga_lang', newLang);
  };

  const toggleLang = () => {
    setLang(lang === 'hi' ? 'en' : 'hi');
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['hi']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
