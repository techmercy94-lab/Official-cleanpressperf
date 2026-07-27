'use client'

import { useState } from 'react'
import { useAuth } from '@/app/providers'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AffiliateProfile {
  id: string
  user_id: string
  affiliate_code: string
  total_referrals: number
  active_referrals: number
  total_commission: number
  pending_commission: number
  available_balance: number
  total_withdrawals: number
}

export default function AffiliateUpgradePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const generateAffiliateCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const handleUpgradeToAffiliate = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      setError(null)

      const supabase = createClient()

      // Check if already an affiliate
      const { data: existingProfile } = await supabase
        .from('affiliates')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (existingProfile) {
        // Already an affiliate, redirect to dashboard
        router.push('/affiliate/dashboard')
        return
      }

      // Create new affiliate profile
      const newProfile: AffiliateProfile = {
        id: crypto.randomUUID(),
        user_id: user.id,
        affiliate_code: generateAffiliateCode(),
        total_referrals: 0,
        active_referrals: 0,
        total_commission: 0,
        pending_commission: 0,
        available_balance: 0,
        total_withdrawals: 0,
      }

      const { error: insertError } = await supabase
        .from('affiliates')
        .insert([newProfile])

      if (insertError) {
        console.error('Insert error:', insertError)
        setError('Failed to create affiliate account. Please try again.')
        return
      }

      // Refresh user session to update affiliate status
      await supabase.auth.refreshSession()

      // Redirect to dashboard
      router.push('/affiliate/dashboard')
    } catch (err) {
      console.error('Error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Become an Affiliate</CardTitle>
          <CardDescription className="text-slate-400">
            Start earning commission on every referral
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p>Get a unique referral link and affiliate code</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p>Earn commission on every successful referral</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p>Track performance with real-time analytics</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p>Easy withdrawal of earnings</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-700 rounded p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={handleUpgradeToAffiliate}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Creating Account...' : 'Activate Affiliate Account'}
            </Button>

            <p className="text-xs text-slate-400 text-center">
              By activating, you agree to our affiliate terms and conditions
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
