type ViteImportMeta = ImportMeta & {
  env?: {
    BASE_URL?: string
  }
}

const viteMeta = import.meta as ViteImportMeta

export const baseUrl = viteMeta.env?.BASE_URL ?? '/'

export const normalizedBasePath = baseUrl === '/'
  ? ''
  : baseUrl.replace(/\/$/, '')

export const apiBasePath = normalizedBasePath
  ? `${normalizedBasePath}/api`
  : '/api'
