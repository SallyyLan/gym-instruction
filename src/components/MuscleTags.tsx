interface Props {
  tags: string[]
}

export default function MuscleTags({ tags }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
