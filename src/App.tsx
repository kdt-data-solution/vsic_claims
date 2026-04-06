import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ClaimsProvider } from './context/ClaimsContext';
import Sidebar from './components/Sidebar';
import KanbanBoard from './components/KanbanBoard';
import ClaimForm from './components/ClaimForm';
import Dashboard from './pages/Dashboard';
import FlowchartPage from './pages/FlowchartPage';

export default function App() {
  const [showNewClaim, setShowNewClaim] = useState(false);

  return (
    <ClaimsProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar onNewClaim={() => setShowNewClaim(true)} />
        <main className="flex-1 overflow-hidden">
          {/* Top bar */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div>
              <Routes>
                <Route path="/" element={<span className="font-semibold text-gray-700">Dashboard</span>} />
                <Route path="/board" element={<span className="font-semibold text-gray-700">Claims Board</span>} />
                <Route path="/flowchart" element={<span className="font-semibold text-gray-700">Process Flowchart</span>} />
              </Routes>
            </div>
            <button onClick={() => setShowNewClaim(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
              + New Claim
            </button>
          </header>

          {/* Page content */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/board" element={<KanbanBoard />} />
            <Route path="/flowchart" element={<FlowchartPage />} />
          </Routes>
        </main>

        {showNewClaim && <ClaimForm onClose={() => setShowNewClaim(false)} />}
      </div>
    </ClaimsProvider>
  );
}
