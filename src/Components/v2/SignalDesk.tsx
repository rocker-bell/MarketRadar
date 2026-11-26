import React, { useState } from 'react';
import {
  LayoutGrid,
  Activity,
  BarChart2,
  Bell,
  Settings,
  HelpCircle,
  Search,
  Plus,
  Radio
} from 'lucide-react';
import type { CryptoAsset, MarketMetrics } from '../../utilities/anomalyDetector';
import type { LiveSignalEvent, ApiUsageStats } from '../../utilities/signalStreamer';
import HeroChartCard from './HeroChartCard';
import WatchlistTable from './WatchlistTable';
import ConvictionCard from './ConvictionCard';
import LivePulseFeed from './LivePulseFeed';
import SignalsApiView from './SignalsApiView';
import TokenModalV2 from './TokenModalV2';
import '../../Styles/V2_SignalDesk.css';

interface SignalDeskProps {
  assets: CryptoAsset[];
  metrics: MarketMetrics | null;
  signals: LiveSignalEvent[];
  totalSignalsCount: number;
  apiStats: ApiUsageStats;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const SignalDesk: React.FC<SignalDeskProps> = ({
  assets,
  metrics,
  signals,
  totalSignalsCount,
  apiStats,
  onRefresh,
  isRefreshing
}) => {
  const [activeTab, setActiveTab] = useState<'desk' | 'api' | 'analytics'>('desk');
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // The highest conviction token (score >= 80, e.g. Arbitrum or top outlier)
  const highestConviction =
    assets.slice().sort((a, b) => b.anomalyScore - a.anomalyScore)[0] || assets[0] || null;

  const filteredAssets = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="V2_wrapper">
      {/* Sidebar Navigation */}
      <aside className="V2_sidebar">
        <div className="V2_sidebarTop">
          <div className="V2_radarLogoBtn" onClick={onRefresh} title="Click to refresh market telemetry">
            <Radio size={18} className={isRefreshing ? 'animate-spin' : ''} />
          </div>

          <nav className="V2_sidebarNav">
            <button
              className={`V2_sidebarNavBtn ${activeTab === 'desk' ? 'V2_sidebarNavBtnActive' : ''}`}
              onClick={() => setActiveTab('desk')}
              title="Signal Desk"
            >
              <LayoutGrid size={18} />
            </button>

            <button
              className={`V2_sidebarNavBtn ${activeTab === 'api' ? 'V2_sidebarNavBtnActive' : ''}`}
              onClick={() => setActiveTab('api')}
              title="Signals API"
            >
              <Activity size={18} />
            </button>

            <button
              className={`V2_sidebarNavBtn ${activeTab === 'analytics' ? 'V2_sidebarNavBtnActive' : ''}`}
              onClick={() => setActiveTab('desk')}
              title="Analytics"
            >
              <BarChart2 size={18} />
            </button>

            <button className="V2_sidebarNavBtn" title="Alerts">
              <Bell size={18} />
            </button>
          </nav>
        </div>

        <div className="V2_sidebarBottom">
          <button className="V2_sidebarNavBtn" title="Help & Info">
            <HelpCircle size={18} />
          </button>
          <div className="V2_userAvatar" title="Operator Profile">
            MK
          </div>
        </div>
      </aside>

      {/* Main Center Content */}
      <main className="V2_mainContent">
        {activeTab === 'desk' ? (
          <>
            {/* Header */}
            <div className="V2_topHeader">
              <div className="V2_headerTitleBlock">
                <div className="V2_liveSubhead">
                  <span className="V2_greenDot"></span>
                  <span>LIVE MARKET INTELLIGENCE</span>
                </div>
                <h1 className="V2_mainTitle">Signal desk</h1>
              </div>

              <div className="V2_headerActions">
                <div className="V2_searchContainer">
                  <Search size={14} className="V2_searchIcon" />
                  <input
                    type="text"
                    placeholder="Search assets"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="V2_searchInput"
                  />
                  <span className="V2_cmdKBadge">⌘ K</span>
                </div>

                <button className="V2_iconBtn" title="Radar settings">
                  <Settings size={15} />
                </button>

                <button className="V2_newScanBtn" onClick={onRefresh} disabled={isRefreshing}>
                  <Plus size={14} />
                  <span>{isRefreshing ? 'Scanning...' : 'New scan'}</span>
                </button>
              </div>
            </div>

            {/* Top Hero Card (Global Cap + Glowing Wave + Radar Volume) */}
            {metrics && (
              <HeroChartCard
                metrics={metrics}
                assets={assets}
                totalSignalsCount={totalSignalsCount}
              />
            )}

            {/* Main 2-Column Grid */}
            <div className="V2_gridContainer">
              {/* Left Column: 01 Signal Watchlist Table */}
              <WatchlistTable
                assets={filteredAssets}
                onSelectAsset={(asset) => setSelectedAsset(asset)}
              />

              {/* Right Column: 02 Highest Conviction + 03 Live Pulse */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <ConvictionCard
                  asset={highestConviction}
                  onOpenAnalysis={(asset) => setSelectedAsset(asset)}
                />

                <LivePulseFeed
                  signals={signals}
                  assets={assets}
                  onSelectAsset={(asset) => setSelectedAsset(asset)}
                />
              </div>
            </div>
          </>
        ) : (
          /* Signals API Tab View (Image 2) */
          <SignalsApiView
            stats={apiStats}
            assets={assets}
            signals={signals}
          />
        )}

        {/* Footer Strip */}
        <div className="V2_footerStrip">
          <div className="V2_footerLeft">
            <span>MR / 01</span>
            <span>COINMARKETCAP TELEMETRY</span>
          </div>
          <div className="V2_footerRight">
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#16a34a' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a' }}></span>
              SYSTEMS OPERATIONAL
            </span>
            <span>UPDATED 8 SEC AGO</span>
          </div>
        </div>
      </main>

      {/* V2 Modal Inspector (Image 3) */}
      <TokenModalV2
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />
    </div>
  );
};

export default SignalDesk;
