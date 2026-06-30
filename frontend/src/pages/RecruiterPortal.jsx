import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Users, Briefcase, Calendar, Sparkles, Filter, ArrowUpRight, 
  BrainCircuit, Search, Check, X, FileText, ChevronRight
} from 'lucide-react';

export default function RecruiterPortal() {
  const { 
    applications, candidates, jobs, schedules, 
    updateApplicationStatus 
  } = useApp();
  
  const navigate = useNavigate();

  // Filter states
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [candidateSearch, setCandidateSearch] = useState('');

  // Selected candidate review drawer state
  const [selectedApp, setSelectedApp] = useState(null);
  const [actionNotes, setActionNotes] = useState('');

  // KPI Calculations
  const activeJobsCount = jobs.filter(j => j.status === 'Active').length;
  const totalApplicants = applications.length;
  const pendingScreenings = applications.filter(a => a.status === 'Screening').length;
  const scheduledInterviews = schedules.filter(s => s.status === 'Scheduled').length;

  const handleStatusChange = (appId, newStatus) => {
    updateApplicationStatus(appId, newStatus, actionNotes || `Status updated by recruiter.`);
    setActionNotes('');
    setSelectedApp(null); // Close drawer
  };

  // Filter application pipeline
  const filteredApps = applications.filter((app) => {
    const candidate = candidates.find(c => c.id === app.candidateId);
    const job = jobs.find(j => j.id === app.jobId);
    
    const matchesSearch = candidate?.name.toLowerCase().includes(candidateSearch.toLowerCase()) || false;
    const matchesJob = selectedJobFilter === 'All' || app.jobId === selectedJobFilter;
    const matchesStatus = selectedStatusFilter === 'All' || app.status === selectedStatusFilter;

    return matchesSearch && matchesJob && matchesStatus;
  }).sort((a, b) => b.aiMatchScore - a.aiMatchScore); // Sorted by AI Match score default

  return (
    <div style={containerStyle}>
      {/* Overview Dashboard Cards */}
      <div style={kpiGridStyle}>
        <div className="glass-card" style={kpiCardStyle}>
          <div style={kpiHeaderStyle}>
            <Briefcase size={22} color="hsl(var(--accent))" />
            <span style={kpiValueStyle}>{activeJobsCount}</span>
          </div>
          <p style={kpiLabelStyle}>Active Job Openings</p>
        </div>

        <div className="glass-card" style={kpiCardStyle}>
          <div style={kpiHeaderStyle}>
            <Users size={22} color="hsl(var(--primary))" />
            <span style={kpiValueStyle}>{totalApplicants}</span>
          </div>
          <p style={kpiLabelStyle}>Total Job Applicants</p>
        </div>

        <div className="glass-card" style={kpiCardStyle}>
          <div style={kpiHeaderStyle}>
            <Sparkles size={22} color="hsl(var(--warning))" />
            <span style={kpiValueStyle}>{pendingScreenings}</span>
          </div>
          <p style={kpiLabelStyle}>Pending AI Screening</p>
        </div>

        <div className="glass-card" style={kpiCardStyle}>
          <div style={kpiHeaderStyle}>
            <Calendar size={22} color="hsl(var(--success))" />
            <span style={kpiValueStyle}>{scheduledInterviews}</span>
          </div>
          <p style={kpiLabelStyle}>Interviews Booked</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="glass-card" style={filterRowStyle}>
        <div style={searchFieldStyle}>
          <Search size={18} color="hsl(var(--text-muted))" />
          <input 
            type="text" 
            placeholder="Search applicants..." 
            value={candidateSearch}
            onChange={(e) => setCandidateSearch(e.target.value)}
            style={searchInputStyle}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={selectFieldStyle}>
            <select 
              value={selectedJobFilter}
              onChange={(e) => setSelectedJobFilter(e.target.value)}
              style={selectInputStyle}
            >
              <option value="All">All Jobs</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>

          <div style={selectFieldStyle}>
            <select 
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              style={selectInputStyle}
            >
              <option value="All">All Stages</option>
              <option value="Screening">Screening</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Score Card">Score Card</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Applicants Pipeline Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={tableHeaderAreaStyle}>
          <h3 style={{ fontSize: '1.1rem' }}>Candidate Evaluation Pipeline</h3>
          <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>Sorted dynamically by AI Compatibility Score</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={tableRowHeaderStyle}>
                <th style={thStyle}>Candidate</th>
                <th style={thStyle}>Applying For</th>
                <th style={thStyle}>Applied Date</th>
                <th style={thStyle}>AI Fit Score</th>
                <th style={thStyle}>Current Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} style={emptyTdStyle}>
                    No applicants match current filters.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => {
                  const candidate = candidates.find(c => c.id === app.candidateId);
                  const job = jobs.find(j => j.id === app.jobId);
                  
                  return (
                    <tr 
                      key={app.id} 
                      style={tableRowStyle} 
                      className="glass-card-interactive"
                      onClick={() => setSelectedApp(app)}
                    >
                      <td style={tdStyle}>
                        <div>
                          <p style={{ fontWeight: '600', color: 'white' }}>{candidate?.name || 'Unknown'}</p>
                          <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>{candidate?.email}</p>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <div>
                          <p style={{ fontWeight: '500' }}>{job?.title || 'Unknown'}</p>
                          <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>{job?.department}</p>
                        </div>
                      </td>
                      <td style={tdStyle}>{app.date}</td>
                      <td style={tdStyle}>
                        <div style={aiIndicatorContainerStyle}>
                          <Sparkles size={12} color="hsl(var(--primary))" />
                          <span style={aiScoreStyle(app.aiMatchScore)}>{app.aiMatchScore}%</span>
                          <div style={miniMeterStyle}>
                            <div style={{ ...miniMeterFillStyle, width: `${app.aiMatchScore}%`, backgroundColor: app.aiMatchScore > 85 ? 'hsl(var(--success))' : 'hsl(var(--primary))' }} />
                          </div>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span className={`badge ${
                          app.status === 'Accepted' ? 'badge-success' :
                          app.status === 'Rejected' ? 'badge-danger' :
                          app.status === 'Interviewing' ? 'badge-primary' : 'badge-warning'
                        }`} style={{ fontSize: '0.7rem' }}>
                          {app.status}
                        </span>
                      </td>
                      <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => setSelectedApp(app)} 
                            style={viewDetailsBtnStyle}
                          >
                            Review <ChevronRight size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============ PIPELINE DRAWER FOR REVIEW ============ */}
      {selectedApp && (
        (() => {
          const candidate = candidates.find(c => c.id === selectedApp.candidateId);
          const job = jobs.find(j => j.id === selectedApp.jobId);
          
          return (
            <div style={drawerOverlayStyle} onClick={() => setSelectedApp(null)}>
              <div style={drawerContentStyle} className="glass-card" onClick={(e) => e.stopPropagation()}>
                <div style={drawerHeaderStyle}>
                  <div>
                    <span className="badge badge-accent">Applicant Profile Review</span>
                    <h2 style={{ fontSize: '1.4rem', marginTop: '8px' }}>{candidate?.name}</h2>
                    <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>Applying for: <strong>{job?.title}</strong></p>
                  </div>
                  <button onClick={() => setSelectedApp(null)} style={closeDrawerBtnStyle}>&times;</button>
                </div>

                <div style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '4px', marginBottom: '20px' }}>
                  {/* Contact row */}
                  <div style={contactRowStyle}>
                    <p><strong>Email:</strong> {candidate?.email}</p>
                    <p><strong>Phone:</strong> {candidate?.phone}</p>
                  </div>

                  {/* AI Assistant Insight Box */}
                  <div style={aiReportBoxStyle}>
                    <div style={aiReportHeaderStyle}>
                      <BrainCircuit size={18} color="hsl(var(--primary))" />
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>AI Assistant Core Matching Feed</h4>
                      <span style={aiReportScoreStyle}>{selectedApp.aiMatchScore}% Match</span>
                    </div>
                    <p style={aiReportDescStyle}>{selectedApp.aiFeedback}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', alignSelf: 'center' }}>Extracted Skills:</span>
                      {selectedApp.aiKeywordsExtracted.map((key) => (
                        <span key={key} style={keywordBadgeStyle}>{key}</span>
                      ))}
                    </div>
                  </div>

                  <h4 style={sectionTitleStyle}>Candidate Qualifications</h4>
                  <div style={infoGridStyle}>
                    <div style={infoBoxStyle}>
                      <span style={infoLabelStyle}>Experience Profile</span>
                      <p style={infoValueStyle}>{candidate?.experience}</p>
                    </div>
                    <div style={infoBoxStyle}>
                      <span style={infoLabelStyle}>Education</span>
                      <p style={infoValueStyle}>{candidate?.education}</p>
                    </div>
                    <div style={infoBoxStyle}>
                      <span style={infoLabelStyle}>Candidate Self-Reported Skills</span>
                      <p style={infoValueStyle}>{candidate?.skills}</p>
                    </div>
                    <div style={infoBoxStyle}>
                      <span style={infoLabelStyle}>Uploaded Resume Attachment</span>
                      <div style={resumeLineStyle}>
                        <FileText size={14} color="hsl(var(--accent))" />
                        <span style={{ fontSize: '0.8rem' }}>{candidate?.resumeFileName}</span>
                      </div>
                    </div>
                  </div>

                  {selectedApp.screeningNotes && (
                    <div style={{ marginTop: '16px' }}>
                      <h4 style={sectionTitleStyle}>Recruitment Activity Log</h4>
                      <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '4px', border: '1px solid hsl(var(--border))' }}>
                        {selectedApp.screeningNotes}
                      </p>
                    </div>
                  )}

                  <div style={dividerStyle} />

                  {/* Actions Area */}
                  <h4 style={sectionTitleStyle}>Hiring Pipeline Decision</h4>
                  
                  <div className="form-group" style={{ marginTop: '10px' }}>
                    <label className="form-label">Review/Evaluation Notes</label>
                    <textarea 
                      className="form-textarea" 
                      rows={2} 
                      placeholder="Add screening comments, feedback, or justification..."
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                    />
                  </div>

                  <div style={actionButtonGroupStyle}>
                    <button 
                      onClick={() => handleStatusChange(selectedApp.id, 'Rejected')}
                      style={rejectBtnStyle}
                    >
                      <X size={16} /> Reject Candidate
                    </button>
                    
                    {selectedApp.status === 'Screening' && (
                      <button 
                        onClick={() => {
                          // Save notes, then redirect to Schedule Interviews
                          updateApplicationStatus(selectedApp.id, 'Interviewing', actionNotes || 'Passed screening check.');
                          setActionNotes('');
                          setSelectedApp(null);
                          navigate('/recruiter/interviews');
                        }}
                        style={scheduleBtnStyle}
                      >
                        <Calendar size={16} /> Book Interview
                      </button>
                    )}

                    {selectedApp.status === 'Score Card' && (
                      <button 
                        onClick={() => handleStatusChange(selectedApp.id, 'Accepted')}
                        style={hireBtnStyle}
                      >
                        <Check size={16} /> Extend Offer / Accept
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
}

// Styles
const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
};

const kpiGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '20px',
  marginBottom: '24px',
};

const kpiCardStyle = {
  padding: '20px',
};

const kpiHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
};

