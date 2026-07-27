'use client'

interface AffiliateStatsProps {
  totalReferrals: number
  activeReferrals: number
  totalCommission: number
  pendingCommission: number
}

export function AffiliateStats({
  totalReferrals,
  activeReferrals,
  totalCommission,
  pendingCommission,
}: AffiliateStatsProps) {
  const stats = [
    {
      label: 'Total Referrals',
      value: totalReferrals,
      color: 'bg-blue-500',
    },
    {
      label: 'Active Referrals',
      value: activeReferrals,
      color: 'bg-green-500',
    },
    {
      label: 'Total Commission',
      value: `$${totalCommission.toFixed(2)}`,
      color: 'bg-purple-500',
    },
    {
      label: 'Pending Commission',
      value: `$${pendingCommission.toFixed(2)}`,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-slate-800 rounded-lg p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-slate-400 text-sm font-medium mb-2">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-white">
                {stat.value}
              </p>
            </div>
            <div
              className={`${stat.color} w-12 h-12 rounded-lg opacity-20`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
