import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import type { CryptoAsset } from '../utilities/anomalyDetector';
import { formatCurrency, formatPercent } from '../utilities/formatters';
import '../Styles/RadarScanner.css';

interface RadarScannerProps {
  assets: CryptoAsset[];
  onSelectAsset: (asset: CryptoAsset) => void;
}

type SortField = 'anomalyScore' | 'price' | 'percentChange1h' | 'percentChange24h' | 'volume24h';

const RadarScanner: React.FC<RadarScannerProps> = ({ assets, onSelectAsset }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortField, setSortField] = useState<SortField>('anomalyScore');
  const [sortAsc, setSortAsc] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    assets.forEach((a) => set.add(a.category));
    return ['ALL', ...Array.from(set)];
  }, [assets]);

  // Filter & Sort
  const filteredAssets = useMemo(() => {
    return assets
      .filter((a) => {
        const matchesSearch =
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.symbol.toLowerCase().includes(search.toLowerCase());
        const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
      });
  }, [assets, search, selectedCategory, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getScoreFillColor = (score: number) => {
    if (score >= 80) return '#ef4444';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#3b82f6';
    return '#10b981';
  };

  const getBadgeClass = (type: CryptoAsset['anomalyType']) => {
    switch (type) {
      case 'ACCUMULATION':
        return 'RadarScanner_badgeAccumulation';
      case 'BREAKOUT':
        return 'RadarScanner_badgeBreakout';
      case 'LIQUIDITY_SURGE':
        return 'RadarScanner_badgeLiquidity';
      case 'DIVERGENCE':
        return 'RadarScanner_badgeDivergence';
      default:
        return 'RadarScanner_badgeStable';
    }
  };

  return (
    <div className="RadarScanner_wrapper">
      <div className="RadarScanner_toolbar">
        <div className="RadarScanner_titleGroup">
          <span className="RadarScanner_title">Anomaly Radar Screener</span>
          <span className="RadarScanner_countBadge">{filteredAssets.length} Assets</span>
        </div>

        <div className="RadarScanner_controls">
          <div className="RadarScanner_searchBox">
            <Search size={14} className="RadarScanner_searchIcon" />
            <input
              type="text"
              placeholder="Search token or symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="RadarScanner_searchInput"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="RadarScanner_filterSelect"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="RadarScanner_tableContainer">
        <table className="RadarScanner_table">
          <thead>
            <tr>
              <th className="RadarScanner_th">Asset</th>
              <th className="RadarScanner_th" onClick={() => handleSort('price')}>
                Price <ArrowUpDown size={11} style={{ verticalAlign: 'middle' }} />
              </th>
              <th className="RadarScanner_th" onClick={() => handleSort('percentChange1h')}>
                1h Change
              </th>
              <th className="RadarScanner_th" onClick={() => handleSort('percentChange24h')}>
                24h Change
              </th>
              <th className="RadarScanner_th" onClick={() => handleSort('volume24h')}>
                24h Volume
              </th>
              <th className="RadarScanner_th" onClick={() => handleSort('anomalyScore')}>
                Radar Anomaly Score
              </th>
              <th className="RadarScanner_th">Anomaly Signal</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset) => (
              <tr
                key={asset.id}
                className="RadarScanner_tr"
                onClick={() => onSelectAsset(asset)}
              >
                <td className="RadarScanner_td">
                  <div className="RadarScanner_assetCell">
                    <span className="RadarScanner_rank">#{asset.cmcRank}</span>
                    <div className="RadarScanner_symbolName">
                      <span className="RadarScanner_symbol">{asset.symbol}</span>
                      <span className="RadarScanner_name">{asset.name}</span>
                    </div>
                  </div>
                </td>
                <td className="RadarScanner_td" style={{ fontWeight: 600 }}>
                  {formatCurrency(asset.price)}
                </td>
                <td
                  className={`RadarScanner_td ${
                    asset.percentChange1h >= 0 ? 'RadarScanner_positive' : 'RadarScanner_negative'
                  }`}
                >
                  {formatPercent(asset.percentChange1h)}
                </td>
                <td
                  className={`RadarScanner_td ${
                    asset.percentChange24h >= 0 ? 'RadarScanner_positive' : 'RadarScanner_negative'
                  }`}
                >
                  {formatPercent(asset.percentChange24h)}
                </td>
                <td className="RadarScanner_td">
                  <div>{formatCurrency(asset.volume24h)}</div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: asset.volumeChange24h >= 0 ? '#34d399' : '#f87171'
                    }}
                  >
                    Vol {asset.volumeChange24h >= 0 ? '+' : ''}
                    {asset.volumeChange24h.toFixed(1)}%
                  </div>
                </td>
                <td className="RadarScanner_td">
                  <div className="RadarScanner_scoreContainer">
                    <div className="RadarScanner_scoreBarBg">
                      <div
                        className="RadarScanner_scoreBarFill"
                        style={{
                          width: `${asset.anomalyScore}%`,
                          backgroundColor: getScoreFillColor(asset.anomalyScore)
                        }}
                      ></div>
                    </div>
                    <span
                      style={{
                        fontWeight: 700,
                        color: getScoreFillColor(asset.anomalyScore)
                      }}
                    >
                      {asset.anomalyScore}
                    </span>
                  </div>
                </td>
                <td className="RadarScanner_td">
                  <span className={`RadarScanner_typeBadge ${getBadgeClass(asset.anomalyType)}`}>
                    {asset.anomalyType.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RadarScanner;
