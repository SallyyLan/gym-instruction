export interface LocalizedString {
  zh: string
  en: string
}

export interface Machine {
  id: string
  name: LocalizedString
  description: LocalizedString
  thumbnail: string
  sketchfabId: string
  steps: LocalizedString[]
  mistakes: LocalizedString[]
  warning: LocalizedString
}
