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
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    />
  )
}
export default ArrowToggle
