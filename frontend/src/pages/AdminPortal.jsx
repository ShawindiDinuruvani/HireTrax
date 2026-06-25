import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, Users, Activity, Terminal, Shield, 
  Trash, UserCheck, HardDrive, RefreshCw, BarChart2
} from 'lucide-react';

export default function AdminPortal() {
  const { logs, candidates, jobs, applications, evaluations } = useApp();
  const [adminTab, setAdminTab] = useState('analytics'); // 'analytics', 'users', 'logs'

  // User database simulation (merge candidates and staff list)
  const [usersList, setUsersList] = useState([
    { id: 'usr-1', name: 'Marcus Aurelius', email: 'marcus@company.com', role: 'Hiring Manager', status: 'Active' },
    { id: 'usr-2', name: 'Emma Watson', email: 'emma.watson@company.com', role: 'Recruiter', status: 'Active' },
    { id: 'usr-3', name: 'Sarah Jenkins', email: 'sarah.j@company.com', role: 'Hiring Manager', status: 'Active' },
    { id: 'usr-4', name: 'Alice Smith', email: 'alice.smith@devmail.net', role: 'Candidate', status: 'Active' },
    { id: 'usr-5', name: 'Bob Johnson', email: 'bob.j@aimail.io', role: 'Candidate', status: 'Active' }
  ]);

  const handleRoleChange = (userId, newRole) => {
    setUsersList(prev => 
      prev.map(u => u.id === userId ? { ...u, role: newRole } : u)
    );
    alert(`User role updated to ${newRole}.`);
  };

  // Funnel calculations
  const totalApps = applications.length;
  const screenedCount = applications.filter(a => a.status !== 'Screening').length;
  const interviewedCount = applications.filter(a => a.status === 'Interviewing' || a.status === 'Score Card' || a.status === 'Accepted').length;
  const offeredCount = applications.filter(a => a.status === 'Accepted').length;

  // Department counts
  const deptData = {
    Engineering: applications.filter(a => jobs.find(j => j.id === a.jobId)?.department === 'Engineering').length,
    AI: applications.filter(a => jobs.find(j => j.id === a.jobId)?.department === 'Artificial Intelligence').length,
    Design: applications.filter(a => jobs.find(j => j.id === a.jobId)?.department === 'Design').length,
    Operations: applications.filter(a => jobs.find(j => j.id === a.jobId)?.department === 'Operations').length,
  };

  return (
    <div style={containerStyle}>
      <div style={headerInfoStyle}>
        <h2>System Administration & Control</h2>
        <p>Monitor platform telemetry, analyze recruitment metrics, and adjust Role-Based Access Controls (RBAC).</p>
      </div>

      {/* Admin Tab Controls */}
      <div style={tabsContainerStyle}>
        <button 
          onClick={() => setAdminTab('analytics')} 
          style={adminTab === 'analytics' ? activeTabStyle : tabStyle}
        >
          <BarChart2 size={16} />
          <span>Talent Analytics</span>
        </button>
        <button 
          onClick={() => setAdminTab('users')} 
          style={adminTab === 'users' ? activeTabStyle : tabStyle}
        >
          <Users size={16} />
          <span>User RBAC Control</span>
        </button>
        <button 
          onClick={() => setAdminTab('logs')} 
          style={adminTab === 'logs' ? activeTabStyle : tabStyle}
        >
          <Terminal size={16} />
          <span>Audit Logs & Health</span>
        </button>
      </div>

      {/* ============ TAB 1: ANALYTICS ============ */}
      {adminTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Dashboard Stats */}
          <div style={kpiGridStyle}>
            <div className="glass-card" style={statBoxStyle}>
              <span style={statLabelStyle}>AI Selection Accuracy</span>
              <h3 style={statValueStyle}>94.2%</h3>
              <p style={statTrendStyle}>+1.4% from last month</p>
            </div>
            <div className="glass-card" style={statBoxStyle}>
              <span style={statLabelStyle}>Avg. Days to Hire</span>
              <h3 style={statValueStyle}>18 Days</h3>
              <p style={{ ...statTrendStyle, color: 'hsl(var(--success))' }}>-4 days improvement</p>
            </div>
            <div className="glass-card" style={statBoxStyle}>
              <span style={statLabelStyle}>Funnel Conversion Rate</span>
              <h3 style={statValueStyle}>28.6%</h3>
              <p style={statTrendStyle}>Industry benchmark: 15%</p>
            </div>
          </div>

          <div style={chartsSplitLayout}>
            {/* Recruitment Pipeline Funnel Visualizer */}
            <div className="glass-card" style={chartCardStyle}>
              <h3 style={{ fontSize: '1rem', marginBottom: '20px', color: 'hsl(var(--accent))' }}>Recruitment Yield Funnel</h3>
              <div style={funnelContainerStyle}>
                <div style={funnelRowStyle}>
                  <span style={funnelLabelStyle}>Applied</span>
                  <div style={funnelBarBgStyle}>
                    <div style={{ ...funnelBarFillStyle, width: '100%' }} />
                  </div>
                  <span style={funnelValueStyle}>{totalApps} (100%)</span>
                </div>
                <div style={funnelRowStyle}>
                  <span style={funnelLabelStyle}>Screened</span>
                  <div style={funnelBarBgStyle}>
                    <div style={{ ...funnelBarFillStyle, width: `${(screenedCount / totalApps) * 100 || 0}%`, backgroundColor: 'hsl(var(--primary))' }} />
                  </div>
                  <span style={funnelValueStyle}>{screenedCount} ({Math.round((screenedCount / totalApps) * 100) || 0}%)</span>
                </div>
                <div style={funnelRowStyle}>
                  <span style={funnelLabelStyle}>Interviewed</span>
                  <div style={funnelBarBgStyle}>
                    <div style={{ ...funnelBarFillStyle, width: `${(interviewedCount / totalApps) * 100 || 0}%`, backgroundColor: 'hsl(var(--accent))' }} />
                  </div>
                  <span style={funnelValueStyle}>{interviewedCount} ({Math.round((interviewedCount / totalApps) * 100) || 0}%)</span>
                </div>
                <div style={funnelRowStyle}>
                  <span style={funnelLabelStyle}>Offered</span>
                  <div style={funnelBarBgStyle}>
                    <div style={{ ...funnelBarFillStyle, width: `${(offeredCount / totalApps) * 100 || 0}%`, backgroundColor: 'hsl(var(--success))' }} />
                  </div>
                  <span style={funnelValueStyle}>{offeredCount} ({Math.round((offeredCount / totalApps) * 100) || 0}%)</span>
                </div>
              </div>
            </div>

            {/* Department applications chart */}
            <div className="glass-card" style={chartCardStyle}>
              <h3 style={{ fontSize: '1rem', marginBottom: '20px', color: 'hsl(var(--accent))' }}>Applications by Department</h3>
              <div style={funnelContainerStyle}>
                {Object.keys(deptData).map(dept => {
                  const count = deptData[dept];
                  const percentage = totalApps > 0 ? (count / totalApps) * 100 : 0;
                  return (
                    <div key={dept} style={funnelRowStyle}>
                      <span style={funnelLabelStyle}>{dept}</span>
                      <div style={funnelBarBgStyle}>
                        <div style={{ ...funnelBarFillStyle, width: `${percentage}%`, backgroundColor: 'rgba(255,255,255,0.3)' }} />
                      </div>
                      <span style={funnelValueStyle}>{count} applications</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ TAB 2: USER MANAGEMENT & RBAC ============ */}
      {adminTab === 'users' && (
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={tableHeaderAreaStyle}>
            <h3 style={{ fontSize: '1.1rem' }}>User Directory & Permissions Matrix</h3>
            <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>Double click role drop down to modify access rules</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableRowHeaderStyle}>
                  <th style={thStyle}>User Identity</th>
                  <th style={thStyle}>Email Address</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Designated Role</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((usr) => (
                  <tr key={usr.id} style={tableRowStyle}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={avatarPlaceholderStyle}>
                          {usr.name.charAt(0)}
                        </div>
                        <span style={{ fontWeight: '600', color: 'white' }}>{usr.name}</span>
                      </div>
                    </td>
                    <td style={tdStyle}>{usr.email}</td>
                    <td style={tdStyle}>
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{usr.status}</span>
                    </td>
                    <td style={tdStyle}>
                      <select 
                        value={usr.role} 
                        onChange={(e) => handleRoleChange(usr.id, e.target.value)}
                        style={inlineSelectStyle}
                      >
                        <option value="Candidate">Candidate</option>
                        <option value="Recruiter">Recruiter</option>
                        <option value="Hiring Manager">Hiring Manager</option>
                        <option value="Administrator">Administrator</option>
                      </select>
                    </td>
                    <td style={tdStyle}>
                      <button 
                        onClick={() => alert(`Security policy restriction: Core staff records cannot be deleted during prototype execution.`)} 
                        style={deleteBtnStyle}
                      >
                        Revoke Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============ TAB 3: SYSTEM AUDIT LOGS & HEALTH ============ */}
      {adminTab === 'logs' && (
        <div style={splitLayoutStyle}>
          {/* Left Panel: Real-time System Logs */}
          <div className="glass-card" style={logsCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Active System Audit Trail</h3>
              <span className="badge badge-primary">JWT SECURED</span>
            </div>
            
            <div style={logsConsoleContainerStyle}>
              {logs.map((log) => (
                <div key={log.id} style={logLineStyle}>
                  <span style={logTimeStyle}>[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span style={logUserStyle}> ({log.user})</span>
                  <span style={{ color: 'white' }}> {log.action}</span>
                  <span style={logDetailStyle}> - {log.details}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Infrastructure Health Monitor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={telemetryCardStyle}>
              <div style={telemetryHeaderStyle}>
                <HardDrive size={18} color="hsl(var(--accent))" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Relational Database Status</h4>
              </div>
              <div style={telemetryGridStyle}>
                <div style={telemetryBoxStyle}>
                  <span style={infoLabelStyle}>DBMS Engine</span>
                  <p style={infoValueStyle}>SQL Server Express</p>
                </div>
                <div style={telemetryBoxStyle}>
                  <span style={infoLabelStyle}>Database File Size</span>
                  <p style={infoValueStyle}>12.4 MB</p>
                </div>
                <div style={telemetryBoxStyle}>
                  <span style={infoLabelStyle}>Connections</span>
                  <p style={infoValueStyle}>8 Active Pools</p>
                </div>
                <div style={telemetryBoxStyle}>
                  <span style={infoLabelStyle}>Migration version</span>
                  <p style={infoValueStyle}>v1.2.04_CoreModels</p>
                </div>
              </div>
            </div>

            <div className="glass-card" style={telemetryCardStyle}>
              <div style={telemetryHeaderStyle}>
                <Activity size={18} color="hsl(var(--primary))" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Web API Telemetry Metrics</h4>
              </div>
              <div style={telemetryGridStyle}>
                <div style={telemetryBoxStyle}>
                  <span style={infoLabelStyle}>Server Host</span>
                  <p style={infoValueStyle}>ASP.NET Core Kestrel</p>
                </div>
                <div style={telemetryBoxStyle}>
                  <span style={infoLabelStyle}>Mean Latency</span>
                  <p style={infoValueStyle}>42 ms</p>
                </div>
                <div style={telemetryBoxStyle}>
                  <span style={infoLabelStyle}>Security Protocols</span>
                  <p style={infoValueStyle}>HTTPS / TLS 1.3</p>
                </div>
                <div style={telemetryBoxStyle}>
                  <span style={infoLabelStyle}>Authorization</span>
                  <p style={infoValueStyle}>Bearer JWT Token</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
};

const headerInfoStyle = {
  marginBottom: '24px',
};

const tabsContainerStyle = {
  display: 'flex',
  gap: '12px',
  borderBottom: '1px solid hsl(var(--border))',
  paddingBottom: '12px',
  marginBottom: '24px',
};

const tabStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: 'transparent',
  border: 'none',
  color: 'hsl(var(--text-secondary))',
  padding: '10px 16px',
  fontSize: '0.9rem',
  cursor: 'pointer',
  borderRadius: 'var(--radius-sm)',
  transition: 'all var(--transition-fast)',
};

const activeTabStyle = {
  ...tabStyle,
  background: 'hsl(var(--primary) / 0.1)',
  color: 'white',
  fontWeight: '600',
};

const kpiGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
};

const statBoxStyle = {
  padding: '20px',
};

const statLabelStyle = {
  fontSize: '0.8rem',
  color: 'hsl(var(--text-muted))',
  fontWeight: '500',
  display: 'block',
  marginBottom: '6px',
};

const statValueStyle = {
  fontSize: '1.8rem',
  fontWeight: '800',
  color: 'white',
  lineHeight: '1',
};

const statTrendStyle = {
  fontSize: '0.75rem',
  color: 'hsl(var(--primary))',
  fontWeight: '600',
  marginTop: '8px',
};

const chartsSplitLayout = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '24px',
  marginTop: '24px',
};

const chartCardStyle = {
  padding: '24px',
};

const funnelContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const funnelRowStyle = {
  display: 'grid',
  gridTemplateColumns: '100px 1fr 120px',
  alignItems: 'center',
  gap: '14px',
};

const funnelLabelStyle = {
  fontSize: '0.85rem',
  color: 'hsl(var(--text-secondary))',
  fontWeight: '500',
};

const funnelBarBgStyle = {
  height: '12px',
  backgroundColor: 'hsl(var(--border))',
  borderRadius: '4px',
  overflow: 'hidden',
};

const funnelBarFillStyle = {
  height: '100%',
  backgroundColor: 'hsl(var(--accent))',
  borderRadius: '4px',
  transition: 'width 0.6s ease',
};

const funnelValueStyle = {
  fontSize: '0.85rem',
  color: 'white',
  fontWeight: '600',
  textAlign: 'right',
};

// Users management list styles
const tableHeaderAreaStyle = {
  padding: '20px 24px',
  borderBottom: '1px solid hsl(var(--border))',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
};

const tableRowHeaderStyle = {
  borderBottom: '1px solid hsl(var(--border))',
  background: 'rgba(255, 255, 255, 0.02)',
};

const thStyle = {
  padding: '16px 24px',
  fontSize: '0.85rem',
  fontWeight: '700',
  color: 'hsl(var(--text-secondary))',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tableRowStyle = {
  borderBottom: '1px solid hsl(var(--border))',
  transition: 'background 0.2s',
};

const tdStyle = {
  padding: '16px 24px',
  fontSize: '0.9rem',
  color: 'hsl(var(--text-secondary))',
};

const avatarPlaceholderStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  background: 'hsl(var(--primary) / 0.2)',
  color: 'hsl(var(--primary))',
  fontSize: '0.8rem',
  fontWeight: '800',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const inlineSelectStyle = {
  background: 'hsl(var(--bg-secondary))',
  border: '1px solid hsl(var(--border))',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '4px',
  fontSize: '0.8rem',
  cursor: 'pointer',
  outline: 'none',
};

const deleteBtnStyle = {
  background: 'transparent',
  border: '1px solid hsl(var(--danger) / 0.3)',
  color: 'hsl(var(--danger))',
  padding: '6px 12px',
  borderRadius: '4px',
  fontSize: '0.8rem',
  cursor: 'pointer',
};

// Logs tab styles
const splitLayoutStyle = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: '24px',
};

const logsCardStyle = {
  height: 'calc(100vh - 270px)',
  display: 'flex',
  flexDirection: 'column',
};

const logsConsoleContainerStyle = {
  background: 'black',
  fontFamily: 'Consolas, monospace',
  fontSize: '0.8rem',
  padding: '16px',
  borderRadius: '4px',
  overflowY: 'auto',
  flexGrow: 1,
  color: '#22c55e', // Console green
};

const logLineStyle = {
  marginBottom: '6px',
  lineHeight: '1.4',
};

const logTimeStyle = {
  color: 'hsl(var(--accent))',
};

const logUserStyle = {
  color: 'hsl(var(--text-muted))',
};

const logDetailStyle = {
  color: '#a3a3a3',
};

const telemetryCardStyle = {
  padding: '20px',
  height: 'fit-content',
};

const telemetryHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '16px',
  borderBottom: '1px solid hsl(var(--border))',
  paddingBottom: '10px',
};

const telemetryGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '14px',
};

const telemetryBoxStyle = {
  background: 'rgba(255,255,255,0.01)',
  border: '1px solid hsl(var(--border))',
  padding: '10px',
  borderRadius: '4px',
};

const infoLabelStyle = {
  fontSize: '0.7rem',
  color: 'hsl(var(--text-muted))',
  display: 'block',
  marginBottom: '2px',
};

const infoValueStyle = {
  fontSize: '0.85rem',
  color: 'white',
  fontWeight: '600',
};
