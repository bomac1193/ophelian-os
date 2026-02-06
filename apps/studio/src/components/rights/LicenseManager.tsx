/**
 * License Manager Component
 * Displays and manages IP licenses
 */

'use client';

import React, { useState, useEffect } from 'react';
import { LicenseCard } from './LicenseCard';
import { CreateLicenseModal } from './CreateLicenseModal';
import type { License } from '@lcos/shared';
import styles from './LicenseManager.module.css';

export function LicenseManager() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/licenses');
      if (!response.ok) {
        throw new Error('Failed to fetch licenses');
      }
      const data = await response.json();
      setLicenses(data.licenses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load licenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const handleCreateLicense = () => {
    setIsCreateModalOpen(true);
  };

  const handleLicenseCreated = (newLicense: License) => {
    setLicenses([...licenses, newLicense]);
    setIsCreateModalOpen(false);
  };

  const handleDeleteLicense = async (licenseId: string) => {
    if (!confirm('Are you sure you want to delete this license?')) return;

    try {
      const response = await fetch(`/api/licenses/${licenseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete license');
      }

      setLicenses(licenses.filter((l) => l.id !== licenseId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete license');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading licenses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>⚠️ {error}</p>
        <button onClick={fetchLicenses} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Your Licenses</h2>
        <button onClick={handleCreateLicense} className={styles.createButton}>
          + Create License
        </button>
      </div>

      {licenses.length === 0 ? (
        <div className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>No licenses yet</h3>
          <p className={styles.emptyText}>
            Create your first license to start monetizing your voice IP
          </p>
          <button onClick={handleCreateLicense} className={styles.emptyButton}>
            Create Your First License
          </button>
        </div>
      ) : (
        <div className={styles.licenseGrid}>
          {licenses.map((license) => (
            <LicenseCard
              key={license.id}
              license={license}
              onDelete={() => handleDeleteLicense(license.id)}
            />
          ))}
        </div>
      )}

      {isCreateModalOpen && (
        <CreateLicenseModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleLicenseCreated}
        />
      )}
    </div>
  );
}
