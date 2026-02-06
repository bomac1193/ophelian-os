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

  // Zoom state
  const currentZoomRef = useRef(1);
  const savedZoomRef = useRef(1);
  const [zoomDisplay, setZoomDisplay] = useState(1);

  // Parse position string like "50% 50% 1.5" into x, y, zoom
  const parsePosition = (pos: string): { x: number; y: number; zoom: number } => {
    const parts = pos.split(' ').map((p) => parseFloat(p.replace('%', '')));
    return {
      x: parts[0] ?? 50,
      y: parts[1] ?? 50,
      zoom: parts[2] ?? 1
    };
  };

  // Initialize position from prop
  useEffect(() => {
    const parsed = parsePosition(position);
    currentPosRef.current = { x: parsed.x, y: parsed.y };
    savedPosRef.current = { x: parsed.x, y: parsed.y };
    currentZoomRef.current = parsed.zoom;
    savedZoomRef.current = parsed.zoom;
    setZoomDisplay(parsed.zoom);
    if (imgRef.current) {
      imgRef.current.style.objectPosition = `${parsed.x}% ${parsed.y}%`;
      imgRef.current.style.transform = `scale(${parsed.zoom})`;
    }
    setHasChanges(false);
  }, [position]);

  // Apply position and zoom directly to DOM for instant feedback
  const applyPosition = useCallback((x: number, y: number, zoom?: number) => {
    if (imgRef.current) {
      imgRef.current.style.objectPosition = `${x}% ${y}%`;
      if (zoom !== undefined) {
        imgRef.current.style.transform = `scale(${zoom})`;
      }
    }
  }, []);

  // Handle mouse wheel for zoom (hold Shift for fine control)
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (disabled) return;
      e.preventDefault();

      // Fine control with Shift key (0.02), normal is 0.1
      const zoomSpeed = e.shiftKey ? 0.02 : 0.1;
      const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
      const newZoom = Math.max(0.5, Math.min(3, currentZoomRef.current + delta));

      currentZoomRef.current = newZoom;
      setZoomDisplay(newZoom);
      applyPosition(currentPosRef.current.x, currentPosRef.current.y, newZoom);

      const hasChanged =
        Math.abs(currentZoomRef.current - savedZoomRef.current) > 0.05 ||
        Math.abs(currentPosRef.current.x - savedPosRef.current.x) > 0.5 ||
        Math.abs(currentPosRef.current.y - savedPosRef.current.y) > 0.5;
      setHasChanges(hasChanged);
    },
    [disabled, applyPosition]
  );

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
      applyPosition(newX, newY, currentZoomRef.current);

      // Update hasChanges during drag for visual feedback
      const hasChanged =
        Math.abs(currentPosRef.current.x - savedPosRef.current.x) > 0.5 ||
        Math.abs(currentPosRef.current.y - savedPosRef.current.y) > 0.5 ||
        Math.abs(currentZoomRef.current - savedZoomRef.current) > 0.05;
      setHasChanges(hasChanged);
    },
    [applyPosition]
  );

  const handleMouseUp = useCallback(() => {
    if (dragStartRef.current) {
      const hasChanged =
        Math.abs(currentPosRef.current.x - savedPosRef.current.x) > 0.5 ||
        Math.abs(currentPosRef.current.y - savedPosRef.current.y) > 0.5 ||
        Math.abs(currentZoomRef.current - savedZoomRef.current) > 0.05;
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
      applyPosition(newX, newY, currentZoomRef.current);

      // Update hasChanges during drag for visual feedback
      const hasChanged =
        Math.abs(currentPosRef.current.x - savedPosRef.current.x) > 0.5 ||
        Math.abs(currentPosRef.current.y - savedPosRef.current.y) > 0.5 ||
        Math.abs(currentZoomRef.current - savedZoomRef.current) > 0.05;
      setHasChanges(hasChanged);
    },
    [applyPosition]
  );

  const handleTouchEnd = useCallback(() => {
    if (dragStartRef.current) {
      const hasChanged =
        Math.abs(currentPosRef.current.x - savedPosRef.current.x) > 0.5 ||
        Math.abs(currentPosRef.current.y - savedPosRef.current.y) > 0.5 ||
        Math.abs(currentZoomRef.current - savedZoomRef.current) > 0.05;
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
    const zoom = currentZoomRef.current;
    savedPosRef.current = { ...pos };
    savedZoomRef.current = zoom;
    onPositionChange(`${Math.round(pos.x)}% ${Math.round(pos.y)}% ${zoom.toFixed(2)}`);
    setHasChanges(false);
  };

  const handleReset = () => {
    currentPosRef.current = { ...savedPosRef.current };
    currentZoomRef.current = savedZoomRef.current;
    setZoomDisplay(savedZoomRef.current);
    applyPosition(savedPosRef.current.x, savedPosRef.current.y, savedZoomRef.current);
    setHasChanges(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onWheel={handleWheel}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            overflow: 'hidden',
            cursor: disabled ? 'default' : isDragging ? 'grabbing' : 'grab',
            border: hasChanges ? '1px solid var(--foreground)' : '1px solid var(--border)',
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
              transform: `scale(${currentZoomRef.current})`,
              userSelect: 'none',
              pointerEvents: 'none',
              willChange: 'object-position, transform',
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
            {!hasChanges && (
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
            {hasChanges && (
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
                {Math.round(zoomDisplay * 100)}%
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
