import type { APIRoute } from 'astro'

import scheduleData from '@/v2026/data/schedule.json'
import { enrichScheduleData, formatToUtcStamp } from '@/v2026/utils/schedule'

const events = enrichScheduleData(scheduleData)

export const getStaticPaths = async () => {
  return events.map((event) => ({
    params: { eventId: event.id },
  }))
}

const escapeIcs = (value: string): string => {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

export const GET: APIRoute = async ({ params, site }) => {
  const eventId = params.eventId

  if (!eventId) {
    return new Response('Missing event id', { status: 400 })
  }

  const event = events.find((item) => item.id === eventId)

  if (!event) {
    return new Response('Event not found', { status: 404 })
  }

  const dtStart = formatToUtcStamp(event.dateISO, event.startTime)
  const dtEnd = formatToUtcStamp(event.dateISO, event.endTime)
  const nowStamp = formatToUtcStamp(event.dateISO, event.startTime)

  const origin = site?.toString().replace(/\/$/, '') || 'https://flisol.bo'
  const uid = `${event.id}@flisol.bo`
  const url = `${origin}/#agenda`

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FLISOL Bolivia//Agenda 2026//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcs(event.actividad)}`,
    `DESCRIPTION:${escapeIcs(`Speaker: ${event.speaker}`)}`,
    `LOCATION:${escapeIcs(event.laboratorio)}`,
    `URL:${escapeIcs(url)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const filename = `${event.id}.ics`

  return new Response(icsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
