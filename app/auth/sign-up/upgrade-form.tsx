'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { registerAsAffiliate } from '@/app/actions/affiliate'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function UpgradeForm() {
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        // Not logged in, redirect to signup
        router.push('/auth/sign-up?affiliate=true')
        return
      }

      setLoading(false)
    }

    checkSession()
  }, [router])

  const handleUpgrade = async () => {
    setUpgrading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setError('Session expired. Please login again.')
        router.push('/auth/login')
        return
      }

      await registerAsAffiliate(session.user.id)
      router.push('/affiliate')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to upgrade account')
      setUpgrading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Upgrade to Affiliate</CardTitle>
              <CardDescription>
                Upgrade your account to start earning 15% commission on every sale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm text-blue-800">
                  Your existing account will be upgraded to affiliate status. You&apos;ll keep all your current data and history.
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded p-4 text-sm text-red-800">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  className="w-full"
                >
                  {upgrading ? 'Upgrading...' : 'Upgrade to Affiliate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