const kpiValueStyle = {
  fontSize: '2rem',
  fontWeight: '800',
  color: 'white',
  lineHeight: '1',
};

const kpiLabelStyle = {
  fontSize: '0.85rem',
  color: 'hsl(var(--text-secondary))',
  fontWeight: '500',
};

const filterRowStyle = {
  display: 'grid',
  gridTemplateColumns: '2fr 1.5fr',
  gap: '16px',
  padding: '16px',
  marginBottom: '24px',
  alignItems: 'center',
};

const searchFieldStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  background: 'hsl(var(--bg-secondary))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 'var(--radius-sm)',
  padding: '0 16px',
  height: '42px',
};

const searchInputStyle = {
  background: 'transparent',
  border: 'none',
  color: 'white',
  width: '100%',
  outline: 'none',
  fontSize: '0.9rem',
};

const selectFieldStyle = {
  height: '42px',
  width: '160px',
};

const selectInputStyle = {
  background: 'hsl(var(--bg-secondary))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 'var(--radius-sm)',
  color: 'white',
  width: '100%',
  height: '100%',
  padding: '0 12px',
  outline: 'none',
  cursor: 'pointer',
  fontSize: '0.85rem',
};

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
  cursor: 'pointer',
  transition: 'background 0.2s',
};

const tdStyle = {
  padding: '16px 24px',
  fontSize: '0.9rem',
  color: 'hsl(var(--text-secondary))',
};

