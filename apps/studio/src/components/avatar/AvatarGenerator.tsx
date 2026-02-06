/**
 * Avatar Generator Component
 * Consent-first avatar generation via Sembla
 */

'use client';

import React, { useState } from 'react';
import styles from './AvatarGenerator.module.css';

interface AvatarGeneratorProps {
  characterId: string;
  characterName: string;
  onAvatarGenerated?: (avatarUrl: string, licenseToken: string) => void;
}

interface GeneratedAvatar {
  outputUrl: string;
  licenseToken: string;
  descriptor: string;
  consentJson: string;
}

export function AvatarGenerator({
  characterId,
  characterName,
  onAvatarGenerated,
}: AvatarGeneratorProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAvatar, setGeneratedAvatar] = useState<GeneratedAvatar | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Consent form fields
  const [consentName, setConsentName] = useState('');
  const [consentEmail, setConsentEmail] = useState('');
  const [gender, setGender] = useState('androgynous');
  const [skinTone, setSkinTone] = useState('neutral skin tone');
  const [vibe, setVibe] = useState('editorial');
  const [agreedToConsent, setAgreedToConsent] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!imageFile) {
      setError('Please select an image');
      return;
    }

    if (!consentName || !consentEmail) {
      setError('Please provide your name and email for consent tracking');
      return;
    }

    if (!agreedToConsent) {
      setError('You must agree to the consent terms');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('characterId', characterId);
      formData.append('consentName', consentName);
      formData.append('consentEmail', consentEmail);
      formData.append('gender', gender);
      formData.append('skinTone', skinTone);
      formData.append('vibe', vibe);

      const response = await fetch('/api/avatars/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate avatar');
      }

      const data = await response.json();
      setGeneratedAvatar(data);

      if (onAvatarGenerated) {
        onAvatarGenerated(data.outputUrl, data.licenseToken);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate avatar');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Avatar Generator</h3>
        <p className={styles.subtitle}>
          Create a consent-tracked avatar for {characterName}
        </p>
      </div>

      {!generatedAvatar ? (
        <>
          {/* Image Upload */}
          <div className={styles.section}>
            <label className={styles.label}>Base Image</label>
            <div className={styles.uploadArea}>
              {previewUrl ? (
                <div className={styles.preview}>
                  <img src={previewUrl} alt="Preview" className={styles.previewImage} />
                  <button
                    onClick={() => {
                      setImageFile(null);
                      setPreviewUrl(null);
                    }}
                    className={styles.removeButton}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className={styles.uploadLabel}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                  />
                  <div className={styles.uploadPrompt}>
                    📸 Click to upload image
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Consent Form */}
          <div className={styles.consentSection}>
            <h4 className={styles.sectionTitle}>📋 Consent Information</h4>
            <p className={styles.consentNote}>
              Required for ethical AI and provenance tracking
            </p>

            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Your Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={consentName}
                  onChange={(e) => setConsentName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Your Email</label>
                <input
                  type="email"
                  className={styles.input}
                  value={consentEmail}
                  onChange={(e) => setConsentEmail(e.target.value)}
                  placeholder="jane@example.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Style Options */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>🎭 Style Options</h4>

            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Gender Presentation</label>
                <select
                  className={styles.select}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="androgynous">Androgynous</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-binary</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Skin Tone</label>
                <select
                  className={styles.select}
                  value={skinTone}
                  onChange={(e) => setSkinTone(e.target.value)}
                >
                  <option value="neutral skin tone">Neutral</option>
                  <option value="light skin tone">Light</option>
                  <option value="medium skin tone">Medium</option>
                  <option value="olive skin tone">Olive</option>
                  <option value="brown skin tone">Brown</option>
                  <option value="dark skin tone">Dark</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Vibe / Style</label>
                <select
                  className={styles.select}
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value)}
                >
                  <option value="editorial">Editorial</option>
                  <option value="signature">Signature</option>
                  <option value="cinematic">Cinematic</option>
                  <option value="natural">Natural</option>
                  <option value="glamour">Glamour</option>
                </select>
              </div>
            </div>
          </div>

          {/* Consent Agreement */}
          <div className={styles.consentBox}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={agreedToConsent}
                onChange={(e) => setAgreedToConsent(e.target.checked)}
              />
              <span>
                I consent to AI generation of my likeness for this character. I understand this
                creates an auditable consent record with my name, email, and timestamp. I retain
                ownership and can revoke this consent at any time.
              </span>
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className={styles.error}>
              ⚠️ {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !imageFile || !agreedToConsent}
            className={styles.generateButton}
          >
            {isGenerating ? 'Generating...' : 'Generate Avatar'}
          </button>
        </>
      ) : (
        <div className={styles.result}>
          <h4 className={styles.resultTitle}>Avatar Generated</h4>

          <div className={styles.avatarDisplay}>
            <img src={generatedAvatar.outputUrl} alt="Generated Avatar" className={styles.avatarImage} />
          </div>

          <div className={styles.resultInfo}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>License Token:</span>
              <span className={styles.infoValue}>{generatedAvatar.licenseToken}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Style:</span>
              <span className={styles.infoValue}>{generatedAvatar.descriptor}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Consent:</span>
              <span className={styles.infoValue}>✓ Tracked & Immutable</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={() => {
                setGeneratedAvatar(null);
                setImageFile(null);
                setPreviewUrl(null);
                setAgreedToConsent(false);
              }}
              className={styles.newButton}
            >
              Generate Another
            </button>
            <a
              href={generatedAvatar.outputUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.downloadButton}
            >
              📥 Download Avatar
            </a>
          </div>
        </div>
      )}

      <div className={styles.infoBanner}>
        <p className={styles.infoText}>
          ℹ️ Powered by Sembla - consent-first avatar generation with zero commission
        </p>
      </div>
    </div>
  );
}
