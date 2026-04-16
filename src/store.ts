import { atom } from 'nanostores'

const currentYear = new Date().getFullYear()

export const selectedYear = atom(currentYear || '2025')
