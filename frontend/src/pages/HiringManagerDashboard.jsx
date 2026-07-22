import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  CheckSquare, Award, Star, User, Calendar, 
  Sparkles, FileText, Send, Check, X, ShieldAlert, Loader 
} from 'lucide-react';

export default function HiringManagerDashboard() {
  const { currentUser } = useApp();

  // Selected candidate for active scorecard submission/review
  const [selectedAppId, setSelectedAppId] = useState('');

  // Form states for scoring
  const [interviewerName, setInterviewerName] = useState('Sarah Jenkins');
  const [skillsScore, setSkillsScore] = useState(4);
  const [cultureScore, setCultureScore] = useState(4);
  const [communicationScore, setCommunicationScore] = useState(4);
  const [recommendation, setRecommendation] = useState('Hire');
  const [notes, setNotes] = useState('');

  // ── Real API State ──
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsData, appsData] = await Promise.all([
        api.getJobs(),
        api.getAllApplications().catch(() => [])
      ]);
      setJobs(jobsData);
      setApplications(appsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  // Filter candidates in the "Interviewing" or "Score Card" phase
  const shortlistedApps = applications.filter(
    (app) => app.status === 'Interviewing' || app.status === 'Score Card' || app.status === 'Accepted'
  );

  const activeApp = applications.find(a => a.id === selectedAppId) || shortlistedApps[0];
  const candidateName = activeApp ? `Candidate #${activeApp.candidateId}` : '';
  const job = activeApp ? jobs.find(j => j.id === activeApp.jobId) : null;
  const existingEval = activeApp ? evaluations.find(e => e.applicationId === activeApp.id) : null;

  React.useEffect(() => {
    if (activeApp?.id && (activeApp.status === 'Score Card' || activeApp.status === 'Accepted')) {
      api.getEvaluationsForApplication(activeApp.id)
        .then(data => setEvaluations(prev => {
          const others = prev.filter(e => e.applicationId !== activeApp.id);
          return [...others, ...(Array.isArray(data) ? data : [])];
        }))
        .catch(console.error);
    }
  }, [activeApp?.id, activeApp?.status]);

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    const idToSubmit = selectedAppId || activeApp?.id;
    if (!idToSubmit) {
      alert('Please select an applicant to score.');
      return;
    }
    if (!notes) {
      alert('Please add qualitative evaluation notes.');
      return;
    }

    try {
      await api.submitEvaluation({
        applicationId: idToSubmit,
        interviewerName,
        skillsScore: parseFloat(skillsScore),
        cultureScore: parseFloat(cultureScore),
        communicationScore: parseFloat(communicationScore),
        recommendation,
        notes
      });
      
      try {
        await api.sendEmail(`candidate${idToSubmit}@hiretrax.local`, 'Assessment Scorecard Submitted', `Your application has moved to the Score Card stage. Recommendation: ${recommendation}`);
      } catch (err) {
        console.warn('Failed to send email notification:', err);
      }

      alert('Candidate scorecard submitted successfully! Status has been updated.');
      setNotes('');
      await loadData();
    } catch (err) {
      alert('Failed to submit score: ' + err.message);
    }
  };

  const handleFinalDecision = async (status) => {
    if (window.confirm(`Are you sure you want to move this candidate to "${status}"?`)) {
      try {
        const idToSubmit = selectedAppId || activeApp?.id;
        await api.updateApplicationStatus(idToSubmit, { status: status, notes: `Hiring Manager Final Decision: ${status}.` });
        
        try {
          await api.sendEmail(`candidate${idToSubmit}@hiretrax.local`, 'Application Status Update', `Your application status has been updated to: ${status}`);
        } catch (err) {
          console.warn('Failed to send email notification:', err);
        }

        alert(`Candidate has been moved to ${status}.`);
        await loadData();
      } catch (err) {
        alert('Failed to update status: ' + err.message);
      }
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '16px' }}>
      <Loader size={40} color="hsl(var(--primary))" style={{ animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'hsl(var(--text-muted))' }}>Loading Dashboard Data...</p>
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={headerInfoStyle}>
        <h2>Hiring Manager Assessment Console</h2>
        <p>Submit scores, review AI screening recommendations, and manage final job offers.</p>
      </div>

      {shortlistedApps.length === 0 ? (
        <div className="glass-card" style={emptyCardStyle}>
          <CheckSquare size={40} color="hsl(var(--text-muted))" style={{ marginBottom: '12px' }} />
          <h3>No Shortlisted Candidates</h3>
          <p>Once recruiters move applicants past screening and schedule interviews, they will appear here for evaluation.</p>
        </div>
      ) : (
        <div style={splitLayoutStyle}>
          {/* Left Column: Shortlist Selection Grid */}
          <div className="glass-card" style={shortlistCardStyle}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Shortlisted Applicants</h3>
            <div style={shortlistContainerStyle}>
              {shortlistedApps.map((app) => {
                const candName = `Candidate #${app.candidateId}`;
                const j = jobs.find(jobItem => jobItem.id === app.jobId);
                const hasScorecard = evaluations.some(e => e.applicationId === app.id);
                const isSelected = activeApp?.id === app.id;

                return (
                  <div 
                    key={app.id} 
                    onClick={() => setSelectedAppId(app.id)}
                    style={isSelected ? activeShortlistItemStyle : shortlistItemStyle}
                    className="glass-card-interactive"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{candName}</h4>
                      {hasScorecard || app.status === 'Score Card' || app.status === 'Accepted' ? (
                        <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>Scored</span>
                      ) : (
                        <span className="badge badge-warning" style={{ fontSize: '0.6rem' }}>Pending</span>
                      )}
                    </div>
                    
                    <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', marginTop: '4px' }}>
                      {j?.title}
                    </p>
                    
                    <div style={metaRowStyle}>
                      <span style={scoreTextStyle}>AI Match: {app.aiMatchScore}%</span>
                      <span style={{ color: 'hsl(var(--text-muted))' }}>•</span>
                      <span style={{ color: 'hsl(var(--accent))', fontWeight: '600' }}>{app.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Scorecard / Decision Area */}
          {activeApp ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Candidate Info Overview */}
              <div className="glass-card" style={detailsCardStyle}>
                <div style={detailsHeaderStyle}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem' }}>{candidateName}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>
                      Target Role: <strong>{job?.title}</strong> ({job?.department})
                    </p>
                  </div>
                  <div className="badge badge-primary">
                    <Sparkles size={12} />
                    <span>{activeApp.aiMatchScore}% AI Match</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '20px 0' }}>
                  <div>
                    <span style={infoLabelStyle}>Technical Experience</span>
                    <p style={infoValueStyle}>Check CV / Resume</p>
                  </div>
                  <div>
                    <span style={infoLabelStyle}>Applied On</span>
                    <p style={infoValueStyle}>
                      {new Date(activeApp.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div style={resumeAttachedStyle}>
                  <FileText size={16} color="hsl(var(--accent))" />
                  <span style={{ fontSize: '0.85rem', flexGrow: 1 }}>{activeApp.resumeFileName || 'resume.pdf'}</span>
                  {activeApp.resumeUrl ? (
                    <a href={`http://localhost:5027${activeApp.resumeUrl}`} target="_blank" rel="noopener noreferrer" style={viewLinkStyle}>View Resume</a>
                  ) : (
                    <a href={`#`} onClick={(e) => { e.preventDefault(); alert('Resume file not uploaded or synced.'); }} style={viewLinkStyle}>No Resume</a>
                  )}
                </div>
              </div>

              {/* Scorecard Block */}
              {existingEval ? (
                /* VIEW SUBMITTED SCORECARD */
                <div className="glass-card" style={evalCardStyle}>
                  <div style={scorecardHeaderStyle}>
                    <Award size={20} color="hsl(var(--success))" />
                    <h3 style={{ fontSize: '1.1rem' }}>Submitted Evaluation Card</h3>
                    <span style={compositeScoreBadgeStyle}>{existingEval.overallScore} / 5</span>
                  </div>

                  <div style={ratingsDisplayRowStyle}>
                    <div style={ratingDisplayBoxStyle}>
                      <span style={infoLabelStyle}>Technical Skills</span>
                      <div style={starsRowStyle}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < existingEval.skillsScore ? 'hsl(var(--accent))' : 'transparent'} color={i < existingEval.skillsScore ? 'hsl(var(--accent))' : 'hsl(var(--border))'} />
                        ))}
                      </div>
                    </div>

                    <div style={ratingDisplayBoxStyle}>
                      <span style={infoLabelStyle}>Cultural Alignment</span>
                      <div style={starsRowStyle}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < existingEval.cultureScore ? 'hsl(var(--accent))' : 'transparent'} color={i < existingEval.cultureScore ? 'hsl(var(--accent))' : 'hsl(var(--border))'} />
                        ))}
                      </div>
                    </div>

                    <div style={ratingDisplayBoxStyle}>
                      <span style={infoLabelStyle}>Communication</span>
                      <div style={starsRowStyle}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < existingEval.communicationScore ? 'hsl(var(--accent))' : 'transparent'} color={i < existingEval.communicationScore ? 'hsl(var(--accent))' : 'hsl(var(--border))'} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={notesBlockStyle}>
                    <span style={infoLabelStyle}>Panel Recommendation</span>
                    <p style={{ fontWeight: '700', fontSize: '1rem', color: existingEval.recommendation?.includes('No') ? 'hsl(var(--danger))' : 'hsl(var(--success))' }}>
                      {existingEval.recommendation || 'N/A'}
                    </p>
                    <span style={{ ...infoLabelStyle, marginTop: '12px' }}>Interview Assessment Notes</span>
                    <p style={notesTextDetailStyle}>{existingEval.notes}</p>
                    <span style={{ ...infoLabelStyle, marginTop: '8px' }}>Submitted By: {existingEval.interviewerName}</span>
                  </div>

                  {/* Hiring Decision Controls */}
                  {activeApp.status === 'Score Card' && (
                    <div style={decisionAreaStyle}>
                      <div style={navDividerStyle} />
                      <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'hsl(var(--accent))' }}>Hiring Director Verdict</h4>
                      <div style={decisionBtnsStyle}>
                        <button onClick={() => handleFinalDecision('Rejected')} style={decRejectBtnStyle}>
                          <X size={16} /> Reject Candidate
                        </button>
                        <button onClick={() => handleFinalDecision('Accepted')} style={decAcceptBtnStyle}>
                          <Check size={16} /> Extend Official Offer
                        </button>
                      </div>
                    </div>
                  )}

                  {activeApp.status === 'Accepted' && (
                    <div style={{ marginTop: '20px', padding: '16px', background: 'hsl(var(--success) / 0.1)', border: '1px solid hsl(var(--success) / 0.3)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--success))', fontWeight: '700' }}>
                        <Check size={18} /> Official Offer Extended
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginTop: '4px' }}>
                        The candidate has been selected for the position. An email notification has been sent to the applicant.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* SUBMIT NEW SCORECARD */
                <form onSubmit={handleScoreSubmit} className="glass-card" style={evalCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <Star size={20} color="hsl(var(--primary))" />
                    <h3 style={{ fontSize: '1.1rem' }}>Submit Interview Scorecard</h3>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Interviewer Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      value={interviewerName} 
                      onChange={(e) => setInterviewerName(e.target.value)} 
                    />
                  </div>

                  {/* Sliders */}
                  <div style={slidersContainerStyle}>
                    <div style={sliderItemStyle}>
                      <div style={sliderHeaderStyle}>
                        <label className="form-label">Technical Competencies *</label>
                        <span style={sliderValueStyle}>{skillsScore} / 5</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        step="0.5" 
                        style={rangeInputStyle}
                        value={skillsScore} 
                        onChange={(e) => setSkillsScore(e.target.value)} 
                      />
                    </div>

                    <div style={sliderItemStyle}>
                      <div style={sliderHeaderStyle}>
                        <label className="form-label">Cultural Alignment *</label>
                        <span style={sliderValueStyle}>{cultureScore} / 5</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        step="0.5" 
                        style={rangeInputStyle}
                        value={cultureScore} 
                        onChange={(e) => setCultureScore(e.target.value)} 
                      />
                    </div>

                    <div style={sliderItemStyle}>
                      <div style={sliderHeaderStyle}>
                        <label className="form-label">Communication & Collaboration *</label>
                        <span style={sliderValueStyle}>{communicationScore} / 5</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        step="0.5" 
                        style={rangeInputStyle}
                        value={communicationScore} 
                        onChange={(e) => setCommunicationScore(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hiring Recommendation *</label>
                    <select 
                      className="form-select" 
                      value={recommendation} 
                      onChange={(e) => setRecommendation(e.target.value)}
                    >
                      <option value="Strong Hire">Strong Hire (High Priority)</option>
                      <option value="Hire">Hire</option>
                      <option value="Hold">Hold / Re-evaluate</option>
                      <option value="No Hire">No Hire (Reject)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Evaluation Summary & Justification *</label>
                    <textarea 
                      className="form-textarea" 
                      rows={3} 
                      required
                      placeholder="Discuss candidate strengths, core concerns, and overall architecture comprehension..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div style={formFooterStyle}>
                    <button type="submit" style={submitScorecardBtnStyle}>
                      Submit Assessment Scorecard
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="glass-card" style={emptyCardStyle}>
              <User size={30} />
              <p>Select a candidate from the list to begin review.</p>
            </div>
          )}
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

const emptyCardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 40px',
  textAlign: 'center',
};

const splitLayoutStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 2fr',
  gap: '24px',
};

const shortlistCardStyle = {
  height: 'calc(100vh - 200px)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const shortlistContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  overflowY: 'auto',
  flexGrow: 1,
};

const shortlistItemStyle = {
  padding: '14px',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid hsl(var(--border))',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const activeShortlistItemStyle = {
  ...shortlistItemStyle,
  background: 'hsl(var(--primary) / 0.08)',
  borderColor: 'hsl(var(--primary) / 0.4)',
};

const metaRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.75rem',
  marginTop: '8px',
};

const scoreTextStyle = {
  color: 'hsl(var(--text-muted))',
  fontWeight: '500',
};

const detailsCardStyle = {
  padding: '24px',
};

const detailsHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '12px',
};

const infoLabelStyle = {
  fontSize: '0.75rem',
  color: 'hsl(var(--text-muted))',
  display: 'block',
  marginBottom: '4px',
};

const infoValueStyle = {
  fontSize: '0.9rem',
  color: 'white',
  fontWeight: '600',
};

const resumeAttachedStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  background: 'hsl(var(--bg-primary))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 'var(--radius-sm)',
  padding: '12px',
};

const viewLinkStyle = {
  fontSize: '0.8rem',
  color: 'hsl(var(--accent))',
  fontWeight: '600',
};

