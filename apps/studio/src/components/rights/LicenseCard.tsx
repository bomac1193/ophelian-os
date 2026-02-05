/**
 * License Card Component
 * Displays a single license with its details and controls
 */

'use client';

import React from 'react';
import type { License } from '@lcos/shared';
import styles from './LicenseCard.module.css';

interface LicenseCardProps {
  license: License;
  onDelete: () => void;
}

export function LicenseCard({ license, onDelete }: LicenseCardProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'EXCLUSIVE':
        return '🔒 Exclusive';
      case 'NON_EXCLUSIVE':
        return '🔓 Non-Exclusive';
      case 'REVSHARE':
        return '💰 Revenue Share';
      default:
        return type;
    }
  };

  const getSubjectTypeLabel = (type: string) => {
    switch (type) {
      case 'VOICE':
        return '🎤 Voice';
      case 'CHARACTER':
        return '🎭 Character';
      default:
        return type;
    }
  };

  const totalSplits = license.royaltySplits.voiceActor +
                      license.royaltySplits.creator +
                      license.royaltySplits.platform;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.typeContainer}>
          <span className={styles.subjectType}>
            {getSubjectTypeLabel(license.subjectType)}
          </span>
          <span className={`${styles.licenseType} ${styles[license.licenseType.toLowerCase()]}`}>
            {getTypeLabel(license.licenseType)}
          </span>
        </div>
        <button onClick={onDelete} className={styles.deleteButton} title="Delete license">
          ×
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Subject ID:</span>
          <span className={styles.value}>{license.subjectId}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.label}>Owner ID:</span>
          <span className={styles.value}>{license.ownerId}</span>
        </div>

        <div className={styles.permissions}>
          <h4 className={styles.sectionTitle}>Permissions</h4>
          <div className={styles.permissionGrid}>
            <div className={styles.permission}>
              <span className={`${styles.permissionIcon} ${license.consentSynthesis ? styles.granted : styles.denied}`}>
                {license.consentSynthesis ? '✓' : '×'}
              </span>
              <span className={styles.permissionLabel}>Synthesis</span>
            </div>
            <div className={styles.permission}>
              <span className={`${styles.permissionIcon} ${license.consentTraining ? styles.granted : styles.denied}`}>
                {license.consentTraining ? '✓' : '×'}
              </span>
              <span className={styles.permissionLabel}>Training</span>
            </div>
            <div className={styles.permission}>
              <span className={`${styles.permissionIcon} ${license.commercialUse ? styles.granted : styles.denied}`}>
                {license.commercialUse ? '✓' : '×'}
              </span>
              <span className={styles.permissionLabel}>Commercial</span>
            </div>
          </div>
        </div>

        <div className={styles.royalties}>
          <h4 className={styles.sectionTitle}>Royalty Splits</h4>
          <div className={styles.splitGrid}>
            <div className={styles.splitItem}>
              <div className={styles.splitBar}>
                <div
                  className={`${styles.splitFill} ${styles.voiceActor}`}
                  style={{ width: `${(license.royaltySplits.voiceActor / totalSplits) * 100}%` }}
                />
              </div>
              <div className={styles.splitLabel}>
                <span>Voice Actor</span>
                <span className={styles.splitValue}>{license.royaltySplits.voiceActor}%</span>
              </div>
            </div>

            <div className={styles.splitItem}>
              <div className={styles.splitBar}>
                <div
                  className={`${styles.splitFill} ${styles.creator}`}
                  style={{ width: `${(license.royaltySplits.creator / totalSplits) * 100}%` }}
                />
              </div>
              <div className={styles.splitLabel}>
                <span>Creator</span>
                <span className={styles.splitValue}>{license.royaltySplits.creator}%</span>
              </div>
            </div>

            <div className={styles.splitItem}>
              <div className={styles.splitBar}>
                <div
                  className={`${styles.splitFill} ${styles.platform}`}
                  style={{ width: `${(license.royaltySplits.platform / totalSplits) * 100}%` }}
                />
              </div>
              <div className={styles.splitLabel}>
                <span>Platform</span>
                <span className={styles.splitValue}>{license.royaltySplits.platform}%</span>
              </div>
            </div>
          </div>
        </div>

        {license.terms && (
          <div className={styles.terms}>
            <h4 className={styles.sectionTitle}>Terms</h4>
            <p className={styles.termsText}>{license.terms}</p>
          </div>
        )}

        <div className={styles.footer}>
          <span className={styles.date}>
            Created {new Date(license.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
