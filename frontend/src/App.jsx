import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import CursorAnimation from './components/CursorAnimation';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import CandidatePortal from './pages/CandidatePortal';
import RecruiterPortal from './pages/RecruiterPortal';
import PostJob from './pages/PostJob';
import ScheduleInterview from './pages/ScheduleInterview';
import HiringManagerDashboard from './pages/HiringManagerDashboard';
import AdminPortal from './pages/AdminPortal';
import IntegrationDemo from './pages/IntegrationDemo';
import './App.css';
import SkillGapAnalysis from './pages/SkillGapAnalysis';

/* ── Ambient decorative glow blobs ─────────────────────────── */
function BackgroundDecor() {
  return (
    <>
      <div style={blob1Style} />
      <div style={blob2Style} />
      <div style={blob3Style} />
    </>
  );
}

/* ── Role-driven router ─────────────────────────────────────── */
function RoleRouter() {
  const { currentRole } = useApp();

  if (currentRole === 'candidate') {
    return (
      <Routes>
        <Route path="/" element={<CandidatePortal />} />
        <Route path="/candidate/applications" element={<CandidatePortal />} />
        <Route path="/candidate/profile" element={<CandidatePortal />} />
        <Route path="/skill-gap" element={<SkillGapAnalysis />} />
        <Route path="/integration-demo" element={<IntegrationDemo />} />
        <Route path="*" element={<CandidatePortal />} />
      </Routes>
    );
  }

  if (currentRole === 'recruiter') {
    return (
      <Routes>
        <Route path="/" element={<RecruiterPortal />} />
        <Route path="/recruiter/post-job" element={<PostJob />} />
        <Route path="/recruiter/interviews" element={<ScheduleInterview />} />
        <Route path="/skill-gap" element={<SkillGapAnalysis />} />
        <Route path="/integration-demo" element={<IntegrationDemo />} />
        <Route path="*" element={<RecruiterPortal />} />
      </Routes>
    );
  }

  if (currentRole === 'hiring_manager') {
    return (
      <Routes>
        <Route path="/" element={<HiringManagerDashboard />} />
        <Route path="/integration-demo" element={<IntegrationDemo />} />
        <Route path="*" element={<HiringManagerDashboard />} />
      </Routes>
    );
  }

  if (currentRole === 'admin') {
    return (
      <Routes>
        <Route path="/" element={<AdminPortal />} />
        <Route path="/integration-demo" element={<IntegrationDemo />} />
        <Route path="*" element={<AdminPortal />} />
      </Routes>
    );
  }

  return null;
}

/* ── Auth gate — shows login or dashboard ───────────────────── */
function AuthGate() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <RoleRouter />
    </Layout>
  );
}

/* ── Root ───────────────────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <CursorAnimation />
        <BackgroundDecor />
        <AuthGate />
      </AppProvider>
    </BrowserRouter>
  );
}

/* ── Blob styles ────────────────────────────────────────────── */
const blob1Style = {
  position: 'fixed', top: '-100px', right: '-100px',
  width: '500px', height: '500px', borderRadius: '50%',
  background: 'radial-gradient(circle, hsl(263 85% 64% / 0.08) 0%, transparent 70%)',
  pointerEvents: 'none', zIndex: 2,
  animation: 'float 10s ease-in-out infinite',
};
const blob2Style = {
  position: 'fixed', bottom: '-150px', left: '-50px',
  width: '600px', height: '600px', borderRadius: '50%',
  background: 'radial-gradient(circle, hsl(190 95% 50% / 0.06) 0%, transparent 70%)',
  pointerEvents: 'none', zIndex: 2,
  animation: 'float 14s ease-in-out infinite reverse',
};
const blob3Style = {
  position: 'fixed', top: '40%', left: '40%',
  width: '400px', height: '400px', borderRadius: '50%',
  background: 'radial-gradient(circle, hsl(263 85% 64% / 0.04) 0%, transparent 70%)',
  pointerEvents: 'none', zIndex: 2,
  transform: 'translate(-50%, -50%)',
  animation: 'float 18s ease-in-out infinite',
};
