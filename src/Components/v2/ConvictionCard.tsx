import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import type { CryptoAsset } from '../../utilities/anomalyDetector';
import { formatCurrency, formatPercent } from '../../utilities/formatters';
import '../../Styles/V2_SignalDesk.css';

interface ConvictionCardProps {
  asset: CryptoAsset | null;
  onOpenAnalysis: (asset: CryptoAsset) => void;
}

const ConvictionCard: React.FC<ConvictionCardProps> = ({ asset, onOpenAnalysis }) => {
  if (!asset) return null;

  return (
    <div className="V2_convictionCard">
      <div className="V2_convictionTopRow">
        <span className="V2_convictionNum">02</span>
        <div className="V2_convictionBadge">
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0c0e12' }}></span>
          <span>HIGHEST CONVICTION</span>
        </div>
      </div>

      <div className="V2_convictionTitleRow">
        <span className="V2_convictionSymbol">{asset.symbol}</span>
        <span style={{ fontSize: '0.85rem', color: 'rgba(12, 14, 18, 0.6)' }}>/ USD</span>
        <span className="V2_convictionPrice">
          {formatCurrency(asset.price)}{' '}
          <span style={{ color: asset.percentChange24h >= 0 ? '#15803d' : '#b91c1c' }}>
            {formatPercent(asset.percentChange24h)}
          </span>
        </span>
      </div>

      <div className="V2_convictionPillRow">
        <span className="V2_convictionPill">Volume +{asset.volumeChange24h.toFixed(0)}%</span>
        <span className="V2_convictionPill">
          Momentum {asset.percentChange1h >= 0 ? '+' : ''}
          {asset.percentChange1h.toFixed(1)}
        </span>
      </div>

      {/* Radar Dial Gauge with concentric rings & lightning icon */}
      <div className="V2_radarDialContainer">
        <div className="V2_radarDialCircle">
          <div className="V2_radarDialInner">
            <Zap size={14} style={{ color: '#bbf43d', marginBottom: 2 }} />
            <span className="V2_dialScore">{asset.anomalyScore}</span>
            <span className="V2_dialLabel">RADAR</span>
          </div>
        </div>
      </div>

      <p className="V2_convictionDesc">{asset.anomalyDescription}</p>

      <button
        className="V2_openAnalysisBtn"
        onClick={() => onOpenAnalysis(asset)}
      >
        <span>Open full analysis</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default ConvictionCard;
