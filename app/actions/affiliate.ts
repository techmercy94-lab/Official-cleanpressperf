'use server'

import { createClient } from '@/lib/supabase/server'

function generateAffiliateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

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
export async function getAffiliateStats(affiliateId: string) {
  const supabase = await createClient()

  const { count: clicksCount } = await supabase
    .from('affiliate_clicks')
    .select('*', { count: 'exact', head: true })
    .eq('affiliate_id', affiliateId)

  const { count: customersCount } = await supabase
    .from('affiliate_customers')
    .select('*', { count: 'exact', head: true })
    .eq('affiliate_id', affiliateId)

  const { data: commissionsData } = await supabase
    .from('commissions')
    .select('commission_amount_naira, status')
    .eq('affiliate_id', affiliateId)

  const totalCommissions =
    commissionsData?.reduce((sum, c) => sum + c.commission_amount_naira, 0) || 0

  const paidCommissions =
    commissionsData
      ?.filter((c) => c.status === 'paid')
      .reduce((sum, c) => sum + c.commission_amount_naira, 0) || 0

  const pendingCommissions =
    commissionsData
      ?.filter((c) => c.status === 'pending')
      .reduce((sum, c) => sum + c.commission_amount_naira, 0) || 0

  return {
    totalClicks: clicksCount || 0,
    totalCustomersReferred: customersCount || 0,
    totalCommissions,
    paidCommissions,
    pendingCommissions,
  }
}

export async function getAffiliateCommissions(affiliateId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('commissions')
    .select('*, order:orders(*)')
    .eq('affiliate_id', affiliateId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching commissions:', error)
    return []
  }

  return data || []
}

export async function requestWithdrawal(
  affiliateId: string,
  amount: number,
  bankName: string,
  accountNumber: string,
  accountHolder: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('withdrawal_requests')
    .insert({
      affiliate_id: affiliateId,
      amount_naira: amount,
      bank_name: bankName,
      bank_account_number: accountNumber,
      account_holder_name: accountHolder,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating withdrawal request:', error)
    return { error }
  }

  return { data }
}

export async function getAffiliateWithdrawals(affiliateId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('withdrawal_requests')
    .select('*')
    .eq('affiliate_id', affiliateId)
    .order('requested_at', { ascending: false })

  if (error) {
    console.error('Error fetching withdrawals:', error)
    return []
  }

  return data || []
}
