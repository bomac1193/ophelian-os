'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import type { Scene } from '@/lib/api';

export interface SceneNodeData {
  scene: Scene;
  isConnectSource?: boolean;
  shiftHeld?: boolean;
  onClick: (scene: Scene) => void;
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

function SceneNodeComponent({ data }: NodeProps<SceneNodeData>) {
  const { scene, isConnectSource, shiftHeld, onClick } = data;

  const getTypeIcon = (type: string) => {
    return type === 'event' ? '\u2605' : '\u25A0';
  };

  return (
    <>
      {!shiftHeld && (
        <>
          <Handle type="target" position={Position.Top} className="scene-node-handle" />
          <Handle type="source" position={Position.Bottom} className="scene-node-handle" />
        </>
      )}

      <div
        className={`scene-node ${isConnectSource ? 'scene-node-connecting' : ''} ${shiftHeld ? 'scene-node-shift' : ''}`}
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

export const SceneNode = memo(SceneNodeComponent);
