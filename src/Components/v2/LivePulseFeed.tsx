import React from 'react';
import { Activity } from 'lucide-react';
import type { LiveSignalEvent } from '../../utilities/signalStreamer';
import type { CryptoAsset } from '../../utilities/anomalyDetector';
import '../../Styles/V2_SignalDesk.css';

interface LivePulseFeedProps {
  signals: LiveSignalEvent[];
  assets: CryptoAsset[];
  onSelectAsset: (asset: CryptoAsset) => void;
}

const LivePulseFeed: React.FC<LivePulseFeedProps> = ({ signals, assets, onSelectAsset }) => {
  const getRelativeTime = (timestamp: Date): string => {
    const elapsed = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    if (elapsed < 10) return 'Now';
    if (elapsed < 60) return `${elapsed}s`;
    return `${Math.floor(elapsed / 60)}m`;
  };

  const handleItemClick = (sig: LiveSignalEvent) => {
    const matched = assets.find((a) => a.id === sig.assetId);
    if (matched) {
      onSelectAsset(matched);
    }
  };

  return (
    <div className="V2_livePulseCard">
      <div className="V2_livePulseHeader">
        <div className="V2_livePulseTitleGroup">
          <span className="V2_sectionNum">03</span>
          <span className="V2_livePulseTitle">Live pulse</span>
        </div>
        <div className="V2_streamingPill">
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a' }}></span>
          <span>Streaming</span>
        </div>
      </div>

      <div className="V2_pulseList">
        {signals.slice(0, 4).map((sig) => (
          <div
            key={sig.id}
            className="V2_pulseItem"
            onClick={() => handleItemClick(sig)}
          >
            <div className="V2_pulseItemLeft">
              <div className="V2_pulseIcon">
                <Activity size={13} />
              </div>
              <div className="V2_pulseItemInfo">
                <span className="V2_pulseItemSymbol">{sig.symbol}</span>
                <span className="V2_pulseItemDesc">{sig.description}</span>
              </div>
            </div>

            <div className="V2_pulseItemRight">
              <span className="V2_pulseScore">{sig.score}</span>
              <span className="V2_pulseTime">{getRelativeTime(sig.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivePulseFeed;
