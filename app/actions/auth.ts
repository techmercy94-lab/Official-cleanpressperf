'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  let { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  // If profile doesn't exist, create it automatically
  if (!data && !error) {
    const { error: createError, data: newProfile } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
      })
      .select()
      .maybeSingle();

    if (!createError) {
      return newProfile;
    }
  }

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function updateProfile(
  userId: string,
  updates: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    profile_image_url?: string;
    bio?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error);
    return { error };
  }

  return { success: true };
}

export async function createUserProfile(userId: string, email: string) {
  const supabase = await createClient();

  // Check if profile already exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (existing) {
    return { success: true };
  }

  // Create profile for new user
  const { error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email,
    });

  if (error && !error.message?.includes('duplicate')) {
    console.error('Error creating profile:', error);
    return { error: error.message };
  }

  return { success: true };
}

export async function signUp(email: string, password: string, firstName?: string, affiliateCode?: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
      data: {
        first_name: firstName || '',
        affiliate_code: affiliateCode || null,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Create profile immediately after signup (don't wait for trigger)
  if (data.user) {
    await createUserProfile(data.user.id, email).catch(err => {
      console.error('Profile creation failed (non-blocking):', err);
    });

    // Track affiliate referral if affiliate code provided
    if (affiliateCode) {
      const { data: affiliate } = await supabase
        .from('profiles')
        .select('id')
        .eq('affiliate_code', affiliateCode)
        .maybeSingle()
        .catch(() => ({ data: null }));

      if (affiliate) {
        await supabase.from('affiliate_customers').insert({
          affiliate_id: affiliate.id,
          customer_id: data.user.id,
          referral_source: 'signup_link',
        }).catch(() => null);
      }
    }
  }

  return { data };
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
