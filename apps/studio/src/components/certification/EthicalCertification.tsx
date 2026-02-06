'use client';

import React, { useState, useEffect } from 'react';
import styles from './EthicalCertification.module.css';

interface ConsentRecord {
  id: string;
  type: 'voice' | 'likeness' | 'content' | 'data';
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string;
  scope: string[];
  status: 'active' | 'expired' | 'revoked';
  verificationHash: string;
}

interface CertificationStatus {
  level: 'uncertified' | 'basic' | 'verified' | 'premium';
  score: number;
  categories: {
    consent: number;
    transparency: number;
    dataProtection: number;
    contentSafety: number;
    attribution: number;
  };
  lastAudit?: string;
  nextAudit?: string;
}

interface EthicalCertificationProps {
  characterId: string;
  characterName: string;
  createdAt: string;
}

function CertificationBadge({ level }: { level: CertificationStatus['level'] }) {
  const badges: Record<CertificationStatus['level'], { label: string; description: string }> = {
    uncertified: { label: 'Uncertified', description: 'No certification' },
    basic: { label: 'Basic', description: 'Meets minimum requirements' },
    verified: { label: 'Verified', description: 'Fully compliant' },
    premium: { label: 'Premium', description: 'Exceeds all standards' },
  };

  const badge = badges[level];

  return (
    <div className={`${styles.badge} ${styles[`badge${level.charAt(0).toUpperCase() + level.slice(1)}`]}`}>
      <div className={styles.badgeIcon}>
        {level === 'premium' ? 'P' : level === 'verified' ? 'V' : level === 'basic' ? 'B' : 'U'}
      </div>
      <div className={styles.badgeInfo}>
        <div className={styles.badgeLabel}>{badge.label}</div>
        <div className={styles.badgeDescription}>{badge.description}</div>
      </div>
    </div>
  );
}

