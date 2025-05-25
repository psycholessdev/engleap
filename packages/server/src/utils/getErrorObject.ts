export function getErrorObject(message: string, options?: Record<string, string>) {
  return { reason: message, ...options }
}
