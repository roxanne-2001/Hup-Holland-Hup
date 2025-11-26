export function parseApiError(data: any): { field?: string; message: string } {
  if (!data) return { message: 'Er is iets misgegaan' }

  if (typeof data === 'object') {
    if (data.field && data.message) return { field: String(data.field), message: String(data.message) }
    if (data.message) return { message: String(data.message) }
    if (data.error) return { message: String(data.error) }
  }

  return { message: String(data) || 'Onbekende fout' }
}

export default parseApiError
