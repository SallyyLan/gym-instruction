import { useState } from 'react'

interface Props {
  modelId: string
  title: string
}

export default function SketchfabEmbed({ modelId, title }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-white" style={{ paddingBottom: '56.25%' }}>
      {!loaded && (
        <div
          data-testid="sketchfab-skeleton"
          className="absolute inset-0 bg-gray-100 animate-pulse"
        />
      )}
      <iframe
        title={title}
        src={`https://sketchfab.com/models/${modelId}/embed?autospin=1&autostart=1&transparent=1&ui_infos=0&ui_watermark_link=0&ui_watermark=0&ui_hint=2`}
        className="absolute inset-0 w-full h-full border-0"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
