import parseApiError from './apiErrors'

export interface ApiError extends Error {
  field?: string
  status?: number
}

export async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<any> {
  const opts: RequestInit = init || {}
  // set JSON header if sending a body and header not present
  if (opts.body && opts.headers == null) {
    opts.headers = { 'Content-Type': 'application/json' }
  }

  const res = await fetch(input, opts)
  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const parsed = parseApiError(data)
    const err: ApiError = new Error(parsed.message) as ApiError
    if (parsed.field) err.field = parsed.field
    err.status = res.status
    throw err
  }

  return data
}

export default apiFetch
