import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from './zh.json'
import en from './en.json'

const savedLang =
  typeof localStorage !== 'undefined' ? (localStorage.getItem('lang') ?? 'zh') : 'zh'

i18n.use(initReactI18next).init({
  resources: {
    zh: { translation: zh },
    en: { translation: en },
  },
  lng: savedLang,
  fallbackLng: 'zh',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lang) => {
  localStorage.setItem('lang', lang)
})

export default i18n
