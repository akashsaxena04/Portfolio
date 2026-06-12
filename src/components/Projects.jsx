import React, { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const ProjectCard = ({ proj, idx, onViewDetails }) => {
  const revealRef = useScrollReveal({ threshold: 0.1 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.transition = 'transform 0.5s ease-out';
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transition = 'none';
  };

  return (
    <article 
      ref={revealRef}
      className={`card glass-card glow-on-hover reveal reveal-delay-${(idx % 3) + 1}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ willChange: 'transform' }}
    >
      <div className="card-content">
        <h3>{proj.title}</h3>
        <p style={{ flex: 1 }}>{proj.description}</p>
        <p className="tech-stack"><strong>Tech Stack:</strong> {proj.tech}</p>
        <div className="project-links">
          <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="btn secondary">
            GitHub
          </a>
          {proj.liveLink && (
            <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" className="btn primary">
              Live Demo
            </a>
          )}
          <button onClick={() => onViewDetails(proj)} className="btn secondary" style={{ marginLeft: 'auto' }}>
            View Specs
          </button>
        </div>
      </div>
    </article>
  );
};

/* --- Interactive LRU Cache Widget --- */
const LRUCacheWidget = () => {
  const [capacity, setCapacity] = useState(4);
  const [order, setOrder] = useState([]); 
  const [cacheMap, setCacheMap] = useState({}); 
  const [inputKey, setInputKey] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [stats, setStats] = useState({ hits: 0, misses: 0, ops: 0 });
  const [log, setLog] = useState([]);
  const [highlightKey, setHighlightKey] = useState(null);

  const addLog = (message, type) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLog(prev => [{ time, message, type }, ...prev].slice(0, 10));
  };

  const handleGet = () => {
    const key = inputKey.trim();
    if (!key) return;
    
    setHighlightKey(key);
    setTimeout(() => setHighlightKey(null), 800);
    setStats(prev => ({ ...prev, ops: prev.ops + 1 }));

    if (cacheMap.hasOwnProperty(key)) {
      setStats(prev => ({ ...prev, hits: prev.hits + 1 }));
      setOrder(prev => [key, ...prev.filter(k => k !== key)]);
      addLog(`GET "${key}": HIT (value: ${cacheMap[key]})`, 'hit');
    } else {
      setStats(prev => ({ ...prev, misses: prev.misses + 1 }));
      addLog(`GET "${key}": MISS (key not found)`, 'miss');
    }
    setInputKey('');
  };

  const handlePut = () => {
    const key = inputKey.trim();
    const val = inputValue.trim() || '0';
    if (!key) return;

    setHighlightKey(key);
    setTimeout(() => setHighlightKey(null), 800);
    setStats(prev => ({ ...prev, ops: prev.ops + 1 }));
    let evicted = null;

    if (cacheMap.hasOwnProperty(key)) {
      setCacheMap(prev => ({ ...prev, [key]: val }));
      setOrder(prev => [key, ...prev.filter(k => k !== key)]);
      addLog(`PUT "${key}" = "${val}": UPDATED existing key`, 'put');
    } else {
      let currentOrder = [...order];
      let currentMap = { ...cacheMap };

      if (currentOrder.length >= capacity) {
        evicted = currentOrder[currentOrder.length - 1];
        currentOrder = currentOrder.slice(0, -1);
        delete currentMap[evicted];
      }

      currentMap[key] = val;
      currentOrder = [key, ...currentOrder];

      setCacheMap(currentMap);
      setOrder(currentOrder);

      if (evicted) {
        addLog(`PUT "${key}" = "${val}": INSERTED. Evicted LRU key "${evicted}"`, 'evict');
      } else {
        addLog(`PUT "${key}" = "${val}": INSERTED new key`, 'put');
      }
    }
    setInputKey('');
    setInputValue('');
  };

  const handleReset = () => {
    setOrder([]);
    setCacheMap({});
    setStats({ hits: 0, misses: 0, ops: 0 });
    setLog([]);
    setInputKey('');
    setInputValue('');
    addLog('Cache cleared and simulator reset.', 'put');
  };

  const handleCapacityChange = (e) => {
    const newCap = Math.max(1, Math.min(8, parseInt(e.target.value) || 4));
    setCapacity(newCap);
    if (order.length > newCap) {
      const truncatedOrder = order.slice(0, newCap);
      const truncatedMap = {};
      truncatedOrder.forEach(k => { truncatedMap[k] = cacheMap[k]; });
      setOrder(truncatedOrder);
      setCacheMap(truncatedMap);
      addLog(`Capacity shrunk to ${newCap}. Evicted exceeding items.`, 'evict');
    } else {
      addLog(`Capacity updated to ${newCap}.`, 'put');
    }
  };

  const hitRatio = stats.ops > 0 ? ((stats.hits / stats.ops) * 100).toFixed(1) : '0.0';

  return (
    <div className="lru-simulator">
      <div className="lru-stats-bar">
        <div className="lru-stat-card">
          <h5>Total Ops</h5>
          <p>{stats.ops}</p>
        </div>
        <div className="lru-stat-card">
          <h5>Hits</h5>
          <p style={{ color: '#10b981' }}>{stats.hits}</p>
        </div>
        <div className="lru-stat-card">
          <h5>Misses</h5>
          <p style={{ color: '#ef4444' }}>{stats.misses}</p>
        </div>
        <div className="lru-stat-card">
          <h5>Hit Ratio</h5>
          <p style={{ color: '#38bdf8' }}>{hitRatio}%</p>
        </div>
      </div>

      <div className="lru-sim-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Controls */}
          <div className="lru-control-panel">
            <div className="lru-input-row">
              <label>Capacity</label>
              <input 
                type="number" 
                min="1" 
                max="8" 
                value={capacity} 
                onChange={handleCapacityChange}
              />
            </div>
            <div className="lru-input-row">
              <label>Key</label>
              <input 
                type="text" 
                placeholder="e.g. A" 
                value={inputKey} 
                onChange={e => setInputKey(e.target.value)} 
              />
              <label style={{ minWidth: '40px', textAlign: 'center' }}>Value</label>
              <input 
                type="text" 
                placeholder="e.g. 100" 
                value={inputValue} 
                onChange={e => setInputValue(e.target.value)} 
              />
            </div>
            <div className="lru-action-buttons">
              <button onClick={handleGet} className="get">GET</button>
              <button onClick={handlePut} className="put">PUT</button>
              <button onClick={handleReset} className="reset">RESET</button>
            </div>
          </div>

          {/* DLL Visualizer */}
          <div className="dll-visualizer">
            <div className="dll-label-row">
              <span>MRU (Head)</span>
              <span>Doubly Linked List (Traversing)</span>
              <span>LRU (Tail)</span>
            </div>
            <div className="dll-nodes-row">
              {order.length === 0 ? (
                <div className="dll-empty-state">Cache is empty. Perform PUT operations.</div>
              ) : (
                order.map((key, i) => {
                  let nodeClass = "dll-node";
                  let label = "mid";
                  if (i === 0) {
                    nodeClass += " mru";
                    label = "MRU";
                  } else if (i === order.length - 1) {
                    nodeClass += " lru";
                    label = "LRU";
                  }
                  return (
                    <React.Fragment key={key}>
                      <div className={nodeClass}>
                        <span className="dll-node-label">{label}</span>
                        <div className="dll-node-key">{key}</div>
                        <div className="dll-node-val">{cacheMap[key]}</div>
                      </div>
                      {i < order.length - 1 && <span className="dll-arrow">⇄</span>}
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* HashMap */}
          <div className="hashmap-panel">
            <h6 style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>HashMap Visualizer</h6>
            <div className="hashmap-grid">
              {Object.keys(cacheMap).length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', padding: '0.5rem' }}>Map empty.</div>
              ) : (
                Object.keys(cacheMap).map(k => (
                  <div key={k} className={`hashmap-cell ${highlightKey === k ? 'active-op' : ''}`}>
                    <div className="hashmap-key">{k}</div>
                    <div className="hashmap-val">ptr → Node({cacheMap[k]})</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Console logs */}
          <div className="lru-log-panel">
            <h6 style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Operation Console</h6>
            <div className="lru-log-console">
              {log.length === 0 ? (
                <div style={{ color: '#4b5563' }}>Console ready.</div>
              ) : (
                log.map((entry, index) => (
                  <div key={index} className={`log-entry ${entry.type}`}>
                    <span className="time">[{entry.time}]</span>
                    <span>{entry.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Interactive WorkAxis Mock Simulator --- */
const WorkAxisSimulator = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Configure DB Connection', status: 'Completed', priority: 'High', assignee: 'Alex' },
    { id: 2, title: 'Build Analytics Charts', status: 'Under Review', priority: 'Medium', assignee: 'Sarah' },
    { id: 3, title: 'Setup JWT Middleware', status: 'In Progress', priority: 'High', assignee: 'Alex' },
    { id: 4, title: 'Design Profile Layout', status: 'Todo', priority: 'Low', assignee: 'Emma' }
  ]);
  const [inputTitle, setInputTitle] = useState('');
  const [inputAssignee, setInputAssignee] = useState('Alex');
  const [notifications, setNotifications] = useState(['System initialized: 4 active tasks.']);

  const handleAddTask = () => {
    if (!inputTitle.trim()) return;
    const newTask = {
      id: Date.now(),
      title: inputTitle.trim(),
      status: 'Todo',
      priority: 'Medium',
      assignee: inputAssignee
    };
    setTasks(prev => [...prev, newTask]);
    setNotifications(prev => [`[Socket.io] User ${inputAssignee} created task: "${newTask.title}"`, ...prev].slice(0, 5));
    setInputTitle('');
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    const task = tasks.find(t => t.id === taskId);
    setNotifications(prev => [`[Socket.io] "${task.title}" shifted to ${newStatus}`, ...prev].slice(0, 5));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Below is a simulated WebSocket taskboard demonstrating real-time synchronization updates as status actions are dispatched.
      </p>
      <div className="lru-control-panel" style={{ padding: '0.8rem' }}>
        <div className="lru-input-row">
          <label style={{ fontSize: '0.8rem' }}>Task</label>
          <input 
            type="text" 
            placeholder="e.g. Write integration test" 
            value={inputTitle} 
            onChange={e => setInputTitle(e.target.value)} 
          />
          <label style={{ minWidth: '40px', fontSize: '0.8rem', textAlign: 'center' }}>Assign</label>
          <select 
            value={inputAssignee} 
            onChange={e => setInputAssignee(e.target.value)}
            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.3rem', borderRadius: '4px', cursor: 'none !important' }}
          >
            <option value="Alex">Alex (Dev)</option>
            <option value="Sarah">Sarah (QA)</option>
            <option value="Emma">Emma (Design)</option>
          </select>
          <button onClick={handleAddTask} className="btn primary" style={{ padding: '0.35rem 0.8rem', borderRadius: '4px', cursor: 'none !important', fontSize: '0.8rem' }}>Add Task</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.8rem', borderRadius: '8px' }}>
        {['Todo', 'In Progress', 'Under Review', 'Completed'].map(status => (
          <div key={status} style={{ minHeight: '160px' }}>
            <h6 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.3rem', color: 'var(--accent-primary)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold' }}>{status}</h6>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
              {tasks.filter(t => t.status === status).map(t => (
                <div key={t.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                  <div style={{ fontWeight: '600', color: '#fff' }}>{t.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginTop: '0.2rem' }}>Member: {t.assignee}</div>
                  <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.4rem' }}>
                    {status !== 'Todo' && (
                      <button 
                        onClick={() => handleStatusChange(t.id, status === 'In Progress' ? 'Todo' : status === 'Under Review' ? 'In Progress' : 'Under Review')} 
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.6rem', padding: '0.1rem 0.2rem', borderRadius: '2px', cursor: 'none !important' }}
                      >
                        ←
                      </button>
                    )}
                    {status !== 'Completed' && (
                      <button 
                        onClick={() => handleStatusChange(t.id, status === 'Todo' ? 'In Progress' : status === 'In Progress' ? 'Under Review' : 'Completed')} 
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.6rem', padding: '0.1rem 0.2rem', borderRadius: '2px', cursor: 'none !important', marginLeft: 'auto' }}
                      >
                        →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="lru-log-panel">
        <h6 style={{ fontSize: '0.85rem' }}>WebSocket Event Stream</h6>
        <div className="lru-log-console" style={{ maxHeight: '80px' }}>
          {notifications.map((n, i) => (
            <div key={i} className="log-entry put">
              <span className="time">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
              <span>{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* --- Interactive RookieRise Mock Simulator --- */
const RookieRiseSimulator = () => {
  const [pipeline, setPipeline] = useState([
    { id: 1, name: 'John Doe', role: 'Frontend Engineer', stage: 'Applied' },
    { id: 2, name: 'Emma Watson', role: 'Node.js Developer', stage: 'Shortlisted' },
    { id: 3, name: 'Robert Downey', role: 'Full Stack Developer', stage: 'Interviewing' }
  ]);
  const [activeChat, setActiveChat] = useState('John Doe');
  const [chatLogs, setChatLogs] = useState({
    'John Doe': [{ sender: 'John Doe', text: 'Hi, I applied for the Frontend role. Looking forward to hearing back!' }],
    'Emma Watson': [{ sender: 'Recruiter', text: 'Congratulations, you have been shortlisted. When are you free for a call?' }],
    'Robert Downey': [{ sender: 'Recruiter', text: 'How was the interview session yesterday?' }]
  });
  const [msgInput, setMsgInput] = useState('');

  const handleSend = () => {
    if (!msgInput.trim()) return;
    const newMsg = { sender: 'Recruiter', text: msgInput.trim() };
    setChatLogs(prev => ({
      ...prev,
      [activeChat]: [...prev[activeChat], newMsg]
    }));
    setMsgInput('');
    setTimeout(() => {
      setChatLogs(prev => ({
        ...prev,
        [activeChat]: [...prev[activeChat], { sender: activeChat, text: `Thank you! I will look into it.` }]
      }));
    }, 1200);
  };

  const handleStageChange = (id, newStage) => {
    setPipeline(prev => prev.map(c => c.id === id ? { ...c, stage: newStage } : c));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Test recruiter-candidate chat channels and track candidate pipelines in this simulated tracking panel.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
        {/* Applicant Pipeline */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '8px' }}>
          <h6 style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>Active Candidates</h6>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {pipeline.map(c => (
              <div key={c.id} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  <span style={{ color: '#fff' }}>{c.name}</span>
                  <span style={{ color: 'var(--accent-primary)' }}>{c.stage}</span>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{c.role}</div>
                <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.4rem', alignItems: 'center' }}>
                  <button onClick={() => setActiveChat(c.name)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.2)', color: 'var(--accent-primary)', borderRadius: '3px', cursor: 'none !important' }}>Open Chat</button>
                  <select 
                    value={c.stage} 
                    onChange={e => handleStageChange(c.id, e.target.value)}
                    style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.65rem', padding: '0.1rem', borderRadius: '3px', marginLeft: 'auto', cursor: 'none !important' }}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time chat console */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', height: '230px' }}>
          <h6 style={{ fontSize: '0.8rem', marginBottom: '0.3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.3rem', fontWeight: 'bold' }}>Chat Console: <span style={{ color: 'var(--accent-primary)' }}>{activeChat}</span></h6>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: '0.3rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', marginBottom: '0.4rem' }}>
            {(chatLogs[activeChat] || []).map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.sender === 'Recruiter' ? 'flex-end' : 'flex-start', background: msg.sender === 'Recruiter' ? 'rgba(112, 0, 255, 0.2)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.35rem 0.5rem', borderRadius: '6px', maxWidth: '80%', fontSize: '0.7rem' }}>
                <span style={{ color: msg.sender === 'Recruiter' ? '#c084fc' : 'var(--accent-primary)', fontWeight: 'bold', display: 'block', fontSize: '0.6rem' }}>{msg.sender}</span>
                {msg.text}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <input 
              type="text" 
              placeholder="Send message..." 
              value={msgInput} 
              onChange={e => setMsgInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              style={{ flex: 1, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '0.3rem', color: '#fff', fontSize: '0.7rem' }}
            />
            <button onClick={handleSend} style={{ background: 'var(--accent-primary)', color: '#000', border: 'none', borderRadius: '4px', padding: '0 0.6rem', fontSize: '0.7rem', cursor: 'none !important' }}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Project Detail Modal Overlay --- */
const ProjectDetailsModal = ({ proj, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-header-section">
          <h2>{proj.title}</h2>
          <div className="subtitle">{proj.subtitle}</div>
        </div>

        <div className="modal-tabs">
          <button 
            className={`modal-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`modal-tab-btn ${activeTab === 'architecture' ? 'active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            Architecture
          </button>
          <button 
            className={`modal-tab-btn ${activeTab === 'demo' ? 'active' : ''}`}
            onClick={() => setActiveTab('demo')}
          >
            Interactive Demo
          </button>
        </div>

        <div className="modal-scroll-body">
          {activeTab === 'overview' && (
            <div className="modal-grid">
              <div>
                <h4 className="modal-sec-title">What It Is</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  {proj.details.whatItIs}
                </p>
                <h4 className="modal-sec-title">What It Does</h4>
                <ul className="bullets-list" style={{ marginBottom: '1.5rem' }}>
                  {proj.details.whatItDoes.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="modal-sec-title">Key Highlights</h4>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {proj.highlights}
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <h4 className="modal-sec-title">Stack Summary</h4>
                  <div className="tech-pills">
                    {proj.tech.split(', ').map((t, i) => (
                      <span key={i} className="tech-pill">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="modal-grid">
              <div>
                <h4 className="modal-sec-title">Tech Stack & Implementation</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {proj.details.techStackDetails.map((item, idx) => (
                    <div key={idx}>
                      <strong style={{ color: 'var(--accent-primary)', fontSize: '0.95rem' }}>{item.area}:</strong>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem', lineHeight: '1.5' }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="modal-sec-title">Studied Workspace Directory</h4>
                <pre className="folder-tree">
                  {proj.details.folderStructure}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'demo' && (
            <div>
              {proj.id === 'lru-cache' && <LRUCacheWidget />}
              {proj.id === 'workaxis' && <WorkAxisSimulator />}
              {proj.id === 'rookierise' && <RookieRiseSimulator />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);

  const projects = [
    {
      id: 'workaxis',
      title: 'WorkAxis – Employee Task Management System',
      subtitle: 'Real-Time Team Operating Ecosystem',
      description: 'Role-based employee task management platform for task assignment, deadline tracking, and real-time notifications, helping managers efficiently monitor workflows across teams.',
      highlights: 'Configures secure authentication and protected API gateways, shrinking synchronization gaps and elevating project status transparency.',
      tech: 'React.js, Node.js, Express.js, MongoDB, Tailwind CSS, Chart.js, JWT, REST APIs, MVC Architecture',
      githubLink: 'https://github.com/akashsaxena04/WorkAxis',
      liveLink: 'https://workaxis.vercel.app',
      details: {
        whatItIs: 'A complete, multi-user task management workspace developed to facilitate communication and task allocation within engineering and product teams. It replaces spreadsheets with a dynamic, synchronized portal.',
        whatItDoes: [
          'Direct task creation, assignment, and status management (Todo, In Progress, Under Review, Completed).',
          'A fully interactive Kanban board for visual status tracking and pipeline management.',
          'Real-time WebSocket event notifications ensuring instant team-wide updates.',
          'Comprehensive analytics dashboard aggregating task completions and workloads using charts.',
          'Granular Role-Based Access Control (RBAC) separating Manager overrides and Member tasks.'
        ],
        techStackDetails: [
          { area: 'Frontend client', desc: 'React.js with TypeScript and Vite. Employs Redux Toolkit for unified client state and Recharts for progress metrics.' },
          { area: 'Styling system', desc: 'Tailwind CSS alongside shadcn-ui components, maintaining a dark theme interface.' },
          { area: 'Backend service', desc: 'Node.js and Express server organized into structured MVC controller endpoints.' },
          { area: 'Database & Streams', desc: 'MongoDB Atlas instance mapped via Mongoose schemas. Real-time updates delivered through Socket.io.' }
        ],
        folderStructure: `WorkAxis/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── pages/       # Dashboard, Analytics
│   │   ├── components/  # Task boards, charts
│   │   └── store/       # Redux state config
└── server/              # Express backend
    ├── src/
    │   ├── controllers/ # Task controllers
    │   ├── routes/      # REST API endpoints
    │   └── models/      # Mongoose models`
      }
    },
    {
      id: 'rookierise',
      title: 'RookieRise – Recruitment and Assessment Platform',
      subtitle: 'SaaS Job Matching & Candidate Pipeline Portal',
      description: 'Full-stack recruitment platform supporting candidate profiles, job postings, and online assessments through a centralized dashboard for recruiters.',
      highlights: 'Establishes applicant pipelines and concurrent review dashboards, enabling multi-stage screening processes and decreasing tracking overhead.',
      tech: 'MongoDB, Express.js, React.js, Node.js, Tailwind CSS, JWT, REST APIs, MVC Architecture',
      githubLink: 'https://github.com/akashsaxena04/RookieRise',
      liveLink: 'https://rookierise.vercel.app',
      details: {
        whatItIs: 'A modern job board and Applicant Tracking System (ATS) connecting junior job seekers with talent acquisition managers, providing integrated chat and workflow management.',
        whatItDoes: [
          'Tailored candidate dashboard with profile customizer, resume uploads, and application feeds.',
          'Recruiter portal for creating job cards and managing candidate screening phases.',
          'Applicant Tracking System (ATS) showing candidate progression stages (Applied, Shortlisted, Interviewing, Rejected).',
          'Profile-to-job matchmaking scores derived from structural text comparison algorithms.',
          'Real-time candidate-recruiter messaging channel and notifications stream.'
        ],
        techStackDetails: [
          { area: 'User client', desc: 'React.js with custom layout viewports. Employs React Router DOM for SPA routing.' },
          { area: 'Backend routing', desc: 'Express.js server exposing authentication and applicant-management REST controllers.' },
          { area: 'Database & File uploads', desc: 'MongoDB stores user profiles, messages, and job listings. Cloudinary hosts PDF resumes and images.' },
          { area: 'Real-time features', desc: 'Socket.io channels distribute recruiter chat messages and immediate job alerts.' }
        ],
        folderStructure: `RookieRise/
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/       # Profiles, Job board
│   │   ├── layouts/     # Recruiter workspaces
│   │   └── contexts/    # State management
└── server/              # Node.js backend
    ├── controllers/     # ATS actions
    ├── models/          # MongoDB schemas
    └── routes/          # API gateways`
      }
    },
    {
      id: 'lru-cache',
      title: 'LRU Cache Simulator – DSA Project',
      subtitle: 'HashMap + Doubly Linked List Visualizer',
      description: 'Implemented a Least Recently Used (LRU) cache simulator demonstrating efficient cache-based memory management with fast data retrieval.',
      highlights: 'Simulates cache memory operations in O(1) operations, showcasing structural linked list manipulation and hit/miss stats logs.',
      tech: 'React.js, CSS Animations, HashMap, Doubly Linked List, C++',
      githubLink: 'https://github.com/akashsaxena04/lru-cache-visualizer',
      liveLink: 'https://lru-cache-visualizer.vercel.app',
      details: {
        whatItIs: 'An educational visualizer built to demonstrate cache eviction strategies and data structure performance. It models the core operations of LeetCode #146.',
        whatItDoes: [
          'Dispatches GET and PUT actions, illustrating node traversals and map lookups.',
          'Real-time structural transitions showing nodes shifting to MRU position or being evicted.',
          'Live statistics tracking total operations, cache hit count, miss count, and hit ratio.',
          'Configurable capacity limits (up to 8 elements) to observe evictions when storage capacity overflows.'
        ],
        techStackDetails: [
          { area: 'Visualization layer', desc: 'React hooks manage cache memory emulation, recording operational nodes and eviction lists.' },
          { area: 'Algorithmic strategy', desc: 'Emulates O(1) retrieval/updates by associating map search keys directly to doubly-linked node nodes.' },
          { area: 'Animations', desc: 'Uses CSS transform state rules to slide and scale nodes as memory layout updates.' }
        ],
        folderStructure: `lru-cache/
├── src/
│   ├── components/      # Key-value panels
│   ├── useLRUCache.js   # State handlers
│   ├── App.jsx          # Header grid layouts
│   └── index.css        # Interactive colors`
      }
    }
  ];

  return (
    <section id="projects" className="section section-alt">
      <div className="section-inner">
        <h2 className="section-title">Projects</h2>
        <div className="cards-grid">
          {projects.map((proj, idx) => (
            <ProjectCard 
              key={idx} 
              proj={proj} 
              idx={idx} 
              onViewDetails={(p) => setActiveProject(p)} 
            />
          ))}
        </div>
      </div>

      {activeProject && (
        <ProjectDetailsModal 
          proj={activeProject} 
          onClose={() => setActiveProject(null)} 
        />
      )}
    </section>
  );
};

export default Projects;
