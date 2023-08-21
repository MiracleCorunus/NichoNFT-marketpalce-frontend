import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from 'locale/en.json';
import cn from 'locale/cn.json';
import es from 'locale/es.json';
import ja from 'locale/ja.json';

const resources = {
  en: {
    translation: en
  },
  cn: {
    translation: cn
  },
  es: {
    translation: es
  },
  ja: {
    translation: ja
  }
}

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    resources: resources,
    interpolation: {
      escapeValue: false,
    }
  });

  localStorage.setItem('languageType', 'en')

export default i18n;