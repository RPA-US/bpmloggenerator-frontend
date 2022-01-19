import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // custom config with https://github.com/i18next/i18next-browser-languageDetector

import commons from './locales/commons.json';
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';

export const resources = {
  en: {
    ns1: commons,
    ns2: enTranslation,
  },
  es: {
    ns1: commons,
    ns2: esTranslation,
  },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    ns: ['ns1', 'ns2'],
    interpolation: {
      escapeValue: false,
    },
    resources,
  })