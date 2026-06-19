import type { FilterState } from '@/lib/types'

function cleanFilters(filters: FilterState): FilterState {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => {
      if (value === undefined || value === null || value === '') return false
      if (Array.isArray(value) && value.length === 0) return false
      return true
    })
  )
}

export function serializeFilters(filters: FilterState): string {
  const cleaned = cleanFilters(filters)
  if (Object.keys(cleaned).length === 0) return ''
  return encodeURIComponent(JSON.stringify(cleaned))
}

export function parseSerializedFilters(value: string | null): FilterState {
  if (!value) return {}

  try {
    return JSON.parse(value) as FilterState
  } catch {
    try {
      return JSON.parse(decodeURIComponent(value)) as FilterState
    } catch {
      return {}
    }
  }
}

export function createFilteredHref(path: string, filters: FilterState): string {
  const serialized = serializeFilters(filters)
  return serialized ? `${path}?filters=${serialized}` : path
}

export function mergeFilterState(base: FilterState, next: FilterState): FilterState {
  return cleanFilters({ ...base, ...next })
}
