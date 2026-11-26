import React, { useMemo } from 'react';
import type { MarketMetrics, CryptoAsset } from '../../utilities/anomalyDetector';
import { formatCurrency, formatPercent } from '../../utilities/formatters';
import '../../Styles/V2_SignalDesk.css';

interface HeroChartCardProps {
  metrics: MarketMetrics;
  assets: CryptoAsset[];
  totalSignalsCount: number;
}

const HeroChartCard: React.FC<HeroChartCardProps> = ({ metrics, assets, totalSignalsCount }) => {
  // Dynamically compute average 24h market shift
  const avg24hChange = useMemo(() => {
    if (!assets || assets.length === 0) return 0;
    const sum = assets.reduce((acc, curr) => acc + curr.percentChange24h, 0);
    return sum / assets.length;
  }, [assets]);

  // Dynamically compute average volume momentum change
  const avgVolChange = useMemo(() => {
    if (!assets || assets.length === 0) return 0;
    const sum = assets.reduce((acc, curr) => acc + curr.volumeChange24h, 0);
    return sum / assets.length;
  }, [assets]);

  // Dynamically generate SVG curve points from live assets' momentum
  const { pathData, areaData, lastPoint } = useMemo(() => {
    if (!assets || assets.length === 0) {
      return {
        pathData: 'M 10,75 C 100,70 200,55 300,60 400,45 490,20',
        areaData: 'M 10,75 C 100,70 200,55 300,60 400,45 490,20 L 490,100 L 10,100 Z',
        lastPoint: { x: 490, y: 20 }
      };
    }

    const sample = assets.slice(0, 10);
    const count = sample.length;
    const points = sample.map((a, i) => {
      const x = 15 + i * (475 / Math.max(1, count - 1));
      // Normalize change (-10% to +30%) to height between 80 (bottom) and 18 (top)
      const clamped = Math.max(-10, Math.min(30, a.percentChange24h));
      const y = Math.round(80 - ((clamped + 10) / 40) * 62);
      return { x, y };
    });

    // Build smooth curve path
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev.x + curr.x) / 2;
      d += ` C ${cx},${prev.y} ${cx},${curr.y} ${curr.x},${curr.y}`;
    }

    const last = points[points.length - 1];
    const area = `${d} L ${last.x},100 L ${points[0].x},100 Z`;

    return { pathData: d, areaData: area, lastPoint: last };
  }, [assets]);

  return (
    <div className="V2_heroBannerCard">
      <div className="V2_heroMetricLeft">
        <span className="V2_heroMetricLabel">GLOBAL MARKET CAP</span>
        <span className="V2_heroMetricValue">{formatCurrency(metrics.totalMarketCap)}</span>
        <span className="V2_heroMetricPill">
          <span>{formatPercent(avg24hChange)} over 24 hours</span>
        </span>
      </div>

      {/* Center glowing neon sparkline computed from live asset momentum */}
      <div className="V2_sparklineArea">
        <svg viewBox="0 0 500 100" preserveAspectRatio="none" className="V2_sparklineSvg">
          <defs>
            <linearGradient id="v2LineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#bbf43d" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#bbf43d" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Dynamic Area Fill */}
          <path d={areaData} fill="url(#v2LineGrad)" />

          {/* Dynamic Glowing Stroke */}
          <path
            d={pathData}
            fill="none"
            stroke="#bbf43d"
            strokeWidth="3"
            filter="url(#glow)"
          />

          {/* Pulse tip point anchored to latest live token point */}
          <circle cx={lastPoint.x} cy={lastPoint.y} r="5" fill="#bbf43d" />
          <circle cx={lastPoint.x} cy={lastPoint.y} r="9" fill="#bbf43d" opacity="0.3" />
        </svg>
      </div>

      <div className="V2_heroMetricRightGroup">
        <div className="V2_heroSubMetric">
          <span className="V2_heroMetricLabel">RADAR VOLUME</span>
          <span className="V2_heroSubMetricVal">{formatCurrency(metrics.total24hVolume)}</span>
          <span className="V2_heroSubMetricSub" style={{ color: '#bbf43d' }}>
            {avgVolChange >= 0 ? '+' : ''}{avgVolChange.toFixed(1)}%
          </span>
        </div>

        <div className="V2_heroSubMetric">
          <span className="V2_heroMetricLabel">SIGNALS TODAY</span>
          <span className="V2_heroSubMetricVal">
            {totalSignalsCount < 10 ? `0${totalSignalsCount}` : totalSignalsCount}
          </span>
          <span className="V2_heroSubMetricSub">{metrics.activeAnomaliesCount} high confidence</span>
        </div>
      </div>
    </div>
  );
};

export default HeroChartCard;
