import React, { useState, useEffect, useCallback } from 'react';
import NavBar from '../Components/NavBar';
import MetricCards from '../Components/MetricCards';
import RadarScanner from '../Components/RadarScanner';
import AnomalyFeed from '../Components/AnomalyFeed';
import TokenModal from '../Components/TokenModal';
import { fetchMarketData } from '../utilities/cmcApi';
import type { CryptoAsset, MarketMetrics } from '../utilities/anomalyDetector';
import '../Styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [metrics, setMetrics] = useState<MarketMetrics | null>(null);
  const [isMockData, setIsMockData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);

  const loadData = useCallback(async (showRefreshingSpinner = false) => {
    if (showRefreshingSpinner) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const result = await fetchMarketData();
      setAssets(result.assets);
      setMetrics(result.metrics);
      setIsMockData(result.isMock);
    } catch (err) {
      console.error('Failed to load telemetry from MarketRadar engine:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Auto-refresh every 60 seconds
    const intervalId = setInterval(() => {
      loadData(true);
    }, 60000);

    return () => clearInterval(intervalId);
  }, [loadData]);

  return (
    <div className="Dashboard_container">
      {/* Navigation Header */}
      <NavBar
        onRefresh={() => loadData(true)}
        isRefreshing={isRefreshing}
        isMockData={isMockData}
      />

      <div className="Dashboard_contentWrapper">
        {isLoading && !metrics ? (
          <div className="Dashboard_loadingState">
            <div className="Dashboard_loadingPulse"></div>
            <span>Calibrating MarketRadar Telemetry Sensors...</span>
          </div>
        ) : (
          <>
            {/* Top Market Metric Cards */}
            {metrics && <MetricCards metrics={metrics} />}

            {/* Main Interactive Grid */}
            <div className="Dashboard_mainGrid">
              <div className="Dashboard_scannerSection">
                <RadarScanner
                  assets={assets}
                  onSelectAsset={(asset) => setSelectedAsset(asset)}
                />
              </div>

              <div className="Dashboard_feedSection">
                <AnomalyFeed
                  assets={assets}
                  onSelectAsset={(asset) => setSelectedAsset(asset)}
                />
              </div>
            </div>
          </>
        )}

        <div className="Dashboard_footerNote">
          <span>MarketRadar v1.0 • CoinMarketCap API Telemetry</span>
          <span>•</span>
          <span>Automatic 60s Sensor Polling</span>
        </div>
      </div>

      {/* Asset Deep-Dive Drawer/Modal */}
      <TokenModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />
    </div>
  );
};

export default Dashboard;
