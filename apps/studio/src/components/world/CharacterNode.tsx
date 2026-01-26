'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import type { Character } from '@/lib/api';

export interface CharacterNodeData {
  character: Character;
  onClick: (character: Character) => void;
}

function CharacterNodeComponent({ data }: NodeProps<CharacterNodeData>) {
  const { character, onClick } = data;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Handle type="target" position={Position.Top} className="character-node-handle" />
      <div className="character-node" onClick={() => onClick(character)}>
        <div className="character-node-avatar">
          {character.avatarUrl ? (
            <img
              src={character.avatarUrl}
              alt={character.name}
              style={{ objectPosition: character.avatarPosition || '50% 50%' }}
            />
          ) : (
            <span className="character-node-initials">{getInitials(character.name)}</span>
          )}
        </div>
        <div className="character-node-name">{character.name}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="character-node-handle" />
    </>
  );
}

export const CharacterNode = memo(CharacterNodeComponent);
