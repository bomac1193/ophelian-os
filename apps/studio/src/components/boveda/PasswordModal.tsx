'use client';

import { useState, useRef, useEffect } from 'react';

interface PasswordModalProps {
  isOpen: boolean;
  relicName: string;
  onClose: () => void;
  onSubmit: (password: string) => Promise<boolean>;
}

export function PasswordModal({ isOpen, relicName, onClose, onSubmit }: PasswordModalProps) {
  const [value, setValue] = useState('');
  const [shaking, setShaking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checking, setChecking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue('');
      setShaking(false);
      setSuccess(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || checking) return;

    setChecking(true);
    const correct = await onSubmit(value);
    setChecking(false);

    if (correct) {
      setSuccess(true);
      setTimeout(() => onClose(), 800);
    } else {
      setShaking(true);
      setTimeout(() => {
        setShaking(false);
        setValue('');
      }, 500);
    }
  };

  return (
    <div className="reliquary-modal-overlay" onClick={onClose}>
      <div
        className={`reliquary-modal ${shaking ? 'reliquary-shake' : ''} ${success ? 'reliquary-success' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="reliquary-modal-prompt">Speak the word...</p>
        <p className="reliquary-modal-relic">{relicName}</p>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="reliquary-modal-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter password"
            autoComplete="off"
            spellCheck={false}
            disabled={checking || success}
          />
          <button
            type="submit"
            className="btn btn-primary reliquary-modal-submit"
            disabled={!value.trim() || checking || success}
          >
            {checking ? '...' : success ? 'Unlocked' : 'Attempt'}
          </button>
        </form>
      </div>
    </div>
  );
}
