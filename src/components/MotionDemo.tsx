interface Props {
  src: string
  alt: string
}

export default function MotionDemo({ src, alt }: Props) {
  return (
    <div className="w-full rounded-lg overflow-hidden bg-gray-50">
      <img
        src={src}
        alt={alt}
        className="w-full object-cover"
        loading="lazy"
      />
    </div>
  )
}
