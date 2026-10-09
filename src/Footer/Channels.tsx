import React from 'react'

import {
  EmailIcon,
  FacebookIcon,
  LinkedInIcon,
  PhoneIcon,
  TelegramIcon,
  WhatsAppIcon,
} from '@/Footer/ChannelIcons'
import {
  resolveFooterChannels,
  type FooterChannelLink,
  type FooterChannelValues,
} from '@/Footer/resolveChannelHref'

const ICONS: Record<FooterChannelLink['id'], React.FC> = {
  linkedin: LinkedInIcon,
  facebook: FacebookIcon,
  whatsapp: WhatsAppIcon,
  telegram: TelegramIcon,
  email: EmailIcon,
  phone: PhoneIcon,
}

const linkClassName =
  'inline-flex size-8 items-center justify-center rounded-[2px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export const FooterChannels: React.FC<{ channels?: FooterChannelValues | null }> = ({ channels }) => {
  const links = resolveFooterChannels(channels)
  if (links.length === 0) return null

  return (
    <nav aria-label="Contact and social" className="mt-5 flex flex-wrap gap-1">
      {links.map((item) => {
        const Icon = ICONS[item.id]
        return (
          <a
            aria-label={item.label}
            className={linkClassName}
            href={item.href}
            key={item.id}
            {...(item.external ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
          >
            <Icon />
          </a>
        )
      })}
    </nav>
  )
}