const emptyTdStyle = {
  padding: '40px 24px',
  textAlign: 'center',
  color: 'hsl(var(--text-muted))',
};

const aiIndicatorContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const aiScoreStyle = (score) => ({
  fontWeight: '700',
  color: score > 85 ? 'hsl(var(--success))' : 'hsl(var(--primary))',
  fontSize: '0.85rem',
});

const miniMeterStyle = {
  width: '60px',
  height: '4px',
  backgroundColor: 'hsl(var(--border))',
  borderRadius: '99px',
  overflow: 'hidden',
};

const miniMeterFillStyle = {
  height: '100%',
};

const viewDetailsBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  background: 'transparent',
  border: '1px solid hsl(var(--border))',
  color: 'white',
  padding: '6px 12px',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.8rem',
  cursor: 'pointer',
  transition: 'border-color 0.2s',
};

// Drawer style reuse candidate portal structures
const drawerOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'flex-end',
};

const drawerContentStyle = {
  width: '550px',
  height: '100%',
  backgroundColor: 'hsl(var(--bg-secondary))',
  borderLeft: '1px solid hsl(var(--border))',
  borderRadius: '0',
  padding: '40px 32px',
  display: 'flex',
  flexDirection: 'column',
  animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
};

const drawerHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '24px',
};

