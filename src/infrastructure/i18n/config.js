import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // custom config with https://github.com/i18next/i18next-browser-languageDetector

import commons from './locales/commons.json';
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';

export const resources = {
  en: {
    commons,
    ns: enTranslation,
  },
  es: {
    commons,
    ns: esTranslation,
  },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    ns: ['commons', 'ns'],
    defaultNS: 'ns',
    interpolation: {
      escapeValue: false,
      format: function(value, format, lng) {
        if (format === 'datetime') return new Intl.DateTimeFormat('es-ES', {
          dateStyle: "medium",
          timeStyle: "medium"
        }).format(value);
        return value;
      }
    },
    resources,
  })