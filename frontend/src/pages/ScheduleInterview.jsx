import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Calendar, Users, Video, Clock, ArrowLeft, Plus, Check } from 'lucide-react';

export default function ScheduleInterview() {
  const { applications, candidates, jobs, schedules, scheduleInterview } = useApp();
  const navigate = useNavigate();

  // Form states
  const [appId, setAppId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [type, setType] = useState('Technical Interview');
  const [interviewer, setInterviewer] = useState('');
  const [meetingLink, setMeetingLink] = useState('https://teams.microsoft.com/l/meetup-join/hiretrax-session');

  // Filter candidates who are active in the system
  const activeApplications = applications.filter(a => a.status === 'Screening' || a.status === 'Interviewing');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!appId || !dateTime || !interviewer) {
      alert('Please fill out all required fields.');
      return;
    }

    scheduleInterview({
      applicationId: appId,
      dateTime,
      type,
      interviewerName: interviewer,
      link: meetingLink
    });

    alert('Interview scheduled successfully! Meeting invites and calendars have been synced.');
    
    // Clear form
    setAppId('');
    setDateTime('');
    setInterviewer('');
  };

  return (
    <div style={containerStyle}>
      <div style={headerRowStyle}>
        <button onClick={() => navigate('/')} style={backBtnStyle}>
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h2>Interview Scheduler & Calendars</h2>
          <p>Book video conferences, assign technical panels, and check candidate availability.</p>
        </div>
      </div>

      <div style={splitLayoutStyle}>
        {/* Left Column: Booking Form */}
        <form onSubmit={handleSubmit} className="glass-card" style={formCardStyle}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Book New Session</h3>

          <div className="form-group">
            <label className="form-label">Select Candidate Application *</label>
            <select 
              className="form-select" 
              required
              value={appId} 
              onChange={(e) => setAppId(e.target.value)}
            >
              <option value="">-- Choose Candidate --</option>
              {activeApplications.map((app) => {
                const cand = candidates.find(c => c.id === app.candidateId);
                const job = jobs.find(j => j.id === app.jobId);
                return (
                  <option key={app.id} value={app.id}>
                    {cand?.name} - {job?.title} (Fit: {app.aiMatchScore}%)
                  </option>
                );
              })}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Date & Time *</label>
              <input 
                type="datetime-local" 
                className="form-input" 
                required
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Interview Type *</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Technical Interview">Technical Interview</option>
                <option value="System Architecture Review">System Architecture Review</option>
                <option value="UI/UX Portfolio Review">UI/UX Portfolio Review</option>
                <option value="Culture Fit Check">Culture Fit Check</option>
                <option value="HR Final Screening">HR Final Screening</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Interviewer / Panel Members *</label>
            <input 
              type="text" 
              className="form-input" 
              required
              placeholder="e.g. Sarah Jenkins (Lead Developer)"
              value={interviewer} 
              onChange={(e) => setInterviewer(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Conferencing Meeting Link</label>
            <input 
              type="url" 
              className="form-input" 
              placeholder="MS Teams, Google Meet, or Zoom Link"
              value={meetingLink} 
              onChange={(e) => setMeetingLink(e.target.value)} 
            />
          </div>

          <div style={formFooterStyle}>
            <button type="submit" style={submitBtnStyle}>
              Confirm Interview Booking
            </button>
          </div>
        </form>

        {/* Right Column: Active Schedule List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={listCardStyle}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Active Schedules</h3>

            {schedules.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', textAlign: 'center', padding: '20px 0' }}>
                No active interviews currently scheduled.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {schedules.map((sch) => {
                  const app = applications.find(a => a.id === sch.applicationId);
                  const cand = candidates.find(c => c.id === app?.candidateId);
                  const job = jobs.find(j => j.id === app?.jobId);
                  
                  return (
                    <div key={sch.id} style={scheduleItemStyle}>
                      <div style={scheduleIconStyle}>
                        <Video size={16} color="hsl(var(--accent))" />
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>{cand?.name || 'Candidate'}</h4>
                          <span className={`badge ${sch.status === 'Completed' ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.65rem' }}>
                            {sch.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', marginTop: '2px' }}>
                          {job?.title} | {sch.type}
                        </p>
                        <div style={timeRowStyle}>
                          <Clock size={12} />
                          <span>{new Date(sch.dateTime).toLocaleString()}</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '4px' }}>
                          Panel: {sch.interviewerName}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
};

const headerRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '24px',
};

const backBtnStyle = {
  background: 'transparent',
  border: '1px solid hsl(var(--border))',
  color: 'white',
  padding: '8px 16px',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.85rem',
  transition: 'border-color 0.2s',
};

const splitLayoutStyle = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 1fr',
  gap: '24px',
};

const formCardStyle = {
  padding: '30px',
};

const formFooterStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '10px',
};

const submitBtnStyle = {
  background: 'hsl(var(--primary))',
  color: 'white',
  border: 'none',
  padding: '12px 30px',
  borderRadius: 'var(--radius-sm)',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 4px 12px hsl(var(--primary) / 0.2)',
};

const listCardStyle = {
  height: 'fit-content',
};

const scheduleItemStyle = {
  display: 'flex',
  gap: '14px',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid hsl(var(--border))',
  borderRadius: 'var(--radius-sm)',
  padding: '14px',
};

const scheduleIconStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: 'hsl(var(--accent) / 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const timeRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.75rem',
  color: 'hsl(var(--text-muted))',
  marginTop: '6px',
};
