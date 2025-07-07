
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { en } from '../i18n/en';
import { fr } from '../i18n/fr';
import { es } from '../i18n/es';
import { ht } from '../i18n/ht'

type Language = 'en' | 'fr' | 'es' | 'ht';

type Translations = {
  [key: string]: any;
};

const translations: Record<Language, Translations> = {
  en,
  fr,
  es,
  ht,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const keys = key.split('.');
    let translation: any = translations[language];
    
    for (const k of keys) {
      if (translation[k] === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      translation = translation[k];
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
