import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Seed initial jobs
const initialJobs = [
  {
    id: 'job-1',
    title: 'Senior C# ASP.NET Core Engineer',
    department: 'Engineering',
    location: 'Colombo, Sri Lanka (Hybrid)',
    type: 'Full-Time',
    description: 'We are seeking a senior C# ASP.NET developer to lead the implementation of our microservices architecture and scale our data pipelines.',
    requirements: 'C#, ASP.NET Core, Entity Framework Core, SQL Server, RESTful APIs, Docker, Clean Architecture',
    salary: '$110,000 - $135,000',
    postedDate: '2026-06-15',
    status: 'Active',
    aiPreferredSkills: ['C#', 'ASP.NET Core', 'SQL Server', 'RESTful APIs', 'Entity Framework']
  },
  {
    id: 'job-2',
    title: 'AI Research & NLP Engineer',
    department: 'Artificial Intelligence',
    location: 'Remote (US/Europe)',
    type: 'Full-Time',
    description: 'Join our AI advisory team to develop resume parsing pipelines, smart LLM agents, and semantic job matching services.',
    requirements: 'Python, PyTorch/TensorFlow, NLP, HuggingFace, OpenAI API, Vector DBs, Vector Embeddings',
    salary: '$130,000 - $160,000',
    postedDate: '2026-06-20',
    status: 'Active',
    aiPreferredSkills: ['Python', 'NLP', 'PyTorch', 'Vector Embeddings', 'LLMs', 'OpenAI']
  },
  {
    id: 'job-3',
    title: 'Lead UI/UX Product Designer',
    department: 'Design',
    location: 'London, UK (Onsite)',
    type: 'Full-Time',
    description: 'Own the visual and user experience lifecycle of our talent analytics dashboards and recruiting pipelines. Design sleek, high-fidelity mockups.',
    requirements: 'Figma, Visual Design, Prototyping, Usability Testing, CSS grid/flexbox, Design Systems',
    salary: '$95,000 - $120,000',
    postedDate: '2026-06-22',
    status: 'Active',
    aiPreferredSkills: ['Figma', 'UI/UX', 'Prototyping', 'Design Systems', 'HTML/CSS']
  },
  {
    id: 'job-4',
    title: 'Senior Cloud DevOps Specialist',
    department: 'Operations',
    location: 'Remote (APAC)',
    type: 'Contract',
    description: 'Help manage our Azure deployments, automate CI/CD workflows, configure K8s clusters, and ensure peak database performance.',
    requirements: 'Azure, Kubernetes, Docker, Terraform, GitHub Actions, SQL Server Management, Monitoring',
    salary: '$80 - $100 / hour',
    postedDate: '2026-06-24',
    status: 'Active',
    aiPreferredSkills: ['Azure', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD']
  }
];

// Seed initial candidates (each maps to a potential user role)
const initialCandidates = [
  {
    id: 'cand-1',
    name: 'Alice Smith',
    email: 'alice.smith@devmail.net',
    phone: '+94 77 123 4567',
    skills: 'C#, ASP.NET Core, EF Core, SQL Server, React, Docker, Git',
    experience: '5 Years - Software Engineer at TechCorp',
    education: 'BSc in Computer Science, University of Moratuwa',
    resumeFileName: 'Alice_Smith_Resume.pdf',
    aiScore: 92
  },
  {
    id: 'cand-2',
    name: 'Bob Johnson',
    email: 'bob.j@aimail.io',
    phone: '+1 (555) 321-7654',
    skills: 'Python, PyTorch, LLMs, Vector DBs, Docker, Fast API, NLP',
    experience: '3 Years - Junior AI Engineer at DeepNLP',
    education: 'MSc in Artificial Intelligence, Edinburgh University',
    resumeFileName: 'Bob_Johnson_Resume_2026.pdf',
    aiScore: 89
  },
  {
    id: 'cand-3',
    name: 'Clara Davis',
    email: 'clara.design@outlook.com',
    phone: '+44 7911 123456',
    skills: 'Figma, UI/UX Design, Design Systems, Typography, HTML5, CSS3',
    experience: '6 Years - Lead Designer at CreativeHub',
    education: 'BA in Graphic Design, London College of Communication',
    resumeFileName: 'Clara_Davis_Portfolio.pdf',
    aiScore: 95
  }
];

// Seed initial applications
const initialApplications = [
  {
    id: 'app-1',
    jobId: 'job-1',
    candidateId: 'cand-1',
    date: '2026-06-18',
    status: 'Interviewing',
    aiMatchScore: 92,
    aiKeywordsExtracted: ['C#', 'ASP.NET Core', 'SQL Server', 'Docker'],
    aiFeedback: 'Excellent skills alignment. Strong experience in relational databases and microservices. Recommended for technical interview.',
    screeningNotes: 'Recruiter reviewed: Solid C# background. Friendly demeanor during initial phone check.'
  },
  {
    id: 'app-2',
    jobId: 'job-2',
    candidateId: 'cand-2',
    date: '2026-06-21',
    status: 'Screening',
    aiMatchScore: 88,
    aiKeywordsExtracted: ['Python', 'LLMs', 'NLP', 'Docker'],
    aiFeedback: 'Good conceptual match for NLP. Slightly lower years of experience, but possesses high competence in modern generative models.',
    screeningNotes: 'System Screening: Passed automatic CV parse check.'
  },
  {
    id: 'app-3',
    jobId: 'job-3',
    candidateId: 'cand-3',
    date: '2026-06-23',
    status: 'Score Card',
    aiMatchScore: 95,
    aiKeywordsExtracted: ['Figma', 'UI/UX', 'Design Systems', 'HTML/CSS'],
    aiFeedback: 'Perfect fit. Extensive design portfolio with core HTML/CSS coding expertise. Outstanding alignment with requirements.',
    screeningNotes: 'Recruiter reviewed: Beautiful portfolio. Extremely promising candidate.'
  }
];

// Seed initial interview schedules
const initialSchedules = [
  {
    id: 'sch-1',
    applicationId: 'app-1',
    dateTime: '2026-06-29T10:00:00',
    type: 'Technical Interview',
    interviewerName: 'Sarah Jenkins (Hiring Manager)',
    link: 'https://teams.microsoft.com/l/meetup-join/hiretrax-meeting-1',
    status: 'Scheduled'
  },
  {
    id: 'sch-2',
    applicationId: 'app-3',
    dateTime: '2026-06-24T14:30:00', // Past
    type: 'Portfolio Presentation',
    interviewerName: 'Marcus Aurelius (Lead Designer)',
    link: 'https://meet.google.com/xyz-pdq-abc',
    status: 'Completed'
  }
];

// Seed initial evaluations
const initialEvaluations = [
  {
    id: 'eval-1',
    applicationId: 'app-3',
    interviewerName: 'Marcus Aurelius',
    skillsScore: 5,        // out of 5
    cultureScore: 4,
    communicationScore: 5,
    overallScore: 4.8,
    recommendation: 'Strong Hire',
    notes: 'Clara has an exceptional design process. She explained her design decisions clearly and showed standard knowledge of accessibility and design token structures. Must hire.'
  }
];

// Seed system audit logs
const initialLogs = [
  { id: 'log-1', timestamp: '2026-06-25T10:14:22', user: 'Admin (System)', action: 'Db Migration', details: 'Added organization records table.' },
  { id: 'log-2', timestamp: '2026-06-25T11:45:09', user: 'Recruiter (Emma)', action: 'Job Posted', details: 'Created Senior Cloud DevOps Specialist.' },
  { id: 'log-3', timestamp: '2026-06-25T12:30:00', user: 'AI Engine', action: 'Resume Screening', details: 'Analyzed resume of Bob Johnson. Match: 88%.' },
  { id: 'log-4', timestamp: '2026-06-25T14:48:30', user: 'Hiring Manager (Marcus)', action: 'Score Card Submitted', details: 'Scored Clara Davis: 4.8 / 5.' }
];

export function AppProvider({ children }) {
  // ── Registered users store ──────────────────────────────────
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('hiretrax_users');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('hiretrax_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Authentication gate
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('hiretrax_auth') === 'true';
  });

  // Logged-in user info
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('hiretrax_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Global user role state
  // Options: 'candidate', 'recruiter', 'hiring_manager', 'admin'
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('hiretrax_role') || 'candidate';
  });

  const [activeCandidateId, setActiveCandidateId] = useState('cand-1');

  // Mock Database Store
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('hiretrax_jobs');
    return saved ? JSON.parse(saved) : initialJobs;
  });

  const [candidates, setCandidates] = useState(() => {
    const saved = localStorage.getItem('hiretrax_candidates');
    return saved ? JSON.parse(saved) : initialCandidates;
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('hiretrax_applications');
    return saved ? JSON.parse(saved) : initialApplications;
  });

  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('hiretrax_schedules');
    return saved ? JSON.parse(saved) : initialSchedules;
  });

  const [evaluations, setEvaluations] = useState(() => {
    const saved = localStorage.getItem('hiretrax_evaluations');
    return saved ? JSON.parse(saved) : initialEvaluations;
  });

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('hiretrax_logs');
    return saved ? JSON.parse(saved) : initialLogs;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('hiretrax_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('hiretrax_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('hiretrax_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('hiretrax_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('hiretrax_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('hiretrax_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('hiretrax_evaluations', JSON.stringify(evaluations));
  }, [evaluations]);

  useEffect(() => {
    localStorage.setItem('hiretrax_logs', JSON.stringify(logs));
  }, [logs]);

  // Log action helper
  const addLog = (user, action, details) => {
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('Z', ''),
      user,
      action,
      details
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Actions
  const applyToJob = (jobId, candidateInfo, resumeFile) => {
    // 1. Create or update candidate record
    const candId = `cand-${Date.now()}`;
    const newCandidate = {
      id: candId,
      name: candidateInfo.name,
      email: candidateInfo.email,
      phone: candidateInfo.phone,
      skills: candidateInfo.skills,
      experience: candidateInfo.experience,
      education: candidateInfo.education || 'Self-Employed/Other',
      resumeFileName: resumeFile ? resumeFile.name : 'Uploaded_Resume.pdf',
      aiScore: Math.floor(Math.random() * 40) + 60 // Simulated baseline score
    };

    setCandidates((prev) => [...prev, newCandidate]);
    setActiveCandidateId(candId); // Simulate logged in candidate switching

    // 2. Perform AI screening simulation based on job matching skills
    const targetJob = jobs.find((j) => j.id === jobId);
    const jobSkills = targetJob ? targetJob.aiPreferredSkills : [];
    
    // Check intersection of skills (simple parsing simulator)
    const userSkillsText = candidateInfo.skills.toLowerCase();
    const matches = jobSkills.filter((s) => userSkillsText.includes(s.toLowerCase()));
    
    // Compute a score based on skill match + experience
    const baseScore = 50;
    const matchBonus = Math.min(matches.length * 10, 40);
    const expBonus = candidateInfo.experience.toLowerCase().includes('senior') || candidateInfo.experience.match(/[5-9]|\d{2}/) ? 10 : 0;
    const calculatedScore = baseScore + matchBonus + expBonus;
    
    const feedbackText = matches.length > 0 
      ? `AI parser identified matching skills: ${matches.join(', ')}. Strong matching criteria calculated.` 
      : 'Resume parser found minimal direct skill alignments. Candidate exhibits baseline technical aptitude.';

    // 3. Create Application
    const appId = `app-${Date.now()}`;
    const newApplication = {
      id: appId,
      jobId,
      candidateId: candId,
      date: new Date().toISOString().split('T')[0],
      status: 'Screening',
      aiMatchScore: calculatedScore,
      aiKeywordsExtracted: matches.length > 0 ? matches : ['General Aptitude'],
      aiFeedback: feedbackText,
      screeningNotes: 'System Screening: Auto-parsed successfully.'
    };

    setApplications((prev) => [...prev, newApplication]);
    addLog(candidateInfo.name, 'Application Submitted', `Applied to ${targetJob?.title || jobId}`);
    addLog('AI Engine', 'Resume Screening', `Screened ${candidateInfo.name} for ${targetJob?.title}. Match: ${calculatedScore}%.`);

    return appId;
  };

  const createJob = (jobInfo) => {
    const newJob = {
      id: `job-${Date.now()}`,
      title: jobInfo.title,
      department: jobInfo.department,
      location: jobInfo.location,
      type: jobInfo.type,
      description: jobInfo.description,
      requirements: jobInfo.requirements,
      salary: jobInfo.salary || 'Competitive',
      postedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      aiPreferredSkills: jobInfo.requirements.split(',').map((s) => s.trim()).filter((s) => s.length > 0)
    };

    setJobs((prev) => [newJob, ...prev]);
    addLog('Recruiter (Emma)', 'Job Posted', `Created ${newJob.title} in ${newJob.department}`);
  };

  const updateApplicationStatus = (appId, status, notes = '') => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const updated = { ...app, status };
          if (notes) {
            updated.screeningNotes = notes;
          }
          return updated;
        }
        return app;
      })
    );
    
    const app = applications.find(a => a.id === appId);
    const cand = candidates.find(c => c.id === app?.candidateId);
    addLog('Recruiter (Emma)', 'Application Review', `Moved ${cand?.name || 'Candidate'} to '${status}'`);
  };

  const scheduleInterview = (schInfo) => {
    const newSch = {
      id: `sch-${Date.now()}`,
      applicationId: schInfo.applicationId,
      dateTime: schInfo.dateTime,
      type: schInfo.type,
      interviewerName: schInfo.interviewerName,
      link: schInfo.link || 'https://meet.google.com/hiretrax-session',
      status: 'Scheduled'
    };

    setSchedules((prev) => [newSch, ...prev]);
    
    // Also move application to Interviewing
    updateApplicationStatus(schInfo.applicationId, 'Interviewing');

    const app = applications.find(a => a.id === schInfo.applicationId);
    const cand = candidates.find(c => c.id === app?.candidateId);
    addLog('Recruiter (Emma)', 'Interview Scheduled', `Booked ${newSch.type} for ${cand?.name || 'Candidate'}`);
  };

  const submitEvaluation = (evalInfo) => {
    const newEval = {
      id: `eval-${Date.now()}`,
      applicationId: evalInfo.applicationId,
      interviewerName: evalInfo.interviewerName,
      skillsScore: parseFloat(evalInfo.skillsScore),
      cultureScore: parseFloat(evalInfo.cultureScore),
      communicationScore: parseFloat(evalInfo.communicationScore),
      overallScore: parseFloat(
        ((parseFloat(evalInfo.skillsScore) + parseFloat(evalInfo.cultureScore) + parseFloat(evalInfo.communicationScore)) / 3).toFixed(1)
      ),
      recommendation: evalInfo.recommendation,
      notes: evalInfo.notes
    };

    setEvaluations((prev) => [...prev, newEval]);
    
    // Set application to scorecard stage
    updateApplicationStatus(evalInfo.applicationId, 'Score Card', `Hiring Manager Feedback: ${newEval.recommendation}`);

    const app = applications.find(a => a.id === evalInfo.applicationId);
    const cand = candidates.find(c => c.id === app?.candidateId);
    addLog('Hiring Manager', 'Evaluation Submitted', `Scored ${cand?.name || 'Candidate'}: ${newEval.overallScore}/5`);
  };

  const resetAllData = () => {
    localStorage.removeItem('hiretrax_jobs');
    localStorage.removeItem('hiretrax_candidates');
    localStorage.removeItem('hiretrax_applications');
    localStorage.removeItem('hiretrax_schedules');
    localStorage.removeItem('hiretrax_evaluations');
    localStorage.removeItem('hiretrax_logs');
    setJobs(initialJobs);
    setCandidates(initialCandidates);
    setApplications(initialApplications);
    setSchedules(initialSchedules);
    setEvaluations(initialEvaluations);
    setLogs(initialLogs);
    addLog('Admin (System)', 'Reset Database', 'Restored system database to initial seeded records.');
  };

  // ── Auth actions ─────────────────────────────────────────────
  const registerUser = ({ fullName, email, password, role }) => {
    // Check for duplicate email
    const exists = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      fullName,
      email,
      password, // In a real system this would be hashed
      role,
      createdAt: new Date().toISOString(),
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    addLog('System', 'User Registered', `New ${role} account created: ${fullName} (${email})`);
    return { success: true, user: newUser };
  };

  const loginUser = ({ email, password }) => {
    const match = registeredUsers.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!match) {
      return { success: false, message: 'Incorrect email or password.' };
    }

    setCurrentUser(match);
    setCurrentRole(match.role);
    setIsAuthenticated(true);
    localStorage.setItem('hiretrax_current_user', JSON.stringify(match));
    addLog(match.fullName, 'Login', `Signed in as ${match.role}`);
    return { success: true, user: match };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.setItem('hiretrax_auth', 'false');
    localStorage.removeItem('hiretrax_current_user');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        currentUser,
        currentRole,
        setCurrentRole,
        activeCandidateId,
        setActiveCandidateId,
        jobs,
        candidates,
        applications,
        schedules,
        evaluations,
        logs,
        applyToJob,
        createJob,
        updateApplicationStatus,
        scheduleInterview,
        submitEvaluation,
        resetAllData,
        registerUser,
        loginUser,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
