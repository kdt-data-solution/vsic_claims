import React, { useState } from 'react';
import { Zap, Plus, Play, Pause, Trash2, Edit3, X, ChevronRight, Bolt, Cog, CheckCircle2 } from 'lucide-react';

type TriggerType = 'claim_created' | 'status_changed' | 'amount_threshold' | 'sla_breach';
type ActionType = 'assign_user' | 'send_email' | 'set_priority' | 'add_tag' | 'escalate';
type OutcomeType = 'notify' | 'log' | 'update_status' | 'create_task';

interface Automation {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: { type: TriggerType; value: string };
  action: { type: ActionType; value: string };
  outcome: { type: OutcomeType; value: string };
  runs: number;
}

const TRIGGER_LABELS: Record<TriggerType, string> = {
  claim_created: 'When a claim is created',
  status_changed: 'When status changes',
  amount_threshold: 'When amount exceeds threshold',
  sla_breach: 'When SLA is breached',
};

const ACTION_LABELS: Record<ActionType, string> = {
  assign_user: 'Assign to user',
  send_email: 'Send email',
  set_priority: 'Set priority',
  add_tag: 'Add tag',
  escalate: 'Escalate to manager',
};

const OUTCOME_LABELS: Record<OutcomeType, string> = {
  notify: 'Notify stakeholders',
  log: 'Log to audit trail',
  update_status: 'Update claim status',
  create_task: 'Create follow-up task',
};

const seed: Automation[] = [
  {
    id: '1',
    name: 'High-value claim escalation',
    description: 'Auto-escalate claims above $50,000 to senior adjusters',
    enabled: true,
    trigger: { type: 'amount_threshold', value: '50000' },
    action: { type: 'escalate', value: 'Senior Adjusters' },
    outcome: { type: 'notify', value: 'manager@vsic.com' },
    runs: 47,
  },
  {
    id: '2',
    name: 'New claim auto-assignment',
    description: 'Round-robin assignment of new claims to active adjusters',
    enabled: true,
    trigger: { type: 'claim_created', value: 'any' },
    action: { type: 'assign_user', value: 'Round-robin pool' },
    outcome: { type: 'log', value: 'Audit trail' },
    runs: 312,
  },
  {
    id: '3',
    name: 'SLA breach alert',
    description: 'Notify supervisor when claim exceeds 5-day SLA',
    enabled: false,
    trigger: { type: 'sla_breach', value: '5 days' },
    action: { type: 'send_email', value: 'supervisor@vsic.com' },
    outcome: { type: 'create_task', value: 'Review overdue claim' },
    runs: 8,
  },
];

