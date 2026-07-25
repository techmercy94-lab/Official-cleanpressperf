'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getAdminWithdrawals, approveWithdrawal } from '@/app/actions/admin';
import { formatNaira } from '@/lib/utils-custom';
import Link from 'next/link';

function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadWithdrawals();
  }, [filter]);

  const loadWithdrawals = async () => {
    setLoading(true);
    try {
      const data = await getAdminWithdrawals(filter === 'all' ? undefined : filter);
      setWithdrawals(data);
    } catch (error) {
      console.error('Error loading withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (withdrawalId: string) => {
    setProcessing(withdrawalId);
    try {
      await approveWithdrawal(withdrawalId);
      await loadWithdrawals();
    } catch (error) {
      console.error('Error approving withdrawal:', error);
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Manage Withdrawals</h1>
            <p className="text-muted-foreground">Approve affiliate withdrawal requests</p>
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
          {['pending', 'approved', 'paid', 'rejected', 'all'].map((status) => (
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

        {/* Withdrawals Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : withdrawals.length > 0 ? (
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
                      Bank Details
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {withdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id} className="hover:bg-muted/20 transition">
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-semibold text-foreground">
                            {withdrawal.affiliate?.affiliate_username}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {withdrawal.affiliate?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary">
                        {formatNaira(withdrawal.amount_naira)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="font-semibold text-foreground">{withdrawal.bank_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {withdrawal.bank_account_number}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            withdrawal.status === 'paid'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : withdrawal.status === 'approved'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : withdrawal.status === 'rejected'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}
                        >
                          {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(withdrawal.requested_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {withdrawal.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(withdrawal.id)}
                            disabled={processing === withdrawal.id}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded hover:bg-blue-200 disabled:opacity-50 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {processing === withdrawal.id ? 'Processing...' : 'Approve'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No withdrawals found</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AdminWithdrawalsPage;