const closeDrawerBtnStyle = {
  background: 'transparent',
  border: 'none',
  color: 'hsl(var(--text-muted))',
  fontSize: '2rem',
  cursor: 'pointer',
  lineHeight: '0.8',
};

const contactRowStyle = {
  display: 'flex',
  gap: '20px',
  fontSize: '0.85rem',
  color: 'hsl(var(--text-secondary))',
  marginBottom: '20px',
  background: 'rgba(255,255,255,0.02)',
  padding: '10px 14px',
  borderRadius: '4px',
  border: '1px solid hsl(var(--border))',
};

const aiReportBoxStyle = {
  background: 'hsl(var(--primary) / 0.05)',
  border: '1px solid hsl(var(--primary) / 0.2)',
  borderRadius: 'var(--radius-sm)',
  padding: '16px',
  marginBottom: '24px',
};

const aiReportHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '10px',
};

const aiReportScoreStyle = {
  marginLeft: 'auto',
  fontSize: '0.8rem',
  fontWeight: '700',
  color: 'hsl(var(--primary))',
  backgroundColor: 'hsl(var(--primary) / 0.1)',
  padding: '2px 8px',
  borderRadius: '4px',
};

const aiReportDescStyle = {
  fontSize: '0.85rem',
  color: 'hsl(var(--text-secondary))',
  lineHeight: '1.5',
};

const keywordBadgeStyle = {
  background: 'hsl(var(--border))',
  color: 'hsl(var(--text-secondary))',
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '0.7rem',
};

const sectionTitleStyle = {
  fontSize: '0.85rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'hsl(var(--accent))',
  marginBottom: '12px',
  marginTop: '20px',
};

const infoGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
};

const infoBoxStyle = {
  background: 'rgba(255, 255, 255, 0.01)',
  border: '1px solid hsl(var(--border))',
  borderRadius: 'var(--radius-sm)',
  padding: '12px',
};

const infoLabelStyle = {
  fontSize: '0.75rem',
  color: 'hsl(var(--text-muted))',
  display: 'block',
  marginBottom: '4px',
};

const infoValueStyle = {
  fontSize: '0.85rem',
  color: 'white',
  fontWeight: '500',
};

const resumeLineStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  color: 'hsl(var(--accent))',
};

const dividerStyle = {
  height: '1px',
  backgroundColor: 'hsl(var(--border))',
  margin: '20px 0',
};

const actionButtonGroupStyle = {
  display: 'flex',
  gap: '12px',
  marginTop: '16px',
};

const rejectBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  flex: '1',
  background: 'transparent',
  border: '1px solid hsl(var(--danger) / 0.4)',
  color: 'hsl(var(--danger))',
  padding: '12px',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.85rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background 0.2s',
};

const scheduleBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  flex: '1.5',
  background: 'hsl(var(--primary))',
  color: 'white',
  border: 'none',
  padding: '12px',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.85rem',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: '0 4px 12px hsl(var(--primary) / 0.2)',
};

const hireBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  flex: '1.5',
  background: 'hsl(var(--success))',
  color: 'white',
  border: 'none',
  padding: '12px',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.85rem',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: '0 4px 12px hsl(var(--success) / 0.2)',
};
