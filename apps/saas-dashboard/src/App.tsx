import React, { useState } from 'react';
import { 
  Shield, 
  MessageSquare, 
  Calendar, 
  Activity, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const [setupToken] = useState("magic_onboarding_2026");
  const [magicLink] = useState(`https://saas.openclaw.ai/setup?token=${setupToken}`);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(magicLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const statusCards = [
    { 
      title: "Agent Brain", 
      status: "Online", 
      icon: <Cpu className="text-sky-400" />, 
      details: "Docker Instance: ClawBot-V2",
      type: "active"
    },
    { 
      title: "WhatsApp Pair", 
      status: "Waiting for QR", 
      icon: <MessageSquare className="text-amber-400" />, 
      details: "No session detected",
      type: "pending"
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
          <div className="status-dot pulse" style={{backgroundColor: 'var(--accent-success)'}}></div>
          <span style={{fontSize: '14px', fontWeight: 600}}>System Operational</span>
        </div>
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
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=ClawSecretaryManualPairing" 
                alt="WhatsApp QR" 
                style={{width: '160px', opacity: 0.3}}
              />
              <div style={{position: 'absolute', textAlign: 'center'}}>
                <AlertCircle size={32} className="text-amber-500" style={{margin: '0 auto 8px'}} />
                <p style={{fontSize: '10px', color: '#333', fontWeight: 600}}>LINKING...</p>
              </div>
            </div>
            <div style={{flex: 1}}>
              <h2 style={{fontSize: '20px', fontWeight: 700, marginBottom: '8px'}}>WhatsApp Hub pairing</h2>
              <p style={{color: 'var(--text-muted)', marginBottom: '20px'}}>
                Scan the QR code with your phone (Linked Devices) to authorize the Secretary to send proactive briefings.
              </p>
              <div style={{display: 'flex', gap: '16px'}}>
                <button className="button-primary">Open Native App <ExternalLink size={18} /></button>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-warning)', fontSize: '12px'}}>
                  <div className="status-dot" style={{backgroundColor: 'var(--accent-warning)'}}></div>
                  Waiting for connection...
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
