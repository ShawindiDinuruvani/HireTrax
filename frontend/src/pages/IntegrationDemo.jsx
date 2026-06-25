import React, { useState } from 'react';
import { Database, CheckCircle, XCircle, Loader, Code, Terminal, ArrowRight, Shield, Server } from 'lucide-react';

const API_BASE = 'http://localhost:5105'; // Default ASP.NET dev server

const ENDPOINTS = [
  { label: 'Health Check', method: 'GET', path: '/api/users', description: 'Retrieves all registered users from the ASP.NET backend.' },
  { label: 'Create User (POST)', method: 'POST', path: '/api/users', description: 'Creates a new user record (sends demo payload).', body: JSON.stringify({ name: 'Demo User', email: 'demo@hiretrax.io', passwordHash: 'demo_hash_xyz', roleId: 1 }, null, 2) },
];

export default function IntegrationDemo() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const runTest = async (ep) => {
    setLoading((prev) => ({ ...prev, [ep.path + ep.method]: true }));
    setResults((prev) => ({ ...prev, [ep.path + ep.method]: null }));

    try {
      const opts = {
        method: ep.method,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      };
      if (ep.body) opts.body = ep.body;

      const res = await fetch(`${API_BASE}${ep.path}`, opts);
      const text = await res.text();
      let json;
      try { json = JSON.parse(text); } catch { json = text; }

      setResults((prev) => ({
        ...prev,
        [ep.path + ep.method]: {
          status: res.status,
          ok: res.ok,
          data: json,
          timestamp: new Date().toLocaleTimeString(),
        },
      }));
    } catch (err) {
      setResults((prev) => ({
        ...prev,
        [ep.path + ep.method]: {
          status: 'ERR',
          ok: false,
          data: err.message,
          timestamp: new Date().toLocaleTimeString(),
        },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [ep.path + ep.method]: false }));
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h2>Backend API Integration Console</h2>
          <p>Live test bench for the C# ASP.NET Web API. Ensure the backend server is running on <code style={codeStyle}>localhost:5105</code> before executing tests.</p>
        </div>
        <div style={statusBadgeStyle}>
          <Server size={14} />
          <span>ASP.NET Backend Target</span>
        </div>
      </div>

      {/* Setup Info Box */}
      <div className="glass-card" style={infoBoxStyle}>
        <div style={infoBoxHeaderStyle}>
          <Shield size={18} color="hsl(var(--accent))" />
          <h3 style={{ fontSize: '1rem' }}>Setup Instructions</h3>
        </div>
        <ol style={infoListStyle}>
          <li>Open a terminal in the <code style={codeStyle}>backend/</code> directory.</li>
          <li>Run <code style={codeStyle}>dotnet run</code> to start the ASP.NET Core Kestrel dev server on port <code style={codeStyle}>5105</code>.</li>
          <li>Ensure <code style={codeStyle}>SQL Server</code> is running and the connection string in <code style={codeStyle}>appsettings.json</code> is correct.</li>
          <li>Click the test buttons below to fire real HTTP requests from this React frontend to the C# API.</li>
        </ol>
      </div>

      {/* Endpoint Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
        {ENDPOINTS.map((ep) => {
          const key = ep.path + ep.method;
          const result = results[key];
          const isLoading = loading[key];

          return (
            <div key={key} className="glass-card" style={epCardStyle}>
              <div style={epHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={methodBadgeStyle(ep.method)}>{ep.method}</span>
                  <code style={epPathStyle}>{API_BASE}{ep.path}</code>
                </div>
                <button
                  onClick={() => runTest(ep)}
                  disabled={isLoading}
                  style={runBtnStyle}
                >
                  {isLoading ? (
                    <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Running...</>
                  ) : (
                    <>Run Test <ArrowRight size={14} /></>
                  )}
                </button>
              </div>

              <p style={epDescStyle}>{ep.description}</p>

              {ep.body && (
                <div style={requestBodyStyle}>
                  <span style={labelStyle}>Request Body (JSON):</span>
                  <pre style={preStyle}>{ep.body}</pre>
                </div>
              )}

              {/* Result Display */}
              {result && (
                <div style={resultContainerStyle(result.ok)}>
                  <div style={resultHeaderStyle}>
                    {result.ok
                      ? <CheckCircle size={16} color="hsl(var(--success))" />
                      : <XCircle size={16} color="hsl(var(--danger))" />
                    }
                    <span style={resultStatusStyle(result.ok)}>
                      HTTP {result.status} — {result.ok ? 'Success' : 'Failed'}
                    </span>
                    <span style={resultTimeStyle}>@ {result.timestamp}</span>
                  </div>
                  <pre style={preStyle}>{typeof result.data === 'object' ? JSON.stringify(result.data, null, 2) : result.data}</pre>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Architecture Note */}
      <div className="glass-card" style={{ ...infoBoxStyle, marginTop: '24px', borderColor: 'hsl(var(--primary) / 0.2)' }}>
        <div style={infoBoxHeaderStyle}>
          <Terminal size={18} color="hsl(var(--primary))" />
          <h3 style={{ fontSize: '1rem' }}>Frontend-Backend Communication Architecture</h3>
        </div>
        <div style={archGridStyle}>
          <div style={archBoxStyle}>
            <h4 style={archTitleStyle}>Authentication</h4>
            <p style={archDescStyle}>JWT Bearer token issued by <code style={codeStyle}>/api/auth/login</code> endpoint, stored in memory and attached as Authorization header on all subsequent requests.</p>
          </div>
          <div style={archBoxStyle}>
            <h4 style={archTitleStyle}>CORS Policy</h4>
            <p style={archDescStyle}>The ASP.NET backend must allow <code style={codeStyle}>http://localhost:5173</code> (Vite dev origin) with credentials enabled for cross-origin API calls to succeed.</p>
          </div>
          <div style={archBoxStyle}>
            <h4 style={archTitleStyle}>Error Handling</h4>
            <p style={archDescStyle}>All API responses are validated for HTTP status codes. 4xx/5xx responses trigger frontend toast notifications and log entries in the Admin audit trail.</p>
          </div>
          <div style={archBoxStyle}>
            <h4 style={archTitleStyle}>Data Contract</h4>
            <p style={archDescStyle}>REST endpoints follow RESTful naming conventions. All payloads use <code style={codeStyle}>camelCase</code> JSON matching the C# ASP.NET DTO model definitions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const containerStyle = { maxWidth: '1000px', margin: '0 auto' };

const headerStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  marginBottom: '24px', gap: '16px',
};

const statusBadgeStyle = {
  display: 'flex', alignItems: 'center', gap: '6px',
  background: 'hsl(var(--accent) / 0.1)', border: '1px solid hsl(var(--accent) / 0.3)',
  color: 'hsl(var(--accent))', padding: '8px 14px', borderRadius: '99px',
  fontSize: '0.8rem', fontWeight: '600', flexShrink: 0,
};

const codeStyle = {
  fontFamily: 'Consolas, monospace', fontSize: '0.85em',
  background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: '3px',
  color: 'hsl(var(--accent))',
};

const infoBoxStyle = {
  padding: '20px', border: '1px solid hsl(var(--accent) / 0.15)',
};

const infoBoxHeaderStyle = {
  display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px',
};

const infoListStyle = {
  paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px',
  fontSize: '0.9rem', color: 'hsl(var(--text-secondary))', lineHeight: '1.6',
};

const epCardStyle = { padding: '20px' };

const epHeaderStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  marginBottom: '12px', gap: '12px',
};

const methodBadgeStyle = (method) => ({
  padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700',
  fontFamily: 'Consolas, monospace',
  background: method === 'GET' ? 'hsl(var(--success) / 0.15)' : 'hsl(var(--primary) / 0.15)',
  color: method === 'GET' ? 'hsl(var(--success))' : 'hsl(var(--primary))',
  border: `1px solid ${method === 'GET' ? 'hsl(var(--success) / 0.3)' : 'hsl(var(--primary) / 0.3)'}`,
});

const epPathStyle = {
  fontFamily: 'Consolas, monospace', fontSize: '0.9rem', color: 'white',
};

const epDescStyle = {
  fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginBottom: '12px',
};

const runBtnStyle = {
  display: 'flex', alignItems: 'center', gap: '6px',
  background: 'hsl(var(--primary))', color: 'white', border: 'none',
  padding: '8px 18px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem',
  fontWeight: '600', cursor: 'pointer', flexShrink: 0,
  boxShadow: '0 4px 12px hsl(var(--primary) / 0.2)',
};

const requestBodyStyle = { marginBottom: '12px' };

const labelStyle = {
  fontSize: '0.75rem', color: 'hsl(var(--text-muted))',
  fontWeight: '600', display: 'block', marginBottom: '6px',
};

const preStyle = {
  background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '6px',
  fontSize: '0.8rem', fontFamily: 'Consolas, monospace', color: '#a3e635',
  overflowX: 'auto', margin: '0',
};

const resultContainerStyle = (ok) => ({
  marginTop: '16px', borderTop: '1px solid hsl(var(--border))', paddingTop: '14px',
  border: `1px solid ${ok ? 'hsl(var(--success) / 0.3)' : 'hsl(var(--danger) / 0.3)'}`,
  borderRadius: 'var(--radius-sm)', padding: '14px',
  background: ok ? 'hsl(var(--success) / 0.04)' : 'hsl(var(--danger) / 0.04)',
});

const resultHeaderStyle = {
  display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px',
};

const resultStatusStyle = (ok) => ({
  fontSize: '0.85rem', fontWeight: '700',
  color: ok ? 'hsl(var(--success))' : 'hsl(var(--danger))',
});

const resultTimeStyle = {
  marginLeft: 'auto', fontSize: '0.75rem', color: 'hsl(var(--text-muted))',
};

const archGridStyle = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '4px',
};

const archBoxStyle = {
  background: 'rgba(255,255,255,0.01)', border: '1px solid hsl(var(--border))',
  padding: '14px', borderRadius: 'var(--radius-sm)',
};

const archTitleStyle = {
  fontSize: '0.85rem', fontWeight: '700', color: 'hsl(var(--primary))', marginBottom: '6px',
};

const archDescStyle = {
  fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', lineHeight: '1.5',
};
