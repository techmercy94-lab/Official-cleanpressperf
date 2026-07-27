import { Suspense } from 'react'
import { ConfirmClient } from './confirm-client'

export const metadata = {
  title: 'Complete Affiliate Registration - CleanPressPerf',
}

export default function AffiliateConfirmPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <ConfirmClient />
    </Suspense>
  )
}
