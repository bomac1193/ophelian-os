'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface RepositionableCircleAvatarProps {
  src: string;
  position: string;
  onPositionChange: (position: string) => void;
  size?: number;
  disabled?: boolean;
}

export function RepositionableCircleAvatar({
  src,
  position,
  onPositionChange,
  size = 120,
  disabled = false,
}: RepositionableCircleAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Store position in ref for fast updates during drag
  const currentPosRef = useRef({ x: 50, y: 50 });
  const savedPosRef = useRef({ x: 50, y: 50 });
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);

  // Parse position string like "50% 50%" into x, y numbers
  const parsePosition = (pos: string): { x: number; y: number } => {
    const parts = pos.split(' ').map((p) => parseFloat(p.replace('%', '')));
    return { x: parts[0] ?? 50, y: parts[1] ?? 50 };
  };

  // Initialize position from prop
  useEffect(() => {
    const parsed = parsePosition(position);
    currentPosRef.current = parsed;
    savedPosRef.current = parsed;
    if (imgRef.current) {
      imgRef.current.style.objectPosition = `${parsed.x}% ${parsed.y}%`;
    }
    setHasChanges(false);
  }, [position]);

  // Apply position directly to DOM for instant feedback
  const applyPosition = useCallback((x: number, y: number) => {
    if (imgRef.current) {
      imgRef.current.style.objectPosition = `${x}% ${y}%`;
    }
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        posX: currentPosRef.current.x,
        posY: currentPosRef.current.y,
      };
      setIsDragging(true);
    },
    [disabled]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragStartRef.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      // Calculate delta as percentage of container size (scaled up for faster movement)
      const sensitivity = 1.5;
      const deltaX = ((e.clientX - dragStartRef.current.x) / rect.width) * 100 * sensitivity;
      const deltaY = ((e.clientY - dragStartRef.current.y) / rect.height) * 100 * sensitivity;

      // Invert the delta because we're moving the image, not the viewport
      const newX = Math.max(0, Math.min(100, dragStartRef.current.posX - deltaX));
      const newY = Math.max(0, Math.min(100, dragStartRef.current.posY - deltaY));

      currentPosRef.current = { x: newX, y: newY };

      // Direct DOM manipulation for instant feedback
      applyPosition(newX, newY);
    },
    [applyPosition]
  );

  const handleMouseUp = useCallback(() => {
    if (dragStartRef.current) {
      const hasChanged =
        Math.abs(currentPosRef.current.x - savedPosRef.current.x) > 0.5 ||
        Math.abs(currentPosRef.current.y - savedPosRef.current.y) > 0.5;
      setHasChanges(hasChanged);
    }
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;
      const touch = e.touches[0];
      if (!touch) return;
      dragStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        posX: currentPosRef.current.x,
        posY: currentPosRef.current.y,
      };
      setIsDragging(true);
    },
    [disabled]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!dragStartRef.current || !containerRef.current) return;
      e.preventDefault();

      const touch = e.touches[0];
      if (!touch) return;

      const rect = containerRef.current.getBoundingClientRect();
      const sensitivity = 1.5;

      const deltaX = ((touch.clientX - dragStartRef.current.x) / rect.width) * 100 * sensitivity;
      const deltaY = ((touch.clientY - dragStartRef.current.y) / rect.height) * 100 * sensitivity;

      const newX = Math.max(0, Math.min(100, dragStartRef.current.posX - deltaX));
      const newY = Math.max(0, Math.min(100, dragStartRef.current.posY - deltaY));

      currentPosRef.current = { x: newX, y: newY };
      applyPosition(newX, newY);
    },
    [applyPosition]
  );

  const handleTouchEnd = useCallback(() => {
    if (dragStartRef.current) {
      const hasChanged =
        Math.abs(currentPosRef.current.x - savedPosRef.current.x) > 0.5 ||
        Math.abs(currentPosRef.current.y - savedPosRef.current.y) > 0.5;
      setHasChanges(hasChanged);
    }
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

  const handleSave = () => {
    const pos = currentPosRef.current;
    savedPosRef.current = { ...pos };
    onPositionChange(`${Math.round(pos.x)}% ${Math.round(pos.y)}%`);
    setHasChanges(false);
  };

  const handleReset = () => {
    currentPosRef.current = { ...savedPosRef.current };
    applyPosition(savedPosRef.current.x, savedPosRef.current.y);
    setHasChanges(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          overflow: 'hidden',
          cursor: disabled ? 'default' : isDragging ? 'grabbing' : 'grab',
          border: hasChanges ? '3px solid var(--primary)' : '3px solid var(--border)',
          backgroundColor: 'var(--muted)',
          position: 'relative',
          touchAction: 'none',
        }}
      >
        <img
          ref={imgRef}
          src={src}
          alt="Avatar"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: `${currentPosRef.current.x}% ${currentPosRef.current.y}%`,
            userSelect: 'none',
            pointerEvents: 'none',
            willChange: 'object-position',
          }}
        />
        {!disabled && !hasChanges && (
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '10px',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Drag to reposition
          </div>
        )}
      </div>

      {hasChanges && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={handleSave}
            disabled={disabled}
            style={{
              padding: '4px 12px',
              fontSize: '12px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#22c55e',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={disabled}
            style={{
              padding: '4px 12px',
              fontSize: '12px',
              borderRadius: '4px',
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
              color: 'var(--foreground)',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
