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
      setError('The covenant requires your acceptance');
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
      setError(err instanceof Error ? err.message : 'The binding could not be forged');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Bind Vessel</h2>
            <p className={styles.voiceInfo}>
              {voice.name} — channeled by {voice.actorName}
            </p>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Choose Your Covenant</h3>
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
                    <span className={styles.licenseTypeName}>◆ Sole Claim</span>
                    <span className={styles.licenseTypePrice}>
                      {formatPrice(voice.pricing.exclusive)}
                    </span>
                  </div>
                  <p className={styles.licenseTypeDesc}>
                    This vessel speaks only for you. No other may invoke it.
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
                    <span className={styles.licenseTypeName}>◇ Per Invocation</span>
                    <span className={styles.licenseTypePrice}>
                      {formatPrice(voice.pricing.nonExclusive)} / channeling
                    </span>
                  </div>
                  <p className={styles.licenseTypeDesc}>
                    Pay tribute each time the vessel speaks. Others may also call upon it.
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
                    <span className={styles.licenseTypeName}>◈ Shared Tithe</span>
                    <span className={styles.licenseTypePrice}>
                      {voice.pricing.revShare.voiceActor}% / {voice.pricing.revShare.creator}% / {voice.pricing.revShare.platform}%
                    </span>
                  </div>
                  <p className={styles.licenseTypeDesc}>
                    Fortunes divided among vessel, wielder, and sanctum.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>What the Covenant Grants</h3>
            <ul className={styles.benefits}>
              <li>◇ Unlimited channeling through Chromox alchemy</li>
              <li>◇ Rights to wield in commerce</li>
              <li>◇ Command over tone, breath, and feeling</li>
              <li>◇ Clear record of every invocation</li>
              <li>◇ Bound by consent of the vessel</li>
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
                I accept the <a href="/terms" target="_blank" className={styles.link}>covenant terms</a> and acknowledge the vessel receives their due tithe.
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
              Withdraw
            </button>
            <button
              onClick={handleLicense}
              className={styles.licenseButton}
              disabled={isProcessing || !agreedToTerms}
            >
              {isProcessing ? 'Binding...' : `Bind for ${getPriceForType(selectedType)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
