/* eslint-disable no-undef */
import { useState } from 'react'
import './AgendaIsland.css'

interface AgendaIslandProps {
  agendaData: {
    eventos: {
      dia: string
      eventos: { horario: string; laboratorio: string; actividad: string; speaker: string }[]
    }[]
  }
  tuxIcon: string
  gnuIcon: string
}

export const AgendaIsland = ({ agendaData, tuxIcon, gnuIcon }: AgendaIslandProps) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0)
  const currentDay = agendaData.eventos[selectedDayIdx]

  const allRooms = [...new Set(currentDay.eventos.map((e) => e.laboratorio))]
  const [selectedRoom, setSelectedRoom] = useState(allRooms[0])
  const [isFading, setIsFading] = useState(false)

  const handleDayChange = (idx: number) => {
    setIsFading(true)
    setTimeout(() => {
      setSelectedDayIdx(idx)
      const nextDayRooms = [...new Set(agendaData.eventos[idx].eventos.map((e) => e.laboratorio))]
      setSelectedRoom(nextDayRooms[0])
      setIsFading(false)
    }, 200)
  }

  const handleRoomChange = (room: string) => {
    setIsFading(true)
    setTimeout(() => {
      setSelectedRoom(room)
      setIsFading(false)
    }, 200)
  }

  const filteredEvents = currentDay.eventos.filter((e) => e.laboratorio === selectedRoom)

  return (
    <article className="agenda-island">
      <div
        className={`day-1 content-box ${selectedDayIdx === 0 ? 'active-day' : ''}`}
        onClick={() => handleDayChange(0)}
        style={{ cursor: 'pointer' }}
      >
        <img src={tuxIcon} alt="Tux" className="gnu-logo" />
        <h4>Dia 1 - UMSS MEMI</h4>
      </div>

      <div
        className={`day-2 content-box ${selectedDayIdx === 1 ? 'active-day' : ''}`}
        onClick={() => handleDayChange(1)}
        style={{ cursor: 'pointer' }}
      >
        <img src={gnuIcon} alt="Gnu" className="gnu-logo" />
        <h4>Dia 2 - UCB</h4>
      </div>

      <div className="rooms-wrapper">
        {allRooms.map((room) => (
          <button
            key={room}
            className={`room content-box ${selectedRoom === room ? 'active' : ''}`}
            onClick={() => handleRoomChange(room)}
          >
            <h4>{room}</h4>
          </button>
        ))}
      </div>

      <div className={`schedule content-box ${isFading ? 'fade-exit' : 'fade-enter'}`}>
        <div className="schedule-content">
          {filteredEvents.map((ev, i) => (
            <div
              key={i}
              className="event-item"
              style={{ padding: '1rem', }}
            >
              <div style={{ fontSize: '1.2rem' }}>
                <strong>{ev.horario}</strong> <span className="arrow-schedule"></span>
                <span className="talk">
                  <p>{ev.actividad}</p>
                  <p className='speaker'>{ev.speaker}</p>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
