'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShareButtons } from './share-buttons'

interface ReferralSectionProps {
  affiliateCode: string
  referralUrl: string
}

export function ReferralSection({
  affiliateCode,
  referralUrl,
}: ReferralSectionProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(affiliateCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Your Referral Link</h2>

      <div className="space-y-4">
        {/* Referral Link */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Referral Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={referralUrl}
              className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm text-white placeholder-slate-400"
            />
            <Button
              onClick={handleCopyLink}
              variant="secondary"
              size="sm"
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Affiliate Code */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Affiliate Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={affiliateCode}
              className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm font-mono text-white placeholder-slate-400"
            />
            <Button
              onClick={handleCopyCode}
              variant="secondary"
              size="sm"
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="pt-4 border-t border-slate-700">
          <p className="text-sm font-medium text-slate-300 mb-3">
            Share on Social Media
          </p>
          <ShareButtons referralUrl={referralUrl} affiliateCode={affiliateCode} />
        </div>
      </div>
    </div>
  )
}
