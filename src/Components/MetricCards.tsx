import React from 'react';
import { TrendingUp, Activity, AlertTriangle, Zap } from 'lucide-react';
import type { MarketMetrics } from '../utilities/anomalyDetector';
import { formatCurrency, formatPercent } from '../utilities/formatters';
import '../Styles/MetricCards.css';

interface MetricCardsProps {
  metrics: MarketMetrics;
}

const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  return (
    <div className="MetricCards_grid">
      <div className="MetricCards_card">
        <div className="MetricCards_header">
          <span className="MetricCards_label">Total Market Cap</span>
          <div className="MetricCards_iconBadge">
            <Activity size={16} />
          </div>
        </div>
        <div className="MetricCards_value">{formatCurrency(metrics.totalMarketCap)}</div>
        <div className="MetricCards_footer">
          <span className="MetricCards_pillPositive">BTC Dom: {metrics.btcDominance.toFixed(1)}%</span>
          <span className="MetricCards_subtext">CMC Global</span>
        </div>
      </div>

      <div className="MetricCards_card">
        <div className="MetricCards_header">
          <span className="MetricCards_label">24h Radar Volume</span>
          <div className="MetricCards_iconBadge">
            <Zap size={16} />
          </div>
        </div>
        <div className="MetricCards_value">{formatCurrency(metrics.total24hVolume)}</div>
        <div className="MetricCards_footer">
          <span className="MetricCards_pillPositive">+14.2%</span>
          <span className="MetricCards_subtext">Aggregated turnover</span>
        </div>
      </div>

      <div className="MetricCards_card">
        <div className="MetricCards_header">
          <span className="MetricCards_label">Active Anomalies</span>
          <div className="MetricCards_iconBadge" style={{ color: '#fbbf24' }}>
            <AlertTriangle size={16} />
          </div>
        </div>
        <div className="MetricCards_value">{metrics.activeAnomaliesCount} Signals</div>
        <div className="MetricCards_footer">
          <span className="MetricCards_pillWarning">Score &ge; 60/100</span>
          <span className="MetricCards_subtext">Accumulation / Breakout</span>
        </div>
      </div>

      <div className="MetricCards_card">
        <div className="MetricCards_header">
          <span className="MetricCards_label">Top Divergence Asset</span>
          <div className="MetricCards_iconBadge" style={{ color: '#38bdf8' }}>
            <TrendingUp size={16} />
          </div>
        </div>
        <div className="MetricCards_value">{metrics.topDivergenceSymbol} ({metrics.topDivergenceScore}/100)</div>
        <div className="MetricCards_footer">
          <span className="MetricCards_pillPositive">{formatPercent(metrics.topGainerPercent)}</span>
          <span className="MetricCards_subtext">Strongest outlier</span>
        </div>
      </div>
    </div>
  );
};

export default MetricCards;
