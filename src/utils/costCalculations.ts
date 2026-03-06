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
  isUsingAstrolabe?: boolean
  astrolabePrice?: number
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

  // Astrolabe
  // TODO: This calculation is incomplete and needs to be updated once we know the astrolabe durability.
  // Current implementation assumes 1 astrolabe per session, but astrolabes actually run out after
  // a certain number of maps. The correct formula should be:
  // astrolabeCost = (numberOfMaps / mapsPerAstrolabe) * astrolabePrice
  // NOTE: the division of numberOfMaps by mapsPerAstrolabe should ideally be rounded up, since you can't use a fraction of an astrolabe. For example, if mapsPerAstrolabe is 10 and you run 15 maps, you would need 2 astrolabes (1 for the first 10 maps and another for the remaining 5 maps).
  // where mapsPerAstrolabe is the durability value (not yet publicly known as of Necropolis launch)
  if (values.isUsingAstrolabe && values.astrolabePrice) {
    total += values.astrolabePrice
  }

  return total
}
