import { CHEMICAL_SPECIALIZATIONS_PART1 } from './chemicalSpecializationsPart1'
import { CHEMICAL_SPECIALIZATIONS_PART2 } from './chemicalSpecializationsPart2'
import type { ChemicalSpecializationCopy } from './chemicalSpecializationTypes'

export type { ChemicalSpecializationCopy } from './chemicalSpecializationTypes'

export const CHEMICAL_SPECIALIZATIONS: ChemicalSpecializationCopy[] = [
  ...CHEMICAL_SPECIALIZATIONS_PART1,
  ...CHEMICAL_SPECIALIZATIONS_PART2,
]
