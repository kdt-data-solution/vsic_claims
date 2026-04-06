import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Claim, ClaimStage, ClaimHistoryEntry } from '../types/claim';

interface ClaimsContextType {
  claims: Claim[];
  addClaim: (claim: Omit<Claim, 'id' | 'claimNumber' | 'history' | 'stage' | 'dateFiled'>) => void;
  updateClaimStage: (claimId: string, newStage: ClaimStage, note?: string) => void;
  updateClaim: (claimId: string, updates: Partial<Claim>) => void;
  deleteClaim: (claimId: string) => void;
  getClaimsByStage: (stage: ClaimStage) => Claim[];
  reorderClaims: (stage: ClaimStage, sourceIndex: number, destIndex: number) => void;
  moveClaimToStage: (claimId: string, sourceStage: ClaimStage, destStage: ClaimStage, destIndex: number) => void;
}

const ClaimsContext = createContext<ClaimsContextType | undefined>(undefined);

function generateClaimNumber(): string {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 99999)).padStart(5, '0');
  return `CLM-${year}-${seq}`;
}

const SAMPLE_CLAIMS: Claim[] = [
  {
    id: uuidv4(),
    claimNumber: 'CLM-2026-00001',
    stage: 'new_claim',
    claimantName: 'Juan Dela Cruz',
    policyNumber: 'POL-2025-10234',
    insuranceType: 'fire',
    dateOfLoss: '2026-03-15',
    dateFiled: '2026-03-20',
    claimAmount: 2500000,
    description: 'Fire damage to commercial building in Makati City',
    contactEmail: 'juan.delacruz@email.com',
    contactPhone: '+63 917 123 4567',
    documents: ['Fire Investigation Report', 'Police Report', 'Photos'],
    notes: 'Initial submission with complete documents',
    premiumStatus: 'paid',
    riCovered: null,
    assignedTo: 'Maria Santos',
    priority: 'high',
    history: [{ timestamp: '2026-03-20T08:00:00Z', fromStage: null, toStage: 'new_claim', note: 'Claim submitted', user: 'System' }],
  },
  {
    id: uuidv4(),
    claimNumber: 'CLM-2026-00002',
    stage: 'claims_division',
    claimantName: 'ABC Corporation',
    policyNumber: 'POL-2025-20567',
    insuranceType: 'marine',
    dateOfLoss: '2026-03-10',
    dateFiled: '2026-03-12',
    claimAmount: 5800000,
    description: 'Cargo damage during transit from Manila to Cebu',
    contactEmail: 'claims@abccorp.ph',
    contactPhone: '+63 2 8888 1234',
    documents: ['Bill of Lading', 'Survey Report', 'Commercial Invoice'],
    notes: 'Under assessment by claims division',
    premiumStatus: 'paid',
    riCovered: null,
    assignedTo: 'Pedro Reyes',
    priority: 'urgent',
    history: [
      { timestamp: '2026-03-12T09:00:00Z', fromStage: null, toStage: 'new_claim', note: 'Claim submitted', user: 'System' },
      { timestamp: '2026-03-13T10:00:00Z', fromStage: 'new_claim', toStage: 'claims_division', note: 'Forwarded for assessment', user: 'Maria Santos' },
    ],
  },
  {
    id: uuidv4(),
    claimNumber: 'CLM-2026-00003',
    stage: 'premium_assessment',
    claimantName: 'Elena Garcia',
    policyNumber: 'POL-2025-30890',
    insuranceType: 'motor',
    dateOfLoss: '2026-02-28',
    dateFiled: '2026-03-01',
    claimAmount: 450000,
    description: 'Vehicle collision on EDSA, total loss declared',
    contactEmail: 'elena.garcia@email.com',
    contactPhone: '+63 918 765 4321',
    documents: ['Police Report', 'Repair Estimate', 'Photos', 'Driver License'],
    notes: 'Checking premium payment compliance with 90-day rule',
    premiumStatus: 'paid',
    riCovered: null,
    assignedTo: 'Ana Lim',
    priority: 'medium',
    history: [
      { timestamp: '2026-03-01T08:00:00Z', fromStage: null, toStage: 'new_claim', note: 'Claim submitted', user: 'System' },
      { timestamp: '2026-03-02T09:00:00Z', fromStage: 'new_claim', toStage: 'claims_division', note: 'Documents validated', user: 'Maria Santos' },
      { timestamp: '2026-03-05T14:00:00Z', fromStage: 'claims_division', toStage: 'premium_assessment', note: 'Proceeding to premium assessment', user: 'Pedro Reyes' },
    ],
  },
  {
    id: uuidv4(),
    claimNumber: 'CLM-2026-00004',
    stage: 'treasury',
    claimantName: 'Roberto Tan',
    policyNumber: 'POL-2024-40123',
    insuranceType: 'casualty',
    dateOfLoss: '2026-01-15',
    dateFiled: '2026-01-20',
    claimAmount: 1200000,
    description: 'Personal accident claim - workplace injury',
    contactEmail: 'roberto.tan@email.com',
    contactPhone: '+63 919 222 3333',
    documents: ['Medical Records', 'Incident Report', 'Hospital Bills'],
    notes: 'Awaiting treasury fund confirmation',
    premiumStatus: 'paid',
    riCovered: false,
    assignedTo: 'Carlos Mendoza',
    priority: 'medium',
    history: [
      { timestamp: '2026-01-20T08:00:00Z', fromStage: null, toStage: 'new_claim', note: 'Claim submitted', user: 'System' },
      { timestamp: '2026-01-22T10:00:00Z', fromStage: 'new_claim', toStage: 'claims_division', note: 'Validated', user: 'Maria Santos' },
      { timestamp: '2026-01-25T11:00:00Z', fromStage: 'claims_division', toStage: 'premium_assessment', note: 'Premium check', user: 'Pedro Reyes' },
      { timestamp: '2026-02-01T09:00:00Z', fromStage: 'premium_assessment', toStage: 'treasury', note: 'Premium within 90 days, forwarded to treasury', user: 'Ana Lim' },
    ],
  },
  {
    id: uuidv4(),
    claimNumber: 'CLM-2026-00005',
    stage: 'check_release',
    claimantName: 'Global Shipping Inc.',
    policyNumber: 'POL-2024-50456',
    insuranceType: 'marine',
    dateOfLoss: '2025-12-20',
    dateFiled: '2025-12-22',
    claimAmount: 8500000,
    description: 'Hull damage to MV Pacific Star',
    contactEmail: 'claims@globalshipping.ph',
    contactPhone: '+63 2 7777 5678',
    documents: ['Survey Report', 'Repair Invoice', 'Classification Society Report'],
    notes: 'Check ready for release, claimant notified',
    premiumStatus: 'paid',
    riCovered: true,
    assignedTo: 'Maria Santos',
    priority: 'high',
    history: [
      { timestamp: '2025-12-22T08:00:00Z', fromStage: null, toStage: 'new_claim', note: 'Claim submitted', user: 'System' },
      { timestamp: '2026-01-15T14:00:00Z', fromStage: 'accounting', toStage: 'check_signing', note: 'Check prepared', user: 'Finance Team' },
      { timestamp: '2026-01-20T10:00:00Z', fromStage: 'check_signing', toStage: 'check_release', note: 'Check signed, ready for release', user: 'OES-P' },
    ],
  },
  {
    id: uuidv4(),
    claimNumber: 'CLM-2026-00006',
    stage: 'denied',
    claimantName: 'Sofia Reyes',
    policyNumber: 'POL-2025-60789',
    insuranceType: 'fire',
    dateOfLoss: '2026-02-10',
    dateFiled: '2026-03-25',
    claimAmount: 3200000,
    description: 'Residential fire damage claim',
    contactEmail: 'sofia.reyes@email.com',
    contactPhone: '+63 920 111 2222',
    documents: ['Fire Report'],
    notes: 'Denied - premium payment beyond 90 days, no payment made',
    premiumStatus: 'unpaid',
    riCovered: null,
    assignedTo: 'Ana Lim',
    priority: 'low',
    history: [
      { timestamp: '2026-03-25T08:00:00Z', fromStage: null, toStage: 'new_claim', note: 'Claim submitted', user: 'System' },
      { timestamp: '2026-03-26T10:00:00Z', fromStage: 'new_claim', toStage: 'claims_division', note: 'Validated', user: 'Maria Santos' },
      { timestamp: '2026-03-27T14:00:00Z', fromStage: 'claims_division', toStage: 'denied', note: 'Premium beyond 90 days, no payment. Denial letter issued.', user: 'Claims Committee' },
    ],
  },
];

