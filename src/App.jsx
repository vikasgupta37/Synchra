import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Map, 
  MessageSquare, 
  ShieldAlert, 
  Wind, 
  Settings,
  Send,
  User,
  Zap
} from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('live');
  const [messages, setMessages] = useState([
    { role: 'synchra', content: 'Synchra core online. Anticipatory models active. Venue status is currently optimal.' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  // Simulated live data
  const [metrics, setMetrics] = useState({
    flowRate: 4200, // pax/hour
    avgWait: 3.2, // mins
    density: 68 // percentage
  });

  // Flow simulation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        flowRate: prev.flowRate + Math.floor(Math.random() * 100) - 50,
        avgWait: Math.max(1, +(prev.avgWait + (Math.random() * 0.4 - 0.2)).toFixed(1)),
        density: Math.min(100, Math.max(0, prev.density + Math.floor(Math.random() * 4) - 2))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Chat scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'operator', content: input }]);
    const currentInput = input.toLowerCase();
    setInput('');

    // Synchra simulated response
    setTimeout(() => {
      let response = "Acknowledged. Monitoring conditions and maintaining synchronized flow.";
      
      if (currentInput.includes('congestion') || currentInput.includes('gate a')) {
        response = "[ALERT] Predictive model indicates 85% probability of bottleneck at Gate A in 12 minutes. Recommendation: Redirect 30% of incoming traffic to Gate C and redeploy 2 security units. Confirm execution?";
      } else if (currentInput.includes('confirm') || currentInput.includes('yes')) {
        response = "Action confirmed. Traffic routed to Gate C. Security deployment adjusting. Visualizing flow stabilization.";
      } else if (currentInput.includes('status')) {
        response = "Current Flow: Smooth. Safety: Optimal. Experience Index: 92/100. Anticipating minor surge near North Concourse at halftime.";
      }

      setMessages(prev => [...prev, { role: 'synchra', content: response }]);
    }, 1000);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <Zap className="brand-icon" size={28} />
          <h1>SYNCHRA</h1>
        </div>
        
        <nav className="nav-links">
          <a 
            className={`nav-item ${activeTab === 'live' ? 'active' : ''}`}
            onClick={() => setActiveTab('live')}
          >
            <Activity className="icon" size={20} />
            <span>Live Flow</span>
          </a>
          <a 
            className={`nav-item ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            <Map className="icon" size={20} />
            <span>Zone Insights</span>
          </a>
          <a 
            className={`nav-item ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            <ShieldAlert className="icon" size={20} />
            <span>Predictive Alerts</span>
          </a>
          <a 
            className={`nav-item ${activeTab === 'console' ? 'active' : ''}`}
            onClick={() => setActiveTab('console')}
          >
            <MessageSquare className="icon" size={20} />
            <span>Agent Console</span>
          </a>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <a className="nav-item">
            <Settings className="icon" size={20} />
            <span>Configuration</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div className="status-indicators">
            <div className="status-item"><div className="status-dot safe"></div> Safety: Nominal</div>
            <div className="status-item"><div className="status-dot neutral"></div> Experience: High</div>
            <div className="status-item"><div className="status-dot safe"></div> Efficiency: 94%</div>
          </div>
          <div className="time-display">
            {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
          </div>
        </header>

        <div className="dashboard-grid fade-in">
          {/* Left Column */}
          <div className="left-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div className="glass-card">
              <div className="card-header">
                <div className="card-title"><Activity size={20} color="var(--accent-cyan)"/> Venue Telemetry</div>
              </div>
              <div className="live-flow-metrics">
                <div className="metric-box">
                  <span className="metric-label">Throughput</span>
                  <div className="metric-value">{metrics.flowRate.toLocaleString()} <span className="span">pax/h</span></div>
                </div>
                <div className="metric-box">
                  <span className="metric-label">Avg Wait Time</span>
                  <div className="metric-value" style={{ color: metrics.avgWait > 5 ? 'var(--accent-red)' : 'var(--text-primary)'}}>
                    {metrics.avgWait} <span className="span">min</span>
                  </div>
                </div>
                <div className="metric-box">
                  <span className="metric-label">Overall Density</span>
                  <div className="metric-value">{metrics.density}%</div>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ flex: 1 }}>
              <div className="card-header">
                <div className="card-title"><Wind size={20} color="var(--accent-blue)"/> Spatial Flow Maps</div>
              </div>
              <div className="heatmap-simulation">
                {/* Simulated Heat Zones */}
                <div className="heat-zone" style={{ top: '20%', left: '30%', width: '100px', height: '100px', background: 'radial-gradient(circle, var(--accent-red) 0%, transparent 70%)' }}></div>
                <div className="heat-zone" style={{ top: '60%', left: '70%', width: '150px', height: '150px', background: 'radial-gradient(circle, var(--accent-cyan) 0%, transparent 70%)', animationDelay: '1s' }}></div>
                <div className="heat-zone" style={{ top: '40%', left: '50%', width: '80px', height: '80px', background: 'radial-gradient(circle, var(--accent-purple) 0%, transparent 70%)', animationDelay: '2s' }}></div>
                
                {/* SVG Blueprint Overlay */}
                <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.2 }}>
                  <rect x="10%" y="10%" width="80%" height="80%" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" rx="20" />
                  <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="var(--accent-cyan)" strokeWidth="1" strokeDasharray="5,5" />
                  <circle cx="50%" cy="50%" r="50" fill="none" stroke="var(--accent-cyan)" strokeWidth="1" />
                </svg>
              </div>
            </div>
            
          </div>

          {/* Right Column - Console */}
          <div className="glass-card agent-console">
            <div className="card-header">
              <div className="card-title"><Zap size={20} color="var(--accent-purple)"/> Synchra Intelligence</div>
            </div>
            
            <div className="console-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`message ${msg.role} fade-in`}>
                  <div className="avatar">
                    {msg.role === 'synchra' ? <Zap size={18} /> : <User size={18} />}
                  </div>
                  <div className="msg-content">
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form className="console-input" onSubmit={handleSend}>
              <input 
                type="text" 
                placeholder="Command Synchra or ask for recommendations..." 
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button type="submit"><Send size={18} /></button>
            </form>
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default App;
