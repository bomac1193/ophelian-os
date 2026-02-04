'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import type { World } from '@/lib/api';

export interface WorldNodeData {
  world: World;
  isConnectSource?: boolean;
  shiftHeld?: boolean;
  onClick: (world: World) => void;
}

const FULLSURFACE_HANDLE_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  transform: 'none',
  borderRadius: 8,
  background: 'transparent',
  border: '2px dashed rgba(245, 158, 11, 0.6)',
  opacity: 1,
  zIndex: 10,
  cursor: 'crosshair',
  pointerEvents: 'all',
};

function WorldNodeComponent({ data }: NodeProps<WorldNodeData>) {
  const { world, isConnectSource, shiftHeld, onClick } = data;

  const getTypeIcon = (type: string) => {
    return type === 'story' ? '\u2756' : '\u2B22';
  };

  return (
    <>
      {!shiftHeld && (
        <>
          <Handle type="target" position={Position.Top} className="world-node-handle" />
          <Handle type="source" position={Position.Bottom} className="world-node-handle" />
        </>
      )}

      <div
        className={`world-node ${isConnectSource ? 'world-node-connecting' : ''} ${shiftHeld ? 'world-node-shift' : ''}`}
        onClick={() => onClick(world)}
      >
        <div className="world-node-icon">
          {world.imageUrl ? (
            <img src={world.imageUrl} alt={world.name} />
          ) : (
            <span className="world-node-type-icon">{getTypeIcon(world.type)}</span>
          )}
        </div>
        <div className="world-node-content">
          <div className="world-node-name">{world.name}</div>
          <div className="world-node-type">{world.type}</div>
        </div>
      </div>

      {shiftHeld && (
        <>
          <Handle
            type="source"
            position={Position.Top}
            id="shift-source"
            style={FULLSURFACE_HANDLE_STYLE}
          />
          <Handle
            type="target"
            position={Position.Bottom}
            id="shift-target"
            style={FULLSURFACE_HANDLE_STYLE}
          />
        </>
      )}
    </>
  );
}

export const WorldNode = memo(WorldNodeComponent);
