/**
 * Genome Data Cache
 * In-memory cache with localStorage persistence for genome data
 * Reduces API calls and improves performance
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

class GenomeCache {
  private cache: Map<string, CacheEntry<any>>;
  private readonly CACHE_PREFIX = 'genome_cache_';
  private readonly DEFAULT_TTL = 1000 * 60 * 30; // 30 minutes

  constructor() {
    this.cache = new Map();
    this.loadFromLocalStorage();
  }

  /**
   * Get data from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.expiresIn) {
      this.cache.delete(key);
      this.removeFromLocalStorage(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set data in cache
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresIn: ttl,
    };

    this.cache.set(key, entry);
    this.saveToLocalStorage(key, entry);
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Clear specific key
   */
  delete(key: string): void {
    this.cache.delete(key);
    this.removeFromLocalStorage(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.clearLocalStorage();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const entries = Array.from(this.cache.entries());
    const now = Date.now();

    return {
      total: entries.length,
      expired: entries.filter(([_, entry]) => now - entry.timestamp > entry.expiresIn).length,
      memorySize: JSON.stringify(Object.fromEntries(this.cache)).length,
    };
  }

  /**
   * Load cache from localStorage
   */
  private loadFromLocalStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          const cacheKey = key.replace(this.CACHE_PREFIX, '');
          const stored = localStorage.getItem(key);

          if (stored) {
            const entry = JSON.parse(stored);
            this.cache.set(cacheKey, entry);
          }
        }
      });
    } catch (error) {
      console.warn('Failed to load genome cache from localStorage:', error);
    }
  }

  /**
   * Save cache entry to localStorage
   */
  private saveToLocalStorage(key: string, entry: CacheEntry<any>): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(
        `${this.CACHE_PREFIX}${key}`,
        JSON.stringify(entry)
      );
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
      // If localStorage is full, clear old entries
      this.clearExpiredFromLocalStorage();
    }
  }

  /**
   * Remove cache entry from localStorage
   */
  private removeFromLocalStorage(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(`${this.CACHE_PREFIX}${key}`);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }

  /**
   * Clear all genome cache from localStorage
   */
  private clearLocalStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  /**
   * Remove expired entries from localStorage
   */
  private clearExpiredFromLocalStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const now = Date.now();
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const entry = JSON.parse(stored);
            if (now - entry.timestamp > entry.expiresIn) {
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.warn('Failed to clear expired entries:', error);
    }
  }
}

// Singleton instance
export const genomeCache = new GenomeCache();

/**
 * Helper function to wrap API calls with caching
 */
export async function cachedFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Check cache first
  const cached = genomeCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch and cache
  const data = await fetchFn();
  genomeCache.set(key, data, ttl);
  return data;
}
