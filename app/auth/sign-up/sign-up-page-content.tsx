'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { SignUpForm } from './sign-up-form'
import { UpgradeForm } from './upgrade-form'

export function SignUpPageContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAffiliateMode, setIsAffiliateMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const affiliate = searchParams.get('affiliate')

      if (affiliate === 'true') {
        setIsAffiliateMode(true)
      }

      if (session) {
        setIsLoggedIn(true)
      }

      setLoading(false)
    }

    checkSession()
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="rounded-lg border bg-card p-6">
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If logged in and affiliate=true, show upgrade form
  if (isLoggedIn && isAffiliateMode) {
    return <UpgradeForm />
  }

  // Otherwise show signup form
  return <SignUpForm />
}
