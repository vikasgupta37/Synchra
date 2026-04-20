import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import LiveFlowPanel from './components/LiveFlowPanel';
import ZoneInsightsPanel from './components/ZoneInsightsPanel';
import AlertsPanel from './components/AlertsPanel';
import AgentConsole from './components/AgentConsole';
import './index.css';

/**
 * Synchra Traffic Controller - Main application component.
 * Orchestrates state and communication between all dashboard panels.
 */
function App() {
  const [activeTab, setActiveTab] = useState('live');
  const [messages, setMessages] = useState([
    {
      role: 'synchra',
      content:
        'Synchra core online. Anticipatory models active. Venue status is currently optimal.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Live simulated metrics
  const [metrics, setMetrics] = useState({
    flowRate: 4200,
    avgWait: 3.2,
    density: 68,
  });

  // Historical data for the real-time throughput chart
  const [historyData, setHistoryData] = useState(
    Array.from({ length: 15 }, (_, i) => ({
      time: new Date(Date.now() - (15 - i) * 3000).toLocaleTimeString([], {
        hour12: false,
        minute: '2-digit',
        second: '2-digit',
      }),
      throughput: 4000 + Math.floor(Math.random() * 500),
      density: 65 + Math.floor(Math.random() * 10),
    }))
  );

  // Simulate live venue data updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => {
        const newFlow = Math.max(1000, prev.flowRate + Math.floor(Math.random() * 200) - 100);
        const newWait = Math.max(0.5, +(prev.avgWait + (Math.random() * 0.4 - 0.2)).toFixed(1));
        const newDensity = Math.min(100, Math.max(0, prev.density + Math.floor(Math.random() * 4) - 2));

        setHistoryData((h) => {
          const ts = new Date().toLocaleTimeString([], {
            hour12: false,
            minute: '2-digit',
            second: '2-digit',
          });
          return [...h.slice(1), { time: ts, throughput: newFlow, density: newDensity }];
        });

        return { flowRate: newFlow, avgWait: newWait, density: newDensity };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Handles operator message submission and generates Synchra's simulated AI response.
   * @param {React.FormEvent} e - Form submit event
   */
  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: 'operator', content: trimmed }]);
    const query = trimmed.toLowerCase();
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let response = 'Acknowledged. Monitoring conditions and maintaining synchronized flow.';

      if (query.includes('gate a') || query.includes('congestion')) {
        response =
          '[ALERT] Predictive model indicates 85% probability of bottleneck at Gate A in 12 minutes. Recommendation: Redirect 30% of incoming traffic to Gate C and redeploy 2 security units. Confirm execution?';
      } else if (query.includes('confirm') || query.includes('yes')) {
        response =
          'Action confirmed. Traffic routed to Gate C. Security deployment adjusting. Visualizing flow stabilization.';
      } else if (query.includes('status')) {
        response =
          'Current Flow: Smooth. Safety: Optimal. Experience Index: 92/100. Anticipating minor surge near North Concourse at halftime.';
      } else if (query.includes('full status report')) {
        response =
          'Full Report — Throughput: 4,200 pax/h | Avg Wait: 3.2 min | Density: 68% | Gate A: High Risk | Gates B/C: Nominal | Safety Score: 97/100 | Experience Index: 92/100.';
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, { role: 'synchra', content: response }]);
    }, 1500 + Math.random() * 800);
  };

  /**
   * Injects a quick-action prompt into the chat input field.
   * @param {string} text - Suggested prompt text
   */
  const handleQuickAction = (text) => {
    setInput(text);
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="main-content" id="main-content" tabIndex={-1}>
        <Topbar />

        <div className="dashboard-grid fade-in">
          {/* Dynamic left column based on active tab */}
          <div
            className="left-col"
            style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', paddingRight: '8px' }}
          >
            {activeTab === 'live' && (
              <LiveFlowPanel metrics={metrics} historyData={historyData} />
            )}
            {activeTab === 'insights' && <ZoneInsightsPanel />}
            {activeTab === 'alerts' && <AlertsPanel />}
          </div>

          {/* Right column — always-visible Agent Console */}
          <AgentConsole
            messages={messages}
            isTyping={isTyping}
            input={input}
            setInput={setInput}
            onSend={handleSend}
            onQuickAction={handleQuickAction}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
