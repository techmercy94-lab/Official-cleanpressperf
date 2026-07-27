'use client'

import { signUp, registerAsAffiliate } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export function SignUpForm() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [isAffiliateSignup, setIsAffiliateSignup] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')
    const affiliate = searchParams.get('affiliate')

    if (ref) {
      setReferralCode(ref)
    }

    if (affiliate === 'true') {
      setIsAffiliateSignup(true)
    }
  }, [searchParams])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (isAffiliateSignup && username.trim().length < 3) {
      setError('Affiliate username must be at least 3 characters long')
      setIsLoading(false)
      return
    }

    try {
      // Use server action for signup
      const result = await signUp(
        email.trim().toLowerCase(),
        password,
        username,
        referralCode || undefined
      )

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      if (!result.data?.user) {
        setError('Signup failed: Account was not created properly')
        setIsLoading(false)
        return
      }

      const data = result.data

      // For affiliate signup, register as affiliate
      if (isAffiliateSignup && data.user) {
        const affiliateUsername = username
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, '')

        const affiliateResult = await registerAsAffiliate(
          data.user.id,
          affiliateUsername
        )

        if (affiliateResult?.success) {
          router.push('/affiliate/dashboard')
        } else {
          setError(affiliateResult?.error || 'Failed to register as affiliate')
          setIsLoading(false)
          return
        }
      } else {
        // Regular signup - redirect to account
        router.push('/account')
      }
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : 'An error occurred'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {isAffiliateSignup
                  ? 'Become an Affiliate'
                  : 'Join CleanPressperf'}
              </CardTitle>

              <CardDescription>
                {isAffiliateSignup
                  ? 'Create your affiliate account and start earning 15% on every sale'
                  : 'Create your account and start your journey to earning premium commissions'}
              </CardDescription>

              {referralCode && (
                <div className="mt-2 rounded border border-green-200 bg-green-50 p-2 text-sm text-green-800">
                  Joining via affiliate link:{' '}
                  <strong>{referralCode}</strong>. You&apos;ll be permanently
                  linked to this affiliate.
                </div>
              )}

              {isAffiliateSignup && (
                <div className="mt-2 rounded border border-blue-200 bg-blue-50 p-2 text-sm text-blue-800">
                  You&apos;re signing up as an affiliate. After registration,
                  you&apos;ll be able to start earning immediately.
                </div>
              )}
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-6">

                  {isAffiliateSignup && (
                    <div className="grid gap-2">
                      <Label htmlFor="username">
                        Affiliate Username
                      </Label>

                      <Input
                        id="username"
                        type="text"
                        placeholder="e.g. perfume_by_mercy"
                        required
                        value={username}
                        onChange={(e) =>
                          setUsername(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9_]/g, '')
                          )
                        }
                      />

                      <p className="text-xs text-muted-foreground">
                        Use letters, numbers, and underscores only.
                      </p>
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="email">
                      Email
                    </Label>

                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">
                      Password
                    </Label>

                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password">
                      Repeat Password
                    </Label>

                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) =>
                        setRepeatPassword(e.target.value)
                      }
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-500">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? 'Creating an account...'
                      : 'Sign up'}
                  </Button>
                </div>

                <div className="mt-4 text-center text-sm">
                  Already have an account?{' '}

                  <Link
                    href="/auth/login"
                    className="underline underline-offset-4"
                  >
                    Login
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
