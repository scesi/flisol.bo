import React, { type ComponentType } from 'react'
import './arrow-toggle.css'

import {
  ArrowLeft,
  ArrowLeftPressed,
  ArrowRight,
  ArrowRightPressed,
} from '@/core/assets/icons/tsx/arrow-icon'

type Orientation = 'left' | 'right'

type ArrowToggleProps = {
  orientation: Orientation
  href: string
  label: string
  disabled?: boolean
}

const ICON_MAP: Record<Orientation, { default: ComponentType; pressed: ComponentType }> = {
  left: { default: ArrowLeft, pressed: ArrowLeftPressed },
  right: { default: ArrowRight, pressed: ArrowRightPressed },
}

export const ArrowToggle = ({ orientation, href, label, disabled = false }: ArrowToggleProps) => {
  const icons = ICON_MAP[orientation]
  const DefaultIcon = icons.default
  const PressedIcon = icons.pressed

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault()
    }
  }

  return (
    <a
      href={disabled ? '#' : href}
      aria-label={label}
      className={`arrow ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      title={disabled ? 'Coming soon' : label}
      style={{
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <span className="icon-default">
        <DefaultIcon />
      </span>
      <span className="icon-pressed">
        <PressedIcon />
      </span>
    </a>
  )
}

export default ArrowToggle
