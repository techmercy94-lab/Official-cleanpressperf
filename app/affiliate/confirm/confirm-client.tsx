'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { registerAsAffiliate } from '@/app/actions/affiliate'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ConfirmClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const userId = searchParams.get('userId')
  const username = searchParams.get('username')

  useEffect(() => {
    if (!userId || !username) {
      router.push('/auth/sign-up')
      return
    }

    const registerAffiliate = async () => {
      setIsLoading(true)
      try {
        const result = await registerAsAffiliate(userId, username)
        
        if (result?.error) {
          setError(typeof result.error === 'string' ? result.error : 'Failed to register as affiliate')
          return
        }

        setSuccess(true)
        setTimeout(() => {
          router.push('/affiliate/dashboard')
        }, 2000)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    registerAffiliate()
  }, [userId, username, router])

  if (!userId || !username) {
    return null
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {success ? 'Welcome to CleanPressPerf Affiliates!' : 'Completing Registration'}
            </CardTitle>
            <CardDescription>
              {success ? 'Your affiliate account is ready' : 'Setting up your affiliate account...'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {isLoading && (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}

              {success && (
                <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800 border border-green-200">
                  <p className="font-medium mb-2">Affiliate Account Created!</p>
                  <p>Your username: <strong>{username}</strong></p>
                  <p className="mt-2 text-xs">Redirecting to your dashboard...</p>
                </div>
              )}

              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
                  <p className="font-medium mb-1">Registration Error</p>
                  <p>{error}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 w-full"
                    onClick={() => router.push('/auth/sign-up?affiliate=true')}
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
