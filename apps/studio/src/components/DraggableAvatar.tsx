'use client';

import { useState, useRef, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'default-dev-key';

interface DraggableAvatarProps {
  src: string;
  position: string;
  onPositionChange: (position: string) => void;
  onRemove: () => void;
  onReplace?: (url: string) => void;
  disabled?: boolean;
}

export function DraggableAvatar({
  src,
  onRemove,
  onReplace,
  disabled = false,
}: DraggableAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(
    async (file: File) => {
      if (disabled || !onReplace) return;

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a JPEG, PNG, GIF, or WebP image');
        return;
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL}/uploads`, {
          method: 'POST',
          headers: {
            'x-api-key': API_KEY,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Upload failed');
        }

        const result = await response.json();
        onReplace(`${API_URL}${result.url}`);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setIsUploading(false);
      }
    },
    [disabled, onReplace]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleUpload(file);
      }
      e.target.value = '';
    },
    [handleUpload]
  );

  const handleChangePhotoClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={disabled || isUploading}
      />

      {/* Full image display */}
      <div style={{
        position: 'relative',
        backgroundColor: 'var(--muted)',
        borderRadius: '8px',
        overflow: 'visible',
      }}>
        <img
          src={src}
          alt="Avatar"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            borderRadius: '8px',
          }}
        />

        {/* Buttons overlay */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          right: '8px',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          {onReplace && (
            <button
              type="button"
              onClick={handleChangePhotoClick}
              disabled={disabled || isUploading}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                cursor: disabled || isUploading ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              {isUploading ? 'Uploading...' : 'Change Photo'}
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              cursor: disabled ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              marginLeft: 'auto',
            }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
