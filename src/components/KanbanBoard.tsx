import React, { useState } from 'react';
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';
import { useClaims } from '../context/ClaimsContext';
import { CLAIM_STAGES, type ClaimStage, type Claim } from '../types/claim';
import ClaimCard from './ClaimCard';
import ClaimDetailModal from './ClaimDetailModal';

const KANBAN_STAGES: ClaimStage[] = [
  'new_claim',
  'claims_division',
  'premium_assessment',
  'cashier_validation',
  'ri_check',
  'ppw_cbw_checking',
  'treasury',
  'accounting',
  'check_signing',
  'check_release',
  'encoding_closing',
  'claims_committee',
  'denied',
  'closed',
];

export default function KanbanBoard() {
  const { claims, reorderClaims, moveClaimToStage } = useClaims();
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const srcStage = source.droppableId as ClaimStage;
    const destStage = destination.droppableId as ClaimStage;

    if (srcStage === destStage && source.index === destination.index) return;

    if (srcStage === destStage) {
      reorderClaims(srcStage, source.index, destination.index);
    } else {
      moveClaimToStage(draggableId, srcStage, destStage, destination.index);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 p-6 overflow-x-auto h-[calc(100vh-4rem)] pb-6">
          {KANBAN_STAGES.map(stageId => {
            const stage = CLAIM_STAGES.find(s => s.id === stageId)!;
            const stageClaims = claims.filter(c => c.stage === stageId);

            return (
              <div key={stageId} className="flex-shrink-0 w-[300px] flex flex-col bg-gray-50 rounded-xl border border-gray-200">
                {/* Column Header */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                      <h3 className="font-semibold text-sm text-gray-800">{stage.label}</h3>
                    </div>
                    <span className="text-xs font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
                      {stageClaims.length}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 leading-tight">{stage.description}</p>
                </div>

                {/* Cards */}
                <Droppable droppableId={stageId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto p-3 space-y-3 min-h-[100px] transition-colors duration-200
                        ${snapshot.isDraggingOver ? 'bg-blue-50/60 ring-2 ring-inset ring-blue-200 rounded-b-xl' : ''}`}
                    >
                      {stageClaims.map((claim, index) => (
                        <ClaimCard key={claim.id} claim={claim} index={index} onClick={setSelectedClaim} />
                      ))}
                      {provided.placeholder}
                      {stageClaims.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex items-center justify-center h-24 text-xs text-gray-300 border-2 border-dashed border-gray-200 rounded-lg">
                          Drag claims here
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {selectedClaim && (
        <ClaimDetailModal
          claim={claims.find(c => c.id === selectedClaim.id) ?? selectedClaim}
          onClose={() => setSelectedClaim(null)}
        />
      )}
    </>
  );
}
