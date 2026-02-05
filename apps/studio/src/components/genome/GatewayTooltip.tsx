/**
 * Gateway Tooltip Component
 * Shows Layer 2 (Gateway) contextual hints
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface GatewayTooltipProps {
  title: string;
  keywords: string[];
  essence: string;
  creativePhase: string;
  learnMoreUrl?: string;
  children: React.ReactNode;
}

export function GatewayTooltip({
  title,
  keywords,
  essence,
  creativePhase,
  learnMoreUrl,
  children,
}: GatewayTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  return (
    <div
      className="gateway-tooltip-wrapper"
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <div
          className="gateway-tooltip"
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            marginTop: '0.5rem',
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '4px',
            padding: '1rem',
            minWidth: '320px',
            maxWidth: '400px',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            {title}
          </div>

          <div style={{
            fontSize: '0.75rem',
            opacity: 0.7,
            marginBottom: '0.75rem',
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}>
            {keywords.map((keyword, i) => (
              <React.Fragment key={i}>
                <span>{keyword}</span>
                {i < keywords.length - 1 && <span>·</span>}
              </React.Fragment>
            ))}
          </div>

          <div style={{ fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '0.75rem', opacity: 0.9 }}>
            {essence}
          </div>

          <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.75rem' }}>
            {creativePhase}
          </div>

          {learnMoreUrl && (
            <button
              onClick={() => router.push(learnMoreUrl)}
              style={{
                fontSize: '0.75rem',
                color: '#8b5cf6',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Learn Full Correspondences →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Simpler tooltip for inline use
 */
interface InlineTooltipProps {
  content: string;
  children: React.ReactNode;
}

export function InlineTooltip({ content, children }: InlineTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span
      style={{ position: 'relative', cursor: 'help' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <span
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '4px',
            padding: '0.5rem 0.75rem',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            marginBottom: '0.25rem',
            zIndex: 1000,
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
}
