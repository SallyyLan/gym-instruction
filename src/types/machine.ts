export interface LocalizedString {
  zh: string
  en: string
}

export interface Machine {
  id: string
  name: LocalizedString
  description: LocalizedString
  thumbnail: string
  muscles: LocalizedString[]
  sketchfabId: string
  gif: string
  callout: string
  steps: LocalizedString[]
  mistakes: LocalizedString[]
  warning: LocalizedString
}
