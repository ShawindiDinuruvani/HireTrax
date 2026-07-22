import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  User,
  FileText,
  Calendar,
  Layers,
  Settings,
  Database,
  CheckSquare,
  RefreshCw,
  Menu,
  X,
  Sparkles,
  LogOut,
  ChevronDown,
  Target,
  Shield,
} from 'lucide-react';

/* ── Demo user info per role ──────────────────────────────── */
const ROLE_META = {
  candidate: {
    label: 'Job Seeker',
    name: 'Alice Smith',
    email: 'alice@hiretrax.io',
    color: 'hsl(190 95% 50%)',
    bg: 'hsl(190 95% 50% / 0.12)',
  },

  recruiter: {
    label: 'Recruiter',
    name: 'Emma Watson',
    email: 'emma@hiretrax.io',
    color: 'hsl(263 85% 64%)',
    bg: 'hsl(263 85% 64% / 0.12)',
  },

  hiring_manager: {
    label: 'Hiring Manager',
    name: 'Sarah Jenkins',
    email: 'sarah@hiretrax.io',
    color: 'hsl(45 93% 47%)',
    bg: 'hsl(45 93% 47% / 0.12)',
  },

  admin: {
    label: 'Administrator',
    name: 'System Admin',
    email: 'admin@hiretrax.io',
    color: 'hsl(142 76% 45%)',
    bg: 'hsl(142 76% 45% / 0.12)',
  },

  company_admin: {
    label: 'Company Admin',
    name: 'Company Admin',
    email: 'admin@company.com',
    color: 'hsl(263 85% 64%)',
    bg: 'hsl(263 85% 64% / 0.12)',
  },
};

