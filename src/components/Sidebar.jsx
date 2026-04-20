import React from 'react';
import { Activity, Map, ShieldAlert, Settings, Zap } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Sidebar - Navigation sidebar for the Synchra dashboard.
 * Provides accessible navigation between dashboard panels.
 * @param {string} activeTab - Currently active tab ID
 * @param {Function} onTabChange - Callback to change the active tab
 */
function Sidebar({ activeTab, onTabChange }) {
  const navItems = [
    { id: 'live', label: 'Live Flow', icon: Activity },
    { id: 'insights', label: 'Zone Insights', icon: Map },
    { id: 'alerts', label: 'Predictive Alerts', icon: ShieldAlert },
  ];

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="brand">
        <Zap className="brand-icon" size={28} aria-hidden="true" />
        <h1>SYNCHRA</h1>
      </div>

      <nav className="nav-links" aria-label="Dashboard sections">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${activeTab === id ? 'active' : ''}`}
            onClick={() => onTabChange(id)}
            aria-current={activeTab === id ? 'page' : undefined}
            aria-label={label}
            type="button"
          >
            <Icon className="icon" size={20} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <button className="nav-item" type="button" aria-label="Configuration settings">
          <Settings className="icon" size={20} aria-hidden="true" />
          <span>Configuration</span>
        </button>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default Sidebar;
