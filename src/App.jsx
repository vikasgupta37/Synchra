import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Map, MessageSquare, ShieldAlert, Wind, Settings, Send, User, Zap, TrendingUp, AlertTriangle 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid 
} from 'recharts';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('live');
  const [messages, setMessages] = useState([
    { role: 'synchra', content: 'Synchra core online. Anticipatory models active. Venue status is currently optimal.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Simulated live data
  const [metrics, setMetrics] = useState({
    flowRate: 4200, 
    avgWait: 3.2, 
    density: 68 
  });

  const [historyData, setHistoryData] = useState(
    Array.from({ length: 15 }, (_, i) => ({
      time: new Date(Date.now() - (15 - i) * 3000).toLocaleTimeString([], { hour12: false, minute:'2-digit', second:'2-digit' }),
      throughput: 4000 + Math.floor(Math.random() * 500),
      density: 65 + Math.floor(Math.random() * 10)
    }))
  );

  // Flow simulation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const newFlow = prev.flowRate + Math.floor(Math.random() * 200) - 100;
        const newWait = Math.max(1, +(prev.avgWait + (Math.random() * 0.4 - 0.2)).toFixed(1));
        const newDensity = Math.min(100, Math.max(0, prev.density + Math.floor(Math.random() * 4) - 2));
        
        setHistoryData(h => {
          const newTime = new Date().toLocaleTimeString([], { hour12: false, minute:'2-digit', second:'2-digit' });
          return [...h.slice(1), { time: newTime, throughput: newFlow, density: newDensity }];
        });

        return { flowRate: newFlow, avgWait: newWait, density: newDensity };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Chat scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'operator', content: input }]);
    const currentInput = input.toLowerCase();
    setInput('');
    setIsTyping(true);

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

      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'synchra', content: response }]);
    }, 1500 + Math.random() * 1000); // Random delay 1.5s - 2.5s for realism
  };

  const handleQuickAction = (text) => {
    setInput(text);
  };

  // Render Views Based on Tabs
  const renderContent = () => {
    if (activeTab === 'insights') {
      const zoneData = [
        { name: 'Gate A', density: 85, avgWait: 5.2 },
        { name: 'Gate B', density: 40, avgWait: 1.5 },
        { name: 'Gate C', density: 55, avgWait: 2.8 },
        { name: 'North Conc', density: 72, avgWait: 4.1 },
        { name: 'VIP', density: 20, avgWait: 0.5 }
      ];

      return (
        <>
          <div className="glass-card" style={{ flex: 1 }}>
            <div className="card-header">
              <div className="card-title"><Map size={20} color="var(--accent-purple)"/> Zone Density Analysis</div>
            </div>
            <div className="chart-container-wrapper" style={{ minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={zoneData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-light)', borderRadius: '8px' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                  <Bar dataKey="density" name="Density (%)" fill="var(--accent-purple)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-card">
            <div className="card-header">
              <div className="card-title"><Wind size={20} color="var(--accent-blue)"/> Spatial Flow Maps</div>
            </div>
            <div className="heatmap-simulation">
              <div className="heat-zone" style={{ top: '20%', left: '30%', width: '100px', height: '100px', background: 'radial-gradient(circle, var(--accent-red) 0%, transparent 70%)' }}></div>
              <div className="heat-zone" style={{ top: '60%', left: '70%', width: '150px', height: '150px', background: 'radial-gradient(circle, var(--accent-cyan) 0%, transparent 70%)', animationDelay: '1s' }}></div>
              <div className="heat-zone" style={{ top: '40%', left: '50%', width: '80px', height: '80px', background: 'radial-gradient(circle, var(--accent-purple) 0%, transparent 70%)', animationDelay: '2s' }}></div>
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.2 }}>
                <rect x="10%" y="10%" width="80%" height="80%" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" rx="20" />
                <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="var(--accent-cyan)" strokeWidth="1" strokeDasharray="5,5" />
                <circle cx="50%" cy="50%" r="50" fill="none" stroke="var(--accent-cyan)" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </>
      );
    }

    if (activeTab === 'alerts') {
      return (
        <div className="glass-card" style={{ flex: 1 }}>
          <div className="card-header">
            <div className="card-title"><ShieldAlert size={20} color="var(--accent-red)"/> Active Predictive Alerts</div>
          </div>
          <div className="alerts-list">
            <div className="alert-item critical">
              <AlertTriangle color="var(--accent-red)" size={24} style={{flexShrink:0}}/>
              <div>
                <div className="alert-header"><span className="alert-title">High Bottleneck Probability</span> <span>2 mins ago</span></div>
                <div style={{color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5'}}>Predictive model indicates 85% probability of bottleneck at Gate A in 12 minutes. Recommendation: Redirect 30% of incoming traffic immediately to preempt congestion.</div>
              </div>
            </div>
            <div className="alert-item warning">
               <Zap color="#ffaa00" size={24} style={{flexShrink:0}}/>
               <div>
                <div className="alert-header"><span className="alert-title">Surge Anticipated</span> <span>15 mins ago</span></div>
                <div style={{color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5'}}>Minor surge expected near North Concourse at halftime. Security units preemptively deployed and wayfinding signs updated.</div>
              </div>
            </div>
            <div className="alert-item info">
               <Activity color="var(--accent-blue)" size={24} style={{flexShrink:0}}/>
               <div>
                <div className="alert-header"><span className="alert-title">Flow Optimized</span> <span>1 hour ago</span></div>
                <div style={{color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5'}}>Traffic routed to Gate C systematically to balance ingress. Average wait times reduced by 1.2 minutes across general admission.</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default Live view (activeTab === 'live' || default)
    return (
      <>
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
            <div className="card-title"><TrendingUp size={20} color="var(--accent-blue)"/> Real-Time Throughput Graph</div>
          </div>
          <div className="chart-container-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} domain={['dataMin - 200', 'dataMax + 200']}/>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-light)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--accent-cyan)' }}
                />
                <Area type="monotone" dataKey="throughput" name="Pax/h" stroke="var(--accent-cyan)" strokeWidth={2} fillOpacity={1} fill="url(#colorThroughput)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </>
    );
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
          
          {/* Left Column Dynamic Content */}
          <div className="left-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', paddingRight: '8px' }}>
            {renderContent()}
          </div>

          {/* Right Column - Console */}
          <div className="glass-card agent-console">
            <div className="card-header">
              <div className="card-title"><MessageSquare size={20} color="var(--accent-purple)"/> Agent Console</div>
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
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="message synchra fade-in">
                  <div className="avatar"><Zap size={18} /></div>
                  <div className="msg-content" style={{ padding: '4px 8px' }}>
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            <div style={{ marginTop: 'auto' }}>
              <div className="quick-actions">
                <button type="button" className="action-chip" onClick={() => handleQuickAction('Status of Gate A')}>Status of Gate A</button>
                <button type="button" className="action-chip" onClick={() => handleQuickAction('Show Congestion Levels')}>Show Congestion</button>
              </div>
              
              <form className="console-input" onSubmit={handleSend}>
                <input 
                  type="text" 
                  placeholder="Command Synchra or ask..." 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={isTyping}
                />
                <button type="submit" disabled={isTyping}><Send size={18} /></button>
              </form>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default App;
