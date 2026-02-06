'use client';

import { useState, useRef, useEffect } from 'react';

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

  // State for UI
  const [isDragging, setIsDragging] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(1);
  const [currentPos, setCurrentPos] = useState({ x: 50, y: 50 });

  // Saved values
  const [savedPos, setSavedPos] = useState({ x: 50, y: 50 });
  const [savedZoom, setSavedZoom] = useState(1);

  // Drag tracking
  const dragStart = useRef<{ mouseX: number; mouseY: number; posX: number; posY: number } | null>(null);

  // Parse position string like "50% 50% 1.5" into x, y, zoom
  const parsePosition = (pos: string): { x: number; y: number; zoom: number } => {
    const parts = pos.split(' ').map((p) => parseFloat(p.replace('%', '')));
    return {
      x: parts[0] ?? 50,
      y: parts[1] ?? 50,
      zoom: parts[2] ?? 1
    };
  };

  // Initialize from prop
  useEffect(() => {
    const parsed = parsePosition(position);
    setCurrentPos({ x: parsed.x, y: parsed.y });
    setSavedPos({ x: parsed.x, y: parsed.y });
    setCurrentZoom(parsed.zoom);
    setSavedZoom(parsed.zoom);
    setHasChanges(false);
  }, [position]);

  // Check if there are unsaved changes
  const checkChanges = (pos: { x: number; y: number }, zoom: number) => {
    const changed =
      Math.abs(pos.x - savedPos.x) > 0.5 ||
      Math.abs(pos.y - savedPos.y) > 0.5 ||
      Math.abs(zoom - savedZoom) > 0.05;
    setHasChanges(changed);
  };

  // Mouse down - start drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();

    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: currentPos.x,
      posY: currentPos.y,
    };
    setIsDragging(true);
  };

  // Global mouse move and mouse up
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStart.current || !containerRef.current) return;

      e.preventDefault();

      const rect = containerRef.current.getBoundingClientRect();
      const sensitivity = 2;

      const deltaX = ((e.clientX - dragStart.current.mouseX) / rect.width) * 100 * sensitivity;
      const deltaY = ((e.clientY - dragStart.current.mouseY) / rect.height) * 100 * sensitivity;

      // Invert because we're moving the image focal point
      const newX = Math.max(0, Math.min(100, dragStart.current.posX - deltaX));
      const newY = Math.max(0, Math.min(100, dragStart.current.posY - deltaY));

      const newPos = { x: newX, y: newY };
      setCurrentPos(newPos);
      checkChanges(newPos, currentZoom);
    };

    const handleMouseUp = () => {
      dragStart.current = null;
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, currentZoom, savedPos, savedZoom]);

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (disabled) return;
    e.preventDefault();

    const zoomSpeed = e.shiftKey ? 0.02 : 0.1;
    const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
    const newZoom = Math.max(0.5, Math.min(3, currentZoom + delta));

    setCurrentZoom(newZoom);
    checkChanges(currentPos, newZoom);
  };

  // Save
  const handleSave = () => {
    setSavedPos({ ...currentPos });
    setSavedZoom(currentZoom);
    onPositionChange(`${Math.round(currentPos.x)}% ${Math.round(currentPos.y)}% ${currentZoom.toFixed(2)}`);
    setHasChanges(false);
  };

  // Reset
  const handleReset = () => {
    setCurrentPos({ ...savedPos });
    setCurrentZoom(savedZoom);
    setHasChanges(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            overflow: 'hidden',
            cursor: disabled ? 'default' : isDragging ? 'grabbing' : 'grab',
            border: hasChanges || isDragging ? '1px solid var(--foreground)' : '1px solid var(--border)',
            backgroundColor: 'var(--muted)',
            position: 'relative',
            userSelect: 'none',
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
              objectPosition: `${currentPos.x}% ${currentPos.y}%`,
              transform: `scale(${currentZoom})`,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
        </div>
        {!disabled && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            {!hasChanges && !isDragging && (
              <div
                style={{
                  color: 'var(--muted-foreground)',
                  fontSize: '9px',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                }}
              >
                Drag · Scroll · ⇧ Fine
              </div>
            )}
            {(hasChanges || isDragging) && (
              <div
                style={{
                  color: 'var(--foreground)',
                  fontSize: '10px',
                  fontWeight: 500,
                  padding: '0.25rem 0.5rem',
                  border: '1px solid var(--border)',
                  borderRadius: '0',
                }}
              >
                {Math.round(currentZoom * 100)}%
              </div>
            )}
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
              borderRadius: '0',
              border: '1px solid var(--foreground)',
              backgroundColor: 'transparent',
              color: 'var(--foreground)',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--foreground)'}
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
              borderRadius: '0',
              border: '1px solid var(--muted-foreground)',
              backgroundColor: 'transparent',
              color: 'var(--muted-foreground)',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--muted-foreground)'}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
