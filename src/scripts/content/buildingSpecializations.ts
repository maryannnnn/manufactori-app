import { BUILDING_SPECIALIZATIONS_PART1 } from './buildingSpecializationsPart1'
import { BUILDING_SPECIALIZATIONS_PART2 } from './buildingSpecializationsPart2'
import type { BuildingSpecializationCopy } from './buildingSpecializationTypes'

export type { BuildingSpecializationCopy } from './buildingSpecializationTypes'

export const BUILDING_SPECIALIZATIONS: BuildingSpecializationCopy[] = [
  ...BUILDING_SPECIALIZATIONS_PART1,
  ...BUILDING_SPECIALIZATIONS_PART2,
]
