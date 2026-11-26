import React from 'react';
import { Layers, Sparkles } from 'lucide-react';
import '../../Styles/V2_SignalDesk.css';

interface VersionToggleProps {
  currentVersion: 'v1' | 'v2';
  onToggle: (v: 'v1' | 'v2') => void;
}

const VersionToggle: React.FC<VersionToggleProps> = ({ currentVersion, onToggle }) => {
  return (
    <div className="VersionToggle_floatingContainer">
      <button
        type="button"
        className={`VersionToggle_btn ${
          currentVersion === 'v1' ? 'VersionToggle_btnActive' : ''
        }`}
        onClick={() => onToggle('v1')}
        title="Switch to V1 (Classic Dark Radar)"
      >
        <Layers size={13} />
        <span>V1 Classic</span>
      </button>

      <button
        type="button"
        className={`VersionToggle_btn ${
          currentVersion === 'v2' ? 'VersionToggle_btnV2Active' : ''
        }`}
        onClick={() => onToggle('v2')}
        title="Switch to V2 (Signal Desk Neo-Editorial)"
      >
        <Sparkles size={13} />
        <span>V2 Signal Desk</span>
      </button>
    </div>
  );
};

export default VersionToggle;
