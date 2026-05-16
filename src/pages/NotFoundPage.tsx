import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="text-5xl" aria-hidden={true}>🏋️</span>
      <p className="text-gray-500">{t('notFound')}</p>
      <Link to="/" className="text-gray-900 font-medium underline">
        {t('backToHome')}
      </Link>
    </div>
  )
}
