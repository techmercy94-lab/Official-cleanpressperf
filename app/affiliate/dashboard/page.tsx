import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getSession } from '@/app/actions/auth';
import { getAffiliateStats, getAffiliateCommissions } from '@/app/actions/affiliate';
import { formatNaira } from '@/lib/utils-custom';
import { BarChart3, TrendingUp, Users, Wallet } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function AffiliateDashboard() {
  const session = await getSession();
  if (!session) {
    redirect('/auth/login');
  }

  const [stats, commissions] = await Promise.all([
    getAffiliateStats(session.id),
    getAffiliateCommissions(session.id),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Affiliate Dashboard</h1>
          <p className="text-muted-foreground">Track your earnings and referrals</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Clicks</p>
                <p className="text-2xl font-bold text-foreground">{stats?.totalClicks || 0}</p>
              </div>
              <BarChart3 className="text-primary" size={32} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Customers Referred</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.totalCustomersReferred || 0}
                </p>
              </div>
              <Users className="text-primary" size={32} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Earnings</p>
                <p className="text-2xl font-bold text-primary">
                  {formatNaira(stats?.pendingCommissions || 0)}
                </p>
              </div>
              <TrendingUp className="text-secondary" size={32} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-primary">
                  {formatNaira(stats?.paidCommissions || 0)}
                </p>
              </div>
              <Wallet className="text-primary" size={32} />
            </div>
          </div>
        </div>

        {/* Recent Commissions */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Recent Commissions</h2>
          </div>

          {commissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Commission
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {commissions.map((commission) => (
                    <tr key={commission.id} className="hover:bg-muted/20 transition">
                      <td className="px-6 py-4">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {commission.order_id.slice(0, 8)}...
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-primary">
                          {formatNaira(commission.commission_amount_naira)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            commission.status === 'paid'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : commission.status === 'approved'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}
                        >
                          {commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(commission.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No commissions yet. Start referring customers!</p>
            </div>
          )}
        </div>

        {/* Action Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Link
            href="/affiliate/settings"
            className="block p-6 bg-card border border-border rounded-lg hover:border-primary transition"
          >
            <h3 className="font-semibold text-foreground mb-2">Affiliate Settings</h3>
            <p className="text-sm text-muted-foreground">Manage your affiliate profile and links</p>
          </Link>

          <Link
            href="/affiliate/withdraw"
            className="block p-6 bg-card border border-border rounded-lg hover:border-primary transition"
          >
            <h3 className="font-semibold text-foreground mb-2">Request Withdrawal</h3>
            <p className="text-sm text-muted-foreground">Withdraw your earned commissions</p>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AffiliateDashboard;
