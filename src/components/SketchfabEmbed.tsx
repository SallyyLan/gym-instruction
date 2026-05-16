import { useState } from 'react'

interface Props {
  modelId: string
  title: string
}

export default function SketchfabEmbed({ modelId, title }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
      {!loaded && (
        <div
          data-testid="sketchfab-skeleton"
          className="absolute inset-0 bg-gray-100 animate-pulse"
        />
      )}
      <iframe
        title={title}
        src={`https://sketchfab.com/models/${modelId}/embed?autostart=0&ui_theme=light&preload=1`}
        className="absolute inset-0 w-full h-full border-0"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
