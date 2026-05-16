interface Props {
  src: string
  alt: string
}

export default function CalloutDiagram({ src, alt }: Props) {
  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-100">
      <img
        src={src}
        alt={alt}
        className="w-full object-contain"
        loading="lazy"
      />
    </div>
  )
}
