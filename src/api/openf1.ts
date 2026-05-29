import type {
  Driver,
  Lap,
  Meeting,
  PositionRecord,
  Session,
  SessionResult,
  Stint,
} from '@/types/f1'

const BASE_URL = 'https://api.openf1.org/v1'
const MAX_REINTENTOS = 4

type QueryValue = string | number | boolean

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function get<T>(endpoint: string, params: Record<string, QueryValue> = {}): Promise<T[]> {
  const url = new URL(`${BASE_URL}/${endpoint}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value))
  }

  for (let intento = 0; ; intento++) {
    const res = await fetch(url.toString())

    // 429 = rate limit de OpenF1. Reintentamos respetando Retry-After si viene,
    // o con backoff exponencial (1s, 2s, 4s…).
    if (res.status === 429 && intento < MAX_REINTENTOS) {
      const retryAfter = Number(res.headers.get('Retry-After'))
      const esperaMs = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : 2 ** intento * 1000
      await sleep(esperaMs)
      continue
    }

    if (!res.ok) {
      throw new Error(
        res.status === 429
          ? 'OpenF1 está limitando las consultas (429). Probá de nuevo en unos segundos.'
          : `OpenF1 ${endpoint} respondió ${res.status}`,
      )
    }
    return (await res.json()) as T[]
  }
}

/** Eventos (Grandes Premios) de un año. */
export function getMeetings(year: number): Promise<Meeting[]> {
  return get<Meeting>('meetings', { year })
}

/** Sesión de carrera de un evento, o null si no existe (ej. tests de pretemporada). */
export async function getRaceSession(meetingKey: number): Promise<Session | null> {
  const sessions = await get<Session>('sessions', {
    meeting_key: meetingKey,
    session_name: 'Race',
  })
  return sessions[0] ?? null
}

/** Pilotos que participaron en una sesión. */
export function getDrivers(sessionKey: number): Promise<Driver[]> {
  return get<Driver>('drivers', { session_key: sessionKey })
}

/** Clasificación final de una sesión. */
export function getSessionResult(sessionKey: number): Promise<SessionResult[]> {
  return get<SessionResult>('session_result', { session_key: sessionKey })
}

/** Vueltas de un piloto en una sesión. */
export function getLaps(sessionKey: number, driverNumber: number): Promise<Lap[]> {
  return get<Lap>('laps', { session_key: sessionKey, driver_number: driverNumber })
}

/** Cambios de posición (con timestamp) de un piloto en una sesión. */
export function getPositions(sessionKey: number, driverNumber: number): Promise<PositionRecord[]> {
  return get<PositionRecord>('position', {
    session_key: sessionKey,
    driver_number: driverNumber,
  })
}

/** Stints de neumáticos de un piloto en una sesión. */
export function getStints(sessionKey: number, driverNumber: number): Promise<Stint[]> {
  return get<Stint>('stints', { session_key: sessionKey, driver_number: driverNumber })
}
