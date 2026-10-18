import React from 'react'

import type { ClientCardData } from '@/utilities/getClientList'

import { ClientCard } from '@/components/ClientCard'

type Props = {
  clients: ClientCardData[]
}

export const ClientDirectory: React.FC<Props> = ({ clients }) => {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {clients.map((client) => (
        <li className="min-w-0" key={client.href}>
          <ClientCard client={client} />
        </li>
      ))}
    </ul>
  )
}
