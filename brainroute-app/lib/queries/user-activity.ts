import { supabase } from '@/lib/supabase/client'
import type { FilterState } from '@/lib/types'

const LIMIT = 20

async function getRows<T>(table: string, userId: string): Promise<T[]> {
  if (!userId) return []

  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(LIMIT)

    if (error) throw error

    return (data as T[]) || []
  } catch (error) {
    console.error(`Failed to fetch ${table}:`, error)
    return []
  }
}

export function getMyPredictionRuns(userId: string) {
  return getRows<Record<string, any>>('user_prediction_runs', userId)
}

export function getMyPredictionBatches(userId: string) {
  return getRows<Record<string, any>>('prediction_batches', userId)
}

export function getMyDownloadEvents(userId: string) {
  return getRows<Record<string, any>>('download_events', userId)
}

export function getMyVerificationSubmissions(userId: string) {
  return getRows<Record<string, any>>('verification_submissions', userId)
}

export async function logDownloadEvent({
  userId,
  downloadType,
  filterState,
  recordCount,
}: {
  userId: string
  downloadType: string
  filterState: FilterState
  recordCount?: number
}) {
  if (!userId) return false

  try {
    const { error } = await supabase.from('download_events').insert({
      user_id: userId,
      download_type: downloadType,
      source_app: 'brainroutedb',
      filter_state: filterState,
      record_count: recordCount,
    })

    if (error) throw error

    return true
  } catch (error) {
    console.error('Failed to log download event:', error)
    return false
  }
}