export default function Layout({ children }) {
  const {
    currentRole,
    currentUser,
    logout,
    resetAllData,
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const meta = ROLE_META[currentRole] || ROLE_META.candidate;

  // Use the registered user's information when available
  const displayName = currentUser?.fullName || meta.name;
  const displayEmail = currentUser?.email || meta.email;

  /* ── Navigation items per role ──────────────────────────── */
  const getNavItems = () => {
    switch (currentRole) {
      case 'candidate':
        return [
          {
            label: 'Job Finder',
            path: '/dashboard',
            icon: Briefcase,
          },
          {
            label: 'My Applications',
            path: '/dashboard/candidate/applications',
            icon: FileText,
          },
          {
            label: 'Skill Gap Analysis',
            path: '/skill-gap',
            icon: Target,
          },
          {
            label: 'Profile & Resume',
            path: '/dashboard/candidate/profile',
            icon: User,
          },
        ];

      case 'recruiter':
        return [
          {
            label: 'Talent Dashboard',
            path: '/dashboard',
            icon: Layers,
          },
          {
            label: 'Post a Job',
            path: '/dashboard/recruiter/post-job',
            icon: Briefcase,
          },
          {
            label: 'Skill Gap Analysis',
            path: '/skill-gap',
            icon: Target,
          },
          {
            label: 'Schedule Interviews',
            path: '/dashboard/recruiter/interviews',
            icon: Calendar,
          },
        ];

      case 'hiring_manager':
        return [
          {
            label: 'Assessment Console',
            path: '/dashboard',
            icon: CheckSquare,
          },
          {
            label: 'Skill Gap Analysis',
            path: '/skill-gap',
            icon: Target,
          },
        ];

      case 'company_admin':
        return [
          {
            label: 'Company Admin',
            path: '/dashboard',
            icon: Shield,
          },
        ];

      case 'admin':
        return [
          {
            label: 'Admin Terminal',
            path: '/dashboard',
            icon: Settings,
          },
          {
            label: 'Skill Gap Analysis',
            path: '/skill-gap',
            icon: Target,
          },
        ];

      default:
        return [];
    }
  };

  const navItems = [
    ...getNavItems(),
    {
      label: 'C# API Testing',
      path: '/dashboard/integration-demo',
      icon: Database,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleReset = () => {
    if (window.confirm('Reset prototype database to default seed data?')) {
      resetAllData();
      navigate('/');
    }
  };

  return (
    <div style={layoutStyle}>
      {/* Desktop sidebar */}
      <aside style={sidebarStyle} className="glass-card">
        {/* Logo */}
        <div style={logoContainerStyle}>
          <div style={logoIconStyle}>
            <Sparkles size={18} color="hsl(190 95% 50%)" />
          </div>

          <div>
            <h1 style={logoTitleStyle}>
              Hire
              <span style={{ color: 'hsl(263 85% 64%)' }}>
                Trax
              </span>
            </h1>

            <span style={logoSubStyle}>
              AI TALENT MANAGEMENT
            </span>
          </div>
        </div>

        <div style={dividerStyle} />

        {/* Navigation links */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path;

            return (
              <button
                key={label}
                type="button"
                onClick={() => navigate(path)}
                style={active ? activeNavStyle : navStyle}
                className="glass-card-interactive"
              >
                <Icon
                  size={17}
                  color={
                    active
                      ? 'hsl(190 95% 50%)'
                      : 'hsl(215 20% 55%)'
                  }
                />

                <span
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: active ? '600' : '400',
                  }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div style={{ marginTop: 'auto' }}>
          {/* Role badge */}
          <div style={rolePillStyle(meta.color, meta.bg)}>
            <div style={roleDotStyle(meta.color)} />

            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: '700',
                color: meta.color,
              }}
            >
              {meta.label} Portal
            </span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            style={resetBtnStyle}
          >
            <RefreshCw size={13} />
            <span>Reset Demo DB</span>
          </button>

          <div style={sidebarFooterStyle}>
            <div style={onlineDotStyle} />

            <span
              style={{
                fontSize: '0.78rem',
                color: 'hsl(215 20% 40%)',
              }}
            >
              System Online
            </span>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div style={mainAreaStyle}>
        {/* Header */}
        <header style={headerStyle} className="glass-card">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            style={mobileToggleStyle}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Page label */}
          <div style={pageLabelStyle}>
            <span style={pageLabelTextStyle}>
              {meta.label} Portal
            </span>
          </div>

          {/* User profile */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((value) => !value)}
              style={userChipStyle(meta.bg, meta.color)}
            >
              <div style={avatarStyle(meta.color)}>
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div style={{ textAlign: 'left' }}>
                <p
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    color: 'white',
                    lineHeight: 1,
                  }}
                >
                  {displayName}
                </p>

                <p
                  style={{
                    fontSize: '0.72rem',
                    color: 'hsl(215 20% 55%)',
                    lineHeight: 1.4,
                  }}
                >
                  {displayEmail}
                </p>
              </div>

              <ChevronDown
                size={14}
                color="hsl(215 20% 55%)"
              />
            </button>

            {/* User dropdown */}
            {userMenuOpen && (
              <div style={dropdownStyle} className="glass-card">
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleLogout();
                  }}
                  style={dropdownItemStyle}
                >
                  <LogOut
                    size={15}
                    color="hsl(350 89% 60%)"
                  />

                  <span
                    style={{
                      color: 'hsl(350 89% 60%)',
                      fontSize: '0.88rem',
                      fontWeight: '600',
                    }}
                  >
                    Sign Out
                  </span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Mobile navigation drawer */}
        {mobileOpen && (
          <div style={mobileDrawerStyle} className="glass-card">
            <nav
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {navItems.map(({ label, path, icon: Icon }) => {
                const active = location.pathname === path;

                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      navigate(path);
                      setMobileOpen(false);
                    }}
                    style={active ? activeNavStyle : navStyle}
                  >
                    <Icon size={17} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              style={{
                ...resetBtnStyle,
                marginTop: '16px',
                borderColor: 'hsl(350 89% 60% / 0.3)',
                color: 'hsl(350 89% 60%)',
              }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Page content */}
        <main style={contentStyle}>
          {children}
        </main>
      </div>
    </div>
  );
}

/* ── Styles ───────────────────────────────────────────────── */

const layoutStyle = {
  display: 'flex',
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  position: 'relative',
  zIndex: 10,
};

const sidebarStyle = {
  width: '268px',
  height: 'calc(100vh - 32px)',
  margin: '16px 0 16px 16px',
  display: 'flex',
  flexDirection: 'column',
  padding: '22px',
  borderRadius: '18px',
  flexShrink: 0,
};

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '4px',
};

