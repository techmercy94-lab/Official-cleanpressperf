export async function registerAsAffiliate(
  userId: string,
  username?: string,
  bio?: string
) {
  const supabase = await createClient()

  // Check whether profile exists
  const { data: currentProfile, error: profileError } = await supabase
    .from('profiles')
    .select('is_affiliate, affiliate_username')
    .eq('id', userId)
    .maybeSingle()

  // Profile should already exist after sign-up
  if (profileError || !currentProfile) {
    return {
      error: 'Profile not found. Please sign in again.',
    }
  }

  if (currentProfile.is_affiliate) {
    return {
      success: true,
      affiliateCode: null,
      message: 'User is already an affiliate',
    }
  }

  // Check if username is already taken
  if (username) {
    const { data: existing } = await supabase
      .from('profiles')
      .select('affiliate_username')
      .eq('affiliate_username', username)
      .maybeSingle()

    if (existing) {
      return {
        error: 'Username already taken',
      }
    }
  }

  const affiliateCode = generateAffiliateCode()

  const { error } = await supabase
    .from('profiles')
    .update({
      is_affiliate: true,
      affiliate_username: username || null,
      affiliate_code: affiliateCode,
      bio: bio || null,
    })
    .eq('id', userId)

  if (error) {
    console.error('Error registering as affiliate:', error)
    return {
      error: error.message,
    }
  }

  return {
    success: true,
    affiliateCode,
  }
}
