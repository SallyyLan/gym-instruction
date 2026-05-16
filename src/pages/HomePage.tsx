import { useTranslation } from 'react-i18next'
import machines from '../data/machines.json'
import type { Machine } from '../types/machine'
import MachineCard from '../components/MachineCard'
import LanguageToggle from '../components/LanguageToggle'

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">{t('browseAll')}</h1>
          <LanguageToggle />
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {(machines as Machine[]).map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>
      </main>
    </div>
  )
}
