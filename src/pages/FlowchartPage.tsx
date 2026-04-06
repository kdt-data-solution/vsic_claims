import React from 'react';
import { ArrowDown, ArrowRight, Diamond, CheckCircle, XCircle } from 'lucide-react';

interface FlowNodeProps {
  label: string;
  type?: 'start' | 'end' | 'process' | 'decision' | 'terminal';
  color?: string;
}

function FlowNode({ label, type = 'process', color }: FlowNodeProps) {
  const styles: Record<string, string> = {
    start: 'bg-orange-400 text-white rounded-full px-6 py-2 text-sm font-bold',
    end: 'bg-orange-400 text-white rounded-full px-6 py-2 text-sm font-bold',
    process: `${color || 'bg-amber-100 border-amber-300 text-amber-900'} border-2 rounded-lg px-4 py-2.5 text-sm font-medium`,
    decision: 'bg-teal-600 text-white rotate-45 w-28 h-28 flex items-center justify-center text-xs font-bold',
    terminal: 'bg-red-100 border-red-300 text-red-800 border-2 rounded-lg px-4 py-2.5 text-sm font-medium',
  };

  if (type === 'decision') {
    return (
      <div className="flex items-center justify-center">
        <div className={styles.decision}>
          <span className="-rotate-45 text-center leading-tight">{label}</span>
        </div>
      </div>
    );
  }

  return <div className={`text-center max-w-[220px] ${styles[type]}`}>{label}</div>;
}

function Arrow({ direction = 'down', label }: { direction?: 'down' | 'right'; label?: string }) {
  return (
    <div className={`flex ${direction === 'down' ? 'flex-col' : 'flex-row'} items-center gap-1 ${direction === 'down' ? 'py-1' : 'px-2'}`}>
      {label && <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{label}</span>}
      {direction === 'down' ? (
        <ArrowDown className="w-4 h-4 text-gray-400" />
      ) : (
        <ArrowRight className="w-4 h-4 text-gray-400" />
      )}
    </div>
  );
}

