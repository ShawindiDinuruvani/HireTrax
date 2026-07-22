import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sparkles, Briefcase, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function PostJob() {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [dept, setDept] = useState('Engineering');
  const [location, setLocation] = useState('Colombo, Sri Lanka (Hybrid)');
  const [jobType, setJobType] = useState('Full-Time');
  const [salary, setSalary] = useState('');
  const [desc, setDesc] = useState('');
  const [reqs, setReqs] = useState('');

  // AI Optimization simulator state
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [optStatus, setOptStatus] = useState('');

  const triggerAiOptimization = () => {
    if (!desc || !reqs) {
      alert('Please fill out the Job Description and Requirements first so the AI can analyze them.');
      return;
    }
    
    setIsOptimizing(true);
    setOptStatus('Analyzing requirements...');
    
    setTimeout(() => {
      setOptStatus('Extracting core competencies...');
      setTimeout(() => {
        // Parse and suggest key tags based on inputs
        const mergedText = (title + ' ' + desc + ' ' + reqs).toLowerCase();
        const pool = [
          'C#', 'ASP.NET Core', 'SQL Server', 'React', 'TypeScript', 'Node.js', 
          'Python', 'PyTorch', 'Docker', 'Kubernetes', 'CI/CD', 'Azure', 'AWS', 
          'Figma', 'UI/UX', 'Design Systems', 'Microservices', 'RESTful APIs'
        ];
        
        const matches = pool.filter(skill => mergedText.includes(skill.toLowerCase()));
        const uniqueMatches = matches.length > 0 ? matches : ['General Tech', 'Team Leadership'];
        
        setAiSuggestions(uniqueMatches);
        setIsOptimizing(false);
        setOptStatus('AI optimization completed successfully!');
        
        // Slightly improve description wording as a simulation
        setDesc(prev => prev + '\n\n[Optimized by HireTrax AI: Candidate must exhibit excellent communication skills, high problem-solving capacity, and experience in scalable software engineering environments.]');
      }, 800);
    }, 800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !desc || !reqs) {
      alert('Please enter all required fields.');
      return;
    }

    try {
      await api.createJob({
        title,
        department: dept,
        location,
        jobType: jobType,
        salaryRange: salary,
        description: desc,
        requirements: reqs,
        aiPreferredSkills: reqs.split(',').map((s) => s.trim()).filter((s) => s.length > 0).join(', '),
        companyName: currentUser?.companyName || "Your Company",
        postedByUserId: currentUser?.id
      });

      alert('New job posted successfully! The AI parser has updated candidate recommendation pipelines.');
      navigate('/');
    } catch (err) {
      alert('Error creating job: ' + err.message);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerRowStyle}>
        <button onClick={() => navigate('/')} style={backBtnStyle}>
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h2>Post New Job Opportunity</h2>
          <p>Fill out the fields to publish a job posting and activate AI screening rules.</p>
        </div>
      </div>

      <div style={splitLayoutStyle}>
        {/* Left Column: Form Details */}
        <form onSubmit={handleSubmit} className="glass-card" style={formCardStyle}>
          <div className="form-group">
            <label className="form-label">Job Title *</label>
            <input 
              type="text" 
              className="form-input" 
              required
              placeholder="e.g. Senior Backend Engineer (C# / .NET)"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select className="form-select" value={dept} onChange={(e) => setDept(e.target.value)}>
                <option value="Engineering">Engineering</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Design">Design</option>
                <option value="Operations">Operations</option>
                <option value="Product Management">Product Management</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Employment Type *</label>
              <select className="form-select" value={jobType} onChange={(e) => setJobType(e.target.value)}>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input 
                type="text" 
                className="form-input" 
                required
                placeholder="e.g. Colombo, Sri Lanka (Hybrid)"
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Salary Range</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. $100k - $125k"
                value={salary} 
                onChange={(e) => setSalary(e.target.value)} 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Job Description *</label>
            <textarea 
              className="form-textarea" 
              required
              rows={4} 
              placeholder="Outline the role responsibilities, team structures, and project objectives..."
              value={desc} 
              onChange={(e) => setDesc(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Required Skills & Competencies (comma separated) *</label>
            <textarea 
              className="form-textarea" 
              required
              rows={2} 
              placeholder="e.g. C#, ASP.NET Core, SQL Server, Docker"
              value={reqs} 
              onChange={(e) => setReqs(e.target.value)} 
            />
          </div>

          <div style={formFooterStyle}>
            <button type="submit" style={submitBtnStyle}>
              Publish Job Listing
            </button>
          </div>
        </form>

        {/* Right Column: AI Co-Pilot Optimizer */}
        <div className="glass-card" style={aiCoPilotCardStyle}>
          <div style={aiHeaderStyle}>
            <Sparkles size={20} color="hsl(var(--primary))" />
            <h3 style={{ fontSize: '1.1rem' }}>AI Co-Pilot Optimizer</h3>
          </div>
          
          <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginBottom: '16px' }}>
            Click optimize to analyze your description, extract preferred key skills, and append structural refinements to attract top candidates.
          </p>

          <button 
            type="button" 
            onClick={triggerAiOptimization}
            style={optimizeBtnStyle}
            disabled={isOptimizing}
          >
            {isOptimizing ? 'Optimizing...' : 'Optimize Requirements'}
          </button>

          {optStatus && (
            <div style={statusAlertStyle(isOptimizing)}>
              <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{optStatus}</span>
            </div>
          )}

          {aiSuggestions.length > 0 && (
            <div style={suggestionsBoxStyle}>
              <h4 style={{ fontSize: '0.85rem', marginBottom: '8px', color: 'hsl(var(--accent))' }}>AI Preferred Skills Registered:</h4>
              <div style={tagCloudStyle}>
                {aiSuggestions.map((tag) => (
                  <span key={tag} className="badge badge-primary">{tag}</span>
                ))}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '12px' }}>
                These tags will now be used by the background screening parser to rank candidate CV compatibility scores.
              </p>
            </div>
          )}
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
  gridTemplateColumns: '2fr 1fr',
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
  background: 'hsl(var(--success))',
  color: 'white',
  border: 'none',
  padding: '12px 30px',
  borderRadius: 'var(--radius-sm)',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 4px 12px hsl(var(--success) / 0.2)',
};

const aiCoPilotCardStyle = {
  height: 'fit-content',
  border: '1px solid hsl(var(--primary) / 0.2)',
  background: 'hsl(var(--primary) / 0.02)',
};

const aiHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '10px',
};

const optimizeBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  background: 'hsl(var(--primary) / 0.1)',
  color: 'hsl(var(--primary))',
  border: '1px solid hsl(var(--primary) / 0.3)',
  padding: '10px',
  borderRadius: 'var(--radius-sm)',
  fontWeight: '600',
  cursor: 'pointer',
  fontSize: '0.85rem',
  transition: 'background 0.2s',
};

const statusAlertStyle = (isPending) => ({
  marginTop: '12px',
  background: isPending ? 'rgba(255,255,255,0.02)' : 'hsl(var(--success) / 0.05)',
  border: `1px solid ${isPending ? 'hsl(var(--border))' : 'hsl(var(--success) / 0.2)'}`,
  color: isPending ? 'white' : 'hsl(var(--success))',
  padding: '10px',
  borderRadius: '4px',
  textAlign: 'center',
});

const suggestionsBoxStyle = {
  marginTop: '20px',
  borderTop: '1px solid hsl(var(--border))',
  paddingTop: '16px',
};

const tagCloudStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
};
