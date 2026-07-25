import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getAdminStats, getAdminOrders, getAdminCommissions } from '@/app/actions/admin';
import { formatNaira } from '@/lib/utils-custom';
import { BarChart3, Users, ShoppingCart, Wallet } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

async function AdminDashboard() {
  const [stats, orders, commissions] = await Promise.all([
    getAdminStats(),
    getAdminOrders(5),
    getAdminCommissions('pending'),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage orders, affiliates, and commissions</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="text-primary" size={32} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
              </div>
              <Users className="text-primary" size={32} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Affiliates</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalAffiliates}</p>
              </div>
              <Users className="text-secondary" size={32} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-xl font-bold text-primary">{formatNaira(stats.totalRevenue)}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending Commissions</p>
              <p className="text-xl font-bold text-primary">
                {formatNaira(stats.totalPendingCommissions)}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/admin/orders"
            className="block p-6 bg-card border border-border rounded-lg hover:border-primary transition"
          >
            <BarChart3 className="text-primary mb-4" size={32} />
            <h3 className="font-semibold text-foreground mb-2">Manage Orders</h3>
            <p className="text-sm text-muted-foreground">View and manage customer orders</p>
          </Link>

          <Link
            href="/admin/commissions"
            className="block p-6 bg-card border border-border rounded-lg hover:border-primary transition"
          >
            <Wallet className="text-secondary mb-4" size={32} />
            <h3 className="font-semibold text-foreground mb-2">Approve Commissions</h3>
            <p className="text-sm text-muted-foreground">Review and pay affiliate commissions</p>
          </Link>

          <Link
            href="/admin/withdrawals"
            className="block p-6 bg-card border border-border rounded-lg hover:border-primary transition"
          >
            <Wallet className="text-accent mb-4" size={32} />
            <h3 className="font-semibold text-foreground mb-2">Manage Withdrawals</h3>
            <p className="text-sm text-muted-foreground">Process affiliate withdrawal requests</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
            <Link href="/admin/orders" className="text-primary hover:text-secondary text-sm font-semibold">
              View All
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Total
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
                  {orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-muted/20 transition">
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="font-semibold text-foreground">
                            {order.user?.first_name} {order.user?.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary">
                        {formatNaira(order.total_amount_naira)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'paid'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          )}
        </div>

        {/* Pending Commissions */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-bold text-foreground">Pending Commissions</h2>
            <Link href="/admin/commissions" className="text-primary hover:text-secondary text-sm font-semibold">
              View All
            </Link>
          </div>

          {commissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Affiliate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {commissions.slice(0, 5).map((commission: any) => (
                    <tr key={commission.id} className="hover:bg-muted/20 transition">
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">
                        {commission.affiliate?.affiliate_username}
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary">
                        {formatNaira(commission.commission_amount_naira)}
                      </td>
                      <td className="px-6 py-4 text-sm">{commission.commission_rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No pending commissions</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AdminDashboard;
