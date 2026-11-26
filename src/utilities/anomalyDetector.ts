export interface CryptoAsset {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmcRank: number;
  price: number;
  percentChange1h: number;
  percentChange24h: number;
  percentChange7d: number;
  volume24h: number;
  volumeChange24h: number;
  marketCap: number;
  circulatingSupply: number;
  category: string;
  anomalyScore: number;
  anomalyType: 'ACCUMULATION' | 'BREAKOUT' | 'LIQUIDITY_SURGE' | 'DIVERGENCE' | 'STABLE';
  anomalyDescription: string;
  lastUpdated: string;
}

export interface MarketMetrics {
  totalMarketCap: number;
  total24hVolume: number;
  btcDominance: number;
  activeAnomaliesCount: number;
  topGainerSymbol: string;
  topGainerPercent: number;
  topDivergenceSymbol: string;
  topDivergenceScore: number;
}

/**
 * Calculates MarketRadar anomaly score (0 - 100)
 * Evaluates:
 * 1. Volume spike vs Price stagnation (Accumulation)
 * 2. 1h sudden acceleration compared to 24h baseline (Breakout)
 * 3. Volume-to-MarketCap ratio extremity (Liquidity Surge)
 */
export function computeAnomaly(
  _price: number,
  change1h: number,
  change24h: number,
  volume24h: number,
  volumeChange24h: number,
  marketCap: number
): {
  score: number;
  type: CryptoAsset['anomalyType'];
  description: string;
} {
  const volToMcapRatio = marketCap > 0 ? (volume24h / marketCap) * 100 : 0;
  let score = 0;
  let type: CryptoAsset['anomalyType'] = 'STABLE';
  let description = 'Normal baseline activity';

  // Anomaly 1: Accumulation (High volume surge with little price appreciation)
  if (volumeChange24h > 70 && Math.abs(change24h) < 4) {
    score = Math.min(95, Math.round(50 + volumeChange24h * 0.35));
    type = 'ACCUMULATION';
    description = `Vol surge (+${volumeChange24h.toFixed(0)}%) with suppressed price action (Accumulation)`;
  } 
  // Anomaly 2: Rapid 1h Breakout (1h momentum exceeds 24h aggregate momentum)
  else if (Math.abs(change1h) >= 3.5 && (Math.sign(change1h) !== Math.sign(change24h) || Math.abs(change1h) > Math.abs(change24h) * 0.6)) {
    score = Math.min(98, Math.round(55 + Math.abs(change1h) * 6));
    type = 'BREAKOUT';
    description = `Rapid 1h velocity (${change1h > 0 ? '+' : ''}${change1h.toFixed(2)}%) diverging from daily trend`;
  }
  // Anomaly 3: Liquidity Surge (Volume to Market Cap ratio > 40%)
  else if (volToMcapRatio > 35) {
    score = Math.min(90, Math.round(45 + volToMcapRatio * 0.8));
    type = 'LIQUIDITY_SURGE';
    description = `Extreme volume/cap turnover (${volToMcapRatio.toFixed(1)}% daily turnover)`;
  }
  // Anomaly 4: Momentum Divergence
  else if (change24h > 15 || change24h < -12) {
    score = Math.min(85, Math.round(40 + Math.abs(change24h) * 1.5));
    type = 'DIVERGENCE';
    description = `Heavy 24h volatility (${change24h > 0 ? '+' : ''}${change24h.toFixed(1)}%) with elevated volume`;
  } else {
    score = Math.max(10, Math.round(15 + volToMcapRatio * 0.5));
    type = 'STABLE';
    description = 'Within standard market volatility';
  }

  return { score, type, description };
}
