export type ClaimStage =
  | 'new_claim'
  | 'claims_division'
  | 'premium_assessment'
  | 'cashier_validation'
  | 'ri_check'
  | 'ppw_cbw_checking'
  | 'treasury'
  | 'accounting'
  | 'check_signing'
  | 'check_release'
  | 'encoding_closing'
  | 'claims_committee'
  | 'denied'
  | 'closed';

export interface ClaimStageInfo {
  id: ClaimStage;
  label: string;
  color: string;
  description: string;
}

export const CLAIM_STAGES: ClaimStageInfo[] = [
  { id: 'new_claim', label: 'New Claim', color: '#f59e0b', description: 'Client submits claim forms to Claims Division' },
  { id: 'claims_division', label: 'Claims Division', color: '#3b82f6', description: 'Validate, Assess & Encode' },
  { id: 'premium_assessment', label: 'Premium Assessment', color: '#8b5cf6', description: '90-Day Rule - Premium Payment Assessment' },
  { id: 'cashier_validation', label: 'Cashier Validation', color: '#ec4899', description: 'Cashier to further validate premium requirements' },
  { id: 'ri_check', label: 'RI Coverage Check', color: '#14b8a6', description: 'Check if claim is RI covered' },
  { id: 'ppw_cbw_checking', label: 'PPW/CBW Checking', color: '#6366f1', description: 'PPW, CBW and Loss Notification Checking' },
  { id: 'treasury', label: 'Treasury', color: '#f97316', description: 'Funds Availability Confirmation & Request of Funds' },
  { id: 'accounting', label: 'Accounting', color: '#0ea5e9', description: 'Check Preparation' },
  { id: 'check_signing', label: 'Check Signing', color: '#10b981', description: 'OES-P - Check Signed & Ready Confirmation' },
  { id: 'check_release', label: 'Check Release', color: '#22c55e', description: 'Notify Claimant & Release/Pick-up' },
  { id: 'encoding_closing', label: 'Encoding & Closing', color: '#84cc16', description: 'Encode released check & close transaction to GENIISYS' },
  { id: 'claims_committee', label: 'Claims Committee', color: '#d946ef', description: 'Claims Committee Review for outstanding issues' },
  { id: 'denied', label: 'Denied / Rejected', color: '#ef4444', description: 'Claim disapproved - Denial letter issued' },
  { id: 'closed', label: 'Closed', color: '#6b7280', description: 'Transaction completed' },
];

export type InsuranceType = 'fire' | 'marine' | 'motor' | 'casualty' | 'surety' | 'life' | 'other';

export interface Claim {
  id: string;
  claimNumber: string;
  stage: ClaimStage;
  claimantName: string;
  policyNumber: string;
  insuranceType: InsuranceType;
  dateOfLoss: string;
  dateFiled: string;
  claimAmount: number;
  description: string;
  contactEmail: string;
  contactPhone: string;
  documents: string[];
  notes: string;
  premiumStatus: 'paid' | 'unpaid' | 'partial';
  riCovered: boolean | null;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  history: ClaimHistoryEntry[];
}

export interface ClaimHistoryEntry {
  timestamp: string;
  fromStage: ClaimStage | null;
  toStage: ClaimStage;
  note: string;
  user: string;
}
