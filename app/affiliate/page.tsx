'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/providers'
import { createClient } from '@/lib/supabase/client'
import { LogoutButton } from '@/components/logout-button'
import { ReferralSection } from '@/components/referral-section'
import { AffiliateStats } from '@/components/affiliate-stats'
import { useRouter } from 'next/navigation'

interface AffiliateProfile {
  id: string
  user_id: string
  affiliate_code: string
  total_referrals: number
  active_referrals: number
  total_commission: number
  pending_commission: number
}

export default function AffiliateDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<AffiliateProfile | null>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (user) {
      loadAffiliateProfile()
    }
  }, [user, loading, router])

  const loadAffiliateProfile = async () => {
    try {
      setPageLoading(true)
      setError(null)

      // Fetch affiliate profile
      const { data, error: fetchError } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No profile exists, create one with default values
          const newProfile: AffiliateProfile = {
            id: crypto.randomUUID(),
            user_id: user!.id,
            affiliate_code: generateAffiliateCode(),
            total_referrals: 0,
            active_referrals: 0,
            total_commission: 0,
            pending_commission: 0,
          }

          const { error: insertError } = await supabase
            .from('affiliates')
            .insert([newProfile])

          if (insertError) {
            console.error('Insert error:', insertError)
            setError(
              'Failed to create affiliate profile. Please try again.'
            )
          } else {
            setProfile(newProfile)
          }
        } else {
          console.error('Fetch error:', fetchError)
          setError('Failed to load affiliate profile.')
        }
      } else {
        setProfile(data)
      }
    } catch (err) {
      console.error('Error:', err)
      setError('An unexpected error occurred.')
    } finally {
      setPageLoading(false)
    }
  }

  const generateAffiliateCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
          <p>Loading your affiliate dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-800/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Welcome, {user.email}
            </p>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-200">
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {profile ? (
          <div className="space-y-8">
            {/* Stats */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Your Performance</h2>
              <AffiliateStats
                totalReferrals={profile.total_referrals}
                activeReferrals={profile.active_referrals}
                totalCommission={profile.total_commission}
                pendingCommission={profile.pending_commission}
              />
            </section>

            {/* Referral Section */}
            <section>
              <ReferralSection
                affiliateCode={profile.affiliate_code}
                referralUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/signup?ref=${profile.affiliate_code}`}
              />
            </section>

            {/* Additional Info */}
            <section className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">How It Works</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-300">
                <div>
                  <p className="font-medium text-white mb-1">1. Share Your Link</p>
                  <p>Share your unique referral link with friends and followers</p>
                </div>
                <div>
                  <p className="font-medium text-white mb-1">
                    2. They Sign Up
                  </p>
                  <p>
                    Your referrals sign up using your link or affiliate code
                  </p>
                </div>
                <div>
                  <p className="font-medium text-white mb-1">
                    3. You Earn Commission
                  </p>
                  <p>Earn commission on every successful referral</p>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
            <p className="text-slate-300">
              Unable to load your affiliate profile. Please try refreshing the
              page.
            </p>
            <button
              onClick={loadAffiliateProfile}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
