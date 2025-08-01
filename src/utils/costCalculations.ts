const NO_OF_CHISELS = 4

interface CostCalculationInput {
  isSelfFarmed?: boolean
  mapCost?: number
  numberOfMaps?: number
  isUsingChisels?: boolean
  chiselPrice?: number
  isUsingScarabs?: boolean
  scarabs?: Array<{
    price?: number
    quantity?: number
  }>
  isUsingMapCraft?: boolean
  mapCraftPrice?: number
}

export function calculateTotalCost(values: CostCalculationInput): number {
  let total = 0
  const numberOfMaps = values.numberOfMaps ?? 0

  // Map cost
  if (!values.isSelfFarmed && values.mapCost) {
    total += values.mapCost * numberOfMaps
  }

  // Chisel cost
  if (values.isUsingChisels && values.chiselPrice) {
    total += values.chiselPrice * NO_OF_CHISELS * numberOfMaps
  }

  // Scarabs
  if (values.isUsingScarabs && values.scarabs?.length) {
    for (const scarab of values.scarabs) {
      if (!scarab.price || !scarab.quantity) continue
      total += scarab.price * scarab.quantity * numberOfMaps
    }
  }

  // Map craft
  if (values.isUsingMapCraft && values.mapCraftPrice) {
    total += values.mapCraftPrice * numberOfMaps
  }

  return total
}
