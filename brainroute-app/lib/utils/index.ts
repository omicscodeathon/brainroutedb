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

/**
 * Format bin names for display (e.g., tpsa_le_60 -> TPSA ≤ 60)
 */
export function formatBinName(bin: string): string {
  // tpsa_le_60 -> TPSA ≤ 60
  // tpsa_60_90 -> TPSA 60-90
  // tpsa_90_140 -> TPSA 90-140
  // tpsa_gt_140 -> TPSA > 140
  // logp_lt_1 -> LogP < 1
  // logp_1_3 -> LogP 1-3
  // logp_3_5 -> LogP 3-5
  // logp_gt_5 -> LogP > 5

  if (bin.startsWith('tpsa_')) {
    const part = bin.replace('tpsa_', '')
    if (part === 'le_60') return 'TPSA ≤ 60'
    if (part === '60_90') return 'TPSA 60-90'
    if (part === '90_140') return 'TPSA 90-140'
    if (part === 'gt_140') return 'TPSA > 140'
  }

  if (bin.startsWith('logp_')) {
    const part = bin.replace('logp_', '')
    if (part === 'lt_1') return 'LogP < 1'
    if (part === '1_3') return 'LogP 1-3'
    if (part === '3_5') return 'LogP 3-5'
    if (part === 'gt_5') return 'LogP > 5'
  }

  if (bin.startsWith('mw_')) {
    const part = bin.replace('mw_', '')
    if (part === 'lt_300') return 'MW < 300'
    if (part === '300_450') return 'MW 300-450'
    if (part === '450_500') return 'MW 450-500'
    if (part === 'gt_500') return 'MW > 500'
  }

  return bin
}
