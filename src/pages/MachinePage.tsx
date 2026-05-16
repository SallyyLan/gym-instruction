import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import machines from '../data/machines.json'
import type { Machine } from '../types/machine'
import LanguageToggle from '../components/LanguageToggle'
import SketchfabEmbed from '../components/SketchfabEmbed'
import StepList from '../components/StepList'
import MistakesList from '../components/MistakesList'
import WarningBox from '../components/WarningBox'

export default function MachinePage() {
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'zh' | 'en'

  const machine = (machines as Machine[]).find((m) => m.id === id)

  if (!machine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-gray-500">{t('notFound')}</p>
        <Link to="/" className="text-gray-900 font-medium underline">
          {t('backToHome')}
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-base font-semibold text-gray-900 truncate pr-4">
            {machine.name[lang]}
          </h1>
          <LanguageToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <SketchfabEmbed modelId={machine.sketchfabId} title={machine.name[lang]} />

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">{t('steps')}</h2>
          <StepList steps={machine.steps.map((s) => s[lang])} />
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">{t('mistakes')}</h2>
          <MistakesList mistakes={machine.mistakes.map((m) => m[lang])} />
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">{t('warning')}</h2>
          <WarningBox text={machine.warning[lang]} />
        </section>

        <div className="pt-4 pb-10 text-center">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 underline">
            {t('browseAll')}
          </Link>
        </div>
      </main>
    </div>
  )
}