export default function AutomationPage() {
  const [automations, setAutomations] = useState<Automation[]>(seed);
  const [editing, setEditing] = useState<Automation | null>(null);

  const toggle = (id: string) =>
    setAutomations(a => a.map(x => (x.id === id ? { ...x, enabled: !x.enabled } : x)));

  const remove = (id: string) =>
    setAutomations(a => a.filter(x => x.id !== id));

  const save = (auto: Automation) => {
    setAutomations(a => {
      const exists = a.find(x => x.id === auto.id);
      return exists ? a.map(x => (x.id === auto.id ? auto : x)) : [...a, auto];
    });
    setEditing(null);
  };

  const newAutomation = (): Automation => ({
    id: Date.now().toString(),
    name: '',
    description: '',
    enabled: true,
    trigger: { type: 'claim_created', value: '' },
    action: { type: 'assign_user', value: '' },
    outcome: { type: 'notify', value: '' },
    runs: 0,
  });

  return (
    <div className="p-6 overflow-auto h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Automation</h2>
          <p className="text-sm text-gray-500 mt-1">Trigger → Action → Outcome rulesets</p>
        </div>
        <button
          onClick={() => setEditing(newAutomation())}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm">
          <Plus className="w-4 h-4" /> New Automation
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Name</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Trigger</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Action</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Outcome</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Runs</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {automations.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggle(a.id)}
                    className={`w-10 h-6 rounded-full relative transition-colors ${a.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${a.enabled ? 'left-[18px]' : 'left-0.5'}`} />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 text-sm">{a.name}</div>
                  <div className="text-xs text-gray-500">{a.description}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{TRIGGER_LABELS[a.trigger.type]}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{ACTION_LABELS[a.action.type]}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{OUTCOME_LABELS[a.outcome.type]}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{a.runs}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditing(a)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => remove(a.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {automations.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                  No automations yet. Click "New Automation" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && <AutomationEditor automation={editing} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  );
}

interface EditorProps {
  automation: Automation;
  onSave: (a: Automation) => void;
  onClose: () => void;
}

function AutomationEditor({ automation, onSave, onClose }: EditorProps) {
  const [draft, setDraft] = useState<Automation>(automation);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <input
                value={draft.name}
                onChange={e => setDraft({ ...draft, name: e.target.value })}
                placeholder="Automation name"
                className="font-semibold text-gray-900 text-lg bg-transparent border-none outline-none focus:ring-0 p-0"
              />
              <input
                value={draft.description}
                onChange={e => setDraft({ ...draft, description: e.target.value })}
                placeholder="Describe what this does..."
                className="block text-xs text-gray-500 bg-transparent border-none outline-none focus:ring-0 p-0 w-96"
              />
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Flow canvas */}
        <div className="flex-1 overflow-auto p-8 bg-[radial-gradient(circle,#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px]">
          <div className="flex flex-col items-center gap-0">
            {/* Trigger */}
            <FlowBlock
              color="from-blue-500 to-blue-600"
              icon={<Bolt className="w-5 h-5 text-white" />}
              kind="TRIGGER"
              title="When this happens..."
              typeOptions={TRIGGER_LABELS}
              selectedType={draft.trigger.type}
              value={draft.trigger.value}
              onTypeChange={t => setDraft({ ...draft, trigger: { ...draft.trigger, type: t as TriggerType } })}
              onValueChange={v => setDraft({ ...draft, trigger: { ...draft.trigger, value: v } })}
              valuePlaceholder="Trigger condition value"
            />

            <Connector />

            {/* Action */}
            <FlowBlock
              color="from-purple-500 to-purple-600"
              icon={<Cog className="w-5 h-5 text-white" />}
              kind="ACTION"
              title="Do this..."
              typeOptions={ACTION_LABELS}
              selectedType={draft.action.type}
              value={draft.action.value}
              onTypeChange={t => setDraft({ ...draft, action: { ...draft.action, type: t as ActionType } })}
              onValueChange={v => setDraft({ ...draft, action: { ...draft.action, value: v } })}
              valuePlaceholder="Action target / parameter"
            />

            <Connector />

            {/* Outcome */}
            <FlowBlock
              color="from-green-500 to-green-600"
              icon={<CheckCircle2 className="w-5 h-5 text-white" />}
              kind="OUTCOME"
              title="With this result..."
              typeOptions={OUTCOME_LABELS}
              selectedType={draft.outcome.type}
              value={draft.outcome.value}
              onTypeChange={t => setDraft({ ...draft, outcome: { ...draft.outcome, type: t as OutcomeType } })}
              onValueChange={v => setDraft({ ...draft, outcome: { ...draft.outcome, value: v } })}
              valuePlaceholder="Outcome detail"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
            Cancel
          </button>
          <button
            onClick={() => onSave(draft)}
            disabled={!draft.name}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm disabled:opacity-50">
            Save Automation
          </button>
        </div>
      </div>
    </div>
  );
}

interface FlowBlockProps {
  color: string;
  icon: React.ReactNode;
  kind: string;
  title: string;
  typeOptions: Record<string, string>;
  selectedType: string;
  value: string;
  onTypeChange: (t: string) => void;
  onValueChange: (v: string) => void;
  valuePlaceholder: string;
}

function FlowBlock({ color, icon, kind, title, typeOptions, selectedType, value, onTypeChange, onValueChange, valuePlaceholder }: FlowBlockProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 w-[480px] overflow-hidden">
      <div className={`bg-gradient-to-r ${color} px-4 py-3 flex items-center gap-3`}>
        <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
          {icon}
        </div>
        <div>
          <div className="text-[10px] font-bold text-white/80 uppercase tracking-wider">{kind}</div>
          <div className="text-sm font-semibold text-white">{title}</div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
          <select
            value={selectedType}
            onChange={e => onTypeChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            {Object.entries(typeOptions).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
          <input
            value={value}
            onChange={e => onValueChange(e.target.value)}
            placeholder={valuePlaceholder}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex flex-col items-center my-1">
      <div className="w-0.5 h-6 bg-gray-300" />
      <ChevronRight className="w-4 h-4 text-gray-400 rotate-90 -my-1" />
      <div className="w-0.5 h-6 bg-gray-300" />
    </div>
  );
}
