"use client";

import { motion } from "framer-motion";
import { Link2, Smartphone, ShieldCheck, CheckCircle2, ChevronRight, Activity, Terminal } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type LogEntry = {
  time: string;
  message: string;
  type: "info" | "success" | "warning";
};

export default function Dashboard() {
  const [notionConnected, setNotionConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: new Date().toLocaleTimeString(), message: "SaaS Bridge initialized.", type: "info" }
  ]);
  
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (msg: string, type: "info"| "success" | "warning" = "info") => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message: msg, type }]);
  };

  const handleConnect = async () => {
    if (notionConnected) {
      return;
    }
    setConnecting(true);
    addLog("Initiating Nango.dev OAuth flow for Notion...", "info");
    
    // Simulate OAuth delay
    await new Promise(r => setTimeout(r, 1500));
    const fakeToken = `notion_bridge_${Date.now()}`;
    addLog("OAuth successful. Received token from Notion.", "success");
    // Inject token to the local OpenClaw Gateway Listener Mode
    try {
      addLog("Sending payload to SaaS Bridge: /api/oauth/bridge", "info");
      
      const payload = {
        provider: "notion",
        edgeUrl: "http://localhost:19001",
        profiles: {
          "notion-default": {
            type: "token",
            provider: "notion",
            token: fakeToken
          }
        }
      };

      // REAL BRIDGE CALL: From browser to SaaS server -> Server to local Edge
      const res = await fetch("/api/oauth/bridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setNotionConnected(true);
        addLog(`✅ Bridge Finalized. ${data.injected} credentials injected into local Sovereignty Vault.`, "success");
      } else {
        addLog(`Bridge Failure: ${data.message || "Unknown error"}.`, "warning");
      }
    } catch (err: unknown) {
      const error = err as Error;
      addLog(`Bridge Connection Error: ${error.message}.`, "warning");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo-wrapper">
          <Smartphone className="logo-icon" size={32} />
          <span className="logo-text">ClawSecretary Edge</span>
        </div>
        <div className="badge badge-connected">
          <ShieldCheck size={14} /> Edge Computing On
        </div>
      </header>

      <div className="grid">
        {/* Main Connection Panel */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass-card"
        >
          <div className="card-header">
            <h2 className="card-title">
              <Link2 className="logo-icon" size={20} />
              Integrations Hub
            </h2>
          </div>
          <p className="card-description">
            Zero-storage pledges. Connect your tools via Nango, and we forward your tokens instantly to your mobile. We keep absolutely nothing.
          </p>
          
          <div style={{ padding: "1rem", borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg" style={{width: 32, height: 32}} alt="Notion" />
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Notion Workspace</h3>
                  <p style={{ fontSize: "0.8rem", color: "#a1a1aa" }}>Sync tasks and documents</p>
                </div>
              </div>
              {notionConnected ? (
                <span className="badge badge-connected"><CheckCircle2 size={12}/> Synced</span>
              ) : (
                <span className="badge badge-disconnected">Not Connected</span>
              )}
            </div>
            
            <button 
              className={`btn ${notionConnected ? "btn-success" : "btn-primary"}`} 
              onClick={handleConnect}
              disabled={connecting || notionConnected}
            >
              {connecting ? (
                <> <Activity className="animate-spin" size={16}/> Bridging... </>
              ) : notionConnected ? (
                <> Edge Sync Complete </>
              ) : (
                <> Bridge with Nango OAuth <ChevronRight size={16}/> </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Console / Status Tracker */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="glass-card"
        >
          <div className="card-header">
            <h2 className="card-title">
              <Terminal size={20} style={{ color: "#3b82f6"}} />
              Live Injection Monitor 
            </h2>
          </div>
          <p className="card-description">
            Monitor real-time token transit from Vercel Cloud directly down to your phone's memory vectors.
          </p>
          
          <div className="log-terminal">
            {logs.map((log, i) => (
              <div key={i} className="log-entry">
                <span className="log-time">[{log.time}]</span>
                <span className={`log-${log.type}`}>{log.message}</span>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        </motion.div>
      </div>

      <div className="local-status-bar">
        <div className="status-text">
          <Activity size={16} /> Edge Gateway Ready (Listening on localhost:19001)
        </div>
        <div style={{ fontSize: "0.8rem", color: "#52525b"}}>No data stored globally.</div>
      </div>
    </div>
  );
}
