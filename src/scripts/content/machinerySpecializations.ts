import { MACHINERY_SPECIALIZATIONS_PART1 } from './machinerySpecializationsPart1'
import { MACHINERY_SPECIALIZATIONS_PART2 } from './machinerySpecializationsPart2'
import { MACHINERY_SPECIALIZATIONS_PART3 } from './machinerySpecializationsPart3'
import type { MachinerySpecializationCopy } from './machinerySpecializationTypes'

export type { MachinerySpecializationCopy } from './machinerySpecializationTypes'

export const MACHINERY_SPECIALIZATIONS: MachinerySpecializationCopy[] = [
  ...MACHINERY_SPECIALIZATIONS_PART1,
  ...MACHINERY_SPECIALIZATIONS_PART2,
  ...MACHINERY_SPECIALIZATIONS_PART3,
]
