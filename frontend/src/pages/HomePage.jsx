import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Briefcase, Building2, User, ArrowRight,
  CheckCircle, BarChart2, Brain, Shield, Star, Zap
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const handleRoleClick = (role) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div style={pageStyle}>
      {/* Hero Section */}
      <header style={heroStyle}>
        {/* Logo */}
        <div style={navStyle}>
          <div style={logoStyle}>
            <div style={logoIconStyle}><Sparkles size={20} color="hsl(190 95% 50%)" /></div>
            <span style={logoTextStyle}>Hire<span style={{ color: 'hsl(263 85% 64%)' }}>Trax</span></span>
          </div>
          <button onClick={() => navigate('/login')} style={loginBtnStyle}>
            Sign In <ArrowRight size={14} style={{ marginLeft: '4px' }} />
          </button>
        </div>

        {/* Hero Content */}
        <div style={heroContentStyle}>
          <div style={heroBadgeStyle}>
            <Zap size={12} color="hsl(190 95% 50%)" />
            <span>AI-Powered Recruitment Platform</span>
          </div>
          <h1 style={heroTitleStyle}>
            The future of hiring<br />
            <span style={gradientTextStyle}>starts here.</span>
          </h1>
          <p style={heroDescStyle}>
            Connect top talent with world-class companies. AI-driven screening,
            intelligent matching, and seamless collaboration — all in one place.
          </p>

          {/* Stats Row */}
          <div style={statsRowStyle}>
            {[
              { value: '10K+', label: 'Active Jobs' },
              { value: '50K+', label: 'Candidates' },
              { value: '98%', label: 'Match Rate' },
              { value: '2x', label: 'Faster Hiring' },
            ].map(s => (
              <div key={s.label} style={statItemStyle}>
                <span style={statValueStyle}>{s.value}</span>
                <span style={statLabelStyle}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Role Selection Section */}
      <section style={roleSectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Choose your journey</h2>
          <p style={sectionDescStyle}>Select how you'd like to use HireTrax to get started</p>
        </div>

        <div style={cardsGridStyle}>
          {/* Candidate Card */}
          <div
            style={roleCardStyle('hsl(190 95% 50%)', hovered === 'candidate')}
            onMouseEnter={() => setHovered('candidate')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleRoleClick('candidate')}
          >
            <div style={cardIconWrapStyle('hsl(190 95% 50%)')}>
              <User size={28} color="hsl(190 95% 50%)" />
            </div>
            <h3 style={cardTitleStyle}>Job Seeker</h3>
            <p style={cardDescStyle}>
              Find your dream job with AI-powered matching. Build your profile,
              upload your resume, and get matched to roles that fit your skills.
            </p>
            <ul style={featureListStyle}>
              {['AI Job Matching', 'Resume Parsing', 'Application Tracking', 'Interview Scheduling'].map(f => (
                <li key={f} style={featureItemStyle}>
                  <CheckCircle size={13} color="hsl(190 95% 50%)" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button style={cardBtnStyle('hsl(190 95% 50%)')} onClick={() => handleRoleClick('candidate')}>
              Find Jobs <ArrowRight size={15} />
            </button>
          </div>

          {/* Company Card */}
          <div
            style={{ ...roleCardStyle('hsl(263 85% 64%)', hovered === 'company'), border: '1px solid hsl(263 85% 64% / 0.4)', boxShadow: hovered === 'company' ? '0 20px 60px hsl(263 85% 64% / 0.25)' : '0 8px 30px rgba(0,0,0,0.3)' }}
            onMouseEnter={() => setHovered('company')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleRoleClick('company_admin')}
          >
            {/* Featured Badge */}
            <div style={featuredBadgeStyle}>
              <Star size={11} /> Most Popular
            </div>

            <div style={cardIconWrapStyle('hsl(263 85% 64%)')}>
              <Building2 size={28} color="hsl(263 85% 64%)" />
            </div>
            <h3 style={cardTitleStyle}>Company / Employer</h3>
            <p style={cardDescStyle}>
              Register your company, build your recruitment team, post jobs,
              and hire the best talent with AI-assisted screening.
            </p>
            <ul style={featureListStyle}>
              {['Company Dashboard', 'Add Recruiters & HMs', 'AI Resume Screening', 'Analytics & Reports'].map(f => (
                <li key={f} style={featureItemStyle}>
                  <CheckCircle size={13} color="hsl(263 85% 64%)" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button style={cardBtnStyle('hsl(263 85% 64%)')} onClick={() => handleRoleClick('company_admin')}>
              Register Company <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Already have account */}
        <div style={alreadyHaveAccountStyle}>
          <span style={{ color: 'hsl(215 20% 55%)' }}>Already have an account?</span>
          <button onClick={() => navigate('/login')} style={signInLinkStyle}>
            Sign In →
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={featuresSectionStyle}>
        <h2 style={{ ...sectionTitleStyle, textAlign: 'center', marginBottom: '40px' }}>
          Why teams choose <span style={gradientTextStyle}>HireTrax</span>
        </h2>
        <div style={featuresGridStyle}>
          {[
            { icon: Brain, color: 'hsl(190 95% 50%)', title: 'AI Screening', desc: 'Automated resume analysis with skill extraction and match scoring' },
            { icon: BarChart2, color: 'hsl(263 85% 64%)', title: 'Analytics', desc: 'Real-time dashboards and recruitment pipeline insights' },
            { icon: Shield, color: 'hsl(142 76% 45%)', title: 'Secure', desc: 'Role-based access control with JWT authentication' },
            { icon: Zap, color: 'hsl(45 93% 47%)', title: 'Fast', desc: 'Reduce time-to-hire by 2x with intelligent automation' },
          ].map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} style={featureCardStyle}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${f.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Icon size={22} color={f.color} />
                </div>
                <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: '700', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ color: 'hsl(215 20% 55%)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={logoStyle}>
          <div style={logoIconStyle}><Sparkles size={16} color="hsl(190 95% 50%)" /></div>
          <span style={{ ...logoTextStyle, fontSize: '1rem' }}>Hire<span style={{ color: 'hsl(263 85% 64%)' }}>Trax</span></span>
        </div>
        <p style={{ color: 'hsl(215 20% 40%)', fontSize: '0.8rem', margin: 0 }}>
          © 2026 HireTrax. AI-Powered Recruitment Platform.
        </p>
      </footer>
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────── */
const pageStyle = {
  minHeight: '100vh',
  background: 'hsl(222 47% 6%)',
  fontFamily: "'Inter', sans-serif",
  overflowX: 'hidden',
};

const heroStyle = {
  padding: '0 40px',
  maxWidth: '1200px',
  margin: '0 auto',
};

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '28px 0',
};

const logoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const logoIconStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  background: 'hsl(190 95% 50% / 0.12)',
  border: '1px solid hsl(190 95% 50% / 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const logoTextStyle = {
  fontSize: '1.3rem',
  fontWeight: '800',
  color: 'white',
  letterSpacing: '-0.5px',
};

const loginBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  background: 'hsl(220 30% 12%)',
  border: '1px solid hsl(220 20% 22%)',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.88rem',
  transition: 'all 0.2s',
};

const heroContentStyle = {
  padding: '60px 0 80px',
  maxWidth: '720px',
};

const heroBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  background: 'hsl(190 95% 50% / 0.1)',
  border: '1px solid hsl(190 95% 50% / 0.3)',
  color: 'hsl(190 95% 70%)',
  padding: '6px 14px',
  borderRadius: '999px',
  fontSize: '0.78rem',
  fontWeight: '600',
  marginBottom: '24px',
  letterSpacing: '0.3px',
};

const heroTitleStyle = {
  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
  fontWeight: '800',
  color: 'white',
  lineHeight: 1.1,
  letterSpacing: '-1.5px',
  margin: '0 0 20px',
};

const gradientTextStyle = {
  background: 'linear-gradient(135deg, hsl(190 95% 50%), hsl(263 85% 64%))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const heroDescStyle = {
  fontSize: '1.05rem',
  color: 'hsl(215 20% 60%)',
  lineHeight: 1.7,
  margin: '0 0 40px',
  maxWidth: '540px',
};

const statsRowStyle = {
  display: 'flex',
  gap: '40px',
  flexWrap: 'wrap',
};

const statItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
};

const statValueStyle = {
  fontSize: '1.6rem',
  fontWeight: '800',
  color: 'white',
  letterSpacing: '-0.5px',
};

const statLabelStyle = {
  fontSize: '0.78rem',
  color: 'hsl(215 20% 50%)',
  fontWeight: '500',
};

const roleSectionStyle = {
  padding: '80px 40px',
  maxWidth: '1200px',
  margin: '0 auto',
};

const sectionHeaderStyle = {
  textAlign: 'center',
  marginBottom: '50px',
};

const sectionTitleStyle = {
  fontSize: '2rem',
  fontWeight: '800',
  color: 'white',
  letterSpacing: '-0.5px',
  margin: '0 0 10px',
};

const sectionDescStyle = {
  color: 'hsl(215 20% 55%)',
  fontSize: '1rem',
  margin: 0,
};

const cardsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '24px',
  maxWidth: '860px',
  margin: '0 auto',
};

const roleCardStyle = (color, isHovered) => ({
  background: isHovered
    ? `linear-gradient(145deg, hsl(220 30% 14%), hsl(220 30% 10%))`
    : 'linear-gradient(145deg, hsl(220 30% 12%), hsl(220 30% 8%))',
  border: `1px solid ${isHovered ? `${color}66` : 'hsl(220 20% 18%)'}`,
  borderRadius: '20px',
  padding: '36px',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  boxShadow: isHovered ? `0 20px 60px ${color}22` : '0 8px 30px rgba(0,0,0,0.3)',
  transform: isHovered ? 'translateY(-4px)' : 'none',
});

const featuredBadgeStyle = {
  position: 'absolute',
  top: '16px',
  right: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  background: 'hsl(263 85% 64% / 0.15)',
  border: '1px solid hsl(263 85% 64% / 0.4)',
  color: 'hsl(263 85% 74%)',
  padding: '4px 10px',
  borderRadius: '999px',
  fontSize: '0.7rem',
  fontWeight: '700',
};

const cardIconWrapStyle = (color) => ({
  width: '60px',
  height: '60px',
  borderRadius: '16px',
  background: `${color}18`,
  border: `1px solid ${color}33`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
});

const cardTitleStyle = {
  color: 'white',
  fontSize: '1.3rem',
  fontWeight: '800',
  margin: '0 0 10px',
};

const cardDescStyle = {
  color: 'hsl(215 20% 55%)',
  fontSize: '0.9rem',
  lineHeight: 1.65,
  margin: '0 0 24px',
};

const featureListStyle = {
  listStyle: 'none',
  padding: 0,
  margin: '0 0 28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const featureItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: 'hsl(215 20% 65%)',
  fontSize: '0.85rem',
};

const cardBtnStyle = (color) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  width: '100%',
  background: `${color}22`,
  border: `1px solid ${color}44`,
  color: color,
  padding: '13px',
  borderRadius: '12px',
  fontWeight: '700',
  fontSize: '0.92rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
});

const alreadyHaveAccountStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  marginTop: '36px',
  fontSize: '0.9rem',
};

const signInLinkStyle = {
  background: 'transparent',
  border: 'none',
  color: 'hsl(190 95% 60%)',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '0.9rem',
  textDecoration: 'none',
};

const featuresSectionStyle = {
  padding: '80px 40px',
  maxWidth: '1200px',
  margin: '0 auto',
  borderTop: '1px solid hsl(220 20% 12%)',
};

const featuresGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '24px',
};

const featureCardStyle = {
  background: 'hsl(220 30% 10%)',
  border: '1px solid hsl(220 20% 16%)',
  borderRadius: '16px',
  padding: '28px',
};

const footerStyle = {
  borderTop: '1px solid hsl(220 20% 12%)',
  padding: '30px 40px',
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};
