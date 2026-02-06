/**
 * Create Merch Modal Component
 * Form for creating merchandise products
 */

'use client';

import React, { useState } from 'react';
import type { MerchProduct, MerchProductType } from '@lcos/shared';
import styles from './CreateMerchModal.module.css';

interface CreateMerchModalProps {
  characterId: string;
  characterName: string;
  visualSignature?: any;
  onClose: () => void;
  onSuccess: (product: MerchProduct) => void;
}

const PRODUCT_TYPES: { value: MerchProductType; label: string; icon: string; basePrice: number }[] = [
  { value: 'T_SHIRT', label: 'T-Shirt', icon: '', basePrice: 2500 },
  { value: 'HOODIE', label: 'Hoodie', icon: '', basePrice: 4500 },
  { value: 'MUG', label: 'Mug', icon: '', basePrice: 1500 },
  { value: 'POSTER', label: 'Poster', icon: '', basePrice: 2000 },
  { value: 'STICKER', label: 'Sticker', icon: '', basePrice: 500 },
  { value: 'PHONE_CASE', label: 'Phone Case', icon: '', basePrice: 2000 },
];

export function CreateMerchModal({
  characterId,
  characterName,
  visualSignature,
  onClose,
  onSuccess,
}: CreateMerchModalProps) {
  const [productType, setProductType] = useState<MerchProductType>('T_SHIRT');
  const [title, setTitle] = useState(`${characterName} T-Shirt`);
  const [description, setDescription] = useState(`Official ${characterName} merchandise`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingDesign, setGeneratingDesign] = useState(false);

  const selectedProduct = PRODUCT_TYPES.find((p) => p.value === productType)!;

  const handleGenerateDesign = async () => {
    setGeneratingDesign(true);
    try {
      const response = await fetch('/api/merch/designs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId,
          characterName,
          visualSignature,
          style: 'minimalist',
        }),
      });

      if (!response.ok) throw new Error('Failed to generate design');

      const data = await response.json();
      return data.design.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate design');
      return null;
    } finally {
      setGeneratingDesign(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Generate design first
      const designId = await handleGenerateDesign();
      if (!designId) throw new Error('Failed to generate design');

      // Create product with design
      const response = await fetch('/api/merch/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId,
          designId,
          productType,
          title,
          description,
          basePrice: selectedProduct.basePrice,
          variants: [
            { size: 'S', color: 'Black', price: selectedProduct.basePrice },
            { size: 'M', color: 'Black', price: selectedProduct.basePrice },
            { size: 'L', color: 'Black', price: selectedProduct.basePrice },
            { size: 'XL', color: 'Black', price: selectedProduct.basePrice },
          ],
          tags: [characterName.toLowerCase(), productType.toLowerCase()],
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create product');
      }

      const data = await response.json();
      onSuccess(data.product);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Create Merchandise</h3>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <label className={styles.label}>Product Type</label>
            <div className={styles.productGrid}>
              {PRODUCT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    setProductType(type.value);
                    setTitle(`${characterName} ${type.label}`);
                  }}
                  className={`${styles.productCard} ${productType === type.value ? styles.selected : ''}`}
                >
                  <span className={styles.productIcon}>{type.icon}</span>
                  <span className={styles.productLabel}>{type.label}</span>
                  <span className={styles.productPrice}>${(type.basePrice / 100).toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <label htmlFor="title" className={styles.label}>Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.section}>
            <label htmlFor="description" className={styles.label}>Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              rows={3}
              required
            />
          </div>

          <div className={styles.revenueInfo}>
            <h4>💰 Revenue Split</h4>
            <div className={styles.revenueSplit}>
              <div className={styles.revenueItem}>
                <span>You earn:</span>
                <strong>70%</strong>
              </div>
              <div className={styles.revenueItem}>
                <span>Platform:</span>
                <strong>30%</strong>
              </div>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading || generatingDesign}>
              {loading || generatingDesign ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
