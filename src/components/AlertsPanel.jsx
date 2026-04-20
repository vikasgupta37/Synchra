import React from 'react';
import { ShieldAlert, Zap, Activity } from 'lucide-react';

/** Alert definitions with severity levels and metadata */
const ALERTS = [
  {
    id: 1,
    severity: 'critical',
    icon: ShieldAlert,
    iconColor: 'var(--accent-red)',
    title: 'High Bottleneck Probability',
    timestamp: '2 mins ago',
    description:
      'Predictive model indicates 85% probability of bottleneck at Gate A in 12 minutes. Recommendation: Redirect 30% of incoming traffic to Gate C immediately to preempt congestion.',
  },
  {
    id: 2,
    severity: 'warning',
    icon: Zap,
    iconColor: '#ffaa00',
    title: 'Surge Anticipated – North Concourse',
    timestamp: '15 mins ago',
    description:
      'Minor surge expected near North Concourse at halftime. Security units preemptively deployed and wayfinding digital signs updated accordingly.',
  },
  {
    id: 3,
    severity: 'info',
    icon: Activity,
    iconColor: 'var(--accent-blue)',
    title: 'Flow Optimised – Gate C',
    timestamp: '1 hour ago',
    description:
      'Traffic systematically rerouted to Gate C to balance ingress load. Average wait times reduced by 1.2 minutes across general admission zones.',
  },
];

/**
 * AlertsPanel - Displays a time-ordered feed of AI predictive alerts with severity tags.
 */
function AlertsPanel() {
  return (
    <section className="glass-card" style={{ flex: 1 }} aria-label="Predictive Alerts Feed">
      <div className="card-header">
        <div className="card-title">
          <ShieldAlert size={20} color="var(--accent-red)" aria-hidden="true" />
          Active Predictive Alerts
        </div>
      </div>

      <ul className="alerts-list" aria-label="List of predictive alerts" role="list">
        {ALERTS.map(({ id, severity, icon: Icon, iconColor, title, timestamp, description }) => (
          <li
            key={id}
            className={`alert-item ${severity}`}
            role="listitem"
            aria-label={`${severity} alert: ${title}`}
          >
            <Icon color={iconColor} size={24} style={{ flexShrink: 0 }} aria-hidden="true" />
            <div style={{ flex: 1 }}>
              <div className="alert-header">
                <span className="alert-title">{title}</span>
                <time style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {timestamp}
                </time>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
                {description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AlertsPanel;
