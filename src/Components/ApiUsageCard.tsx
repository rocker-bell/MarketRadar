import React from 'react';
import { Server } from 'lucide-react';
import type { ApiUsageStats } from '../utilities/signalStreamer';
import '../Styles/ApiUsageCard.css';

interface ApiUsageCardProps {
  stats: ApiUsageStats;
  isMockData: boolean;
}

const ApiUsageCard: React.FC<ApiUsageCardProps> = ({ stats, isMockData }) => {
  const percentUsed = Math.min(100, Math.round((stats.creditsUsed / stats.dailyQuota) * 100));

  return (
    <div className="ApiUsage_card">
      <div className="ApiUsage_header">
        <div className="ApiUsage_titleGroup">
          <Server size={16} style={{ color: '#38bdf8' }} />
          <span className="ApiUsage_title">CMC API Telemetry</span>
        </div>
        <span
          className={`ApiUsage_statusBadge ${
            !isMockData ? 'ApiUsage_statusLive' : 'ApiUsage_statusSnapshot'
          }`}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: !isMockData ? '#10b981' : '#38bdf8'
            }}
          ></span>
          {!isMockData ? 'Pro v1 Live' : 'Snapshot Safe'}
        </span>
      </div>

      <div className="ApiUsage_grid">
        <div className="ApiUsage_statBox">
          <div className="ApiUsage_statLabel">Calls Session</div>
          <div className="ApiUsage_statValue">{stats.callsMade}</div>
        </div>

        <div className="ApiUsage_statBox">
          <div className="ApiUsage_statLabel">Latency</div>
          <div className="ApiUsage_statValue" style={{ color: '#34d399' }}>
            {stats.latencyMs}ms
          </div>
        </div>
      </div>

      <div className="ApiUsage_progressSection">
        <div className="ApiUsage_progressLabelRow">
          <span>Daily Credit Quota</span>
          <span>{stats.creditsUsed} / {stats.dailyQuota} ({percentUsed}%)</span>
        </div>
        <div className="ApiUsage_progressBarBg">
          <div
            className="ApiUsage_progressBarFill"
            style={{ width: `${Math.max(4, percentUsed)}%` }}
          ></div>
        </div>
      </div>

      <div className="ApiUsage_endpointInfo">
        <span>Endpoint: {stats.endpoint}</span>
      </div>
    </div>
  );
};

export default ApiUsageCard;
