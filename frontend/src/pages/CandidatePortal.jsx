import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, Briefcase, MapPin, DollarSign, Upload, 
  CheckCircle, ArrowRight, ShieldCheck, Sparkles, FileText, BrainCircuit, ExternalLink
} from 'lucide-react';

export default function CandidatePortal() {
  const { jobs, candidates, applications, activeCandidateId, applyToJob, schedules } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('jobs'); // 'jobs', 'tracker', 'profile'
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  // Selected job for application drawer
  const [selectedJob, setSelectedJob] = useState(null);

  // Resume Upload Simulation
  const [isParsing, setIsParsing] = useState(false);
  const [parsedMsg, setParsedMsg] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Profile Form state
  const currentCandidate = candidates.find((c) => c.id === activeCandidateId) || candidates[0];
  const [profileName, setProfileName] = useState(currentCandidate?.name || '');
  const [profileEmail, setProfileEmail] = useState(currentCandidate?.email || '');
  const [profilePhone, setProfilePhone] = useState(currentCandidate?.phone || '');
  const [profileSkills, setProfileSkills] = useState(currentCandidate?.skills || '');
  const [profileExp, setProfileExp] = useState(currentCandidate?.experience || '');
  const [profileEdu, setProfileEdu] = useState(currentCandidate?.education || '');

  // Calculate recommendation badge
  const isRecommended = (job, skillsText) => {
    if (!skillsText) return false;
    const skills = skillsText.toLowerCase();
    const matches = job.aiPreferredSkills.filter(s => skills.includes(s.toLowerCase()));
    return matches.length >= 2;
  };

  const getMatchScore = (job, skillsText) => {
    if (!skillsText) return 50;
    const skills = skillsText.toLowerCase();
    const matches = job.aiPreferredSkills.filter(s => skills.includes(s.toLowerCase()));
    const base = 50;
    return base + (matches.length * 10 > 40 ? 40 : matches.length * 10);
  };

  // Simulating the AI parsing engine
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsParsing(true);
    setUploadProgress(10);
    setParsedMsg('Uploading CV...');

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // AI Analysis logic simulation
            let skillsDetected = '';
            let expDetected = '';
            
            const nameLower = file.name.toLowerCase();
            if (nameLower.includes('alice') || nameLower.includes('developer')) {
              skillsDetected = 'C#, ASP.NET Core, EF Core, SQL Server, React, Docker, Git, CI/CD';
              expDetected = '5 Years - Software Engineer at TechCorp';
            } else if (nameLower.includes('bob') || nameLower.includes('ai') || nameLower.includes('nlp')) {
              skillsDetected = 'Python, PyTorch, LLMs, NLP, Vector DBs, FastAPI, Docker';
              expDetected = '3 Years - Junior AI Engineer at DeepNLP';
            } else {
              skillsDetected = 'HTML5, CSS3, JavaScript, React, Figma, UI/UX Design, Node.js';
              expDetected = '4 Years - Frontend Web Engineer at WebStudio';
            }

            setProfileSkills(skillsDetected);
            setProfileExp(expDetected);
            setIsParsing(false);
            setParsedMsg('AI parsing completed! Detected matching skills and updated profile forms.');
          }, 600);
          return 100;
        }
        return prev + 30;
      });
    }, 400);
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    const resumeFake = { name: currentCandidate?.resumeFileName || 'Uploaded_CV.pdf' };
    const candData = {
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      skills: profileSkills,
      experience: profileExp,
      education: profileEdu
    };

    applyToJob(selectedJob.id, candData, resumeFake);
    setSelectedJob(null);
    setActiveSubTab('tracker'); // Jump to application tracker
  };

  const departments = ['All', ...new Set(jobs.map((j) => j.department))];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || job.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const myApps = applications.filter((app) => app.candidateId === activeCandidateId);

  return (
    <div style={containerStyle}>
      {/* Sub Tabs Toggle */}
      <div style={subTabsContainerStyle}>
        <button 
          onClick={() => setActiveSubTab('jobs')} 
          style={activeSubTab === 'jobs' ? activeSubTabStyle : subTabStyle}
        >
          <Briefcase size={16} />
          <span>Job Finder</span>
        </button>
        <button 
          onClick={() => setActiveSubTab('tracker')} 
          style={activeSubTab === 'tracker' ? activeSubTabStyle : subTabStyle}
        >
          <FileText size={16} />
          <span>My Applications ({myApps.length})</span>
        </button>
        <button 
          onClick={() => setActiveSubTab('profile')} 
          style={activeSubTab === 'profile' ? activeSubTabStyle : subTabStyle}
        >
          <BrainCircuit size={16} />
          <span>AI Resume & Profile</span>
        </button>
      </div>

      {/* View Content */}
      <div style={{ position: 'relative' }}>
        {/* ============ TAB 1: JOB FINDER ============ */}
        {activeSubTab === 'jobs' && (
          <div>
            <div style={headerInfoStyle}>
              <h2>Find Your Dream AI/Engineering Role</h2>
              <p>Explore openings with instant AI-powered compatibility scores based on your profile.</p>
            </div>

            {/* Search Filters */}
            <div style={searchRowStyle} className="glass-card">
              <div style={searchFieldStyle}>
                <Search size={18} color="hsl(var(--text-muted))" />
                <input 
                  type="text" 
                  placeholder="Search jobs by keywords..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={searchInputStyle}
                />
              </div>
              <div style={selectFieldStyle}>
                <select 
                  value={selectedDept} 
                  onChange={(e) => setSelectedDept(e.target.value)}
                  style={selectInputStyle}
                >
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Jobs Grid */}
            <div style={jobsGridStyle}>
              {filteredJobs.map((job) => {
                const recommended = isRecommended(job, profileSkills);
                const score = getMatchScore(job, profileSkills);
                
                return (
                  <div key={job.id} className="glass-card glass-card-interactive" style={jobCardStyle}>
                    <div style={jobCardHeaderStyle}>
                      <div>
                        <span className="badge badge-accent" style={{ marginBottom: '8px' }}>{job.department}</span>
                        <h3 style={jobCardTitleStyle}>{job.title}</h3>
                      </div>
                      {recommended && (
                        <div className="badge badge-primary animate-float" style={aiBadgeStyle}>
                          <Sparkles size={12} />
                          <span>AI Match Preferred</span>
                        </div>
                      )}
                    </div>
                    
                    <p style={jobCardDescStyle}>{job.description.substring(0, 140)}...</p>

                    <div style={jobMetadataRowStyle}>
                      <span style={metaItemStyle}><MapPin size={14} /> {job.location}</span>
                      <span style={metaItemStyle}><DollarSign size={14} /> {job.salary}</span>
                    </div>

                    <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))', margin: '16px 0' }} />

                    <div style={jobCardFooterStyle}>
                      <div style={matchMeterContainerStyle}>
                        <span style={matchMeterLabelStyle}>Compatibility Score:</span>
                        <div style={progressBarBgStyle}>
                          <div style={{ ...progressBarFillStyle, width: `${score}%`, backgroundColor: score > 80 ? 'hsl(var(--success))' : 'hsl(var(--primary))' }} />
                        </div>
                        <span style={scoreTextStyle(score)}>{score}% Match</span>
                      </div>

                      <button 
                        onClick={() => setSelectedJob(job)}
                        className="pulse-glow-btn"
                        style={applyBtnStyle}
                      >
                        Apply Now <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============ TAB 2: MY APPLICATIONS TRACKER ============ */}
        {activeSubTab === 'tracker' && (
          <div>
            <div style={headerInfoStyle}>
              <h2>Application Tracking Dashboard</h2>
              <p>Monitor your progress, review automated screening reports, and view scheduled interview slots.</p>
            </div>

            {myApps.length === 0 ? (
              <div className="glass-card" style={emptyCardStyle}>
                <Briefcase size={40} color="hsl(var(--text-muted))" style={{ marginBottom: '12px' }} />
                <h3>No Applications Yet</h3>
                <p>Browse the job finder tab above to submit your credentials to active roles.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {myApps.map((app) => {
                  const job = jobs.find((j) => j.id === app.jobId);
                  const matchingSchedule = schedules.find(s => s.applicationId === app.id);
                  
                  return (
                    <div key={app.id} className="glass-card" style={appCardStyle}>
                      <div style={appCardHeaderStyle}>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{job?.title || 'Unknown Role'}</h3>
                          <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>Applied on: {app.date}</p>
                        </div>
                        <div>
                          <span className={`badge ${
                            app.status === 'Accepted' ? 'badge-success' :
                            app.status === 'Rejected' ? 'badge-danger' :
                            app.status === 'Interviewing' ? 'badge-primary' : 'badge-warning'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      </div>

                      {/* Progress Tracker Pipeline */}
                      <div style={trackerPipelineStyle}>
                        {['Applied', 'Screening', 'Interviewing', 'Score Card', 'Decision'].map((stage, idx) => {
                          const stages = ['Applied', 'Screening', 'Interviewing', 'Score Card', 'Accepted', 'Rejected'];
                          const currentIdx = stages.indexOf(app.status);
                          let isActive = idx <= currentIdx;
                          if (app.status === 'Rejected' && idx === 4) isActive = false;
                          
                          return (
                            <div key={stage} style={pipelineStepStyle}>
                              <div style={pipelineCircleStyle(isActive, app.status === 'Rejected' && idx === currentIdx)}>
                                {idx < currentIdx ? <CheckCircle size={14} /> : idx + 1}
                              </div>
                              <span style={pipelineLabelStyle(isActive)}>{stage}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* AI Screening Assessment Card */}
                      <div style={aiReportBoxStyle}>
                        <div style={aiReportHeaderStyle}>
                          <BrainCircuit size={18} color="hsl(var(--primary))" />
                          <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>AI Assistant Screening Analysis</h4>
                          <span style={aiReportScoreStyle}>{app.aiMatchScore}% Score</span>
                        </div>
                        <p style={aiReportDescStyle}>{app.aiFeedback}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginRight: '6px', alignSelf: 'center' }}>Keywords Parsed:</span>
                          {app.aiKeywordsExtracted.map((key) => (
                            <span key={key} style={keywordBadgeStyle}>{key}</span>
                          ))}
                        </div>
                      </div>

                      {/* Interview schedule box if matching */}
                      {matchingSchedule && (
                        <div style={interviewScheduleBoxStyle}>
                          <div>
                            <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'hsl(var(--accent))' }}>Upcoming Scheduled Interview</p>
                            <h4 style={{ fontSize: '1rem', margin: '4px 0' }}>{matchingSchedule.type}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
                              Time: {new Date(matchingSchedule.dateTime).toLocaleString()} | Interviewer: {matchingSchedule.interviewerName}
                            </p>
                          </div>
                          {matchingSchedule.status === 'Scheduled' && (
                            <a 
                              href={matchingSchedule.link} 
                              target="_blank" 
                              rel="noreferrer" 
                              style={joinMeetingBtnStyle}
                            >
                              Join Call <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============ TAB 3: PROFILE BUILDER & RESUME PARSER ============ */}
        {activeSubTab === 'profile' && (
          <div>
            <div style={headerInfoStyle}>
              <h2>AI Profile Builder & Parser</h2>
              <p>Drag your resume below to have our artificial intelligence extract your experience and skills instantly.</p>
            </div>

            <div style={profileSplitStyle}>
              {/* Left Column: Drag & Drop Resume Upload */}
              <div className="glass-card" style={resumeUploadCardStyle}>
                <h3 style={{ marginBottom: '12px' }}>Resume Upload</h3>
                
                <div style={dragDropAreaStyle}>
                  <Upload size={32} color="hsl(var(--primary))" style={{ marginBottom: '12px' }} />
                  <p style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '4px' }}>Drag & Drop CV file here</p>
                  <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginBottom: '16px' }}>Supports PDF or DOCX format</p>
                  
                  <label htmlFor="cv-upload-btn" style={uploadFileBtnStyle}>
                    Choose File
                  </label>
                  <input 
                    type="file" 
                    id="cv-upload-btn" 
                    style={{ display: 'none' }}
                    onChange={handleResumeChange}
                    accept=".pdf,.docx"
                    disabled={isParsing}
                  />
                </div>

                {isParsing && (
                  <div style={parsingLoaderContainerStyle}>
                    <p style={{ fontSize: '0.85rem', marginBottom: '6px', fontWeight: '600' }}>{parsedMsg}</p>
                    <div style={progressBarBgStyle}>
                      <div style={{ ...progressBarFillStyle, width: `${uploadProgress}%`, backgroundColor: 'hsl(var(--primary))' }} />
                    </div>
                  </div>
                )}

                {parsedMsg && !isParsing && (
                  <div style={parsedSuccessContainerStyle}>
                    <ShieldCheck size={18} color="hsl(var(--success))" />
                    <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>{parsedMsg}</p>
                  </div>
                )}
              </div>

              {/* Right Column: Profile Form Details */}
              <div className="glass-card" style={profileFormCardStyle}>
                <h3 style={{ marginBottom: '20px' }}>Professional CV Data</h3>
                
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profileName} 
                    onChange={(e) => setProfileName(e.target.value)} 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={profileEmail} 
                      onChange={(e) => setProfileEmail(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={profilePhone} 
                      onChange={(e) => setProfilePhone(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Academic Degrees / Education</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profileEdu} 
                    placeholder="BSc in Computer Science..."
                    onChange={(e) => setProfileEdu(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Relevant Skills (comma separated)</label>
                  <textarea 
                    className="form-textarea" 
                    rows={2} 
                    value={profileSkills} 
                    onChange={(e) => setProfileSkills(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Professional Experience Summary</label>
                  <textarea 
                    className="form-textarea" 
                    rows={2} 
                    value={profileExp} 
                    onChange={(e) => setProfileExp(e.target.value)} 
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button 
                    onClick={() => {
                      alert('Profile data saved locally! Ready for job applications.');
                      setActiveSubTab('jobs');
                    }}
                    style={saveProfileBtnStyle}
                  >
                    Save & Proceed
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============ APPLICATION MODAL DRAWER ============ */}
      {selectedJob && (
        <div style={drawerOverlayStyle} onClick={() => setSelectedJob(null)}>
          <div style={drawerContentStyle} className="glass-card" onClick={(e) => e.stopPropagation()}>
            <div style={drawerHeaderStyle}>
              <div>
                <span className="badge badge-accent">{selectedJob.department}</span>
                <h2 style={{ fontSize: '1.4rem', marginTop: '8px' }}>Apply for {selectedJob.title}</h2>
              </div>
              <button onClick={() => setSelectedJob(null)} style={closeDrawerBtnStyle}>&times;</button>
            </div>
            
            <div style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '4px', marginBottom: '20px' }}>
              <h4 style={sectionTitleStyle}>Job Description</h4>
              <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))', marginBottom: '16px' }}>{selectedJob.description}</p>
              
              <h4 style={sectionTitleStyle}>Skill Requirements</h4>
              <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))', marginBottom: '16px' }}>{selectedJob.requirements}</p>

              <div style={dividerStyle} />

              <h4 style={sectionTitleStyle}>Confirm Application Details</h4>
              <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" required value={profileName} onChange={(e) => setProfileName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" required value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Parsed Skills</label>
                  <input type="text" className="form-input" required value={profileSkills} onChange={(e) => setProfileSkills(e.target.value)} />
                  <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Ensure your key skills are set for AI scoring compatibility.</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Verified Resume Attachment</label>
                  <div style={resumeAttachedStyle}>
                    <FileText size={16} color="hsl(var(--primary))" />
                    <span style={{ fontSize: '0.85rem', flexGrow: 1 }}>{currentCandidate?.resumeFileName || 'Default_CV_Attached.pdf'}</span>
                    <span className="badge badge-success">Attached</span>
                  </div>
                </div>

                <button type="submit" style={submitApplicationBtnStyle}>
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline layouts and design overrides for visual excellence
const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
};

const subTabsContainerStyle = {
  display: 'flex',
  gap: '12px',
  borderBottom: '1px solid hsl(var(--border))',
  paddingBottom: '12px',
  marginBottom: '24px',
};

const subTabStyle = {
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

const activeSubTabStyle = {
  ...subTabStyle,
  background: 'hsl(var(--primary) / 0.1)',
  color: 'white',
  fontWeight: '600',
  boxShadow: '0 0 10px hsl(var(--primary) / 0.05)',
};

const headerInfoStyle = {
  marginBottom: '24px',
};

const searchRowStyle = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
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
  height: '46px',
};

const searchInputStyle = {
  background: 'transparent',
  border: 'none',
  color: 'white',
  width: '100%',
  outline: 'none',
  fontSize: '0.95rem',
};

const selectFieldStyle = {
  height: '46px',
};

const selectInputStyle = {
  background: 'hsl(var(--bg-secondary))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 'var(--radius-sm)',
  color: 'white',
  width: '100%',
  height: '100%',
  padding: '0 16px',
  outline: 'none',
  cursor: 'pointer',
};

const jobsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
  gap: '24px',
};

const jobCardStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
};

const jobCardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '12px',
  marginBottom: '16px',
};

const jobCardTitleStyle = {
  fontSize: '1.15rem',
  fontWeight: '700',
  marginTop: '4px',
};

const aiBadgeStyle = {
  flexShrink: 0,
};

const jobCardDescStyle = {
  fontSize: '0.9rem',
  color: 'hsl(var(--text-secondary))',
  marginBottom: '20px',
  flexGrow: 1,
};

const jobMetadataRowStyle = {
  display: 'flex',
  gap: '16px',
  marginBottom: '4px',
};

const metaItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.8rem',
  color: 'hsl(var(--text-muted))',
};

const jobCardFooterStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const matchMeterContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  alignItems: 'center',
  gap: '10px',
};

const matchMeterLabelStyle = {
  fontSize: '0.75rem',
  color: 'hsl(var(--text-muted))',
};

const progressBarBgStyle = {
  height: '6px',
  backgroundColor: 'hsl(var(--border))',
  borderRadius: '999px',
  overflow: 'hidden',
};

const progressBarFillStyle = {
  height: '100%',
  borderRadius: '999px',
  transition: 'width 0.5s ease',
};

const scoreTextStyle = (score) => ({
  fontSize: '0.75rem',
  fontWeight: '700',
  color: score > 80 ? 'hsl(var(--success))' : 'hsl(var(--primary))',
});

const applyBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  width: '100%',
  background: 'hsl(var(--primary))',
  color: 'white',
  border: 'none',
  padding: '12px',
  borderRadius: 'var(--radius-sm)',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: '0 4px 14px hsl(var(--primary) / 0.2)',
  transition: 'background var(--transition-fast)',
};

const emptyCardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 40px',
  textAlign: 'center',
};

const appCardStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const appCardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const trackerPipelineStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  position: 'relative',
  padding: '0 20px',
  marginTop: '10px',
  marginBottom: '10px',
};

const pipelineStepStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  zIndex: 2,
};

const pipelineCircleStyle = (active, isRejected) => ({
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  backgroundColor: isRejected ? 'hsl(var(--danger) / 0.2)' : active ? 'hsl(var(--primary) / 0.2)' : 'hsl(var(--bg-secondary))',
  border: `2px solid ${isRejected ? 'hsl(var(--danger))' : active ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
  color: isRejected ? 'hsl(var(--danger))' : active ? 'white' : 'hsl(var(--text-muted))',
  fontSize: '0.8rem',
  fontWeight: '700',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  boxShadow: active ? `0 0 10px ${isRejected ? 'hsl(var(--danger) / 0.3)' : 'hsl(var(--primary) / 0.3)'}` : 'none',
});

const pipelineLabelStyle = (active) => ({
  fontSize: '0.75rem',
  fontWeight: active ? '600' : '400',
  color: active ? 'hsl(var(--text-primary))' : 'hsl(var(--text-muted))',
});

const aiReportBoxStyle = {
  background: 'hsl(var(--bg-secondary) / 0.4)',
  border: '1px solid hsl(var(--border))',
  borderRadius: 'var(--radius-sm)',
  padding: '16px',
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

const interviewScheduleBoxStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'hsl(var(--accent) / 0.05)',
  border: '1px solid hsl(var(--accent) / 0.2)',
  borderRadius: 'var(--radius-sm)',
  padding: '16px',
};

const joinMeetingBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  background: 'hsl(var(--accent))',
  color: 'hsl(var(--bg-primary))',
  padding: '8px 16px',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.85rem',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
};

const profileSplitStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 2fr',
  gap: '24px',
};

const resumeUploadCardStyle = {
  height: 'fit-content',
};

const dragDropAreaStyle = {
  border: '2px dashed hsl(var(--border))',
  borderRadius: 'var(--radius-md)',
  padding: '40px 20px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'border-color 0.2s',
  '&:hover': {
    borderColor: 'hsl(var(--primary))',
  }
};

const uploadFileBtnStyle = {
  background: 'hsl(var(--primary) / 0.1)',
  color: 'hsl(var(--primary))',
  border: '1px solid hsl(var(--primary) / 0.3)',
  padding: '8px 20px',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.85rem',
  fontWeight: '600',
  cursor: 'pointer',
};

const parsingLoaderContainerStyle = {
  marginTop: '20px',
  textAlign: 'center',
};

const parsedSuccessContainerStyle = {
  marginTop: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  background: 'hsl(var(--success) / 0.05)',
  border: '1px solid hsl(var(--success) / 0.2)',
  borderRadius: 'var(--radius-sm)',
  padding: '12px',
};

const profileFormCardStyle = {};

const saveProfileBtnStyle = {
  background: 'hsl(var(--primary))',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: 'var(--radius-sm)',
  fontWeight: '600',
  cursor: 'pointer',
};

// Modal Drawer Styles
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
  width: '500px',
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

const sectionTitleStyle = {
  fontSize: '0.95rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'hsl(var(--accent))',
  marginBottom: '8px',
};

const dividerStyle = {
  height: '1px',
  backgroundColor: 'hsl(var(--border))',
  margin: '20px 0',
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

const submitApplicationBtnStyle = {
  background: 'hsl(var(--success))',
  color: 'white',
  border: 'none',
  padding: '14px',
  borderRadius: 'var(--radius-sm)',
  fontWeight: '700',
  cursor: 'pointer',
  marginTop: '12px',
  boxShadow: '0 4px 14px hsl(var(--success) / 0.2)',
};
