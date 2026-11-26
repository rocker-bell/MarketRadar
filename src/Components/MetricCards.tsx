import React from 'react';
import { TrendingUp, Activity, Radio, Zap, Server } from 'lucide-react';
import type { MarketMetrics } from '../utilities/anomalyDetector';
import type { ApiUsageStats } from '../utilities/signalStreamer';
import { formatCurrency, formatPercent } from '../utilities/formatters';
import '../Styles/MetricCards.css';

interface MetricCardsProps {
  metrics: MarketMetrics;
  totalSignalsCount: number;
  apiStats: ApiUsageStats;
}

const MetricCards: React.FC<MetricCardsProps> = ({
  metrics,
  totalSignalsCount,
  apiStats
}) => {
  return (
    <div className="MetricCards_grid">
      <div className="MetricCards_card">
        <div className="MetricCards_header">
          <span className="MetricCards_label">Total Market Cap</span>
          <div className="MetricCards_iconBadge">
            <Activity size={15} />
          </div>
        </div>
        <div className="MetricCards_value">{formatCurrency(metrics.totalMarketCap)}</div>
        <div className="MetricCards_footer">
          <span className="MetricCards_pillPositive">BTC: {metrics.btcDominance.toFixed(1)}%</span>
          <span className="MetricCards_subtext">CMC Global</span>
        </div>
      </div>

      <div className="MetricCards_card">
        <div className="MetricCards_header">
          <span className="MetricCards_label">24h Radar Volume</span>
          <div className="MetricCards_iconBadge">
            <Zap size={15} />
          </div>
        </div>
        <div className="MetricCards_value">{formatCurrency(metrics.total24hVolume)}</div>
        <div className="MetricCards_footer">
          <span className="MetricCards_pillPositive">+14.2%</span>
          <span className="MetricCards_subtext">Turnover</span>
        </div>
      </div>

      <div className="MetricCards_card">
        <div className="MetricCards_header">
          <span className="MetricCards_label">Signals Detected</span>
          <div className="MetricCards_iconBadge" style={{ color: '#38bdf8' }}>
            <Radio size={15} />
          </div>
        </div>
        <div className="MetricCards_value">{totalSignalsCount} Active</div>
        <div className="MetricCards_footer">
          <span className="MetricCards_pillInfo">Live Stream</span>
          <span className="MetricCards_subtext">Cumulative radar</span>
        </div>
      </div>

      <div className="MetricCards_card">
        <div className="MetricCards_header">
          <span className="MetricCards_label">Top Divergence</span>
          <div className="MetricCards_iconBadge" style={{ color: '#fbbf24' }}>
            <TrendingUp size={15} />
          </div>
        </div>
        <div className="MetricCards_value">
          {metrics.topDivergenceSymbol} ({metrics.topDivergenceScore})
        </div>
        <div className="MetricCards_footer">
          <span className="MetricCards_pillPositive">{formatPercent(metrics.topGainerPercent)}</span>
          <span className="MetricCards_subtext">Peak Outlier</span>
        </div>
      </div>

      <div className="MetricCards_card">
        <div className="MetricCards_header">
          <span className="MetricCards_label">CMC API Calls</span>
          <div className="MetricCards_iconBadge" style={{ color: '#34d399' }}>
            <Server size={15} />
          </div>
        </div>
        <div className="MetricCards_value">{apiStats.callsMade} Calls</div>
        <div className="MetricCards_footer">
          <span className="MetricCards_pillPositive">{apiStats.latencyMs}ms</span>
          <span className="MetricCards_subtext">{apiStats.creditsUsed}/{apiStats.dailyQuota} Credits</span>
        </div>
      </div>
    </div>
  );
};

export default MetricCards;
