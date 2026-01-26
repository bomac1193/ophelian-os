'use client';

import { memo } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from 'reactflow';
import type { CharacterRelationship, RelationshipType } from '@/lib/api';

export interface RelationshipEdgeData {
  relationship: CharacterRelationship;
  onClick: (relationship: CharacterRelationship) => void;
}

const RELATIONSHIP_COLORS: Record<RelationshipType, string> = {
  ALLY: '#22c55e',
  ENEMY: '#ef4444',
  MENTOR: '#8b5cf6',
  FAMILY: '#f59e0b',
  RIVAL: '#f97316',
  FRIEND: '#3b82f6',
  LOVER: '#ec4899',
  CUSTOM: '#6b7280',
};

function RelationshipEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps<RelationshipEdgeData>) {
  const relationship = data?.relationship;
  const onClick = data?.onClick;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const color = relationship ? RELATIONSHIP_COLORS[relationship.relationshipType] : '#6b7280';
  const label =
    relationship?.customTypeName || relationship?.relationshipType.toLowerCase().replace('_', ' ') || '';

  return (
    <>
      <path
        id={id}
        className="relationship-edge-path"
        d={edgePath}
        stroke={color}
        strokeWidth={2}
        fill="none"
        markerEnd={markerEnd}
        style={{ cursor: 'pointer' }}
        onClick={() => relationship && onClick?.(relationship)}
      />
      <EdgeLabelRenderer>
        <div
          className="relationship-edge-label"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            background: color,
            pointerEvents: 'all',
          }}
          onClick={() => relationship && onClick?.(relationship)}
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export const RelationshipEdge = memo(RelationshipEdgeComponent);
