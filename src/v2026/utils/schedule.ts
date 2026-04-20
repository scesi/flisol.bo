export type RawScheduleEvent = {
  horario: string
  laboratorio: string
  actividad: string
  speaker: string
  descripcion?: string
}

export type RawScheduleDay = {
  dia: string
  total_eventos: number
  eventos: RawScheduleEvent[]
}

export type RawScheduleData = {
  locationDay1?: string
  locationDay2?: string
  eventos: RawScheduleDay[]
}

export type EventCategory =
  | 'frontend'
  | 'ia'
  | 'datos'
  | 'seguridad'
  | 'infra'
  | 'ux'
  | 'comunidad'
  | 'general'

export type EnrichedScheduleEvent = RawScheduleEvent & {
  id: string
  dayLabel: string
  dateISO: string
  startTime: string
  endTime: string
  startMinutes: number
  endMinutes: number
  category: EventCategory
  description: string
  calendarLocation: string
}

export const DAY_DATE_MAP: Record<string, string> = {
  viernes: '2026-04-24',
  sabado: '2026-04-25',
}

const DAY_LOCATION_KEYS: Record<string, 'locationDay1' | 'locationDay2'> = {
  viernes: 'locationDay1',
  sabado: 'locationDay2',
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  frontend: 'Frontend',
  ia: 'IA',
  datos: 'Datos',
  seguridad: 'Seguridad',
  infra: 'Infra',
  ux: 'UX',
  comunidad: 'Comunidad',
  general: 'General',
}

const CATEGORY_KEYWORDS: Record<EventCategory, string[]> = {
  frontend: ['frontend', 'react', 'web', 'ui', 'javascript', 'css'],
  ia: ['ia', 'llm', 'copilot', 'inteligencia artificial', 'deep seek', 'modelo'],
  datos: ['datos', 'data', 'ciencia de datos', 'analytics', 'cuantica'],
  seguridad: ['hacker', 'phreaking', 'amenazas', 'ciber', 'seguridad'],
  infra: ['docker', 'quarkus', 'linux', 'devops', 'github actions'],
  ux: ['ux', 'diseno', 'interfaz', 'penpot'],
  comunidad: ['carrera', 'software libre', 'comunidad', 'open source'],
  general: [],
}

export const normalizeDay = (dayLabel: string): string => {
  return dayLabel
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const safeSplitTime = (value: string): [string, string] => {
  const cleaned = value.replace(/\s+/g, '')
  const parts = cleaned.split('-')
  const start = parts[0] || '00:00'
  const end = parts[1] || start
  return [start, end]
}

const toMinutes = (hhmm: string): number => {
  const [hoursText, minutesText] = hhmm.split(':')
  const hours = Number.parseInt(hoursText || '0', 10)
  const minutes = Number.parseInt(minutesText || '0', 10)
  return hours * 60 + minutes
}

const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const inferCategory = (activity: string): EventCategory => {
  const text = activity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  const match = (Object.keys(CATEGORY_KEYWORDS) as EventCategory[]).find((category) => {
    if (category === 'general') return false
    return CATEGORY_KEYWORDS[category].some((word) => text.includes(word))
  })

  return match || 'general'
}

export const enrichScheduleData = (scheduleData: RawScheduleData): EnrichedScheduleEvent[] => {
  return scheduleData.eventos.flatMap((day) => {
    const normalizedDay = normalizeDay(day.dia)
    const dateISO = DAY_DATE_MAP[normalizedDay] || '2026-04-24'
    const locationKey = DAY_LOCATION_KEYS[normalizedDay]
    const dayLocation = (locationKey && scheduleData[locationKey]) || scheduleData.locationDay1 || 'Cochabamba, Bolivia'

    return day.eventos
      .map((event) => {
        const [startTime, endTime] = safeSplitTime(event.horario)
        const idSource = `${day.dia}-${event.horario}-${event.laboratorio}-${event.actividad}`
        const baseDescription = event.descripcion?.trim()
        const description =
          baseDescription && baseDescription.length > 0
            ? baseDescription
            : `Sesion: ${event.actividad}. Ponente: ${event.speaker}. Sala: ${event.laboratorio}. Sede: ${dayLocation}.`

        return {
          ...event,
          id: slugify(idSource),
          dayLabel: day.dia,
          dateISO,
          startTime,
          endTime,
          startMinutes: toMinutes(startTime),
          endMinutes: toMinutes(endTime),
          category: inferCategory(event.actividad),
          description,
          calendarLocation: dayLocation,
        }
      })
      .sort((a, b) => a.startMinutes - b.startMinutes)
  })
}

export const formatToUtcStamp = (dateISO: string, hhmm: string): string => {
  const [hoursText, minutesText] = hhmm.split(':')
  const hours = Number.parseInt(hoursText || '0', 10)
  const minutes = Number.parseInt(minutesText || '0', 10)

  const utcDate = new Date(`${dateISO}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00-04:00`)

  const year = utcDate.getUTCFullYear()
  const month = String(utcDate.getUTCMonth() + 1).padStart(2, '0')
  const day = String(utcDate.getUTCDate()).padStart(2, '0')
  const utcHours = String(utcDate.getUTCHours()).padStart(2, '0')
  const utcMinutes = String(utcDate.getUTCMinutes()).padStart(2, '0')
  const utcSeconds = String(utcDate.getUTCSeconds()).padStart(2, '0')

  return `${year}${month}${day}T${utcHours}${utcMinutes}${utcSeconds}Z`
}

export const toGoogleCalendarUrl = (event: EnrichedScheduleEvent): string => {
  const startStamp = formatToUtcStamp(event.dateISO, event.startTime)
  const endStamp = formatToUtcStamp(event.dateISO, event.endTime)

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.actividad,
    dates: `${startStamp}/${endStamp}`,
    location: event.calendarLocation,
    details: event.description,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export const groupEventsByDay = (events: EnrichedScheduleEvent[]): Record<string, EnrichedScheduleEvent[]> => {
  return events.reduce<Record<string, EnrichedScheduleEvent[]>>((acc, event) => {
    const key = event.dayLabel
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(event)
    return acc
  }, {})
}
