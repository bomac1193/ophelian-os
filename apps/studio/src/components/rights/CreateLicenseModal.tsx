/**
 * Create License Modal
 * Form for creating new IP licenses
 */

'use client';

import React, { useState } from 'react';
import type { License, CreateLicenseInput } from '@lcos/shared';
import { LicenseType, SubjectType } from '@lcos/shared';
import styles from './CreateLicenseModal.module.css';

interface CreateLicenseModalProps {
  onClose: () => void;
  onSuccess: (license: License) => void;
}

export function CreateLicenseModal({ onClose, onSuccess }: CreateLicenseModalProps) {
  const [formData, setFormData] = useState<CreateLicenseInput>({
    ownerId: 'user_demo', // TODO: Get from auth
    subjectType: SubjectType.VOICE,
    subjectId: '',
    consentSynthesis: true,
    consentTraining: false,
    commercialUse: true,
    licenseType: LicenseType.REVSHARE,
    royaltySplits: {
      voiceActor: 50,
      creator: 30,
      platform: 20,
    },
    terms: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate royalty splits
      const total = formData.royaltySplits.voiceActor +
                    formData.royaltySplits.creator +
                    formData.royaltySplits.platform;

      if (total !== 100) {
        throw new Error(`Royalty splits must total 100% (current: ${total}%)`);
      }

      const response = await fetch('/api/licenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create license');
      }

      const data = await response.json();
      onSuccess(data.license);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create license');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoyaltySplitChange = (
    field: 'voiceActor' | 'creator' | 'platform',
    value: number
  ) => {
    setFormData({
      ...formData,
      royaltySplits: {
        ...formData.royaltySplits,
        [field]: Math.max(0, Math.min(100, value)),
      },
    });
  };

  const totalSplits = formData.royaltySplits.voiceActor +
                      formData.royaltySplits.creator +
                      formData.royaltySplits.platform;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create License</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Subject Type */}
          <div className={styles.field}>
            <label className={styles.label}>Subject Type</label>
            <select
              className={styles.select}
              value={formData.subjectType}
              onChange={(e) => setFormData({ ...formData, subjectType: e.target.value as any })}
              required
            >
              <option value={SubjectType.VOICE}>🎤 Voice</option>
              <option value={SubjectType.CHARACTER}>🎭 Character</option>
            </select>
          </div>

          {/* Subject ID */}
          <div className={styles.field}>
            <label className={styles.label}>
              Subject ID
              <span className={styles.hint}>
                {formData.subjectType === SubjectType.VOICE
                  ? '(Chromox persona ID or voice profile ID)'
                  : '(Character genome ID)'}
              </span>
            </label>
            <input
              type="text"
              className={styles.input}
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              placeholder="e.g., persona_abc123"
              required
            />
          </div>

          {/* License Type */}
          <div className={styles.field}>
            <label className={styles.label}>License Type</label>
            <div className={styles.radioGroup}>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="licenseType"
                  value={LicenseType.EXCLUSIVE}
                  checked={formData.licenseType === LicenseType.EXCLUSIVE}
                  onChange={(e) => setFormData({ ...formData, licenseType: e.target.value as any })}
                />
                <span className={styles.radioLabel}>
                  <strong>Exclusive</strong>
                  <span className={styles.radioHint}>Only one licensee allowed</span>
                </span>
              </label>

              <label className={styles.radio}>
                <input
                  type="radio"
                  name="licenseType"
                  value={LicenseType.NON_EXCLUSIVE}
                  checked={formData.licenseType === LicenseType.NON_EXCLUSIVE}
                  onChange={(e) => setFormData({ ...formData, licenseType: e.target.value as any })}
                />
                <span className={styles.radioLabel}>
                  <strong>Non-Exclusive</strong>
                  <span className={styles.radioHint}>Multiple licensees allowed</span>
                </span>
              </label>

              <label className={styles.radio}>
                <input
                  type="radio"
                  name="licenseType"
                  value={LicenseType.REVSHARE}
                  checked={formData.licenseType === LicenseType.REVSHARE}
                  onChange={(e) => setFormData({ ...formData, licenseType: e.target.value as any })}
                />
                <span className={styles.radioLabel}>
                  <strong>Revenue Share</strong>
                  <span className={styles.radioHint}>Pay per use with royalties</span>
                </span>
              </label>
            </div>
          </div>

          {/* Permissions */}
          <div className={styles.field}>
            <label className={styles.label}>Permissions</label>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={formData.consentSynthesis}
                  onChange={(e) => setFormData({ ...formData, consentSynthesis: e.target.checked })}
                />
                <span>Allow voice synthesis</span>
              </label>

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={formData.consentTraining}
                  onChange={(e) => setFormData({ ...formData, consentTraining: e.target.checked })}
                />
                <span>Allow AI training</span>
              </label>

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={formData.commercialUse}
                  onChange={(e) => setFormData({ ...formData, commercialUse: e.target.checked })}
                />
                <span>Allow commercial use</span>
              </label>
            </div>
          </div>

          {/* Royalty Splits */}
          <div className={styles.field}>
            <label className={styles.label}>
              Royalty Splits
              <span className={`${styles.totalBadge} ${totalSplits === 100 ? styles.valid : styles.invalid}`}>
                Total: {totalSplits}%
              </span>
            </label>

            <div className={styles.splitFields}>
              <div className={styles.splitField}>
                <label className={styles.splitLabel}>Voice Actor</label>
                <input
                  type="number"
                  className={styles.splitInput}
                  value={formData.royaltySplits.voiceActor}
                  onChange={(e) => handleRoyaltySplitChange('voiceActor', Number(e.target.value))}
                  min="0"
                  max="100"
                />
                <span className={styles.percent}>%</span>
              </div>

              <div className={styles.splitField}>
                <label className={styles.splitLabel}>Creator</label>
                <input
                  type="number"
                  className={styles.splitInput}
                  value={formData.royaltySplits.creator}
                  onChange={(e) => handleRoyaltySplitChange('creator', Number(e.target.value))}
                  min="0"
                  max="100"
                />
                <span className={styles.percent}>%</span>
              </div>

              <div className={styles.splitField}>
                <label className={styles.splitLabel}>Platform</label>
                <input
                  type="number"
                  className={styles.splitInput}
                  value={formData.royaltySplits.platform}
                  onChange={(e) => handleRoyaltySplitChange('platform', Number(e.target.value))}
                  min="0"
                  max="100"
                />
                <span className={styles.percent}>%</span>
              </div>
            </div>
          </div>

          {/* Terms (Optional) */}
          <div className={styles.field}>
            <label className={styles.label}>Terms (Optional)</label>
            <textarea
              className={styles.textarea}
              value={formData.terms || ''}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value || null })}
              placeholder="Additional license terms and conditions..."
              rows={4}
            />
          </div>

          {/* Error */}
          {error && (
            <div className={styles.error}>
              ⚠️ {error}
            </div>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || totalSplits !== 100}
            >
              {isSubmitting ? 'Creating...' : 'Create License'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
