import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import type { CryptoAsset } from '../utilities/anomalyDetector';
import { formatCurrency, formatPercent } from '../utilities/formatters';
import '../Styles/TokenModal.css';

interface TokenModalProps {
  asset: CryptoAsset | null;
  onClose: () => void;
}

const TokenModal: React.FC<TokenModalProps> = ({ asset, onClose }) => {
  if (!asset) return null;

  const turnoverRatio = asset.marketCap > 0 ? ((asset.volume24h / asset.marketCap) * 100).toFixed(2) : '0';

  return (
    <div className="TokenModal_overlay" onClick={onClose}>
      <div className="TokenModal_modal" onClick={(e) => e.stopPropagation()}>
        <div className="TokenModal_header">
          <div className="TokenModal_titleGroup">
            <span className="TokenModal_symbol">
              {asset.name} ({asset.symbol})
            </span>
            <span className="TokenModal_name">
              CoinMarketCap Rank #{asset.cmcRank} • Sector: {asset.category}
            </span>
          </div>
          <button className="TokenModal_closeBtn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="TokenModal_anomalyBanner">
          <div className="TokenModal_anomalyTitle">
            Radar Signal: {asset.anomalyType.replace('_', ' ')} (Score {asset.anomalyScore}/100)
          </div>
          <div className="TokenModal_anomalyDesc">{asset.anomalyDescription}</div>
        </div>

        <div className="TokenModal_statsGrid">
          <div className="TokenModal_statBox">
            <div className="TokenModal_statLabel">Current Price</div>
            <div className="TokenModal_statVal">{formatCurrency(asset.price)}</div>
          </div>

          <div className="TokenModal_statBox">
            <div className="TokenModal_statLabel">24h Vol Turnover</div>
            <div className="TokenModal_statVal">{turnoverRatio}% of Cap</div>
          </div>

          <div className="TokenModal_statBox">
            <div className="TokenModal_statLabel">1h Momentum</div>
            <div
              className="TokenModal_statVal"
              style={{ color: asset.percentChange1h >= 0 ? '#34d399' : '#f87171' }}
            >
              {formatPercent(asset.percentChange1h)}
            </div>
          </div>

          <div className="TokenModal_statBox">
            <div className="TokenModal_statLabel">24h Price Change</div>
            <div
              className="TokenModal_statVal"
              style={{ color: asset.percentChange24h >= 0 ? '#34d399' : '#f87171' }}
            >
              {formatPercent(asset.percentChange24h)}
            </div>
          </div>

          <div className="TokenModal_statBox">
            <div className="TokenModal_statLabel">24h Trading Volume</div>
            <div className="TokenModal_statVal">{formatCurrency(asset.volume24h)}</div>
          </div>

          <div className="TokenModal_statBox">
            <div className="TokenModal_statLabel">Circulating Market Cap</div>
            <div className="TokenModal_statVal">{formatCurrency(asset.marketCap)}</div>
          </div>
        </div>

        <div className="TokenModal_actionFooter">
          <a
            href={`https://coinmarketcap.com/currencies/${asset.slug}/`}
            target="_blank"
            rel="noreferrer"
            className="TokenModal_cmcLink"
          >
            View on CoinMarketCap <ExternalLink size={12} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TokenModal;
