import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Verify Email - CleanPressPerf',
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>
              We sent a confirmation link to your email address
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800 border border-blue-200">
                <p className="font-medium mb-2">Verify Your Email</p>
                <p>
                  Click the confirmation link in the email we just sent you to complete your registration and access your account.
                </p>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>If you don&apos;t see the email in your inbox:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Check your spam or junk folder</li>
                  <li>Make sure you entered the correct email address</li>
                  <li>Try signing up again if after 15 minutes you still haven&apos;t received it</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
