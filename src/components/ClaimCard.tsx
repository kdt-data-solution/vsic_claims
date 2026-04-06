import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Clock, User, AlertTriangle, DollarSign, FileText } from 'lucide-react';
import type { Claim } from '../types/claim';

interface ClaimCardProps {
  claim: Claim;
  index: number;
  onClick: (claim: Claim) => void;
}

const PRIORITY_CONFIG = {
  low: { color: 'bg-gray-100 text-gray-600', label: 'Low' },
  medium: { color: 'bg-blue-100 text-blue-700', label: 'Medium' },
  high: { color: 'bg-orange-100 text-orange-700', label: 'High' },
  urgent: { color: 'bg-red-100 text-red-700', label: 'Urgent' },
};

const INSURANCE_LABELS: Record<string, string> = {
  fire: 'Fire',
  marine: 'Marine',
  motor: 'Motor',
  casualty: 'Casualty',
  surety: 'Surety',
  life: 'Life',
  other: 'Other',
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

function daysAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return '1 day ago';
  return `${diff} days ago`;
}

export default function ClaimCard({ claim, index, onClick }: ClaimCardProps) {
  const priority = PRIORITY_CONFIG[claim.priority];

  return (
    <Draggable draggableId={claim.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(claim)}
          className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer
            hover:shadow-md hover:border-gray-200 transition-all duration-200 select-none
            ${snapshot.isDragging ? 'claim-card-dragging shadow-xl border-blue-200 ring-2 ring-blue-100' : ''}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-semibold text-gray-500">{claim.claimNumber}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priority.color}`}>
              {priority.label}
            </span>
          </div>

          {/* Claimant Name */}
          <h4 className="font-semibold text-gray-900 text-sm mb-2 leading-tight">{claim.claimantName}</h4>

          {/* Description snippet */}
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{claim.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md">
              <FileText className="w-3 h-3" />
              {INSURANCE_LABELS[claim.insuranceType]}
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-md">
              <DollarSign className="w-3 h-3" />
              {formatCurrency(claim.claimAmount)}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {daysAgo(claim.dateFiled)}
            </span>
            {claim.assignedTo && (
              <span className="inline-flex items-center gap-1">
                <User className="w-3 h-3" />
                {claim.assignedTo.split(' ')[0]}
              </span>
            )}
          </div>

          {/* Premium warning */}
          {claim.premiumStatus === 'unpaid' && (
            <div className="mt-2 flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
              <AlertTriangle className="w-3 h-3" />
              Premium Unpaid
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
