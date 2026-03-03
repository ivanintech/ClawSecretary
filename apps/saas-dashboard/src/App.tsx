import React, { useState } from 'react';
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
  Activity
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

  const statusCards = [
    { 
      title: "Agent Brain", 
      status: isRebooting ? "Rebooting..." : "Online", 
      icon: <Cpu className={isRebooting ? "pulse text-amber-400" : "text-sky-400"} />, 
      details: "Docker Instance: ClawBot-V2",
      type: isRebooting ? "pending" : "active"
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
          <div className={`status-dot ${isRebooting ? 'pulse' : ''}`} style={{backgroundColor: isRebooting ? 'var(--accent-warning)' : 'var(--accent-success)'}}></div>
          <span style={{fontSize: '14px', fontWeight: 600}}>{isRebooting ? 'Rebooting...' : 'System Operational'}</span>
        </div>
        <button onClick={handleReboot} className="button-primary" style={{marginLeft: '20px', background: 'rgba(248, 113, 113, 0.2)', border: '1px solid rgba(248, 113, 113, 0.3)'}}>
            Emergency Reboot
        </button>
      </header>

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
