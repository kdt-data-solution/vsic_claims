import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, XCircle, AlertTriangle, TrendingUp, DollarSign, Users } from 'lucide-react';
import { useClaims } from '../context/ClaimsContext';
import { CLAIM_STAGES } from '../types/claim';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(amount);
}

export default function Dashboard() {
  const { claims } = useClaims();
  const navigate = useNavigate();

  const totalClaims = claims.length;
  const activeClaims = claims.filter(c => c.stage !== 'closed' && c.stage !== 'denied').length;
  const closedClaims = claims.filter(c => c.stage === 'closed').length;
  const deniedClaims = claims.filter(c => c.stage === 'denied').length;
  const totalAmount = claims.reduce((sum, c) => sum + c.claimAmount, 0);
  const urgentClaims = claims.filter(c => c.priority === 'urgent' || c.priority === 'high').length;

  const stageDistribution = CLAIM_STAGES.map(stage => ({
    ...stage,
    count: claims.filter(c => c.stage === stage.id).length,
  })).filter(s => s.count > 0);

  const recentClaims = [...claims].sort((a, b) => new Date(b.dateFiled).getTime() - new Date(a.dateFiled).getTime()).slice(0, 5);

  return (
    <div className="p-6 overflow-y-auto h-[calc(100vh-4rem)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Claims process overview and monitoring</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FileText className="w-5 h-5" />} label="Total Claims" value={totalClaims} color="blue" />
        <StatCard icon={<Clock className="w-5 h-5" />} label="Active Claims" value={activeClaims} color="amber" />
        <StatCard icon={<CheckCircle className="w-5 h-5" />} label="Closed" value={closedClaims} color="green" />
        <StatCard icon={<XCircle className="w-5 h-5" />} label="Denied" value={deniedClaims} color="red" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<DollarSign className="w-5 h-5" />} label="Total Amount" value={formatCurrency(totalAmount)} color="purple" />
        <StatCard icon={<AlertTriangle className="w-5 h-5" />} label="High/Urgent" value={urgentClaims} color="orange" />
        <StatCard icon={<Users className="w-5 h-5" />} label="Assigned Staff" value={new Set(claims.map(c => c.assignedTo).filter(Boolean)).size} color="teal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stage Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Claims by Stage
          </h2>
          <div className="space-y-3">
            {stageDistribution.map(stage => (
              <div key={stage.id} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: stage.color }} />
                <span className="text-sm text-gray-700 flex-1">{stage.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(stage.count / totalClaims) * 100}%`, backgroundColor: stage.color }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-600 w-6 text-right">{stage.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Claims */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Recent Claims
            </h2>
            <button onClick={() => navigate('/board')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium">
              View Board →
            </button>
          </div>
          <div className="space-y-3">
            {recentClaims.map(claim => {
              const stageInfo = CLAIM_STAGES.find(s => s.id === claim.stage);
              return (
                <div key={claim.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: stageInfo?.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 truncate">{claim.claimantName}</span>
                      <span className="text-xs font-mono text-gray-400">{claim.claimNumber}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{claim.description}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full shrink-0 text-white"
                    style={{ backgroundColor: stageInfo?.color }}>
                    {stageInfo?.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-600',
  green: 'bg-green-50 text-green-600',
  red: 'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
  teal: 'bg-teal-50 text-teal-600',
};

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${COLOR_MAP[color]}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
