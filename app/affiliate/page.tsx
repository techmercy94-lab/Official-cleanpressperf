'use client'

import { useEffect } from 'react'
import { useAuth } from '@/app/providers'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AffiliatePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const checkAffiliateStatus = async () => {
      if (loading) return

      // Guest user -> redirect to login
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Logged in user -> check if affiliate
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('affiliates')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (error && error.code === 'PGRST116') {
          // Non-affiliate -> redirect to register
          router.push('/affiliate/register')
        } else if (data) {
          // Affiliate -> redirect to dashboard
          router.push('/affiliate/dashboard')
        } else {
          // No affiliate profile, redirect to register
          router.push('/affiliate/register')
        }
      } catch (err) {
        console.error('Error checking affiliate status:', err)
        // On error, redirect to register
        router.push('/affiliate/register')
      }
    }

    checkAffiliateStatus()
  }, [user, loading, router])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
        <p>Redirecting...</p>
      </div>
    </div>
  )
}
