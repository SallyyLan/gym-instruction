import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Machine } from '../types/machine'
import MuscleTags from './MuscleTags'

interface Props {
  machine: Machine
}

export default function MachineCard({ machine }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'zh' | 'en'

  return (
    <Link
      to={`/machine/${machine.id}`}
      className="block rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-video bg-gray-50 overflow-hidden">
        <img
          src={machine.thumbnail}
          alt={machine.name[lang]}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-3 space-y-2">
        <h2 className="font-semibold text-sm text-gray-900 leading-snug">{machine.name[lang]}</h2>
        <p className="text-xs text-gray-400 line-clamp-2">{machine.description[lang]}</p>
        <MuscleTags tags={machine.muscles.map((m) => m[lang])} />
      </div>
    </Link>
  )
}
