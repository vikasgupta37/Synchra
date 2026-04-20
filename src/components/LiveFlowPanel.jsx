import React from 'react';
import { Activity, TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import PropTypes from 'prop-types';

/**
 * LiveFlowPanel - Displays real-time venue telemetry metrics and an animated throughput graph.
 * @param {Object} metrics - Current venue metrics
 * @param {Array} historyData - Historical throughput data for the chart
 */
function LiveFlowPanel({ metrics, historyData }) {
  return (
    <>
      <section className="glass-card" aria-label="Venue Telemetry Metrics">
        <div className="card-header">
          <div className="card-title">
            <Activity size={20} color="var(--accent-cyan)" aria-hidden="true" />
            Venue Telemetry
          </div>
        </div>
        <div className="live-flow-metrics" role="list" aria-label="Live venue metrics">
          <div className="metric-box" role="listitem">
            <span className="metric-label" id="throughput-label">Throughput</span>
            <div
              className="metric-value"
              aria-labelledby="throughput-label"
              aria-live="polite"
            >
              {metrics.flowRate.toLocaleString()}{' '}
              <span className="span">pax/h</span>
            </div>
          </div>
          <div className="metric-box" role="listitem">
            <span className="metric-label" id="wait-label">Avg Wait Time</span>
            <div
              className="metric-value"
              aria-labelledby="wait-label"
              aria-live="polite"
              style={{ color: metrics.avgWait > 5 ? 'var(--accent-red)' : 'var(--text-primary)' }}
            >
              {metrics.avgWait} <span className="span">min</span>
            </div>
          </div>
          <div className="metric-box" role="listitem">
            <span className="metric-label" id="density-label">Overall Density</span>
            <div
              className="metric-value"
              aria-labelledby="density-label"
              aria-live="polite"
            >
              {metrics.density}%
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card" style={{ flex: 1 }} aria-label="Real-Time Throughput Chart">
        <div className="card-header">
          <div className="card-title">
            <TrendingUp size={20} color="var(--accent-blue)" aria-hidden="true" />
            Real-Time Throughput
          </div>
        </div>
        <div
          className="chart-container-wrapper"
          role="img"
          aria-label="Area chart showing real-time passenger throughput over the last 15 intervals"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
              <YAxis
                stroke="var(--text-secondary)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 200', 'dataMax + 200']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-panel)',
                  borderColor: 'var(--border-light)',
                  borderRadius: '8px',
                }}
                itemStyle={{ color: 'var(--accent-cyan)' }}
              />
              <Area
                type="monotone"
                dataKey="throughput"
                name="Pax/h"
                stroke="var(--accent-cyan)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorThroughput)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}

LiveFlowPanel.propTypes = {
  metrics: PropTypes.shape({
    flowRate: PropTypes.number.isRequired,
    avgWait: PropTypes.number.isRequired,
    density: PropTypes.number.isRequired,
  }).isRequired,
  historyData: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string,
      throughput: PropTypes.number,
    })
  ).isRequired,
};

export default LiveFlowPanel;
