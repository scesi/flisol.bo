import { useState, type ComponentType } from 'react'
import './arrow-toggle.css'

import { ArrowLeft, ArrowLeftPressed, ArrowRight, ArrowRightPressed } from '@/core/assets/icons/tsx/arrow-icon'


type Orientation = 'left' | 'right'

type ArrowToggleProps = {
  orientation: Orientation
}

const ICON_MAP: Record<Orientation, { default: ComponentType; pressed: ComponentType }> = {
  left: { default: ArrowLeft, pressed: ArrowLeftPressed },

  right: { default: ArrowRight, pressed: ArrowRightPressed },

}

export const ArrowToggle = ({ orientation }: ArrowToggleProps) => {
  const [pressed, setPressed] = useState(false)

  const icons = ICON_MAP[orientation]
  const IconComponent = pressed ? icons.pressed : icons.default

  return (
    <div
      role="button"
      aria-pressed={pressed}
      className={`arrow`}
      tabIndex={0}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setPressed(true)
          e.preventDefault()
        }
      }}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setPressed(false)
        }
      }}
    >
      <IconComponent />
    </div>
  )
}

export default ArrowToggle
