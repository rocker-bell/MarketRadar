import React from 'react';
import { Radio } from 'lucide-react';
import type { CryptoAsset } from '../utilities/anomalyDetector';
import { formatCurrency, formatPercent } from '../utilities/formatters';
import '../Styles/AnomalyFeed.css';

interface AnomalyFeedProps {
  assets: CryptoAsset[];
  onSelectAsset: (asset: CryptoAsset) => void;
}

const AnomalyFeed: React.FC<AnomalyFeedProps> = ({ assets, onSelectAsset }) => {
  // Filter top anomalies with score >= 50, sorted descending
  const topAnomalies = assets
    .filter((a) => a.anomalyScore >= 45)
    .sort((a, b) => b.anomalyScore - a.anomalyScore)
    .slice(0, 6);

  return (
    <div className="AnomalyFeed_panel">
      <div className="AnomalyFeed_header">
        <div className="AnomalyFeed_headingGroup">
          <span className="AnomalyFeed_liveDot"></span>
          <span className="AnomalyFeed_title">Telemetry Signals</span>
        </div>
        <Radio size={14} style={{ color: '#38bdf8' }} />
      </div>

      <div className="AnomalyFeed_list">
        {topAnomalies.map((asset) => {
          const isHigh = asset.anomalyScore >= 75;
          return (
            <div
              key={asset.id}
              className="AnomalyFeed_item"
              onClick={() => onSelectAsset(asset)}
            >
              <div className="AnomalyFeed_itemTop">
                <span className="AnomalyFeed_itemSymbol">
                  {asset.symbol} <span style={{ color: '#64748b', fontSize: '0.74rem' }}>{formatCurrency(asset.price)}</span>
                </span>
                <span
                  className={`AnomalyFeed_itemScore ${
                    isHigh ? 'AnomalyFeed_scoreHigh' : 'AnomalyFeed_scoreMed'
                  }`}
                >
                  Score {asset.anomalyScore}
                </span>
              </div>

              <div className="AnomalyFeed_itemDesc">{asset.anomalyDescription}</div>

              <div className="AnomalyFeed_itemFooter">
                <span className="AnomalyFeed_badge">{asset.category}</span>
                <span style={{ color: asset.percentChange24h >= 0 ? '#34d399' : '#f87171' }}>
                  24h: {formatPercent(asset.percentChange24h)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnomalyFeed;
