import React, { useState } from 'react';
import { X, Plus, FileText } from 'lucide-react';
import { useClaims } from '../context/ClaimsContext';
import type { InsuranceType } from '../types/claim';

interface ClaimFormProps {
  onClose: () => void;
}

const INSURANCE_TYPES: { value: InsuranceType; label: string }[] = [
  { value: 'fire', label: 'Fire' },
  { value: 'marine', label: 'Marine' },
  { value: 'motor', label: 'Motor Car' },
  { value: 'casualty', label: 'Casualty' },
  { value: 'surety', label: 'Surety' },
  { value: 'life', label: 'Life' },
  { value: 'other', label: 'Other' },
];

export default function ClaimForm({ onClose }: ClaimFormProps) {
  const { addClaim } = useClaims();
  const [documentInput, setDocumentInput] = useState('');
  const [form, setForm] = useState({
    claimantName: '',
    policyNumber: '',
    insuranceType: 'fire' as InsuranceType,
    dateOfLoss: '',
    claimAmount: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    documents: [] as string[],
    notes: '',
    premiumStatus: 'paid' as 'paid' | 'unpaid' | 'partial',
    riCovered: null as boolean | null,
    assignedTo: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const addDocument = () => {
    if (documentInput.trim()) {
      setForm(prev => ({ ...prev, documents: [...prev.documents, documentInput.trim()] }));
      setDocumentInput('');
    }
  };

  const removeDocument = (index: number) => {
    setForm(prev => ({ ...prev, documents: prev.documents.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClaim({
      ...form,
      claimAmount: parseFloat(form.claimAmount) || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Submit New Claim</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Claimant Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Claimant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Claimant Name *</label>
                <input type="text" name="claimantName" value={form.claimantName} onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number *</label>
                <input type="text" name="policyNumber" value={form.policyNumber} onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" name="contactPhone" value={form.contactPhone} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
              </div>
            </div>
          </div>

          {/* Claim Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Claim Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Type *</label>
                <select name="insuranceType" value={form.insuranceType} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                  {INSURANCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Loss *</label>
                <input type="date" name="dateOfLoss" value={form.dateOfLoss} onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Claim Amount (PHP) *</label>
                <input type="number" name="claimAmount" value={form.claimAmount} onChange={handleChange} required min="0" step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select name="priority" value={form.priority} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Premium Status</label>
                <select name="premiumStatus" value={form.premiumStatus} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                <input type="text" name="assignedTo" value={form.assignedTo} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none" />
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Supporting Documents</h3>
            <div className="flex gap-2">
              <input type="text" value={documentInput} onChange={e => setDocumentInput(e.target.value)}
                placeholder="Enter document name (e.g., Police Report)"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addDocument(); } }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
              <button type="button" onClick={addDocument}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Plus className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {form.documents.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.documents.map((doc, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                    {doc}
                    <button type="button" onClick={() => removeDocument(i)} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm">
              Submit Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