export default function FlowchartPage() {
  return (
    <div className="p-6 overflow-y-auto h-[calc(100vh-4rem)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Claims Process Flowchart</h1>
        <p className="text-sm text-gray-500 mt-1">Visual reference for the insurance claims processing workflow</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Main Flow */}
          <div className="flex flex-col items-center">
            <FlowNode label="Start" type="start" />
            <Arrow />

            <FlowNode label="Client Submits Claim Forms to Claims Division" color="bg-amber-100 border-amber-300 text-amber-900" />
            <Arrow />

            <div className="flex items-start gap-12">
              {/* Left branch - Claims Registry */}
              <div className="flex flex-col items-center">
                <FlowNode label="Claims Registry / Notify RISC" color="bg-amber-100 border-amber-300 text-amber-900" />
                <Arrow />
                <FlowNode label="Generate PLA / Manual PLA" color="bg-amber-100 border-amber-300 text-amber-900" />
                <Arrow />
                <FlowNode label="RI Partners Loss Notification" color="bg-amber-100 border-amber-300 text-amber-900" />
              </div>

              {/* Center - Main flow */}
              <div className="flex flex-col items-center">
                <FlowNode label="Claims Division (Validate, Assess & Encode)" color="bg-blue-100 border-blue-300 text-blue-900" />
                <Arrow />

                <FlowNode label="Validation Outcomes" type="decision" />
                <Arrow />

                <div className="flex items-start gap-16 mt-4">
                  {/* Incomplete path */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-red-500 font-semibold mb-2">INCOMPLETE / REJECTED</span>
                    <FlowNode label="Return to Client" type="terminal" />
                  </div>

                  {/* Complete path */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-green-600 font-semibold mb-2">COMPLETE / VALIDATED</span>
                    <Arrow />

                    <FlowNode label="Premium Payment Assessment (90-Day Rule)" color="bg-purple-100 border-purple-300 text-purple-900" />
                    <Arrow />

                    <FlowNode label="Within 90 Days?" type="decision" />
                    <Arrow />

                    <div className="flex items-start gap-16 mt-4">
                      {/* Beyond 90 days */}
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-red-500 font-semibold mb-2">BEYOND 90 DAYS</span>
                        <FlowNode label="Cashier to Further Validate" color="bg-pink-100 border-pink-300 text-pink-900" />
                        <Arrow />
                        <FlowNode label="Premium Requirements Met?" type="decision" />
                        <Arrow />
                        <div className="flex items-start gap-12 mt-4">
                          <div className="flex flex-col items-center">
                            <span className="text-xs text-red-500 font-semibold mb-2">NO</span>
                            <FlowNode label="Disapproved / Rejected" type="terminal" />
                            <Arrow />
                            <FlowNode label="Issue Denial Letter" type="terminal" />
                            <Arrow />
                            <FlowNode label="End" type="end" />
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-xs text-green-600 font-semibold mb-2">YES</span>
                            <span className="text-xs text-gray-400 italic">Continue to RI Check →</span>
                          </div>
                        </div>
                      </div>

                      {/* Within 90 days */}
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-green-600 font-semibold mb-2">WITHIN 90 DAYS</span>

                        <FlowNode label="RI Covered?" type="decision" />
                        <Arrow />

                        <div className="flex items-start gap-12 mt-2">
                          <div className="flex flex-col items-center">
                            <FlowNode label="PPW, CBW & Loss Notification Checking" color="bg-indigo-100 border-indigo-300 text-indigo-900" />
                            <Arrow />
                            <FlowNode label="Outstanding Issues?" type="decision" />
                            <Arrow />
                            <div className="flex items-start gap-12 mt-4">
                              <div className="flex flex-col items-center">
                                <span className="text-xs text-orange-500 font-semibold mb-2">YES</span>
                                <FlowNode label="Claims Committee Review" color="bg-fuchsia-100 border-fuchsia-300 text-fuchsia-900" />
                                <Arrow />
                                <div className="flex items-start gap-12 mt-3">
                                  <div className="flex flex-col items-center">
                                    <span className="text-xs text-green-600 font-semibold mb-2">APPROVED</span>
                                    <FlowNode label="Back to Treasury" color="bg-orange-100 border-orange-300 text-orange-900" />
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <span className="text-xs text-red-500 font-semibold mb-2">DISAPPROVED</span>
                                    <FlowNode label="Issue Denial Letter" type="terminal" />
                                    <Arrow />
                                    <FlowNode label="End" type="end" />
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-xs text-green-600 font-semibold mb-2">NO</span>
                                <span className="text-xs text-gray-400 italic">Continue ↓</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Treasury onwards */}
            <div className="mt-8 flex flex-col items-center border-t-2 border-dashed border-gray-200 pt-8 w-full">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Payment Processing</h3>

              <FlowNode label="Treasury - Funds Availability Confirmation" color="bg-orange-100 border-orange-300 text-orange-900" />
              <Arrow />

              <div className="flex items-start gap-12">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-amber-500 font-semibold mb-2">WAITING FOR FUNDS</span>
                  <FlowNode label="Back to Treasury (wait)" color="bg-amber-50 border-amber-200 text-amber-800" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-green-600 font-semibold mb-2">FUNDS AVAILABLE</span>
                  <FlowNode label="Request of Funds" color="bg-orange-100 border-orange-300 text-orange-900" />
                  <Arrow />
                  <FlowNode label="Accounting - Check Preparation" color="bg-sky-100 border-sky-300 text-sky-900" />
                  <Arrow />
                  <FlowNode label="OES-P - Check Signed & Ready" color="bg-emerald-100 border-emerald-300 text-emerald-900" />
                  <Arrow />
                  <FlowNode label="Notify Claimant for Releasing of Check" color="bg-emerald-100 border-emerald-300 text-emerald-900" />
                  <Arrow />
                  <FlowNode label="Check Release / Pick-up" color="bg-green-100 border-green-300 text-green-900" />
                  <Arrow />
                  <FlowNode label="Encode Released Check on Monitoring" color="bg-lime-100 border-lime-300 text-lime-900" />
                  <Arrow />
                  <FlowNode label="Close Transaction to GENIISYS" color="bg-lime-100 border-lime-300 text-lime-900" />
                  <Arrow />
                  <FlowNode label="End" type="end" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-400 rounded-full" />
            <span className="text-xs text-gray-600">Start / End</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-100 border-2 border-amber-300 rounded" />
            <span className="text-xs text-gray-600">Process Step</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-teal-600 rotate-45" />
            <span className="text-xs text-gray-600 ml-1">Decision Point</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-100 border-2 border-red-300 rounded" />
            <span className="text-xs text-gray-600">Rejection / Denial</span>
          </div>
        </div>
      </div>
    </div>
  );
}
