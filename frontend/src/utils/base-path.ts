export const baseUrl = import.meta.env.BASE_URL ?? '/'

export const normalizedBasePath = baseUrl === '/'
  ? ''
  : baseUrl.replace(/\/$/, '')

export const apiBasePath = normalizedBasePath
  ? `${normalizedBasePath}/api`
  : '/api'
