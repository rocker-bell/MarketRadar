import React from 'react';
import { Link } from 'react-router-dom';
import { Radar, ArrowRight, Activity, ShieldCheck, Zap } from 'lucide-react';
import '../Styles/LandingPage.css';

const Landing_page: React.FC = () => {
  return (
    <div className="LandingPage_container">
      <div className="LandingPage_heroCard">
        <div className="LandingPage_tag">
          <Radar size={14} />
          <span>CoinMarketCap Hackathon Project</span>
        </div>

        <h1 className="LandingPage_title">
          MarketRadar <br />
          <span className="LandingPage_gradientText">Anomaly Intelligence</span>
        </h1>

        <p className="LandingPage_description">
          Real-time crypto market screener detecting unusual volume accumulation, 
          momentum divergence, and capital rotation using CoinMarketCap API telemetry.
        </p>

        <Link to="/dashboard" className="LandingPage_launchBtn">
          <span>Launch Radar Terminal</span>
          <ArrowRight size={16} />
        </Link>

        <div className="LandingPage_features">
          <span><Activity size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> Volume Outlier Detection</span>
          <span><Zap size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> 1h vs 24h Momentum Radar</span>
          <span><ShieldCheck size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> Rate-Limit Resilient</span>
        </div>
      </div>
    </div>
  );
};

export default Landing_page;
