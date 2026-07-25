'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getSession } from '@/app/actions/auth';
import { getAffiliateStats, requestWithdrawal, getAffiliateWithdrawals } from '@/app/actions/affiliate';
import { formatNaira } from '@/lib/utils-custom';
import Link from 'next/link';

function WithdrawPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    amount: '',
    bankName: '',
    accountNumber: '',
    accountHolder: '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const session = await getSession();
        if (!session) {
          window.location.href = '/auth/login';
          return;
        }

        setUser(session);

        const [statsData, withdrawalsData] = await Promise.all([
          getAffiliateStats(session.id),
          getAffiliateWithdrawals(session.id),
        ]);

        setStats(statsData);
        setWithdrawals(withdrawalsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const amountInNaira = parseFloat(formData.amount);
      if (amountInNaira > (stats?.pendingCommissions || 0) / 100) {
        setError('Amount exceeds available balance');
        return;
      }

      const result = await requestWithdrawal(
        user.id,
        Math.round(amountInNaira * 100),
        formData.bankName,
        formData.accountNumber,
        formData.accountHolder
      );

      if (result.error) {
        setError(result.error.message || 'Failed to request withdrawal');
      } else {
        setFormData({ amount: '', bankName: '', accountNumber: '', accountHolder: '' });
        alert('Withdrawal request submitted successfully!');
        // Reload withdrawals
        const updated = await getAffiliateWithdrawals(user.id);
        setWithdrawals(updated);
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Request Withdrawal</h1>
          <p className="text-muted-foreground">Withdraw your earned commissions</p>
        </div>

        {/* Balance Info */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Available Balance</p>
              <p className="text-3xl font-bold text-primary">
                {formatNaira(stats?.pendingCommissions || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Total Earnings</p>
              <p className="text-3xl font-bold text-foreground">
                {formatNaira(stats?.totalCommissions || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Withdrawal Details</h2>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Amount (NGN)
              </label>
              <input
                type="number"
                step="100"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="50000"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maximum: {formatNaira(stats?.pendingCommissions || 0)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="e.g., First Bank"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Account Number
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="0123456789"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Account Holder Name
              </label>
              <input
                type="text"
                value={formData.accountHolder}
                onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="Your full name"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Processing...' : 'Request Withdrawal'}
            </button>
          </form>
        </div>

        {/* Previous Withdrawals */}
        {withdrawals.length > 0 && (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Withdrawal History</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Bank
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
                  {withdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id} className="hover:bg-muted/20 transition">
                      <td className="px-6 py-4 font-semibold text-primary">
                        {formatNaira(withdrawal.amount_naira)}
                      </td>
                      <td className="px-6 py-4 text-sm">{withdrawal.bank_name}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            withdrawal.status === 'paid'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : withdrawal.status === 'approved'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}
                        >
                          {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(withdrawal.requested_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/affiliate/dashboard" className="text-primary hover:text-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default WithdrawPage;
