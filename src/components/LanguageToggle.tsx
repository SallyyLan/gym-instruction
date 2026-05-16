import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { i18n, t } = useTranslation()

  const toggle = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')
  }

  return (
    <button
      onClick={toggle}
      className="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 transition-colors"
    >
      {t('switchLang')}
    </button>
  )
}
