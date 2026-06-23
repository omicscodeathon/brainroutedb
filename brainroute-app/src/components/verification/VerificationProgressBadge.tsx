import {
  getVerificationProgress,
  VERIFICATION_PROGRESS_LABELS,
  type VerificationSubmission,
  type VerificationProgress,
} from '@/lib/types/verification'

const PROGRESS_STYLES: Record<VerificationProgress, string> = {
  submitted: 'border-yellow-200 bg-yellow-50 text-yellow-800',
  in_review: 'border-blue-200 bg-blue-50 text-blue-800',
  accepted: 'border-green-200 bg-green-50 text-green-800',
  denied: 'border-red-200 bg-red-50 text-red-800',
  more_information_requested: 'border-purple-200 bg-purple-50 text-purple-800',
}

export function VerificationProgressBadge({
  submission,
}: {
  submission: Pick<VerificationSubmission, 'progress_status' | 'verified_by_admin'>
}) {
  const progress = getVerificationProgress(submission)

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${PROGRESS_STYLES[progress]}`}
    >
      {VERIFICATION_PROGRESS_LABELS[progress]}
    </span>
  )
}
