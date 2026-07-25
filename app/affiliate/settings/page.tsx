'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getSession, getProfile } from '@/app/actions/auth';
import { getAffiliateProfile } from '@/app/actions/affiliate';
import Link from 'next/link';
import { Copy, Check } from 'lucide-react';

function AffiliateSettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const session = await getSession();
        if (!session) {
          window.location.href = '/auth/login';
          return;
        }

        const profileData = await getProfile();
        setUser(session);
        setProfile(profileData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const affiliateLink =
    profile?.affiliate_code &&
    `${typeof window !== 'undefined' ? window.location.origin : ''}/shop?ref=${profile.affiliate_code}`;

  const copyToClipboard = () => {
    if (affiliateLink) {
      navigator.clipboard.writeText(affiliateLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile?.is_affiliate) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Not an Affiliate Yet</h1>
            <p className="text-muted-foreground mb-8">Join the program to access your settings</p>
            <Link
              href="/auth/sign-up?affiliate=true"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary transition"
            >
              Become an Affiliate
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Affiliate Settings</h1>
          <p className="text-muted-foreground">Manage your affiliate profile and referral links</p>
        </div>

        {/* Profile Info */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Profile Information</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Username</label>
              <p className="font-semibold text-foreground">{profile.affiliate_username}</p>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Affiliate Code</label>
              <div className="flex items-center gap-2 mt-2">
                <code className="flex-1 bg-muted px-4 py-2 rounded font-mono text-sm">
                  {profile.affiliate_code}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(profile.affiliate_code);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-2 hover:bg-muted rounded transition"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Bio</label>
              <p className="text-foreground">{profile.bio || 'No bio added yet'}</p>
            </div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Your Referral Link</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Referral URL</label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={affiliateLink}
                  readOnly
                  className="flex-1 bg-muted px-4 py-2 rounded text-sm font-mono"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded hover:bg-secondary transition flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-muted/30 border border-border rounded p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Share this link on social media, blogs, or anywhere to start earning 15% on every
                sale!
              </p>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/affiliate/dashboard"
            className="block p-6 bg-card border border-border rounded-lg hover:border-primary transition text-center"
          >
            <h3 className="font-semibold text-foreground mb-2">Back to Dashboard</h3>
          </Link>

          <Link
            href="/affiliate/withdraw"
            className="block p-6 bg-card border border-border rounded-lg hover:border-primary transition text-center"
          >
            <h3 className="font-semibold text-foreground mb-2">Request Withdrawal</h3>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AffiliateSettingsPage;
