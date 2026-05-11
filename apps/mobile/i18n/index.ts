import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import zh from './zh.json';
import en from './en.json';

const resources = {
  zh: { translation: zh },
  en: { translation: en },
};

const deviceLanguage = getLocales()[0]?.languageCode || 'zh';
const initialLang = resources[deviceLanguage as keyof typeof resources] ? deviceLanguage : 'zh';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
