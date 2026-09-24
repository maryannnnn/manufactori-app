import React from 'react'

import { Accordion, type AccordionItem } from '@/components/Accordion'

export type StrategyItem = AccordionItem

type Props = {
  items: StrategyItem[]
}

/** Marketing strategy fields as an accordion, first panel open. */
export const CaseStudyStrategy: React.FC<Props> = ({ items }) => (
  <Accordion defaultOpenKey={items[0]?.key} items={items} />
)