function ScoreGauge({ score, label }: { score: number; label: string }) {
  return (
    <div className={styles.scoreGauge}>
      <div className={styles.scoreHeader}>
        <span className={styles.scoreLabel}>{label}</span>
        <span className={styles.scoreValue}>{score}/100</span>
      </div>
      <div className={styles.scoreTrack}>
        <div
          className={styles.scoreFill}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function ConsentCard({ consent }: { consent: ConsentRecord }) {
  const typeLabels: Record<ConsentRecord['type'], string> = {
    voice: 'Voice Synthesis',
    likeness: 'Visual Likeness',
    content: 'Content Usage',
    data: 'Data Processing',
  };

  const statusColors: Record<ConsentRecord['status'], string> = {
    active: 'var(--foreground)',
    expired: 'var(--muted-foreground)',
    revoked: 'var(--destructive)',
  };

  return (
    <div className={styles.consentCard}>
      <div className={styles.consentHeader}>
        <div className={styles.consentType}>{typeLabels[consent.type]}</div>
        <div
          className={styles.consentStatus}
          style={{ borderColor: statusColors[consent.status] }}
        >
          {consent.status.toUpperCase()}
        </div>
      </div>
      <div className={styles.consentDetails}>
        <div className={styles.consentField}>
          <span className={styles.consentFieldLabel}>Granted By</span>
          <span className={styles.consentFieldValue}>{consent.grantedBy}</span>
        </div>
        <div className={styles.consentField}>
          <span className={styles.consentFieldLabel}>Granted</span>
          <span className={styles.consentFieldValue}>
            {new Date(consent.grantedAt).toLocaleDateString()}
          </span>
        </div>
        {consent.expiresAt && (
          <div className={styles.consentField}>
            <span className={styles.consentFieldLabel}>Expires</span>
            <span className={styles.consentFieldValue}>
              {new Date(consent.expiresAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
      <div className={styles.consentScope}>
        <span className={styles.consentFieldLabel}>Scope</span>
        <div className={styles.scopeChips}>
          {consent.scope.map((s) => (
            <span key={s} className={styles.scopeChip}>{s}</span>
          ))}
        </div>
      </div>
      <div className={styles.consentHash}>
        <span className={styles.consentFieldLabel}>Verification</span>
        <code className={styles.hashValue}>{consent.verificationHash.slice(0, 16)}...</code>
      </div>
    </div>
  );
}

export function EthicalCertification({
  characterId,
  characterName,
  createdAt,
}: EthicalCertificationProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'consent' | 'audit'>('overview');
  const [certification, setCertification] = useState<CertificationStatus | null>(null);
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading certification data
    const timer = setTimeout(() => {
      // Generate deterministic data based on character ID
      const seed = characterId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const seededRandom = (offset: number) => {
        const x = Math.sin(seed + offset) * 10000;
        return x - Math.floor(x);
      };

      const consentScore = Math.round(60 + seededRandom(1) * 40);
      const transparencyScore = Math.round(70 + seededRandom(2) * 30);
      const dataScore = Math.round(65 + seededRandom(3) * 35);
      const safetyScore = Math.round(75 + seededRandom(4) * 25);
      const attributionScore = Math.round(80 + seededRandom(5) * 20);

      const totalScore = Math.round(
        (consentScore + transparencyScore + dataScore + safetyScore + attributionScore) / 5
      );

      const level: CertificationStatus['level'] =
        totalScore >= 90 ? 'premium' :
        totalScore >= 75 ? 'verified' :
        totalScore >= 50 ? 'basic' : 'uncertified';

      setCertification({
        level,
        score: totalScore,
        categories: {
          consent: consentScore,
          transparency: transparencyScore,
          dataProtection: dataScore,
          contentSafety: safetyScore,
          attribution: attributionScore,
        },
        lastAudit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        nextAudit: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
      });

      // Generate consent records
      const consentTypes: ConsentRecord['type'][] = ['voice', 'likeness', 'content', 'data'];
      const generatedConsents: ConsentRecord[] = consentTypes.map((type, i) => ({
        id: `consent-${characterId}-${type}`,
        type,
        grantedBy: seededRandom(10 + i) > 0.5 ? 'Creator (Self)' : 'Licensed Partner',
        grantedAt: new Date(Date.parse(createdAt) + i * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: seededRandom(20 + i) > 0.7 ? undefined : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        scope: type === 'voice' ? ['synthesis', 'cloning', 'commercial'] :
               type === 'likeness' ? ['avatar', 'merchandise', 'promotional'] :
               type === 'content' ? ['generation', 'adaptation', 'distribution'] :
               ['storage', 'analytics', 'training'],
        status: seededRandom(30 + i) > 0.9 ? 'expired' : 'active',
        verificationHash: `0x${Array.from({ length: 64 }, () =>
          Math.floor(seededRandom(40 + i) * 16).toString(16)
        ).join('')}`,
      }));

      setConsents(generatedConsents);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [characterId, createdAt]);

  if (loading) {
    return (
      <div className={styles.loading}>
        Loading certification data...
      </div>
    );
  }

  if (!certification) return null;

  return (
    <div className={styles.container}>
      {/* Header with Badge */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h2 className={styles.title}>Ethical AI Certification</h2>
          <p className={styles.subtitle}>
            Compliance and consent tracking for {characterName}
          </p>
        </div>
        <CertificationBadge level={certification.level} />
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {(['overview', 'consent', 'audit'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className={styles.content}>
          {/* Overall Score */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Overall Compliance Score</h3>
            <div className={styles.overallScore}>
              <div className={styles.overallScoreValue}>{certification.score}</div>
              <div className={styles.overallScoreLabel}>/ 100</div>
            </div>
          </div>

          {/* Category Scores */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Category Breakdown</h3>
            <div className={styles.scoresGrid}>
              <ScoreGauge score={certification.categories.consent} label="Consent Management" />
              <ScoreGauge score={certification.categories.transparency} label="Transparency" />
              <ScoreGauge score={certification.categories.dataProtection} label="Data Protection" />
              <ScoreGauge score={certification.categories.contentSafety} label="Content Safety" />
              <ScoreGauge score={certification.categories.attribution} label="Attribution" />
            </div>
          </div>

          {/* Audit Schedule */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Audit Schedule</h3>
            <div className={styles.auditGrid}>
              <div className={styles.auditCard}>
                <div className={styles.auditLabel}>Last Audit</div>
                <div className={styles.auditValue}>
                  {certification.lastAudit
                    ? new Date(certification.lastAudit).toLocaleDateString()
                    : 'Never'}
                </div>
              </div>
              <div className={styles.auditCard}>
                <div className={styles.auditLabel}>Next Audit</div>
                <div className={styles.auditValue}>
                  {certification.nextAudit
                    ? new Date(certification.nextAudit).toLocaleDateString()
                    : 'Not Scheduled'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Quick Actions</h3>
            <div className={styles.actionsGrid}>
              <button type="button" className={styles.actionButton}>
                Request Audit
              </button>
              <button type="button" className={styles.actionButton}>
                Export Certificate
              </button>
              <button type="button" className={styles.actionButton}>
                View Full Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consent Tab */}
      {activeTab === 'consent' && (
        <div className={styles.content}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Consent Records</h3>
              <button type="button" className={styles.addButton}>
                Add Consent
              </button>
            </div>
            <div className={styles.consentsGrid}>
              {consents.map((consent) => (
                <ConsentCard key={consent.id} consent={consent} />
              ))}
            </div>
          </div>

          {/* Consent Summary */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Consent Summary</h3>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <div className={styles.summaryValue}>
                  {consents.filter((c) => c.status === 'active').length}
                </div>
                <div className={styles.summaryLabel}>Active Consents</div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryValue}>
                  {consents.filter((c) => c.status === 'expired').length}
                </div>
                <div className={styles.summaryLabel}>Expired</div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryValue}>
                  {consents.reduce((acc, c) => acc + c.scope.length, 0)}
                </div>
                <div className={styles.summaryLabel}>Total Scopes</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Audit History</h3>
            <div className={styles.auditHistory}>
              <div className={styles.auditEntry}>
                <div className={styles.auditEntryDate}>
                  {certification.lastAudit
                    ? new Date(certification.lastAudit).toLocaleDateString()
                    : 'N/A'}
                </div>
                <div className={styles.auditEntryDetails}>
                  <div className={styles.auditEntryTitle}>Automated Compliance Check</div>
                  <div className={styles.auditEntryResult}>
                    Score: {certification.score}/100 - {certification.level.toUpperCase()}
                  </div>
                </div>
                <div className={styles.auditEntryStatus}>Passed</div>
              </div>
              <div className={styles.auditEntry}>
                <div className={styles.auditEntryDate}>
                  {new Date(Date.parse(createdAt)).toLocaleDateString()}
                </div>
                <div className={styles.auditEntryDetails}>
                  <div className={styles.auditEntryTitle}>Initial Creation Audit</div>
                  <div className={styles.auditEntryResult}>
                    Character genome validated and certified
                  </div>
                </div>
                <div className={styles.auditEntryStatus}>Passed</div>
              </div>
            </div>
          </div>

          {/* Compliance Checklist */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Compliance Checklist</h3>
            <div className={styles.checklist}>
              {[
                { item: 'Voice consent documentation', checked: true },
                { item: 'Likeness rights verification', checked: true },
                { item: 'Content usage terms defined', checked: true },
                { item: 'Data processing agreement', checked: certification.categories.dataProtection > 70 },
                { item: 'Attribution requirements met', checked: certification.categories.attribution > 80 },
                { item: 'Safety guidelines implemented', checked: certification.categories.contentSafety > 75 },
              ].map(({ item, checked }) => (
                <div key={item} className={styles.checklistItem}>
                  <div className={`${styles.checkbox} ${checked ? styles.checked : ''}`}>
                    {checked ? 'X' : ''}
                  </div>
                  <span className={styles.checklistLabel}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