const logoIconStyle = {
  width: '34px',
  height: '34px',
  borderRadius: '9px',
  background: 'hsl(190 95% 50% / 0.1)',
  border: '1px solid hsl(190 95% 50% / 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const logoTitleStyle = {
  fontSize: '1.22rem',
  fontWeight: '800',
  lineHeight: 1,
  fontFamily: 'var(--font-header)',
};

const logoSubStyle = {
  fontSize: '0.6rem',
  color: 'hsl(215 20% 40%)',
  letterSpacing: '0.15em',
  fontWeight: '700',
};

const dividerStyle = {
  height: '1px',
  backgroundColor: 'hsl(217 20% 16%)',
  margin: '18px 0',
};

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '11px',
  width: '100%',
  padding: '11px 14px',
  background: 'transparent',
  border: '1px solid transparent',
  borderRadius: '8px',
  color: 'hsl(215 20% 55%)',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all var(--transition-fast)',
};

const activeNavStyle = {
  ...navStyle,
  background: 'hsl(190 95% 50% / 0.08)',
  borderColor: 'hsl(190 95% 50% / 0.2)',
  color: 'white',
};

const rolePillStyle = (color, bg) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: bg,
  border: `1px solid ${color
    .replace(')', ' / 0.25)')
    .replace('hsl(', 'hsl(')}`,
  borderRadius: '99px',
  padding: '7px 14px',
  marginBottom: '10px',
});

const roleDotStyle = (color) => ({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: color,
  boxShadow: `0 0 6px ${color}`,
  flexShrink: 0,
});

const resetBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  width: '100%',
  padding: '8px',
  background: 'transparent',
  border: '1px dashed hsl(217 20% 20%)',
  color: 'hsl(215 20% 45%)',
  fontSize: '0.75rem',
  cursor: 'pointer',
  borderRadius: '7px',
  transition: 'color 0.2s, border-color 0.2s',
};

const sidebarFooterStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '12px',
};

const onlineDotStyle = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: 'hsl(142 76% 45%)',
  boxShadow: '0 0 6px hsl(142 76% 45%)',
};

const mainAreaStyle = {
  flexGrow: 1,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const headerStyle = {
  height: '68px',
  margin: '16px 16px 0 16px',
  padding: '0 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: '12px',
  flexShrink: 0,
};

const mobileToggleStyle = {
  display: 'none',
  background: 'transparent',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
};

const pageLabelStyle = {
  display: 'flex',
  alignItems: 'center',
};

const pageLabelTextStyle = {
  fontSize: '0.82rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'hsl(215 20% 50%)',
};

const userChipStyle = (bg, color) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  background: bg,
  border: `1px solid ${color
    .replace(')', ' / 0.25)')
    .replace('hsl(', 'hsl(')}`,
  borderRadius: '99px',
  padding: '6px 14px 6px 6px',
  cursor: 'pointer',
  transition: 'all 0.2s',
});

const avatarStyle = (color) => ({
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  background: color
    .replace(')', ' / 0.2)')
    .replace('hsl(', 'hsl('),
  color,
  fontWeight: '800',
  fontSize: '0.8rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const dropdownStyle = {
  position: 'absolute',
  top: 'calc(100% + 8px)',
  right: 0,
  minWidth: '160px',
  padding: '8px',
  zIndex: 200,
};

const dropdownItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '10px 14px',
  background: 'transparent',
  border: 'none',
  borderRadius: '7px',
  cursor: 'pointer',
  transition: 'background 0.15s',
};

const contentStyle = {
  flexGrow: 1,
  overflowY: 'auto',
  padding: '24px',
};

const mobileDrawerStyle = {
  position: 'absolute',
  top: '86px',
  left: '16px',
  right: '16px',
  zIndex: 100,
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
};