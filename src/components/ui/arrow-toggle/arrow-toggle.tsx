import { useState } from 'react'

import './arrow-toggle.css'

type ArrowToggleProps = {
  orientation: 'up' | 'down' | 'left' | 'right'
}

export const ArrowToggle = ({ orientation }: ArrowToggleProps) => {
  const [pressed, setPressed] = useState(false)

  return (
    <div
      className={`arrow ${orientation} ${pressed ? 'pressed' : ''}`}
      tabIndex={0}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      // Accesibility options to keyboard users
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
    />
  )
}
export default ArrowToggle
