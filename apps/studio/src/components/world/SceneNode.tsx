'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import type { Scene } from '@/lib/api';

export interface SceneNodeData {
  scene: Scene;
  isConnectSource?: boolean;
  onClick: (scene: Scene) => void;
}

function SceneNodeComponent({ data }: NodeProps<SceneNodeData>) {
  const { scene, isConnectSource, onClick } = data;

  const getTypeIcon = (type: string) => {
    return type === 'event' ? '\u2605' : '\u25A0'; // star or square
  };

  return (
    <>
      <Handle type="target" position={Position.Top} className="scene-node-handle" />
      <div
        className={`scene-node ${isConnectSource ? 'scene-node-connecting' : ''}`}
        onClick={() => onClick(scene)}
      >
        <div className="scene-node-icon">
          {scene.imageUrl ? (
            <img src={scene.imageUrl} alt={scene.name} />
          ) : (
            <span className="scene-node-type-icon">{getTypeIcon(scene.type)}</span>
          )}
        </div>
        <div className="scene-node-content">
          <div className="scene-node-name">{scene.name}</div>
          <div className="scene-node-type">{scene.type}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="scene-node-handle" />
    </>
  );
}

export const SceneNode = memo(SceneNodeComponent);