const evalCardStyle = {
  padding: '24px',
};

const scorecardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '20px',
};

const compositeScoreBadgeStyle = {
  marginLeft: 'auto',
  fontSize: '1.1rem',
  fontWeight: '800',
  color: 'hsl(var(--accent))',
  background: 'hsl(var(--accent) / 0.1)',
  padding: '4px 12px',
  borderRadius: '6px',
  border: '1px solid hsl(var(--accent) / 0.2)',
};

const ratingsDisplayRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '12px',
  marginBottom: '20px',
};

const ratingDisplayBoxStyle = {
  background: 'rgba(255,255,255,0.01)',
  border: '1px solid hsl(var(--border))',
  padding: '12px',
  borderRadius: 'var(--radius-sm)',
  textAlign: 'center',
};

const starsRowStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '4px',
  marginTop: '4px',
};

const notesBlockStyle = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid hsl(var(--border))',
  padding: '16px',
  borderRadius: 'var(--radius-sm)',
};

const notesTextDetailStyle = {
  fontSize: '0.9rem',
  color: 'hsl(var(--text-secondary))',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap',
  marginTop: '4px',
};

const slidersContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginBottom: '20px',
};

const sliderItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const sliderHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const sliderValueStyle = {
  fontSize: '0.85rem',
  fontWeight: '700',
  color: 'white',
};

const rangeInputStyle = {
  width: '100%',
  accentColor: 'hsl(var(--primary))',
  cursor: 'pointer',
};

const formFooterStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
};

const submitScorecardBtnStyle = {
  background: 'hsl(var(--primary))',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: 'var(--radius-sm)',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 4px 12px hsl(var(--primary) / 0.2)',
};

const decisionAreaStyle = {
  marginTop: '20px',
};

const navDividerStyle = {
  height: '1px',
  backgroundColor: 'hsl(var(--border))',
  margin: '16px 0',
};

const decisionBtnsStyle = {
  display: 'flex',
  gap: '12px',
};

const decRejectBtnStyle = {
  flex: '1',
  background: 'transparent',
  border: '1px solid hsl(var(--danger) / 0.4)',
  color: 'hsl(var(--danger))',
  padding: '12px',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.85rem',
  fontWeight: '600',
  cursor: 'pointer',
};

const decAcceptBtnStyle = {
  flex: '1.5',
  background: 'hsl(var(--success))',
  color: 'white',
  border: 'none',
  padding: '12px',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.85rem',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 4px 12px hsl(var(--success) / 0.2)',
};
