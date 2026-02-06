/**
 * Merch Manager Component
 * Manages character merchandise products
 */

'use client';

import React, { useState, useEffect } from 'react';
import { MerchProductCard } from './MerchProductCard';
import { CreateMerchModal } from './CreateMerchModal';
import type { MerchProduct } from '@lcos/shared';
import styles from './MerchManager.module.css';

interface MerchManagerProps {
  characterId: string;
  characterName: string;
  visualSignature?: any;
}

export function MerchManager({ characterId, characterName, visualSignature }: MerchManagerProps) {
  const [products, setProducts] = useState<MerchProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/merch/products?characterId=${characterId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [characterId]);

  const handleProductCreated = (newProduct: MerchProduct) => {
    setProducts([...products, newProduct]);
    setIsCreateModalOpen(false);
  };

  const calculateTotalRevenue = () => {
    return products.reduce((sum, p) => sum + p.revenue, 0) / 100; // Convert cents to dollars
  };

  const calculateTotalSales = () => {
    return products.reduce((sum, p) => sum + p.salesCount, 0);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading merchandise...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={fetchProducts} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{characterName}'s Merchandise</h3>
          <p className={styles.subtitle}>
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className={styles.createButton}>
          Create Product
        </button>
      </div>

      {products.length > 0 && (
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{products.length}</span>
            <span className={styles.statLabel}>Products</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{calculateTotalSales()}</span>
            <span className={styles.statLabel}>Total Sales</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>${calculateTotalRevenue().toFixed(2)}</span>
            <span className={styles.statLabel}>Revenue</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>70%</span>
            <span className={styles.statLabel}>Your Share</span>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className={styles.emptyState}>
          <h4 className={styles.emptyTitle}>No merchandise yet</h4>
          <p className={styles.emptyText}>
            Create merchandise products featuring {characterName}. Designs are automatically generated
            from the character's visual signature. You earn 70% of all sales.
          </p>
          <button onClick={() => setIsCreateModalOpen(true)} className={styles.emptyButton}>
            Create First Product
          </button>
        </div>
      ) : (
        <div className={styles.productGrid}>
          {products.map((product) => (
            <MerchProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {isCreateModalOpen && (
        <CreateMerchModal
          characterId={characterId}
          characterName={characterName}
          visualSignature={visualSignature}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleProductCreated}
        />
      )}
    </div>
  );
}
