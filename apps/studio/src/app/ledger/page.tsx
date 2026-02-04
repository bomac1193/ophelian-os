'use client';

import { useState } from 'react';
import { getSettlement, type MonthlySettlement } from '@/lib/api';

export default function LedgerPage() {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [settlement, setSettlement] = useState<MonthlySettlement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchSettlement = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSettlement(month);
      setSettlement(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settlement');
      setSettlement(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCents = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Ledger Settlement</h1>
      </div>

      <div className="card mb-4">
        <h3 className="card-title">Select Month</h3>
        <div className="flex gap-4 mt-4 items-center">
          <input
            type="month"
            className="input"
            style={{ width: 'auto' }}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <button className="btn btn-secondary" onClick={handleFetchSettlement} disabled={loading}>
            {loading ? 'Loading...' : 'Fetch Settlement'}
          </button>
        </div>
      </div>

      {error && (
        <div className="card" style={{ borderColor: 'var(--error)' }}>
          <p style={{ color: 'var(--error)' }}>{error}</p>
        </div>
      )}

      {settlement && (
        <>
          {/* Totals Card */}
          <div className="card mb-4">
            <h3 className="card-title">Settlement Summary - {settlement.month}</h3>
            <p className="card-description">
              Generated at: {new Date(settlement.generatedAt).toLocaleString()}
            </p>

            <div className="grid grid-cols-3 mt-4 gap-4">
              <div className="card">
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                  TOTAL REVENUE
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  {formatCents(settlement.totals.totalRevenueCents)}
                </div>
              </div>
              <div className="card">
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                  TOTAL EVENTS
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  {settlement.totals.totalEventCount}
                </div>
              </div>
              <div className="card">
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>OWNERS</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{settlement.owners.length}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 mt-4 gap-4">
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                  Voice Actor Share
                </div>
                <div style={{ fontWeight: 500 }}>
                  {formatCents(settlement.totals.totalVoiceActorShareCents)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                  Creator Share
                </div>
                <div style={{ fontWeight: 500 }}>
                  {formatCents(settlement.totals.totalCreatorShareCents)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                  Platform Share
                </div>
                <div style={{ fontWeight: 500 }}>
                  {formatCents(settlement.totals.totalPlatformShareCents)}
                </div>
              </div>
            </div>
          </div>

          {/* Per-Owner Breakdown */}
          {settlement.owners.length > 0 ? (
            <div className="card">
              <h3 className="card-title">Owner Breakdown</h3>
              <table className="table mt-4">
                <thead>
                  <tr>
                    <th>Owner ID</th>
                    <th>Events</th>
                    <th>Total Revenue</th>
                    <th>Voice Actor</th>
                    <th>Creator</th>
                    <th>Platform</th>
                  </tr>
                </thead>
                <tbody>
                  {settlement.owners.map((owner) => (
                    <tr key={owner.ownerId}>
                      <td>{owner.ownerId}</td>
                      <td>{owner.eventCount}</td>
                      <td>{formatCents(owner.totalRevenueCents)}</td>
                      <td>{formatCents(owner.voiceActorShareCents)}</td>
                      <td>{formatCents(owner.creatorShareCents)}</td>
                      <td>{formatCents(owner.platformShareCents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No usage events for this month</p>
            </div>
          )}
        </>
      )}

      {!settlement && !loading && !error && (
        <div className="empty-state">
          <p>Select a month and click "Fetch Settlement" to view the ledger report</p>
        </div>
      )}
    </div>
  );
}
