/**
 * Merch Product Card Component
 * Displays a single merchandise product
 */

'use client';

import React from 'react';
import type { MerchProduct } from '@lcos/shared';
import styles from './MerchProductCard.module.css';

interface MerchProductCardProps {
  product: MerchProduct;
}

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  T_SHIRT: 'T-Shirt',
  HOODIE: 'Hoodie',
  MUG: 'Mug',
  POSTER: 'Poster',
  STICKER: 'Sticker',
  PHONE_CASE: 'Phone Case',
  TOTE_BAG: 'Tote Bag',
  NOTEBOOK: 'Notebook',
  PILLOW: 'Pillow',
  CANVAS_PRINT: 'Canvas Print',
};

export function MerchProductCard({ product }: MerchProductCardProps) {
  const basePrice = (product.basePrice / 100).toFixed(2);
  const totalRevenue = (product.revenue / 100).toFixed(2);
  const creatorRevenue = ((product.revenue * product.revenueShare.creator) / 10000).toFixed(2);

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <div className={styles.placeholderImage}>
          <span className={styles.productIcon}>
            {product.productType === 'T_SHIRT' && '👕'}
            {product.productType === 'HOODIE' && '🧥'}
            {product.productType === 'MUG' && '☕'}
            {product.productType === 'POSTER' && '🖼️'}
            {product.productType === 'STICKER' && '✨'}
            {product.productType === 'PHONE_CASE' && '📱'}
            {product.productType === 'TOTE_BAG' && '👜'}
            {product.productType === 'NOTEBOOK' && '📓'}
            {product.productType === 'PILLOW' && '🛋️'}
            {product.productType === 'CANVAS_PRINT' && '🎨'}
          </span>
        </div>
        <span className={styles.productTypeBadge}>
          {PRODUCT_TYPE_LABELS[product.productType]}
        </span>
      </div>

      <div className={styles.content}>
        <h4 className={styles.title}>{product.title}</h4>
        <p className={styles.description}>{product.description}</p>

        <div className={styles.pricing}>
          <span className={styles.price}>${basePrice}</span>
          <span className={styles.variants}>{product.variants.length} variants</span>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Sales:</span>
            <span className={styles.statValue}>{product.salesCount}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Revenue:</span>
            <span className={styles.statValue}>${totalRevenue}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Your Share:</span>
            <span className={styles.statValueHighlight}>${creatorRevenue}</span>
          </div>
        </div>

        {product.tags.length > 0 && (
          <div className={styles.tags}>
            {product.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className={styles.actions}>
          <button className={styles.viewButton}>View Details</button>
          <button className={styles.editButton}>Edit</button>
        </div>
      </div>
    </div>
  );
}
