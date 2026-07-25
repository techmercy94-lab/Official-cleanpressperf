import { Suspense } from 'react'
import { SignUpForm } from './sign-up-form'
import { SignUpPageContent } from './sign-up-page-content'

function SignUpFallback() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="space-y-2">
              <div className="h-8 bg-muted rounded animate-pulse"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<SignUpFallback />}>
      <SignUpPageContent />
    </Suspense>
  )
}
