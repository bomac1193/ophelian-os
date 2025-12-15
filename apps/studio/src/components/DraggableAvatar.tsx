'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface DraggableAvatarProps {
  src: string;
  position: string;
  onPositionChange: (position: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function DraggableAvatar({
  src,
  position,
  onPositionChange,
  onRemove,
  disabled = false,
}: DraggableAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localPosition, setLocalPosition] = useState(position);
  const [hasChanges, setHasChanges] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);

  // Parse position string like "50% 50%" into x, y numbers
  const parsePosition = (pos: string): { x: number; y: number } => {
    const parts = pos.split(' ').map((p) => parseFloat(p.replace('%', '')));
    return { x: parts[0] ?? 50, y: parts[1] ?? 50 };
  };

  // Convert x, y numbers to position string
  const formatPosition = (x: number, y: number): string => {
    return `${Math.round(x)}% ${Math.round(y)}%`;
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      const { x, y } = parsePosition(localPosition);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        posX: x,
        posY: y,
      };
      setIsDragging(true);
    },
    [localPosition, disabled]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current || !containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();

      // Calculate delta as percentage of container size
      const deltaX = ((e.clientX - dragStartRef.current.x) / rect.width) * 100;
      const deltaY = ((e.clientY - dragStartRef.current.y) / rect.height) * 100;

      // Invert the delta because we're moving the image, not the viewport
      const newX = Math.max(0, Math.min(100, dragStartRef.current.posX - deltaX));
      const newY = Math.max(0, Math.min(100, dragStartRef.current.posY - deltaY));

      const newPosition = formatPosition(newX, newY);
      setLocalPosition(newPosition);
      setHasChanges(newPosition !== position);
    },
    [isDragging, position]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;
      const touch = e.touches[0];
      if (!touch) return;
      const { x, y } = parsePosition(localPosition);
      dragStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        posX: x,
        posY: y,
      };
      setIsDragging(true);
    },
    [localPosition, disabled]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !dragStartRef.current || !containerRef.current) return;
      e.preventDefault();

      const touch = e.touches[0];
      if (!touch) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();

      const deltaX = ((touch.clientX - dragStartRef.current.x) / rect.width) * 100;
      const deltaY = ((touch.clientY - dragStartRef.current.y) / rect.height) * 100;

      const newX = Math.max(0, Math.min(100, dragStartRef.current.posX - deltaX));
      const newY = Math.max(0, Math.min(100, dragStartRef.current.posY - deltaY));

      const newPosition = formatPosition(newX, newY);
      setLocalPosition(newPosition);
      setHasChanges(newPosition !== position);
    },
    [isDragging, position]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  // Add/remove global event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Sync local position when prop changes
  useEffect(() => {
    setLocalPosition(position);
    setHasChanges(false);
  }, [position]);

  const handleSave = () => {
    onPositionChange(localPosition);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalPosition(position);
    setHasChanges(false);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          position: 'relative',
          width: '100%',
          height: '200px',
          borderRadius: '8px',
          overflow: 'hidden',
          cursor: disabled ? 'default' : isDragging ? 'grabbing' : 'grab',
          border: hasChanges ? '2px solid var(--primary)' : '2px solid transparent',
          boxSizing: 'border-box',
        }}
      >
        <img
          src={src}
          alt="Avatar"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: localPosition,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
        {!disabled && (
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              pointerEvents: 'none',
            }}
          >
            {isDragging ? 'Dragging...' : 'Drag to reposition'}
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          disabled={disabled}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: 'white',
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
          }}
        >
          x
        </button>
      </div>

      {hasChanges && (
        <div className="flex gap-2" style={{ marginTop: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            disabled={disabled}
            style={{ flex: 1 }}
          >
            Save Position
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleReset}
            disabled={disabled}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
