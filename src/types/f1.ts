// Tipos de las respuestas de la API de OpenF1 (https://openf1.org).
// Solo se incluyen los campos que usa el dashboard.

export interface Meeting {
  meeting_key: number
  meeting_name: string
  meeting_official_name?: string
  year: number
  country_name: string
  location: string
  circuit_short_name?: string
  date_start?: string
}

export interface Session {
  session_key: number
  session_name: string
  session_type: string
  meeting_key: number
  year: number
  country_name: string
  circuit_short_name?: string
  date_start?: string
  date_end?: string
}

export interface Driver {
  driver_number: number
  full_name: string
  broadcast_name?: string
  name_acronym: string
  team_name: string
  team_colour: string
  headshot_url?: string
  session_key: number
  meeting_key: number
}

export interface SessionResult {
  position: number | null
  driver_number: number
  number_of_laps?: number
  points?: number
  dnf?: boolean
  dns?: boolean
  dsq?: boolean
  duration?: number | number[] | null
  gap_to_leader?: number | string | null
  session_key: number
  meeting_key: number
}

export interface Lap {
  driver_number: number
  lap_number: number
  lap_duration: number | null
  date_start: string | null
  session_key: number
}

export interface PositionRecord {
  date: string
  driver_number: number
  position: number
  session_key: number
}

export interface Stint {
  driver_number: number
  stint_number: number
  compound: string
  lap_start: number
  lap_end: number
  tyre_age_at_start: number | null
  session_key: number
  meeting_key: number
}
