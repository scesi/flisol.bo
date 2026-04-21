export type RawScheduleEvent = {
  horario: string
  laboratorio: string
  actividad: string
  speaker: string
  confirmado: boolean
  spanAllRooms?: boolean
  spanRows?: number
  esBloque?: boolean
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
  | 'backend'
  | 'mobile'
  | 'ia'
  | 'datos'
  | 'seguridad'
  | 'infra'
  | 'gamedev'
  | 'ux'
  | 'comunidad'
  | 'general'

export type EnrichedScheduleEvent = RawScheduleEvent & {
  id: string
  dayLabel: string
  startTime: string
  endTime: string
  startMinutes: number
  endMinutes: number
  category: EventCategory
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  mobile: 'Mobile',
  ia: 'IA',
  datos: 'Datos',
  seguridad: 'Seguridad',
  infra: 'Infra',
  gamedev: 'GameDev',
  ux: 'UX',
  comunidad: 'Comunidad',
  general: 'General',
}

const CATEGORY_KEYWORDS: Record<EventCategory, string[]> = {
  seguridad: [
    'hacker',
    'phreaking',
    'amenazas',
    'ciber',
    'seguridad',
    'attacks',
    'ataque',
    'ataques',
    'vulnerabilidad',
  ],
  ia: [
    'ia',
    'ai',
    'llm',
    'llms',
    'copilot',
    'inteligencia artificial',
    'machine learning',
    'deep seek',
    'modelo',
    'modelos',
    'neural network',
    'neural networks',
    'pinn',
  ],
  datos: ['datos', 'data', 'data science', 'ciencia de datos', 'analytics', 'cuantica'],
  gamedev: ['godot', 'videojuegos', 'juegos', 'engine', 'gamedev'],
  mobile: ['android', 'ios', 'flutter', 'kotlin', 'mobile'],
  backend: ['backend', 'java', 'spring boot', 'nodejs', 'node', 'api', 'python'],
  frontend: ['frontend', 'react', 'web', 'ui', 'javascript', 'css', 'html', 'blogs'],
  infra: [
    'docker',
    'quarkus',
    'linux',
    'devops',
    'github actions',
    'arquitectura',
    'despliegue',
    'cloud',
    'aws',
  ],
  ux: ['ux', 'diseno', 'interfaz', 'penpot', 'diseño'],
  comunidad: [
    'carrera',
    'software libre',
    'comunidad',
    'open source',
    'gratis',
    'startup',
    'costos',
  ],
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
  const text = activity
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  const match = (Object.keys(CATEGORY_KEYWORDS) as EventCategory[]).find((category) => {
    if (category === 'general') return false
    return CATEGORY_KEYWORDS[category].some((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'i')
      return regex.test(text)
    })
  })

  return match || 'general'
}

export const enrichScheduleData = (scheduleData: RawScheduleData): EnrichedScheduleEvent[] => {
  return scheduleData.eventos.flatMap((day) => {
    return day.eventos
      .filter((event) => event.confirmado)
      .map((event) => {
        const [startTime, endTime] = safeSplitTime(event.horario)
        const idSource = `${day.dia}-${event.horario}-${event.laboratorio}-${event.actividad}`

        return {
          ...event,
          id: slugify(idSource),
          dayLabel: day.dia,
          startTime,
          endTime,
          startMinutes: toMinutes(startTime),
          endMinutes: toMinutes(endTime),
          category: inferCategory(event.actividad),
        }
      })
      .sort((a, b) => a.startMinutes - b.startMinutes)
  })
}

export const groupEventsByDay = (
  events: EnrichedScheduleEvent[]
): Record<string, EnrichedScheduleEvent[]> => {
  return events.reduce<Record<string, EnrichedScheduleEvent[]>>((acc, event) => {
    const key = event.dayLabel
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(event)
    return acc
  }, {})
}

export const isSimpleBlockEvent = (event: RawScheduleEvent): boolean => {
  if (event.esBloque || event.spanAllRooms) {
    return true
  }

  const text = event.actividad
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  return /(break|almuerzo|registro|acreditacion|inauguracion|receso|coffee)/.test(text)
}
