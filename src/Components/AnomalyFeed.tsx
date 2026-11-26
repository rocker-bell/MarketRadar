import React, { useState, useEffect } from 'react';
import { Radio, RefreshCw } from 'lucide-react';
import type { CryptoAsset } from '../utilities/anomalyDetector';
import type { LiveSignalEvent } from '../utilities/signalStreamer';
import { formatCurrency, formatPercent } from '../utilities/formatters';
import '../Styles/AnomalyFeed.css';

interface AnomalyFeedProps {
  assets: CryptoAsset[];
  signals: LiveSignalEvent[];
  totalSignalsCount: number;
  onSelectAsset: (asset: CryptoAsset) => void;
}

const AnomalyFeed: React.FC<AnomalyFeedProps> = ({
  assets,
  signals,
  totalSignalsCount,
  onSelectAsset
}) => {
  const [, setTick] = useState(0);

  // Re-render every 5 seconds to update relative time ("12s ago", "Just now")
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const getRelativeTime = (timestamp: Date): string => {
    const elapsedSeconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    if (elapsedSeconds < 8) return 'Just now';
    if (elapsedSeconds < 60) return `${elapsedSeconds}s ago`;
    const mins = Math.floor(elapsedSeconds / 60);
    return `${mins}m ago`;
  };

  const handleItemClick = (sig: LiveSignalEvent) => {
    const matchedAsset = assets.find((a) => a.id === sig.assetId);
    if (matchedAsset) {
      onSelectAsset(matchedAsset);
    }
  };

  return (
    <div className="AnomalyFeed_panel">
      <div className="AnomalyFeed_header">
        <div className="AnomalyFeed_headingGroup">
          <span className="AnomalyFeed_liveDot"></span>
          <span className="AnomalyFeed_title">Live Telemetry Signals</span>
        </div>
        <div className="AnomalyFeed_totalCountPill">
          <Radio size={12} />
          <span>{totalSignalsCount} Captured</span>
        </div>
      </div>

      <div className="AnomalyFeed_subBar">
        <div className="AnomalyFeed_radarSweep">
          <RefreshCw size={11} className="animate-spin" />
          <span>Continuous Radar Stream</span>
        </div>
        <span>Live Polling: Active</span>
      </div>

      <div className="AnomalyFeed_list">
        {signals.map((sig, index) => {
          const isHigh = sig.score >= 75;
          const isLatest = index === 0;

          return (
            <div
              key={sig.id}
              className={`AnomalyFeed_item ${isLatest ? 'AnomalyFeed_newItemAnim' : ''}`}
              onClick={() => handleItemClick(sig)}
            >
              <div className="AnomalyFeed_itemTop">
                <span className="AnomalyFeed_itemSymbol">
                  {sig.symbol}{' '}
                  <span style={{ color: '#64748b', fontSize: '0.74rem' }}>
                    {formatCurrency(sig.price)}
                  </span>
                </span>
                <span
                  className={`AnomalyFeed_itemScore ${
                    isHigh ? 'AnomalyFeed_scoreHigh' : 'AnomalyFeed_scoreMed'
                  }`}
                >
                  Score {sig.score}
                </span>
              </div>

              <div className="AnomalyFeed_itemDesc">{sig.description}</div>

              <div className="AnomalyFeed_itemFooter">
                <span className="AnomalyFeed_badge">
                  {sig.anomalyType.replace('_', ' ')}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      color: sig.percentChange24h >= 0 ? '#34d399' : '#f87171',
                      fontWeight: 600
                    }}
                  >
                    24h: {formatPercent(sig.percentChange24h)}
                  </span>
                  <span className="AnomalyFeed_timePill">
                    {getRelativeTime(sig.timestamp)}
                  </span>
                  <span className="AnomalyFeed_viewMorePill">
                    View more &rarr;
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnomalyFeed;
