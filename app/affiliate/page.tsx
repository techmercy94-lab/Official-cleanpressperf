import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { TrendingUp, Users, Gift, BarChart3 } from 'lucide-react';

function AffiliatePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero */}
          <section className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Become a CleanPressperf Affiliate
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Earn 15% lifetime commission on every customer you refer. No limits, flexible promotions, and full tracking.
            </p>
            <Link
              href="/auth/sign-up?affiliate=true"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary transition"
            >
              Get Started Free
            </Link>
          </section>

          {/* Features */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-card border border-border rounded-lg p-6">
              <TrendingUp className="text-primary mb-4" size={32} />
              <h3 className="font-bold text-foreground mb-2">15% Commission</h3>
              <p className="text-sm text-muted-foreground">
                Earn 15% on every sale from customers you refer
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <Users className="text-primary mb-4" size={32} />
              <h3 className="font-bold text-foreground mb-2">Lifetime Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Track all referred customers for lifetime earnings
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <Gift className="text-primary mb-4" size={32} />
              <h3 className="font-bold text-foreground mb-2">Exclusive Perks</h3>
              <p className="text-sm text-muted-foreground">
                Access exclusive promotions and marketing materials
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <BarChart3 className="text-primary mb-4" size={32} />
              <h3 className="font-bold text-foreground mb-2">Real-Time Stats</h3>
              <p className="text-sm text-muted-foreground">
                Track clicks, conversions, and earnings in real-time
              </p>
            </div>
          </section>

          {/* How It Works */}
          <section className="bg-card border border-border rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold text-foreground mb-2">Sign Up</h3>
                <p className="text-sm text-muted-foreground">
                  Create your affiliate account and get your unique referral link
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold text-foreground mb-2">Promote</h3>
                <p className="text-sm text-muted-foreground">
                  Share your link on social media, blogs, or any platform
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold text-foreground mb-2">Earn</h3>
                <p className="text-sm text-muted-foreground">
                  Earn 15% commission on every sale from your referrals
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to start earning?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of affiliates earning passive income
            </p>
            <Link
              href="/auth/sign-up?affiliate=true"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary transition"
            >
              Create Free Account
            </Link>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AffiliatePage;
