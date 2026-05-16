import { QRCodeSVG } from 'qrcode.react'
import { useTranslation } from 'react-i18next'
import machines from '../data/machines.json'
import type { Machine } from '../types/machine'

export default function QRCodesPage() {
  const { t } = useTranslation()
  const base = window.location.origin

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 print:hidden">
          <h1 className="text-xl font-semibold">{t('qrPageTitle')}</h1>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
          >
            {t('printAll')}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {(machines as Machine[]).map((machine) => (
            <div
              key={machine.id}
              className="flex flex-col items-center gap-3 p-6 border border-gray-100 rounded-xl"
            >
              <QRCodeSVG
                value={`${base}/machine/${machine.id}`}
                size={160}
                level="M"
              />
              <p className="font-semibold text-sm text-center">{machine.name.zh}</p>
              <p className="text-xs text-gray-400 text-center">{machine.name.en}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
