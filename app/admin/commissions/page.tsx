'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getAdminCommissions, approveCommission, payCommission } from '@/app/actions/admin';
import { formatNaira } from '@/lib/utils-custom';
import Link from 'next/link';

function AdminCommissionsPage() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadCommissions();
  }, [filter]);

  const loadCommissions = async () => {
    setLoading(true);
    try {
      const data = await getAdminCommissions(filter === 'all' ? undefined : filter);
      setCommissions(data);
    } catch (error) {
      console.error('Error loading commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (commissionId: string) => {
    setProcessing(commissionId);
    try {
      await approveCommission(commissionId);
      await loadCommissions();
    } catch (error) {
      console.error('Error approving commission:', error);
    } finally {
      setProcessing(null);
    }
  };

  const handlePay = async (commissionId: string) => {
    setProcessing(commissionId);
    try {
      await payCommission(commissionId);
      await loadCommissions();
    } catch (error) {
      console.error('Error paying commission:', error);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Manage Commissions</h1>
            <p className="text-muted-foreground">Approve and pay affiliate commissions</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="text-primary hover:text-secondary text-sm font-semibold"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['pending', 'approved', 'paid', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:border-primary'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Commissions Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : commissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Affiliate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Commission
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {commissions.map((commission) => (
                    <tr key={commission.id} className="hover:bg-muted/20 transition">
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">
                        {commission.affiliate?.affiliate_username}
                      </td>
                      <td className="px-6 py-4 text-xs bg-muted px-2 py-1 rounded w-fit">
                        {commission.order_id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary">
                        {formatNaira(commission.commission_amount_naira)}
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
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {commission.status === 'pending' && (
                            <button
                              onClick={() => handleApprove(commission.id)}
                              disabled={processing === commission.id}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded hover:bg-blue-200 disabled:opacity-50 dark:bg-blue-900 dark:text-blue-200"
                            >
                              {processing === commission.id ? 'Approving...' : 'Approve'}
                            </button>
                          )}
                          {commission.status === 'approved' && (
                            <button
                              onClick={() => handlePay(commission.id)}
                              disabled={processing === commission.id}
                              className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded hover:bg-green-200 disabled:opacity-50 dark:bg-green-900 dark:text-green-200"
                            >
                              {processing === commission.id ? 'Paying...' : 'Pay'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No commissions found</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AdminCommissionsPage;
