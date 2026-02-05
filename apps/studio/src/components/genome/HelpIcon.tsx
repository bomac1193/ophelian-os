/**
 * Help Icon Component
 * Contextual help tooltips for Symbol System
 */

'use client';

import React, { useState } from 'react';
import styles from './HelpIcon.module.css';

interface HelpIconProps {
  content: string | React.ReactNode;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function HelpIcon({ content, title, position = 'top' }: HelpIconProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.iconButton}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(!isVisible);
        }}
        aria-label="Help"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8 11.5V11.5M8 9V8C8 7.44772 8.44772 7 9 7V7C9.55228 7 10 6.55228 10 6V6C10 5.44772 9.55228 5 9 5H7.5C6.94772 5 6.5 5.44772 6.5 6V6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {isVisible && (
        <div className={`${styles.tooltip} ${styles[position]}`}>
          {title && <div className={styles.tooltipTitle}>{title}</div>}
          <div className={styles.tooltipContent}>{content}</div>
        </div>
      )}
    </div>
  );
}

interface InlineHelpProps {
  text: string;
  learnMoreUrl?: string;
}

export function InlineHelp({ text, learnMoreUrl }: InlineHelpProps) {
  return (
    <div className={styles.inlineHelp}>
      <span className={styles.inlineIcon}>ⓘ</span>
      <span className={styles.inlineText}>{text}</span>
      {learnMoreUrl && (
        <a href={learnMoreUrl} className={styles.learnMore}>
          Learn more →
        </a>
      )}
    </div>
  );
}