export function ClaimsProvider({ children }: { children: ReactNode }) {
  const [claims, setClaims] = useState<Claim[]>(SAMPLE_CLAIMS);

  const addClaim = useCallback((claimData: Omit<Claim, 'id' | 'claimNumber' | 'history' | 'stage' | 'dateFiled'>) => {
    const newClaim: Claim = {
      ...claimData,
      id: uuidv4(),
      claimNumber: generateClaimNumber(),
      stage: 'new_claim',
      dateFiled: new Date().toISOString().split('T')[0],
      history: [{
        timestamp: new Date().toISOString(),
        fromStage: null,
        toStage: 'new_claim',
        note: 'Claim submitted',
        user: 'System',
      }],
    };
    setClaims(prev => [newClaim, ...prev]);
  }, []);

  const updateClaimStage = useCallback((claimId: string, newStage: ClaimStage, note = '') => {
    setClaims(prev => prev.map(claim => {
      if (claim.id !== claimId) return claim;
      const entry: ClaimHistoryEntry = {
        timestamp: new Date().toISOString(),
        fromStage: claim.stage,
        toStage: newStage,
        note: note || `Moved to ${newStage}`,
        user: 'Current User',
      };
      return { ...claim, stage: newStage, history: [...claim.history, entry] };
    }));
  }, []);

  const updateClaim = useCallback((claimId: string, updates: Partial<Claim>) => {
    setClaims(prev => prev.map(claim =>
      claim.id === claimId ? { ...claim, ...updates } : claim
    ));
  }, []);

  const deleteClaim = useCallback((claimId: string) => {
    setClaims(prev => prev.filter(c => c.id !== claimId));
  }, []);

  const getClaimsByStage = useCallback((stage: ClaimStage) => {
    return claims.filter(c => c.stage === stage);
  }, [claims]);

  const reorderClaims = useCallback((stage: ClaimStage, sourceIndex: number, destIndex: number) => {
    setClaims(prev => {
      const stageClaims = prev.filter(c => c.stage === stage);
      const otherClaims = prev.filter(c => c.stage !== stage);
      const [moved] = stageClaims.splice(sourceIndex, 1);
      stageClaims.splice(destIndex, 0, moved);
      return [...otherClaims, ...stageClaims];
    });
  }, []);

  const moveClaimToStage = useCallback((claimId: string, sourceStage: ClaimStage, destStage: ClaimStage, destIndex: number) => {
    setClaims(prev => {
      const claim = prev.find(c => c.id === claimId);
      if (!claim) return prev;
      const entry: ClaimHistoryEntry = {
        timestamp: new Date().toISOString(),
        fromStage: sourceStage,
        toStage: destStage,
        note: `Moved from ${sourceStage} to ${destStage}`,
        user: 'Current User',
      };
      const updated = { ...claim, stage: destStage, history: [...claim.history, entry] };
      const without = prev.filter(c => c.id !== claimId);
      const destClaims = without.filter(c => c.stage === destStage);
      const otherClaims = without.filter(c => c.stage !== destStage);
      destClaims.splice(destIndex, 0, updated);
      return [...otherClaims, ...destClaims];
    });
  }, []);

  return (
    <ClaimsContext.Provider value={{ claims, addClaim, updateClaimStage, updateClaim, deleteClaim, getClaimsByStage, reorderClaims, moveClaimToStage }}>
      {children}
    </ClaimsContext.Provider>
  );
}

export function useClaims() {
  const ctx = useContext(ClaimsContext);
  if (!ctx) throw new Error('useClaims must be used within ClaimsProvider');
  return ctx;
}
