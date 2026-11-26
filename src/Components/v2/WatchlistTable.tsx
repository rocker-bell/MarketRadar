import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { CryptoAsset } from '../../utilities/anomalyDetector';
import { formatCurrency, formatPercent } from '../../utilities/formatters';
import '../../Styles/V2_SignalDesk.css';

interface WatchlistTableProps {
  assets: CryptoAsset[];
  onSelectAsset: (asset: CryptoAsset) => void;
}

const WatchlistTable: React.FC<WatchlistTableProps> = ({ assets, onSelectAsset }) => {
  const [filterTab, setFilterTab] = useState<'ALL' | 'Hot' | 'Rising'>('ALL');

  const filtered = assets.filter((a) => {
    if (filterTab === 'Hot') return a.anomalyScore >= 70;
    if (filterTab === 'Rising') return a.percentChange24h > 5;
    return true;
  });

  return (
    <div className="V2_watchlistCard">
      <div className="V2_watchlistHeader">
        <div className="V2_watchlistTitleGroup">
          <span className="V2_sectionNum">01</span>
          <span className="V2_watchlistTitle">Signal watchlist</span>
          <span className="V2_assetCountBadge">{filtered.length} ASSETS</span>
        </div>

        <div className="V2_filterTabs">
          <button
            className={`V2_filterTabBtn ${filterTab === 'ALL' ? 'V2_filterTabBtnActive' : ''}`}
            onClick={() => setFilterTab('ALL')}
          >
            ALL
          </button>
          <button
            className={`V2_filterTabBtn ${filterTab === 'Hot' ? 'V2_filterTabBtnActive' : ''}`}
            onClick={() => setFilterTab('Hot')}
          >
            Hot
          </button>
          <button
            className={`V2_filterTabBtn ${filterTab === 'Rising' ? 'V2_filterTabBtnActive' : ''}`}
            onClick={() => setFilterTab('Rising')}
          >
            Rising
          </button>
        </div>
      </div>

      <div className="V2_tableContainer">
        <table className="V2_table">
          <thead>
            <tr>
              <th className="V2_th">ASSET</th>
              <th className="V2_th">PRICE</th>
              <th className="V2_th">24H</th>
              <th className="V2_th">VOLUME</th>
              <th className="V2_th">RADAR SCORE</th>
              <th className="V2_th" style={{ textAlign: 'right' }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((asset, index) => {
              const rowNum = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;
              return (
                <tr
                  key={asset.id}
                  className="V2_tr"
                  onClick={() => onSelectAsset(asset)}
                >
                  <td className="V2_td">
                    <div className="V2_tokenAssetCell">
                      <span className="V2_tokenNum">{rowNum}</span>
                      <div className="V2_tokenInfo">
                        <span className="V2_tokenSymbol">{asset.symbol}</span>
                        <span className="V2_tokenName">{asset.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="V2_td" style={{ fontWeight: 600 }}>
                    {formatCurrency(asset.price)}
                  </td>
                  <td
                    className="V2_td"
                    style={{
                      color: asset.percentChange24h >= 0 ? '#16a34a' : '#ef4444',
                      fontWeight: 700
                    }}
                  >
                    {formatPercent(asset.percentChange24h)}
                  </td>
                  <td className="V2_td" style={{ color: '#475569' }}>
                    {formatCurrency(asset.volume24h)}
                  </td>
                  <td className="V2_td">
                    <div className="V2_scoreBarContainer">
                      <div className="V2_scoreBarTrack">
                        <div
                          className="V2_scoreBarFill"
                          style={{ width: `${asset.anomalyScore}%` }}
                        ></div>
                      </div>
                      <span className="V2_scoreVal">{asset.anomalyScore}</span>
                    </div>
                  </td>
                  <td className="V2_td V2_chevronCell">
                    <ChevronRight size={14} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WatchlistTable;
