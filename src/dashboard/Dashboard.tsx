import React, { useState, useEffect, useCallback, useRef } from 'react';
import NavBar from '../Components/NavBar';
import MetricCards from '../Components/MetricCards';
import RadarScanner from '../Components/RadarScanner';
import AnomalyFeed from '../Components/AnomalyFeed';
import ApiUsageCard from '../Components/ApiUsageCard';
import TokenModal from '../Components/TokenModal';
import VersionToggle from '../Components/v2/VersionToggle';
import SignalDesk from '../Components/v2/SignalDesk';
import { fetchMarketData } from '../utilities/cmcApi';
import type { CryptoAsset, MarketMetrics } from '../utilities/anomalyDetector';
import {
  type LiveSignalEvent,
  type ApiUsageStats,
  getApiUsageStats,
  generateInitialSignals,
  createLiveSignalPing
} from '../utilities/signalStreamer';
import '../Styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const [version, setVersion] = useState<'v1' | 'v2'>('v1');
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [metrics, setMetrics] = useState<MarketMetrics | null>(null);
  const [isMockData, setIsMockData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);

  // Live Signals & API Telemetry State
  const [signals, setSignals] = useState<LiveSignalEvent[]>([]);
  const [totalSignalsCount, setTotalSignalsCount] = useState<number>(0);
  const [apiStats, setApiStats] = useState<ApiUsageStats>(getApiUsageStats());

  const assetsRef = useRef<CryptoAsset[]>([]);
  assetsRef.current = assets;

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

      // Initialize signals if empty
      if (signals.length === 0) {
        const initial = generateInitialSignals(result.assets);
        setSignals(initial);
        setTotalSignalsCount(initial.length);
      }

      setApiStats(getApiUsageStats());
    } catch (err) {
      console.error('Failed to load telemetry from MarketRadar engine:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [signals.length]);

  // Initial fetch and 60s full polling
  useEffect(() => {
    loadData();

    const intervalId = setInterval(() => {
      loadData(true);
    }, 60000);

    return () => clearInterval(intervalId);
  }, [loadData]);

  // Live "per signal" continuous fetching stream (sweeps every 8 seconds)
  useEffect(() => {
    const signalInterval = setInterval(() => {
      if (assetsRef.current.length > 0) {
        const newPing = createLiveSignalPing(assetsRef.current);
        if (newPing) {
          setSignals((prev) => [newPing, ...prev.slice(0, 19)]); // Keep last 20 in memory
          setTotalSignalsCount((count) => count + 1);
          setApiStats(getApiUsageStats());
        }
      }
    }, 8000);

    return () => clearInterval(signalInterval);
  }, []);

  return (
    <>
      {/* Absolute / Fixed Version Toggle (V1 vs V2) */}
      <VersionToggle
        currentVersion={version}
        onToggle={(v) => setVersion(v)}
      />

      {version === 'v2' ? (
        /* V2: Signal Desk Experience (Editorial Neo-Brutalist Tech) */
        <SignalDesk
          assets={assets}
          metrics={metrics}
          signals={signals}
          totalSignalsCount={totalSignalsCount}
          apiStats={apiStats}
          onRefresh={() => loadData(true)}
          isRefreshing={isRefreshing}
        />
      ) : (
        /* V1: Classic Dark Radar Experience */
        <div className="Dashboard_container">
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
                {metrics && (
                  <MetricCards
                    metrics={metrics}
                    totalSignalsCount={totalSignalsCount}
                    apiStats={apiStats}
                  />
                )}

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
                      signals={signals}
                      totalSignalsCount={totalSignalsCount}
                      onSelectAsset={(asset) => setSelectedAsset(asset)}
                    />

                    <ApiUsageCard
                      stats={apiStats}
                      isMockData={isMockData}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="Dashboard_footerNote">
              <span>MarketRadar v1.0 • CoinMarketCap API Telemetry</span>
              <span>•</span>
              <span>Continuous Radar Stream (8s Per-Signal Sweeps)</span>
              <span>•</span>
              <span>Session Signals: {totalSignalsCount}</span>
            </div>
          </div>

          {/* V1 Asset Deep-Dive Drawer/Modal */}
          <TokenModal
            asset={selectedAsset}
            onClose={() => setSelectedAsset(null)}
          />
        </div>
      )}
    </>
  );
};

export default Dashboard;
