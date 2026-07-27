'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/providers'
import { createClient } from '@/lib/supabase/client'
import { LogoutButton } from '@/components/logout-button'
import { ReferralSection } from '@/components/referral-section'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
}

function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-400">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}

export default function AffiliateDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<AffiliateProfile | null>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No affiliate profile found, redirect to register
          router.push('/affiliate/register')
          return
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

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700">
          <CardContent className="pt-6 text-center">
            <p className="text-slate-300 mb-4">
              Unable to load your affiliate profile.
            </p>
            <button
              onClick={loadAffiliateProfile}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const referralUrl = `https://official-cleanpressperf.vercel.app/?ref=${profile.affiliate_code}`

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-800/50 backdrop-blur sticky top-0">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">{user.email}</p>
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

        <div className="space-y-8">
          {/* Stats Grid */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard
                title="Total Referrals"
                value={profile.total_referrals}
              />
              <StatCard
                title="Active Referrals"
                value={profile.active_referrals}
              />
              <StatCard
                title="Total Earnings"
                value={`$${(profile.total_commission / 100).toFixed(2)}`}
              />
              <StatCard
                title="Pending Earnings"
                value={`$${(profile.pending_commission / 100).toFixed(2)}`}
              />
              <StatCard
                title="Available Balance"
                value={`$${(profile.available_balance / 100).toFixed(2)}`}
              />
            </div>
          </section>

          {/* Referral Section */}
          <section>
            <ReferralSection
              affiliateCode={profile.affiliate_code}
              referralUrl={referralUrl}
            />
          </section>

          {/* Quick Start Guide */}
          <section className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">How to Maximize Your Earnings</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-300">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                    1
                  </div>
                  <p className="font-medium text-white">Share Your Link</p>
                </div>
                <p>Copy your referral link and share it on social media, email, or messaging apps.</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                    2
                  </div>
                  <p className="font-medium text-white">Track Referrals</p>
                </div>
                <p>Monitor your referral stats and earnings in real-time from your dashboard.</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                    3
                  </div>
                  <p className="font-medium text-white">Withdraw Earnings</p>
                </div>
                <p>Withdraw your available balance once you reach the minimum threshold.</p>
              </div>
            </div>
          </section>

          {/* Withdrawals Info */}
          <section className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">Withdrawal History</h3>
            <p className="text-slate-400 text-sm">
              Total Withdrawals: <span className="text-white font-semibold">${(profile.total_withdrawals / 100).toFixed(2)}</span>
            </p>
            <p className="text-slate-400 text-sm mt-2">
              You can withdraw your available balance once you reach a minimum of $50. Withdrawals are processed within 5-7 business days.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
