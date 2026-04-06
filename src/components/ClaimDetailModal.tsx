import React from 'react';
import { X, Clock, User, FileText, DollarSign, Calendar, Mail, Phone, Shield, AlertTriangle, ArrowRight } from 'lucide-react';
import type { Claim } from '../types/claim';
import { CLAIM_STAGES } from '../types/claim';

interface ClaimDetailModalProps {
  claim: Claim;
  onClose: () => void;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-PH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const PRIORITY_CONFIG = {
  low: { color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Low' },
  medium: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Medium' },
  high: { color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'High' },
  urgent: { color: 'bg-red-100 text-red-700 border-red-200', label: 'Urgent' },
};

const PREMIUM_CONFIG = {
  paid: { color: 'text-green-700 bg-green-50', label: 'Paid' },
  partial: { color: 'text-amber-700 bg-amber-50', label: 'Partial' },
  unpaid: { color: 'text-red-700 bg-red-50', label: 'Unpaid' },
};

const INSURANCE_LABELS: Record<string, string> = {
  fire: 'Fire', marine: 'Marine', motor: 'Motor Car', casualty: 'Casualty',
  surety: 'Surety', life: 'Life', other: 'Other',
};

export default function ClaimDetailModal({ claim, onClose }: ClaimDetailModalProps) {
  const stageInfo = CLAIM_STAGES.find(s => s.id === claim.stage);
  const priority = PRIORITY_CONFIG[claim.priority];
  const premium = PREMIUM_CONFIG[claim.premiumStatus];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm text-gray-500">{claim.claimNumber}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${priority.color}`}>{priority.label}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{claim.claimantName}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          {stageInfo && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: stageInfo.color }}>
              {stageInfo.label}
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            <InfoItem icon={<Shield className="w-4 h-4" />} label="Policy Number" value={claim.policyNumber} />
            <InfoItem icon={<FileText className="w-4 h-4" />} label="Insurance Type" value={INSURANCE_LABELS[claim.insuranceType]} />
            <InfoItem icon={<DollarSign className="w-4 h-4" />} label="Claim Amount" value={formatCurrency(claim.claimAmount)} />
            <InfoItem icon={<Calendar className="w-4 h-4" />} label="Date of Loss" value={formatDate(claim.dateOfLoss)} />
            <InfoItem icon={<Calendar className="w-4 h-4" />} label="Date Filed" value={formatDate(claim.dateFiled)} />
            <InfoItem icon={<User className="w-4 h-4" />} label="Assigned To" value={claim.assignedTo || 'Unassigned'} />
            {claim.contactEmail && <InfoItem icon={<Mail className="w-4 h-4" />} label="Email" value={claim.contactEmail} />}
            {claim.contactPhone && <InfoItem icon={<Phone className="w-4 h-4" />} label="Phone" value={claim.contactPhone} />}
          </div>

          {/* Premium Status */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Premium Status:</span>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${premium.color}`}>{premium.label}</span>
            {claim.riCovered !== null && (
              <>
                <span className="text-sm text-gray-500 ml-2">RI Covered:</span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${claim.riCovered ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {claim.riCovered ? 'Yes' : 'No'}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">{claim.description}</p>
          </div>

          {/* Documents */}
          {claim.documents.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Documents</h3>
              <div className="flex flex-wrap gap-2">
                {claim.documents.map((doc, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg">
                    <FileText className="w-3.5 h-3.5" />
                    {doc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {claim.notes && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Notes</h3>
              <p className="text-gray-700 text-sm bg-amber-50 p-3 rounded-lg border border-amber-100">{claim.notes}</p>
            </div>
          )}

          {/* History timeline */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Claim History</h3>
            <div className="space-y-3">
              {claim.history.map((entry, i) => {
                const fromLabel = entry.fromStage ? CLAIM_STAGES.find(s => s.id === entry.fromStage)?.label : null;
                const toLabel = CLAIM_STAGES.find(s => s.id === entry.toStage)?.label ?? entry.toStage;
                const toColor = CLAIM_STAGES.find(s => s.id === entry.toStage)?.color ?? '#6b7280';
                return (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="mt-1 w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white" style={{ backgroundColor: toColor }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {fromLabel && (
                          <>
                            <span className="text-xs text-gray-500">{fromLabel}</span>
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                          </>
                        )}
                        <span className="text-xs font-semibold" style={{ color: toColor }}>{toLabel}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{entry.note}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(entry.timestamp)}
                        <span className="mx-1">-</span>
                        <User className="w-3 h-3" />
                        {entry.user}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-gray-400 mt-0.5">{icon}</div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-medium text-gray-900">{value}</div>
      </div>
    </div>
  );
}
