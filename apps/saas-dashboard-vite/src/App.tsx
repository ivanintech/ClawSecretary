import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  MessageSquare, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Cpu,
  Calendar,
  ChevronRight,
  Activity,
  FileText,
  Upload,
  BookOpen,
  Zap,
  Lock,
  Globe,
  Search,
  RefreshCcw,
  Wand2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { gateway } from './gateway-api';

const App: React.FC = () => {
  const [setupToken] = useState("magic_onboarding_2026");
  const [magicLink] = useState(`https://saas.openclaw.ai/setup?token=${setupToken}`);
  const [isCopied, setIsCopied] = useState(false);
  
  // Real-time Gateway State
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const [isLinked, setIsLinked] = useState(false);
  const [isRebooting, setIsRebooting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyses, setAnalyses] = useState<Array<{ name: string, summary: string, date: string }>>([]);
  const [healthStatus, setHealthStatus] = useState<'live' | 'unstable' | 'down'>('live');
  const [latency, setLatency] = useState<number | null>(null);
  const [agentStatus, setAgentStatus] = useState<any>(null);
  const [memoryStatus, setMemoryStatus] = useState<any>(null);
  const [isPatching, setIsPatching] = useState(false);
  const [crons, setCrons] = useState<any[]>([]);
  const [securityScore, setSecurityScore] = useState<number | null>(null);
  const [secretaryStatus, setSecretaryStatus] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const pollHealth = useCallback(async () => {
    const start = Date.now();
    try {
      const result = await gateway.checkHealth();
      if (result.ok) {
        setHealthStatus('live');
        setLatency(Date.now() - start);
      } else {
        setHealthStatus('unstable');
        setLatency(null);
      }
      
      // Poll full status for Live Activity
      const statusResult = await gateway.getStatus();
      if (statusResult.ok) setAgentStatus(statusResult.payload);

      // Poll memory status
      const memoryResult = await gateway.getMemoryStatus();
      if (memoryResult.ok) setMemoryStatus(memoryResult.payload);
    } catch (err) {
      setHealthStatus('down');
      setLatency(null);
    }
  }, []);

  const handleToggleProvider = async (provider: 'openai' | 'ollama') => {
    setIsPatching(true);
    const result = await gateway.patchConfig({
      agentDefaults: {
        memorySearch: {
          provider: provider
        }
      }
    });
    if (result.ok) {
      // Refresh status immediately
      pollHealth();
    }
    setIsPatching(false);
  };

  const fetchDashboardData = useCallback(async () => {
    const cronResult = await gateway.listCrons();
    if (cronResult.ok) setCrons(cronResult.payload.items || []);

    const securityResult = await gateway.getSecurityAudit();
    if (securityResult.ok) {
      setSecurityScore(securityResult.payload.score);
    }

    const secStatus = await gateway.getSecretaryStatus();
    if (secStatus.ok) {
      setSecretaryStatus(secStatus.payload.details?.status);
    }
  }, []);

  useEffect(() => {
    pollHealth();
    fetchDashboardData();
    const interval = setInterval(pollHealth, 5000);
    return () => clearInterval(interval);
  }, [pollHealth, fetchDashboardData]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(magicLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleStartLinking = async () => {
    setIsLinking(true);
    setQrUrl(null);
    const result = await gateway.startWhatsAppLogin();
    if (result.ok && result.payload?.qrDataUrl) {
      setQrUrl(result.payload.qrDataUrl);
      
      // Simulation: Start waiting for scan
      const waitResult = await gateway.waitForWhatsAppLogin();
      if (waitResult.ok && waitResult.payload?.connected) {
        setIsLinked(true);
        setIsLinking(false);
      }
    } else {
      setIsLinking(false);
    }
  };

  const handleReboot = async () => {
    setIsRebooting(true);
    await gateway.rebootAgent();
    setTimeout(() => setIsRebooting(false), 3000);
  };

  const handleRunCron = async (id: string) => {
    await gateway.runCron(id);
    fetchDashboardData();
  };

  const handleResetSession = async () => {
    if (confirm("Are you sure you want to reset the main session? This will clear short-term context.")) {
      await gateway.resetSession();
      pollHealth();
    }
  };

  const handleSyncGog = async () => {
    setIsSyncing(true);
    await gateway.syncCalendars();
    fetchDashboardData();
    setIsSyncing(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResults(null);
    const result = await gateway.searchOpportunities(searchQuery);
    if (result.ok) {
      setSearchResults(result.payload.details);
    }
    setIsSearching(false);
  };

  const handleActivateSecretary = async () => {
    setIsActivating(true);
    const result = await gateway.setupProactive();
    if (result.ok && result.payload.details) {
      const { cronParams, preResearchCron } = result.payload.details;
      await gateway.addCron(cronParams);
      await gateway.addCron(preResearchCron);
      // Refresh crons
      fetchDashboardData();
      alert("Autonomous Secretary Activated! Crons registered.");
    }
    setIsActivating(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    
    // Convert to base64 for simulation
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      const result = await gateway.analyzeDocument(base64, file.name);
      
      if (result.ok && result.payload) {
        setAnalyses(prev => [{
          name: file.name,
          summary: result.payload!.text,
          date: new Date().toLocaleTimeString()
        }, ...prev]);
      }
      setIsAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const statusCards = [
    { 
      title: "Agent Brain", 
      status: isRebooting ? "Rebooting..." : (healthStatus === 'live' ? "Online" : healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1)), 
      icon: <Cpu className={isRebooting ? "pulse text-amber-400" : (healthStatus === 'live' ? "text-sky-400" : "text-rose-400")} />, 
      details: `Docker Instance: ClawBot-V2 ${latency ? `(${latency}ms)` : ''}`,
      type: isRebooting ? "pending" : (healthStatus === 'live' ? "active" : "inactive")
    },
    { 
      title: "WhatsApp Pair", 
      status: isLinked ? "Linked" : (isLinking ? "Waiting for QR" : "Disconnected"), 
      icon: <MessageSquare className={isLinked ? "text-emerald-400" : (isLinking ? "pulse text-amber-400" : "text-slate-400")} />, 
      details: isLinked ? "Session: Active (v2)" : "No session detected",
      type: isLinked ? "active" : (isLinking ? "pending" : "inactive")
    },
    { 
      title: "Privacy Vault", 
      status: "Synced", 
      icon: <Shield className="text-emerald-400" />, 
      details: "Mobile Node: iPhone 13 Pro",
      type: "active"
    }
  ];

  const connections = [
    { name: "Google Calendar", state: "Connected", icon: <Calendar size={20} /> },
    { name: "Microsoft Outlook", state: "Not Linked", icon: <AlertCircle size={20} className="text-slate-500" /> },
    { name: "SaaS OAuth Bridge", state: "Active", icon: <Activity size={20} /> },
  ];

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="logo-container">
          <div className="logo-icon">
            <Shield size={32} color="white" />
          </div>
          <div>
            <h1 className="logo-text">ClawSecretary <span style={{color: 'var(--accent-primary)'}}>SaaS</span></h1>
            <p style={{fontSize: '12px', color: 'var(--text-muted)'}}>The Autonomous Digital Twin</p>
          </div>
        </div>
        <div className="glass-panel" style={{padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px'}}>
          <div className={`status-dot ${isRebooting || healthStatus === 'unstable' ? 'pulse' : ''}`} 
               style={{backgroundColor: isRebooting ? 'var(--accent-warning)' : (healthStatus === 'live' ? 'var(--accent-success)' : 'var(--accent-danger)')}}></div>
          <span style={{fontSize: '14px', fontWeight: 600}}>
            {isRebooting ? 'Rebooting...' : (healthStatus === 'live' ? 'System Operational' : (healthStatus === 'unstable' ? 'System Unstable' : 'System Offline'))}
            {latency && <span style={{fontSize: '10px', opacity: 0.5, marginLeft: '8px'}}>{latency}ms</span>}
          </span>
        </div>
        <div style={{display: 'flex', gap: '10px'}}>
            <button onClick={handleResetSession} className="button-primary" style={{background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-primary)'}}>
                Reset Session
            </button>
            <button onClick={handleReboot} className="button-primary" style={{background: 'rgba(248, 113, 113, 0.2)', border: '1px solid rgba(248, 113, 113, 0.3)'}}>
                Emergency Reboot
            </button>
        </div>
      </header>

      {/* Dynamic Island / Live Activity Mirror */}
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
          <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-panel"
              style={{
                  padding: '8px 24px',
                  borderRadius: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  cursor: 'pointer'
              }}
          >
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <div className="pulse" style={{width: '8px', height: '8px', background: 'var(--accent-primary)', borderRadius: '50%'}}></div>
                  <span style={{fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--accent-primary)'}}>Live Activity</span>
              </div>
              <div style={{width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)'}}></div>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <span style={{fontSize: '13px', color: 'var(--text-muted)'}}>Agent:</span>
                  <span style={{fontSize: '13px', fontWeight: 600}}>{agentStatus?.sessions?.recent[0]?.agentId || 'Idle'}</span>
              </div>
              {agentStatus?.sessions?.recent[0] && (
                  <>
                      <div style={{width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)'}}></div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                          <span style={{fontSize: '11px', color: 'var(--text-muted)'}}>Tokens:</span>
                          <div style={{width: '80px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden'}}>
                              <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${agentStatus.sessions.recent[0].percentUsed}%` }}
                                  transition={{ duration: 1 }}
                                  style={{height: '100%', background: 'var(--accent-primary)'}}
                              ></motion.div>
                          </div>
                          <span style={{fontSize: '11px', fontWeight: 700}}>{agentStatus.sessions.recent[0].percentUsed}%</span>
                      </div>
                  </>
              )}
          </motion.div>
      </div>

      <main>
        <div className="status-grid">
          {statusCards.map((card, idx) => (
            <motion.div 
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel card"
            >
              <div className="card-header">
                <div className="card-icon">{card.icon}</div>
                <div className={`card-status status-${card.type}`}>
                  <div className="status-dot"></div>
                  {card.status}
                </div>
              </div>
              <div>
                <h3 className="card-title">{card.title}</h3>
                <p style={{color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px'}}>{card.details}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px'}}>
          <section className="glass-panel magic-link-section">
            <h2 style={{fontSize: '24px', fontWeight: 700}}>Zero-Touch Onboarding</h2>
            <p style={{color: 'var(--text-muted)', maxWidth: '600px'}}>
              Use this Magic Link to onboard a new agent session. Once clicked, the SaaS Bridge will handle all OAuth flows automatically.
            </p>
            <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
              <div className="token-area" style={{flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <code>{magicLink}</code>
                <button 
                  onClick={copyToClipboard}
                  style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}
                >
                  {isCopied ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
              </div>
              <button className="button-primary">
                Send to Phone <Smartphone size={18} />
              </button>
            </div>
          </section>

          <aside className="glass-panel card" style={{justifyContent: 'flex-start'}}>
            <h3 className="card-title">Cloud Connections</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px'}}>
              {connections.map((conn) => (
                <div key={conn.name} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div className="card-icon" style={{padding: '8px'}}>{conn.icon}</div>
                    <span style={{fontSize: '14px'}}>{conn.name}</span>
                  </div>
                  <span style={{fontSize: '12px', fontWeight: 600, color: conn.state === "Connected" ? 'var(--accent-success)' : 'var(--text-muted)'}}>
                    {conn.state}
                  </span>
                </div>
              ))}
            </div>
            <button className="button-primary" style={{marginTop: 'auto', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)'}}>
              Manage All <ChevronRight size={18} />
            </button>
          </aside>
        </div>

        <div style={{marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px'}}>
            <section className="glass-panel card" style={{justifyContent: 'flex-start'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px'}}>
                    <BookOpen className="text-sky-400" />
                    <h3 className="card-title">Knowledge Vault</h3>
                </div>
                <p style={{fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px'}}>
                    Upload documents to train your agent. Supported formats: **Native PDF Analysis**, Text, Markdown.
                </p>
                <label className="upload-zone" style={{
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '2px dashed rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '30px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <input type="file" accept=".pdf" style={{display: 'none'}} onChange={handleFileUpload} disabled={isAnalyzing} />
                    {isAnalyzing ? (
                        <div className="pulse" style={{textAlign: 'center'}}>
                            <Activity size={32} className="text-sky-400" style={{margin: '0 auto 12px'}} />
                            <p style={{fontSize: '12px', fontWeight: 600}}>Ingesting document...</p>
                        </div>
                    ) : (
                        <>
                            <Upload size={32} className="text-slate-500" style={{marginBottom: '10px'}} />
                            <p style={{fontSize: '14px', fontWeight: 500}}>Drop PDF here</p>
                            <p style={{fontSize: '11px', color: 'var(--text-muted)'}}>Max 10MB per file</p>
                        </>
                    )}
                </label>
            </section>

            <section className="glass-panel card" style={{justifyContent: 'flex-start'}}>
                <h3 className="card-title">Analysis History</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px'}}>
                    {analyses.length === 0 ? (
                        <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
                            <FileText size={48} style={{margin: '0 auto 12px', opacity: 0.1}} />
                            <p style={{fontSize: '14px'}}>No documents analyzed yet.</p>
                        </div>
                    ) : (
                        analyses.map((ana, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass-panel" 
                                style={{padding: '16px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)'}}
                            >
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                                    <span style={{fontSize: '14px', fontWeight: 600, color: 'var(--accent-primary)'}}>{ana.name}</span>
                                    <span style={{fontSize: '11px', color: 'var(--text-muted)'}}>{ana.date}</span>
                                </div>
                                <p style={{fontSize: '13px', lineHeight: '1.5', color: 'var(--text-muted)'}}>{ana.summary}</p>
                            </motion.div>
                        ))
                    )}
                </div>
            </section>
        </div>

        <section className="dashboard-content" style={{paddingTop: '0', marginTop: '24px'}}>
            <div className="glass-panel main-panel" style={{background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
                    <div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px'}}>
                            <Search className="text-sky-400" size={24} />
                            <h2 className="card-title" style={{fontSize: '20px', margin: 0}}>Proactive Intelligence</h2>
                        </div>
                        <p style={{fontSize: '14px', opacity: 0.6}}>Autonomous services, calendars & search orchestration</p>
                    </div>
                    <div style={{display: 'flex', gap: '8px'}}>
                        <button onClick={handleSyncGog} disabled={isSyncing} className="button-primary" style={{
                            background: isSyncing ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.2)',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            padding: '8px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: 'white'
                        }}>
                             <RefreshCcw size={16} className={isSyncing ? 'animate-spin' : ''} />
                             {isSyncing ? 'Syncing...' : 'Sync All Calendars'}
                        </button>
                        <button onClick={handleActivateSecretary} disabled={isActivating} className="button-primary" style={{
                            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.4) 0%, rgba(139, 92, 246, 0.4) 100%)',
                            border: '1px solid rgba(139, 92, 246, 0.5)',
                            padding: '8px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: 'white',
                            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                        }}>
                             <Wand2 size={16} className={isActivating ? 'animate-spin' : ''} />
                             {isActivating ? 'Activating...' : 'Magic Activation'}
                        </button>
                    </div>
                </div>

                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px'}}>
                    <div className="glass-panel" style={{padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px'}}>
                            <Calendar size={18} className="text-sky-400" />
                            <h3 style={{fontSize: '16px', fontWeight: 600}}>Calendar Services</h3>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}>
                                <span style={{opacity: 0.6}}>Local Store (WAL)</span>
                                <span style={{color: 'var(--accent-success)'}}>✅ Connected</span>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}>
                                <span style={{opacity: 0.6}}>Google (Gog)</span>
                                <span style={{color: secretaryStatus?.google_calendar_gog?.includes('✅') ? 'var(--accent-success)' : 'var(--accent-danger)'}}>
                                    {secretaryStatus?.google_calendar_gog || 'Checking...'}
                                </span>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}>
                                <span style={{opacity: 0.6}}>Outlook (Graph)</span>
                                <span style={{color: secretaryStatus?.outlook?.includes('ready') ? 'var(--accent-success)' : 'var(--accent-warning)'}}>
                                    {secretaryStatus?.outlook || 'Checking...'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px'}}>
                            <Search size={18} className="text-sky-400" />
                            <h3 style={{fontSize: '16px', fontWeight: 600}}>Opportunity Search</h3>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px', flex: 1}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}>
                                <span style={{opacity: 0.6}}>Tavily API</span>
                                <span style={{color: secretaryStatus?.tavily?.includes('✅') ? 'var(--accent-success)' : 'var(--accent-danger)'}}>
                                    {secretaryStatus?.tavily || 'Checking...'}
                                </span>
                            </div>
                            <div style={{marginTop: '10px', display: 'flex', gap: '8px'}}>
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Ask the secretary to find..." 
                                    style={{
                                        flex: 1,
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        fontSize: '13px',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                                <button 
                                    onClick={handleSearch}
                                    disabled={isSearching}
                                    className="button-primary" 
                                    style={{padding: '8px', borderRadius: '8px', minWidth: '40px'}}
                                >
                                    {isSearching ? <RefreshCcw size={16} className="animate-spin" /> : <Search size={16} />}
                                </button>
                            </div>

                            {searchResults && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    style={{marginTop: '15px'}}
                                >
                                    <h4 style={{fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: '10px'}}>Search Results</h4>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto', paddingRight: '5px'}}>
                                        {searchResults.results?.map((res: any, i: number) => (
                                            <div key={i} style={{padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px'}}>
                                                <a href={res.url} target="_blank" rel="noreferrer" style={{fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none', display: 'block', marginBottom: '4px'}}>
                                                    {res.title}
                                                </a>
                                                <p style={{fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4'}}>{res.snippet}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {searchResults.answer && (
                                        <div style={{marginTop: '12px', padding: '10px', background: 'rgba(56, 189, 248, 0.05)', borderLeft: '3px solid var(--accent-primary)', borderRadius: '4px'}}>
                                            <p style={{fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px'}}>AI Executive Summary:</p>
                                            <p style={{fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic'}}>{searchResults.answer}</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <div className="glass-panel" style={{padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px'}}>
                            <Lock size={18} className="text-emerald-400" />
                            <h3 style={{fontSize: '16px', fontWeight: 600}}>HAL/WAL Context</h3>
                        </div>
                        <div style={{fontSize: '12px', opacity: 0.6, lineHeight: '1.5'}}>
                            Working-Memory Protocol (WAL) active. Every decision is persisted to `SESSION-STATE.md` before execution for context preservation.
                        </div>
                        <div style={{marginTop: '15px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: '6px', padding: '8px'}}>
                            <span style={{fontSize: '11px', color: 'var(--accent-success)', fontWeight: 600}}>System Status: RELENTLESS</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section style={{marginTop: '24px'}}>
            <div className="glass-panel" style={{padding: '30px', border: '1px solid rgba(16, 185, 129, 0.2)', background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px'}}>
                    <div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                            <Shield className="text-emerald-400" size={28} />
                            <h2 style={{fontSize: '24px', fontWeight: 700}}>Privacy & Governance</h2>
                        </div>
                        <p style={{color: 'var(--text-muted)', maxWidth: '600px'}}>
                            Configure how your Secretary handles long-term memory. Choose between cloud performance or local-first privacy.
                        </p>
                    </div>
                    <div style={{display: 'flex', gap: '8px'}}>
                        <div className="status-badge" style={{
                            background: 'rgba(56, 189, 248, 0.1)',
                            border: '1px solid rgba(56, 189, 248, 0.2)',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <Cpu size={14} className="text-sky-400" />
                            <span style={{fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)'}}>
                                Intelligence: {secretaryStatus?.outlook?.includes('ready') ? 'Proactive' : 'Learning'}
                            </span>
                        </div>
                        {securityScore !== null && (
                            <div className="status-badge" style={{
                                background: securityScore > 80 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                border: `1px solid ${securityScore > 80 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                                padding: '6px 12px',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <Shield size={14} className={securityScore > 80 ? 'text-emerald-400' : 'text-amber-400'} />
                                <span style={{fontSize: '12px', fontWeight: 600, color: securityScore > 80 ? 'var(--accent-success)' : 'var(--accent-warning)'}}>
                                    Security Score: {securityScore}%
                                </span>
                            </div>
                        )}
                        <div className={`status-badge ${memoryStatus?.embedding?.ok ? 'active' : 'inactive'}`} style={{
                            background: memoryStatus?.embedding?.ok ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            border: `1px solid ${memoryStatus?.embedding?.ok ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                            padding: '6px 12px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <Activity size={14} className={memoryStatus?.embedding?.ok ? 'text-emerald-400' : 'text-rose-400'} />
                            <span style={{fontSize: '12px', fontWeight: 600, color: memoryStatus?.embedding?.ok ? 'var(--accent-success)' : 'var(--accent-danger)'}}>
                                {memoryStatus?.embedding?.ok ? 'Embedding Engine: Healthy' : 'Embedding Engine: Unhealthy'}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                    <motion.div 
                        whileHover={{y: -5}}
                        onClick={() => handleToggleProvider('ollama')}
                        className="glass-panel" 
                        style={{
                            padding: '24px', 
                            cursor: 'pointer',
                            border: memoryStatus?.provider === 'ollama' ? '2px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.05)',
                            background: memoryStatus?.provider === 'ollama' ? 'rgba(14, 165, 233, 0.1)' : 'rgba(255,255,255,0.02)',
                            opacity: isPatching ? 0.7 : 1
                        }}
                    >
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
                            <div className="card-icon" style={{background: 'rgba(14, 165, 233, 0.1)'}}><Zap className="text-sky-400" /></div>
                            {memoryStatus?.provider === 'ollama' && <CheckCircle2 className="text-sky-400" />}
                        </div>
                        <h3 style={{fontSize: '18px', fontWeight: 700, marginBottom: '8px'}}>Privacy-First (Ollama)</h3>
                        <p style={{fontSize: '13px', color: 'var(--text-muted)'}}>
                            Embeddings and vector search happen locally on your hardware. Zero data leaves your network.
                        </p>
                        <div style={{marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <Lock size={14} className="text-emerald-400" />
                            <span style={{fontSize: '11px', color: 'var(--accent-success)', fontWeight: 600}}>100% On-Device</span>
                        </div>
                    </motion.div>

                    <motion.div 
                        whileHover={{y: -5}}
                        onClick={() => handleToggleProvider('openai')}
                        className="glass-panel" 
                        style={{
                            padding: '24px', 
                            cursor: 'pointer',
                            border: memoryStatus?.provider === 'openai' ? '2px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.05)',
                            background: memoryStatus?.provider === 'openai' ? 'rgba(14, 165, 233, 0.1)' : 'rgba(255,255,255,0.02)',
                            opacity: isPatching ? 0.7 : 1
                        }}
                    >
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
                            <div className="card-icon" style={{background: 'rgba(255,255,255,0.05)'}}><Globe className="text-slate-400" /></div>
                            {memoryStatus?.provider === 'openai' && <CheckCircle2 className="text-sky-400" />}
                        </div>
                        <h3 style={{fontSize: '18px', fontWeight: 700, marginBottom: '8px'}}>Performance (Cloud)</h3>
                        <p style={{fontSize: '13px', color: 'var(--text-muted)'}}>
                            High-speed cloud embeddings for large datasets. Faster processing, but data is sent to provider.
                        </p>
                        <div style={{marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <Activity size={14} className="text-sky-400" />
                            <span style={{fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600}}>High Performance</span>
                        </div>
                    </motion.div>
                </div>
                <div style={{marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                        <h3 className="card-title">Autonomous Cron Manager</h3>
                        <span style={{fontSize: '11px', color: 'var(--text-muted)'}}>{crons.length} scheduled jobs active</span>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px'}}>
                        {crons.map(cron => (
                            <div key={cron.id} className="glass-panel" style={{padding: '16px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                    <div>
                                        <p style={{fontSize: '14px', fontWeight: 600}}>{cron.name}</p>
                                        <p style={{fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px'}}>Schedule: <code>{cron.schedule.expr}</code></p>
                                    </div>
                                    <button 
                                        onClick={() => handleRunCron(cron.id)}
                                        className="button-primary" 
                                        style={{padding: '4px 10px', fontSize: '11px', background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.2)'}}
                                    >
                                        Run Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        <div style={{marginTop: '24px'}} className="glass-panel card">
          <div className="qr-section">
            <div className="qr-placeholder" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
              {qrUrl ? (
                 <img src={qrUrl} alt="WhatsApp QR" style={{width: '160px'}} />
              ) : (
                <>
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=ClawSecretaryManualPairing" 
                    alt="WhatsApp QR Placeholder" 
                    style={{width: '160px', opacity: 0.1}}
                  />
                  <div style={{position: 'absolute', textAlign: 'center'}}>
                    <AlertCircle size={32} className="text-slate-500" style={{margin: '0 auto 8px'}} />
                    <p style={{fontSize: '10px', color: '#666', fontWeight: 600}}>READY TO PAIR</p>
                  </div>
                </>
              )}
            </div>
            <div style={{flex: 1}}>
              <h2 style={{fontSize: '20px', fontWeight: 700, marginBottom: '8px'}}>WhatsApp Hub pairing</h2>
              <p style={{color: 'var(--text-muted)', marginBottom: '20px'}}>
                {isLinked 
                  ? "✅ Sucessfully linked! Your Secretary can now send proactive notifications." 
                  : "Scan the QR code with your phone (Linked Devices) to authorize the Secretary to send proactive briefings."}
              </p>
              <div style={{display: 'flex', gap: '16px'}}>
                {!isLinked && (
                  <button onClick={handleStartLinking} className="button-primary" disabled={isLinking}>
                    {isLinking ? "Waiting for Scan..." : "Request Pairing QR"} <Smartphone size={18} />
                  </button>
                )}
                {isLinked && (
                  <button className="button-primary" style={{background: 'var(--accent-success)'}}>
                    Session Active <CheckCircle2 size={18} />
                  </button>
                )}
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: isLinked ? 'var(--accent-success)' : 'var(--accent-warning)', fontSize: '12px'}}>
                  <div className="status-dot" style={{backgroundColor: isLinked ? 'var(--accent-success)' : 'var(--accent-warning)'}}></div>
                  {isLinked ? "Connected" : (isLinking ? "Awaiting scan..." : "Needs connection")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2026 OpenClaw Federated SaaS Orchestrator. Privacy first, always.</p>
      </footer>
    </div>
  );
};

export default App;
