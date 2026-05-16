interface Props {
  mistakes: string[]
}

export default function MistakesList({ mistakes }: Props) {
  return (
    <ul className="space-y-2">
      {mistakes.map((mistake, i) => (
        <li key={mistake} className="flex gap-2 items-start text-gray-700">
          <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-400" />
          <span className="leading-relaxed">{mistake}</span>
        </li>
      ))}
    </ul>
  )
}
