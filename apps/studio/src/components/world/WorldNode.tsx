'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import type { World } from '@/lib/api';

export interface WorldNodeData {
  world: World;
  onClick: (world: World) => void;
}

function WorldNodeComponent({ data }: NodeProps<WorldNodeData>) {
  const { world, onClick } = data;

  const getTypeIcon = (type: string) => {
    return type === 'story' ? '\u2756' : '\u2B22'; // diamond or hexagon
  };

  return (
    <>
      <Handle type="target" position={Position.Top} className="world-node-handle" />
      <div className="world-node" onClick={() => onClick(world)}>
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
      <Handle type="source" position={Position.Bottom} className="world-node-handle" />
    </>
  );
}

export const WorldNode = memo(WorldNodeComponent);
