/**
 * Utility functions
 */

import clsx, { type ClassValue } from 'clsx'

/**
 * Merge class names with clsx
 */
export function cn(...classes: ClassValue[]): string {
  return clsx(classes)
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

/**
 * Format decimal numbers to fixed precision
 */
export function formatDecimal(num: number | null, precision: number = 2): string {
  if (num === null || num === undefined) return 'N/A'
  return Number(num).toFixed(precision)
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Capitalize string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert snake_case to Title Case
 */
export function snakeCaseToTitleCase(str: string): string {
  return str
    .split('_')
    .map(word => capitalize(word))
    .join(' ')
}

/**
 * Check if value is empty
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}
