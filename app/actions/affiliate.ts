export async function registerAsAffiliate(
  userId: string,
  username: string,
  bio?: string
) {
  const supabase = await createClient()

  // Check whether this user is already an affiliate
  const { data: currentProfile, error: profileError } = await supabase
    .from('profiles')
    .select('is_affiliate, affiliate_username')
    .eq('id', userId)
    .single()

  if (profileError) {
    console.error('Error finding user profile:', profileError)
    return { error: 'User profile not found' }
  }

  if (currentProfile?.is_affiliate) {
    return {
      success: true,
      affiliateCode: null,
      message: 'User is already an affiliate',
    }
  }

  // Check if username is already taken
  const { data: existing } = await supabase
    .from('profiles')
    .select('affiliate_username')
    .eq('affiliate_username', username)
    .maybeSingle()

  if (existing) {
    return { error: 'Username already taken' }
  }

  const affiliateCode = generateAffiliateCode()

  const { error } = await supabase
    .from('profiles')
    .update({
      is_affiliate: true,
      affiliate_username: username,
      affiliate_code: affiliateCode,
      bio: bio || null,
    })
    .eq('id', userId)

  if (error) {
    console.error('Error registering as affiliate:', error)
    return { error: error.message }
  }

  return {
    success: true,
    affiliateCode,
  }
}
