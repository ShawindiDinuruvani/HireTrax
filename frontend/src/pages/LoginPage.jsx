import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles, Mail, Lock, Eye, EyeOff, User,
  ArrowRight, UserPlus, LogIn, CheckCircle,
  Briefcase, CheckSquare, Settings, ChevronDown
} from 'lucide-react';

const ROLES = [
  { value: 'candidate',      label: 'Job Seeker',      icon: User,        color: 'hsl(190 95% 50%)', desc: 'Browse & apply to jobs' },
  { value: 'recruiter',      label: 'Recruiter',       icon: Briefcase,   color: 'hsl(263 85% 64%)', desc: 'Post jobs & screen candidates' },
  { value: 'hiring_manager', label: 'Hiring Manager',  icon: CheckSquare, color: 'hsl(45 93% 47%)',  desc: 'Evaluate & decide on candidates' },
  { value: 'admin',          label: 'Administrator',   icon: Settings,    color: 'hsl(142 76% 45%)', desc: 'Manage users & system settings' },
];

export default function LoginPage() {
  const { registerUser, loginUser } = useApp();

  // Toggle between 'login' and 'register'
  const [mode, setMode] = useState('login');

  // Shared fields
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Register-only fields
  const [fullName,        setFullName]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [selectedRole,    setSelectedRole]    = useState('candidate');
  const [roleOpen,        setRoleOpen]        = useState(false);
  const [registered,      setRegistered]      = useState(false);

  // Feedback
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const switchMode = (m) => {
    setMode(m);
    setError('');
    setEmail('');
    setPassword('');
    setFullName('');
    setConfirmPassword('');
    setRegistered(false);
  };

  /* ── Login submit ── */
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }

    setLoading(true);
    setTimeout(() => {
      const result = loginUser({ email: email.trim(), password });
      if (!result.success) {
        setError(result.message);
        setLoading(false);
      }
      // On success, AppContext sets isAuthenticated — App re-renders automatically
    }, 800);
  };

  /* ── Register submit ── */
  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim())       { setError('Please enter your full name.'); return; }
    if (!email.trim())          { setError('Please enter your email address.'); return; }
    if (password.length < 6)    { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    setTimeout(() => {
      const result = registerUser({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role: selectedRole,
      });

      if (!result.success) {
        setError(result.message);
        setLoading(false);
      } else {
        setRegistered(true);
        setLoading(false);
      }
    }, 900);
  };

  const activeRole = ROLES.find(r => r.value === selectedRole);

  return (
    <div style={pageStyle}>

      {/* ── Left branding panel ── */}
      <div style={leftPanelStyle}>
        <div style={logoRowStyle}>
          <div style={logoIconStyle}>
            <Sparkles size={22} color="hsl(190 95% 50%)" />
          </div>
          <span style={logoTextStyle}>
            Hire<span style={{ color: 'hsl(263 85% 64%)' }}>Trax</span>
          </span>
        </div>

        <div style={brandingBodyStyle}>
          <h1 style={heroTitleStyle}>
            The future of<br />
            <span style={gradientTextStyle}>AI-powered</span><br />
            hiring is here.
          </h1>
          <p style={heroDescStyle}>
            Streamline your entire recruitment lifecycle — from intelligent resume
            parsing and candidate matching to interview scheduling and offer
            management — all in one unified platform.
          </p>

          <div style={featureListStyle}>
            {[
              'AI candidate-job compatibility scoring',
              'Automated resume skill extraction',
              'Smart interview scheduling engine',
              'Real-time recruitment analytics',
              'Role-based access control (RBAC)',
            ].map(f => (
              <div key={f} style={featureItemStyle}>
                <CheckCircle size={15} color="hsl(190 95% 50%)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.88rem', color: 'hsl(215 20% 65%)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={decorCircle1} />
        <div style={decorCircle2} />
      </div>

      {/* ── Right form panel ── */}
      <div style={rightPanelStyle}>
        <div style={formBoxStyle}>

          {/* Mode toggle tabs */}
          <div style={tabRowStyle}>
            <button
              onClick={() => switchMode('login')}
              style={mode === 'login' ? activeTabStyle : inactiveTabStyle}
            >
              <LogIn size={15} />
              Sign In
            </button>
            <button
              onClick={() => switchMode('register')}
              style={mode === 'register' ? activeTabStyle : inactiveTabStyle}
            >
              <UserPlus size={15} />
              Create Account
            </button>
          </div>

          {/* ── LOGIN FORM ── */}
          {mode === 'login' && (
            <>
              <div style={formHeaderStyle}>
                <h2 style={formTitleStyle}>Welcome back</h2>
                <p style={formSubStyle}>Sign in to access your portal</p>
              </div>

              <form onSubmit={handleLogin} style={formStyle}>
                {/* Email */}
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={inputWrapStyle}>
                    <Mail size={15} style={inputIconStyle} />
                    <input
                      type="email"
                      className="form-input"
                      style={paddedInput}
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={inputWrapStyle}>
                    <Lock size={15} style={inputIconStyle} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="form-input"
                      style={paddedInput}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => setShowPass(v => !v)} style={eyeBtnStyle}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {error && <div style={errorBoxStyle}>{error}</div>}

                <button type="submit" style={primaryBtnStyle} disabled={loading}>
                  {loading
                    ? <><span style={spinnerStyle} /> Signing in...</>
                    : <><LogIn size={15} /> Sign In</>
                  }
                </button>
              </form>

              <p style={switchPromptStyle}>
                Don't have an account?{' '}
                <button onClick={() => switchMode('register')} style={linkBtnStyle}>
                  Create one now
                </button>
              </p>
            </>
          )}

          {/* ── REGISTER FORM ── */}
          {mode === 'register' && !registered && (
            <>
              <div style={formHeaderStyle}>
                <h2 style={formTitleStyle}>Create your account</h2>
                <p style={formSubStyle}>Join HireTrax and get started today</p>
              </div>

              <form onSubmit={handleRegister} style={formStyle}>
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div style={inputWrapStyle}>
                    <User size={15} style={inputIconStyle} />
                    <input
                      type="text"
                      className="form-input"
                      style={paddedInput}
                      placeholder="John Smith"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={inputWrapStyle}>
                    <Mail size={15} style={inputIconStyle} />
                    <input
                      type="email"
                      className="form-input"
                      style={paddedInput}
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password + Confirm — side by side */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Password</label>
                    <div style={inputWrapStyle}>
                      <Lock size={15} style={inputIconStyle} />
                      <input
                        type={showPass ? 'text' : 'password'}
                        className="form-input"
                        style={paddedInput}
                        placeholder="Min. 6 characters"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                      />
                      <button type="button" onClick={() => setShowPass(v => !v)} style={eyeBtnStyle}>
                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Confirm Password</label>
                    <div style={inputWrapStyle}>
                      <Lock size={15} style={inputIconStyle} />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        className="form-input"
                        style={paddedInput}
                        placeholder="Repeat password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button type="button" onClick={() => setShowConfirm(v => !v)} style={eyeBtnStyle}>
                        {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Role picker */}
                <div className="form-group">
                  <label className="form-label">I am joining as</label>
                  <div style={{ position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => setRoleOpen(v => !v)}
                      style={rolePickerBtnStyle(activeRole.color)}
                    >
                      <activeRole.icon size={16} color={activeRole.color} />
                      <div style={{ textAlign: 'left', flexGrow: 1 }}>
                        <p style={{ fontSize: '0.88rem', fontWeight: '700', color: 'white', lineHeight: 1 }}>
                          {activeRole.label}
                        </p>
                        <p style={{ fontSize: '0.74rem', color: 'hsl(215 20% 55%)', lineHeight: 1.4 }}>
                          {activeRole.desc}
                        </p>
                      </div>
                      <ChevronDown
                        size={15}
                        color="hsl(215 20% 50%)"
                        style={{ transform: roleOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }}
                      />
                    </button>

                    {roleOpen && (
                      <div style={roleDropdownStyle} className="glass-card">
                        {ROLES.map(r => {
                          const Icon = r.icon;
                          const isSelected = r.value === selectedRole;
                          return (
                            <button
                              key={r.value}
                              type="button"
                              onClick={() => { setSelectedRole(r.value); setRoleOpen(false); }}
                              style={roleOptionStyle(r.color, isSelected)}
                            >
                              <Icon size={16} color={r.color} />
                              <div style={{ textAlign: 'left' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'white', lineHeight: 1 }}>
                                  {r.label}
                                </p>
                                <p style={{ fontSize: '0.73rem', color: 'hsl(215 20% 55%)', lineHeight: 1.4 }}>
                                  {r.desc}
                                </p>
                              </div>
                              {isSelected && <CheckCircle size={15} color={r.color} style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {error && <div style={errorBoxStyle}>{error}</div>}

                <button type="submit" style={primaryBtnStyle} disabled={loading}>
                  {loading
                    ? <><span style={spinnerStyle} /> Creating account...</>
                    : <><UserPlus size={15} /> Create Account</>
                  }
                </button>
              </form>

              <p style={switchPromptStyle}>
                Already have an account?{' '}
                <button onClick={() => switchMode('login')} style={linkBtnStyle}>
                  Sign in
                </button>
              </p>
            </>
          )}

          {/* ── SUCCESS STATE ── */}
          {mode === 'register' && registered && (
            <div style={successCardStyle}>
              <div style={successIconStyle}>
                <CheckCircle size={36} color="hsl(142 76% 45%)" />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}>
                Account Created!
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'hsl(215 20% 60%)', marginBottom: '24px', textAlign: 'center' }}>
                Your <strong style={{ color: activeRole.color }}>{activeRole.label}</strong> account
                has been successfully created. Sign in to access your portal.
              </p>
              <button
                onClick={() => switchMode('login')}
                style={{ ...primaryBtnStyle, width: '100%' }}
              >
                <LogIn size={15} /> Go to Sign In
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────── */
const pageStyle = {
  display: 'flex', width: '100vw', height: '100vh',
  overflow: 'hidden', position: 'relative', zIndex: 10,
};

const leftPanelStyle = {
  width: '42%', height: '100%', flexShrink: 0,
  background: 'linear-gradient(145deg, hsl(224 30% 7%) 0%, hsl(263 40% 10%) 100%)',
  borderRight: '1px solid hsl(217 20% 14%)',
  display: 'flex', flexDirection: 'column',
  padding: '40px 48px', position: 'relative', overflow: 'hidden',
};

const logoRowStyle = {
  display: 'flex', alignItems: 'center', gap: '12px',
};

const logoIconStyle = {
  width: '38px', height: '38px', borderRadius: '10px',
  background: 'hsl(190 95% 50% / 0.1)',
  border: '1px solid hsl(190 95% 50% / 0.2)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const logoTextStyle = {
  fontFamily: "'Outfit', sans-serif",
  fontSize: '1.5rem', fontWeight: '800', color: 'white',
  letterSpacing: '-0.03em',
};

const brandingBodyStyle = {
  marginTop: 'auto', marginBottom: 'auto',
};

const heroTitleStyle = {
  fontSize: '2.6rem', fontWeight: '800',
  fontFamily: "'Outfit', sans-serif",
  lineHeight: '1.15', color: 'white',
  marginBottom: '18px', letterSpacing: '-0.03em',
};

const gradientTextStyle = {
  background: 'linear-gradient(90deg, hsl(263 85% 72%), hsl(190 95% 58%))',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
};

const heroDescStyle = {
  fontSize: '0.92rem', color: 'hsl(215 20% 58%)',
  lineHeight: '1.75', maxWidth: '370px', marginBottom: '30px',
};

const featureListStyle = { display: 'flex', flexDirection: 'column', gap: '11px' };

const featureItemStyle = { display: 'flex', alignItems: 'center', gap: '10px' };

const decorCircle1 = {
  position: 'absolute', top: '-60px', right: '-80px',
  width: '280px', height: '280px', borderRadius: '50%',
  background: 'radial-gradient(circle, hsl(263 85% 64% / 0.1) 0%, transparent 70%)',
  pointerEvents: 'none',
};

const decorCircle2 = {
  position: 'absolute', bottom: '-100px', left: '20px',
  width: '340px', height: '340px', borderRadius: '50%',
  background: 'radial-gradient(circle, hsl(190 95% 50% / 0.07) 0%, transparent 70%)',
  pointerEvents: 'none',
};

const rightPanelStyle = {
  flex: 1, height: '100%', overflowY: 'auto',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '40px 24px',
};

const formBoxStyle = {
  width: '100%', maxWidth: '440px',
};

const tabRowStyle = {
  display: 'flex', background: 'hsl(224 25% 9%)',
  border: '1px solid hsl(217 20% 15%)',
  borderRadius: '10px', padding: '4px', marginBottom: '28px',
  gap: '4px',
};

const activeTabStyle = {
  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
  gap: '7px', padding: '10px',
  background: 'hsl(263 85% 64%)',
  border: 'none', borderRadius: '7px',
  color: 'white', fontSize: '0.88rem', fontWeight: '700',
  cursor: 'pointer', boxShadow: '0 4px 14px hsl(263 85% 64% / 0.3)',
  transition: 'all 0.2s',
};

const inactiveTabStyle = {
  ...activeTabStyle,
  background: 'transparent',
  boxShadow: 'none',
  color: 'hsl(215 20% 50%)',
};

const formHeaderStyle = { marginBottom: '22px' };

const formTitleStyle = {
  fontSize: '1.65rem', fontWeight: '800',
  fontFamily: "'Outfit', sans-serif", marginBottom: '5px',
};

const formSubStyle = { fontSize: '0.88rem', color: 'hsl(215 20% 55%)' };

const formStyle = { display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '18px' };

const inputWrapStyle = { position: 'relative', display: 'flex', alignItems: 'center' };

const inputIconStyle = {
  position: 'absolute', left: '14px', zIndex: 1,
  color: 'hsl(215 20% 45%)', flexShrink: 0,
};

const paddedInput = { paddingLeft: '42px', paddingRight: '42px' };

const eyeBtnStyle = {
  position: 'absolute', right: '13px',
  background: 'transparent', border: 'none',
  color: 'hsl(215 20% 50%)', display: 'flex',
  alignItems: 'center', padding: 0,
};

const rolePickerBtnStyle = (color) => ({
  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
  padding: '12px 14px',
  background: 'hsl(224 25% 10%)',
  border: `1px solid ${color.replace(')', ' / 0.3)').replace('hsl(', 'hsl(')}`,
  borderRadius: '8px', cursor: 'pointer', transition: 'border-color 0.2s',
});

const roleDropdownStyle = {
  position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
  zIndex: 300, padding: '6px',
  display: 'flex', flexDirection: 'column', gap: '4px',
};

const roleOptionStyle = (color, isSelected) => ({
  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
  padding: '10px 12px', background: isSelected ? color.replace(')', ' / 0.08)').replace('hsl(', 'hsl(') : 'transparent',
  border: `1px solid ${isSelected ? color.replace(')', ' / 0.25)').replace('hsl(', 'hsl(') : 'transparent'}`,
  borderRadius: '7px', cursor: 'pointer', transition: 'background 0.15s',
});

const errorBoxStyle = {
  background: 'hsl(350 89% 60% / 0.08)',
  border: '1px solid hsl(350 89% 60% / 0.3)',
  borderRadius: '8px', padding: '11px 14px',
  color: 'hsl(350 89% 65%)', fontSize: '0.85rem',
  marginBottom: '4px',
};

const primaryBtnStyle = {
  width: '100%', padding: '13px',
  background: 'linear-gradient(135deg, hsl(263 85% 62%), hsl(263 85% 52%))',
  color: 'white', border: 'none', borderRadius: '10px',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontSize: '0.92rem', fontWeight: '700',
  cursor: 'pointer', marginTop: '6px',
  boxShadow: '0 6px 20px hsl(263 85% 64% / 0.3)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  transition: 'opacity 0.2s',
};

const spinnerStyle = {
  width: '15px', height: '15px',
  border: '2px solid rgba(255,255,255,0.25)',
  borderTopColor: 'white', borderRadius: '50%',
  display: 'inline-block', animation: 'spin 0.8s linear infinite',
};

const switchPromptStyle = {
  textAlign: 'center', fontSize: '0.85rem',
  color: 'hsl(215 20% 50%)', marginTop: '4px',
};

const linkBtnStyle = {
  background: 'none', border: 'none',
  color: 'hsl(263 85% 70%)', fontWeight: '700',
  fontSize: '0.85rem', cursor: 'pointer',
  textDecoration: 'underline', textUnderlineOffset: '3px',
};

const successCardStyle = {
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', padding: '40px 20px',
};

const successIconStyle = {
  width: '72px', height: '72px', borderRadius: '50%',
  background: 'hsl(142 76% 45% / 0.1)',
  border: '1px solid hsl(142 76% 45% / 0.3)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  marginBottom: '20px',
};
