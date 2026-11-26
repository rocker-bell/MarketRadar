import React from 'react';
import { Radar, RefreshCw } from 'lucide-react';
import '../Styles/NavBar.css';

interface NavBarProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  isMockData?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ onRefresh, isRefreshing, isMockData }) => {
  return (
    <header className="NavBar_container">
      <div className="NavBar_leftSection">
        <div className="NavBar_logoBadge">
          <div className="NavBar_logoIcon">
            <Radar size={20} />
          </div>
          <div className="NavBar_titleGroup">
            <span className="NavBar_title">MarketRadar</span>
            <span className="NavBar_subtitle">CoinMarketCap Intelligence</span>
          </div>
        </div>

        <div className="NavBar_statusPill">
          <span className="NavBar_livePulse"></span>
          <span>{isMockData ? 'Radar Mode: Snapshot' : 'Radar Mode: Live API'}</span>
        </div>
      </div>

      <div className="NavBar_rightSection">
        <a href="#/" className="NavBar_navLink">Landing</a>
        <a href="#/dashboard" className="NavBar_navLink" style={{ color: '#38bdf8' }}>Dashboard</a>

        <button 
          className="NavBar_actionBtn" 
          onClick={onRefresh} 
          disabled={isRefreshing}
          title="Refresh market radar telemetry"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          <span>{isRefreshing ? 'Scanning...' : 'Scan Market'}</span>
        </button>
      </div>
    </header>
  );
};

export default NavBar;
