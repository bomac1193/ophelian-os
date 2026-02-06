/**
 * Universes Page
 * Main page for collaborative universe management
 */

'use client';

import { UniverseManager } from '../../components/universe/UniverseManager';
import styles from './universes.module.css';

export default function UniversesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Collaborative Universes</h1>
        <p className={styles.heroDescription}>
          Create shared worlds where multiple creators can collaborate on stories and characters.
          Build rich, interconnected narratives with shared canon and IP protection.
        </p>
      </div>

      <div className={styles.features}>
        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Multi-Creator</h3>
          <p className={styles.featureText}>
            Invite collaborators and build worlds together with role-based permissions
          </p>
        </div>

        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Shared Canon</h3>
          <p className={styles.featureText}>
            Maintain consistent world-building with collaborative timeline and events
          </p>
        </div>

        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>IP Protection</h3>
          <p className={styles.featureText}>
            Control character permissions and revenue sharing with granular licensing
          </p>
        </div>
      </div>

      <UniverseManager />
    </div>
  );
}
