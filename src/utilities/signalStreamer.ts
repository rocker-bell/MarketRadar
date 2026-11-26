import type { CryptoAsset } from './anomalyDetector';

export interface LiveSignalEvent {
  id: string;
  assetId: number;
  symbol: string;
  name: string;
  anomalyType: CryptoAsset['anomalyType'];
  score: number;
  description: string;
  timestamp: Date;
  price: number;
  percentChange1h: number;
  percentChange24h: number;
}

export interface ApiUsageStats {
  callsMade: number;
  creditsUsed: number;
  dailyQuota: number;
  monthlyQuota: number;
  lastCallTimestamp: string | null;
  latencyMs: number;
  medianLatencyMs: number;
  latencyHistory: number[];
  errorCount: number;
  status: 'CONNECTED' | 'SNAPSHOT_MODE';
  endpoint: string;
  requestsPerMinute: number;
  peakRequestsPerMinute: number;
}

// Global in-memory telemetry state for session
let sessionCalls = 0;
let sessionCredits = 0;
let errorCount = 0;
const latencyHistory: number[] = [120];
let apiStatus: 'CONNECTED' | 'SNAPSHOT_MODE' = 'SNAPSHOT_MODE';
const sessionStartTime = Date.now();
let peakReqPerMin = 12;

export function recordApiCall(isLive: boolean, latency: number = 145, isError: boolean = false) {
  sessionCalls += 1;
  sessionCredits += isLive ? 1 : 0;
  if (isError) {
    errorCount += 1;
  }
  latencyHistory.push(latency);
  if (latencyHistory.length > 20) {
    latencyHistory.shift();
  }
  apiStatus = isLive ? 'CONNECTED' : 'SNAPSHOT_MODE';

  const elapsedMins = Math.max(0.2, (Date.now() - sessionStartTime) / 60000);
  const currentReqPerMin = Math.round(sessionCalls / elapsedMins);
  if (currentReqPerMin > peakReqPerMin) {
    peakReqPerMin = currentReqPerMin;
  }
}

export function getApiUsageStats(): ApiUsageStats {
  const sorted = [...latencyHistory].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const medianLatencyMs = sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);

  const elapsedMins = Math.max(0.2, (Date.now() - sessionStartTime) / 60000);
  const requestsPerMinute = Math.max(1, Math.round(sessionCalls / elapsedMins));

  return {
    callsMade: sessionCalls,
    creditsUsed: sessionCredits,
    dailyQuota: 333, // CMC Free Tier standard ~10k/month (~333/day)
    monthlyQuota: 10000,
    lastCallTimestamp: new Date().toLocaleTimeString(),
    latencyMs: latencyHistory[latencyHistory.length - 1] || 120,
    medianLatencyMs: medianLatencyMs || 120,
    latencyHistory: [...latencyHistory],
    errorCount,
    status: apiStatus,
    endpoint: '/v1/cryptocurrency/listings/latest',
    requestsPerMinute,
    peakRequestsPerMinute: Math.max(peakReqPerMin, requestsPerMinute)
  };
}

/**
 * Generates an initial batch of live signals from current assets
 */
export function generateInitialSignals(assets: CryptoAsset[]): LiveSignalEvent[] {
  const anomalies = assets
    .filter((a) => a.anomalyScore >= 40)
    .sort((a, b) => b.anomalyScore - a.anomalyScore);

  const now = Date.now();
  return anomalies.map((asset, index) => ({
    id: `sig-${asset.id}-${now - index * 14000}`,
    assetId: asset.id,
    symbol: asset.symbol,
    name: asset.name,
    anomalyType: asset.anomalyType,
    score: asset.anomalyScore,
    description: asset.anomalyDescription,
    timestamp: new Date(now - index * 14000),
    price: asset.price,
    percentChange1h: asset.percentChange1h,
    percentChange24h: asset.percentChange24h
  }));
}

/**
 * Creates a new live telemetry ping from random asset volatility tick
 */
export function createLiveSignalPing(assets: CryptoAsset[]): LiveSignalEvent | null {
  if (!assets || assets.length === 0) return null;

  // Pick an asset with interesting dynamics
  const candidatePool = assets.filter((a) => a.anomalyScore >= 35);
  const pool = candidatePool.length > 0 ? candidatePool : assets;
  const target = pool[Math.floor(Math.random() * pool.length)];

  // Slight jitter to simulate real-time price/vol movement
  const jitterChange = (Math.random() - 0.48) * 0.4;
  const jitterVol = Math.round((Math.random() - 0.4) * 8);
  const new1h = Number((target.percentChange1h + jitterChange).toFixed(2));
  const newVolChange = Math.max(10, Math.round(target.volumeChange24h + jitterVol));

  let newScore = target.anomalyScore + Math.floor((Math.random() - 0.4) * 5);
  newScore = Math.max(35, Math.min(99, newScore));

  const descriptions: Record<CryptoAsset['anomalyType'], string> = {
    ACCUMULATION: `Stealth volume divergence detected (+${newVolChange}% turnover surge)`,
    BREAKOUT: `1h momentum expansion (${new1h > 0 ? '+' : ''}${new1h}%) breaking daily resistance`,
    LIQUIDITY_SURGE: `Unusual liquidity concentration (${(target.volume24h / 1e6).toFixed(1)}M 24h vol)`,
    DIVERGENCE: `Price divergence detected against market beta`,
    STABLE: `Volatility consolidation within standard channel`
  };

  return {
    id: `sig-${target.id}-${Date.now()}`,
    assetId: target.id,
    symbol: target.symbol,
    name: target.name,
    anomalyType: target.anomalyType,
    score: newScore,
    description: descriptions[target.anomalyType] || target.anomalyDescription,
    timestamp: new Date(),
    price: target.price,
    percentChange1h: new1h,
    percentChange24h: target.percentChange24h
  };
}
