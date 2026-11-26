import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import type { CryptoAsset } from '../../utilities/anomalyDetector';
import { formatCurrency, formatPercent } from '../../utilities/formatters';
import '../../Styles/V2_SignalDesk.css';

interface TokenModalV2Props {
  asset: CryptoAsset | null;
  onClose: () => void;
}

const TokenModalV2: React.FC<TokenModalV2Props> = ({ asset, onClose }) => {
  if (!asset) return null;

  return (
    <div className="V2_modalOverlay" onClick={onClose}>
      <div className="V2_modalWrapper" onClick={(e) => e.stopPropagation()}>
        {/* Offset lime-green underlay shadow */}
        <div className="V2_modalUnderlayShadow"></div>

        <div className="V2_modalCard">
          <div className="V2_modalHeader">
            <span className="V2_modalSubtitle">
              SIGNAL ANALYSIS / {asset.symbol}
            </span>
            <button className="V2_modalCloseBtn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <h2 className="V2_modalTitle">{asset.name}</h2>

          <div className="V2_modalScoreRow">
            <span className="V2_modalScoreNum">{asset.anomalyScore}</span>
            <div className="V2_modalScoreMeta">
              <span className="V2_modalScoreLabel">RADAR SCORE</span>
              <span className="V2_modalScoreConviction">
                {asset.anomalyScore >= 80 ? 'HIGH CONVICTION' : 'ELEVATED ALPHA'}
              </span>
            </div>
          </div>

          <p className="V2_modalNarrative">
            MarketRadar identified a <strong>{asset.anomalyType.toLowerCase().replace('_', ' ')}</strong> pattern with elevated volume and strengthening short-term momentum.
          </p>

          <div className="V2_modalStatsGrid">
            <div className="V2_modalStatCol">
              <span className="V2_modalStatColLabel">PRICE</span>
              <span className="V2_modalStatColVal">{formatCurrency(asset.price)}</span>
            </div>
            <div className="V2_modalStatCol">
              <span className="V2_modalStatColLabel">24H CHANGE</span>
              <span
                className="V2_modalStatColVal"
                style={{ color: asset.percentChange24h >= 0 ? '#16a34a' : '#ef4444' }}
              >
                {formatPercent(asset.percentChange24h)}
              </span>
            </div>
            <div className="V2_modalStatCol">
              <span className="V2_modalStatColLabel">VOLUME</span>
              <span className="V2_modalStatColVal">{formatCurrency(asset.volume24h)}</span>
            </div>
          </div>

          <a
            href={`https://coinmarketcap.com/currencies/${asset.slug}/`}
            target="_blank"
            rel="noreferrer"
            className="V2_modalActionBtn"
          >
            <span>View on CoinMarketCap</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TokenModalV2;
