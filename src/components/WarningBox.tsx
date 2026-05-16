interface Props {
  text: string
}

export default function WarningBox({ text }: Props) {
  return (
    <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex gap-3 items-start">
      <span className="text-amber-500 text-xl flex-shrink-0" aria-hidden={true}>⚠️</span>
      <p className="text-amber-800 text-sm leading-relaxed">{text}</p>
    </div>
  )
}
