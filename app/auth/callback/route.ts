import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/account'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id, is_affiliate')
          .eq('id', user.id)
          .maybeSingle()
          .catch(() => ({ data: null }))

        // If profile doesn't exist, create it
        if (!existingProfile) {
          await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              created_at: new Date().toISOString(),
            })
            .catch((err) => {
              console.error('Error creating profile:', err)
            })
        }

        // Check user metadata for affiliate status
        const isAffiliate = user.user_metadata?.is_affiliate || existingProfile?.is_affiliate
        const redirectPath = isAffiliate ? '/affiliate/dashboard' : next
        
        return NextResponse.redirect(`${origin}${redirectPath}`)
      }
      
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
