'use client'

import { Card, CardContent } from '@/components/ui/card'

export function AffiliateEmptyState() {
  return (
    <div className="space-y-4 text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-full mb-4">
        <svg
          className="w-8 h-8 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6h6m0 0h6"
          />
        </svg>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Welcome to Your Affiliate Program!
        </h3>
        <p className="text-slate-400 max-w-md mx-auto">
          Your referral link and affiliate code will appear here once you start receiving referrals. Start sharing your unique link to begin earning commissions!
        </p>
      </div>
      <Card className="bg-slate-800 border-slate-700 mt-6 max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                ✓
              </div>
              <p className="text-sm text-slate-300">
                Your referral stats will update in real-time
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                ✓
              </div>
              <p className="text-sm text-slate-300">
                Earnings are calculated automatically
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                ✓
              </div>
              <p className="text-sm text-slate-300">
                Withdraw your earnings when ready
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
