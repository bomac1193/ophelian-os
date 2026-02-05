/**
 * License Voice Modal
 * Purchase/license a voice from the marketplace
 */

'use client';

import React, { useState } from 'react';
import type { MarketplaceVoice } from './VoiceMarketplace';
import { LicenseType } from '@lcos/shared';
import styles from './LicenseVoiceModal.module.css';

interface LicenseVoiceModalProps {
  voice: MarketplaceVoice;
  onClose: () => void;
  onSuccess: () => void;
}

export function LicenseVoiceModal({ voice, onClose, onSuccess }: LicenseVoiceModalProps) {
  const [selectedType, setSelectedType] = useState<string>(LicenseType.REVSHARE);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getPriceForType = (type: string) => {
    switch (type) {
      case LicenseType.EXCLUSIVE:
        return formatPrice(voice.pricing.exclusive);
      case LicenseType.NON_EXCLUSIVE:
        return `${formatPrice(voice.pricing.nonExclusive)} per use`;
      case LicenseType.REVSHARE:
        return `${voice.pricing.revShare.voiceActor}% / ${voice.pricing.revShare.creator}% / ${voice.pricing.revShare.platform}% split`;
      default:
        return '';
    }
  };

  const handleLicense = async () => {
    if (!agreedToTerms) {
      setError('You must agree to the terms to continue');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create license via API
      const response = await fetch('/api/licenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: 'user_demo', // TODO: Get from auth
          subjectType: 'VOICE',
          subjectId: voice.chromoxPersonaId,
          consentSynthesis: true,
          consentTraining: false, // Voice actor controls this
          commercialUse: true,
          licenseType: selectedType,
          royaltySplits: voice.pricing.revShare,
          terms: `Licensed voice "${voice.name}" from ${voice.actorName} via Bóveda Marketplace`,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create license');
      }

      // Success!
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to license voice');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>License Voice</h2>
            <p className={styles.voiceInfo}>
              {voice.name} by {voice.actorName}
            </p>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Select License Type</h3>
            <div className={styles.licenseTypes}>
              <label
                className={`${styles.licenseType} ${selectedType === LicenseType.EXCLUSIVE ? styles.selected : ''}`}
              >
                <input
                  type="radio"
                  name="licenseType"
                  value={LicenseType.EXCLUSIVE}
                  checked={selectedType === LicenseType.EXCLUSIVE}
                  onChange={(e) => setSelectedType(e.target.value)}
                />
                <div className={styles.licenseTypeContent}>
                  <div className={styles.licenseTypeHeader}>
                    <span className={styles.licenseTypeName}>🔒 Exclusive</span>
                    <span className={styles.licenseTypePrice}>
                      {formatPrice(voice.pricing.exclusive)}
                    </span>
                  </div>
                  <p className={styles.licenseTypeDesc}>
                    Full ownership. Only you can use this voice. One-time payment.
                  </p>
                </div>
              </label>

              <label
                className={`${styles.licenseType} ${selectedType === LicenseType.NON_EXCLUSIVE ? styles.selected : ''}`}
              >
                <input
                  type="radio"
                  name="licenseType"
                  value={LicenseType.NON_EXCLUSIVE}
                  checked={selectedType === LicenseType.NON_EXCLUSIVE}
                  onChange={(e) => setSelectedType(e.target.value)}
                />
                <div className={styles.licenseTypeContent}>
                  <div className={styles.licenseTypeHeader}>
                    <span className={styles.licenseTypeName}>🔓 Non-Exclusive</span>
                    <span className={styles.licenseTypePrice}>
                      {formatPrice(voice.pricing.nonExclusive)} / use
                    </span>
                  </div>
                  <p className={styles.licenseTypeDesc}>
                    Pay per usage. Others can license this voice too.
                  </p>
                </div>
              </label>

              <label
                className={`${styles.licenseType} ${selectedType === LicenseType.REVSHARE ? styles.selected : ''}`}
              >
                <input
                  type="radio"
                  name="licenseType"
                  value={LicenseType.REVSHARE}
                  checked={selectedType === LicenseType.REVSHARE}
                  onChange={(e) => setSelectedType(e.target.value)}
                />
                <div className={styles.licenseTypeContent}>
                  <div className={styles.licenseTypeHeader}>
                    <span className={styles.licenseTypeName}>💰 Revenue Share</span>
                    <span className={styles.licenseTypePrice}>
                      {voice.pricing.revShare.voiceActor}% / {voice.pricing.revShare.creator}% / {voice.pricing.revShare.platform}%
                    </span>
                  </div>
                  <p className={styles.licenseTypeDesc}>
                    Share revenue with voice actor. Best for monetized content.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>What You Get</h3>
            <ul className={styles.benefits}>
              <li>✓ Unlimited voice synthesis via Chromox</li>
              <li>✓ Commercial usage rights</li>
              <li>✓ Prosody & emotion controls</li>
              <li>✓ Transparent usage tracking</li>
              <li>✓ Consent-verified & ethical AI</li>
            </ul>
          </div>

          <div className={styles.section}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <span>
                I agree to the <a href="/terms" target="_blank" className={styles.link}>terms of service</a> and understand that the voice actor receives royalties per the selected license type.
              </span>
            </label>
          </div>

          {error && (
            <div className={styles.error}>
              ⚠️ {error}
            </div>
          )}

          <div className={styles.actions}>
            <button
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handleLicense}
              className={styles.licenseButton}
              disabled={isProcessing || !agreedToTerms}
            >
              {isProcessing ? 'Processing...' : `License for ${getPriceForType(selectedType)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
