interface Props {
  steps: string[]
}

export default function StepList({ steps }: Props) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3 items-start">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white text-sm font-semibold flex items-center justify-center">
            {i + 1}
          </span>
          <span className="text-gray-700 leading-relaxed pt-0.5">{step}</span>
        </li>
      ))}
    </ol>
  )
}
