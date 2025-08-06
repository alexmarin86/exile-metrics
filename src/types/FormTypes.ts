// Generic form interface that can work with different form implementations
export interface GenericForm<TValues = unknown> {
  values: TValues
  setFieldValue: (field: string, value: unknown) => void
  // Add other methods as needed
}

// Specific interfaces for what each component needs
export interface SessionInfoFormData {
  sessionName: string
  sessionDescription: string
  sessionNotes?: string
}

export interface MapInfoFormData {
  isRandomMap: boolean
  mapName: string
  isOriginator: boolean
  isSelfFarmed: boolean
  mapCost?: number
  numberOfMaps: number
  isUsingChisels: boolean
  chiselName?: string
  chiselPrice?: number
  isUsingScarabs: boolean
  scarabs: Array<{
    name?: string
    quantity?: number
    price?: number
  }>
  isUsingMapCraft: boolean
  mapCraftName?: string
  mapCraftPrice?: number
}

// Basic map info without chisels, scarabs, and crafts - for EditInfoSection
export interface BasicMapInfoFormData {
  isRandomMap: boolean
  mapName: string
  isOriginator: boolean
  isSelfFarmed: boolean
  mapCost?: number
  numberOfMaps: number
}

// Extended interface that includes all form fields for components that need everything
export interface FullFormData extends SessionInfoFormData, MapInfoFormData {}

// Combined interface for components that need both
export interface SessionAndMapFormData extends SessionInfoFormData, MapInfoFormData {}
