/**
 * User Progress Tracking
 * Tracks user's progress toward unlocking Advanced View
 */

export interface UserProgress {
  genomeCount: number;
  accountAgeDays: number;
  hasAdvancedAccess: boolean;
  accountCreatedAt: Date;
}

/**
 * Get user's current progress
 * For now, uses localStorage to simulate user progress
 * TODO: Replace with actual API call to backend
 */
export async function getUserProgress(): Promise<UserProgress> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));

  // Get from localStorage (temporary solution)
  const stored = localStorage.getItem('userProgress');

  if (stored) {
    const data = JSON.parse(stored);
    return {
      ...data,
      accountCreatedAt: new Date(data.accountCreatedAt),
    };
  }

  // Initialize new user
  const accountCreatedAt = new Date();
  const initialProgress: UserProgress = {
    genomeCount: 0,
    accountAgeDays: 0,
    hasAdvancedAccess: false,
    accountCreatedAt,
  };

  localStorage.setItem('userProgress', JSON.stringify(initialProgress));
  return initialProgress;
}

/**
 * Update genome count
 */
export async function incrementGenomeCount(): Promise<UserProgress> {
  const progress = await getUserProgress();

  const updated: UserProgress = {
    ...progress,
    genomeCount: progress.genomeCount + 1,
  };

  // Check if user unlocked advanced access
  updated.hasAdvancedAccess = checkAdvancedAccess(updated);

  localStorage.setItem('userProgress', JSON.stringify(updated));
  return updated;
}

/**
 * Calculate account age in days
 */
export function calculateAccountAgeDays(createdAt: Date): number {
  const now = new Date();
  const diff = now.getTime() - createdAt.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Check if user has earned advanced access
 */
export function checkAdvancedAccess(progress: UserProgress): boolean {
  // Unlock after 3 genomes
  if (progress.genomeCount >= 3) return true;

  // Unlock after 7 days
  const ageDays = calculateAccountAgeDays(progress.accountCreatedAt);
  if (ageDays >= 7) return true;

  return false;
}

/**
 * Refresh user progress (recalculates age)
 */
export async function refreshUserProgress(): Promise<UserProgress> {
  const progress = await getUserProgress();

  const accountAgeDays = calculateAccountAgeDays(progress.accountCreatedAt);
  const hasAdvancedAccess = checkAdvancedAccess({
    ...progress,
    accountAgeDays,
  });

  const updated: UserProgress = {
    ...progress,
    accountAgeDays,
    hasAdvancedAccess,
  };

  localStorage.setItem('userProgress', JSON.stringify(updated));
  return updated;
}
