// Central API Service for HireTrax

const API_BASE_URL = '/api';

// Helper to get headers with JWT token
const getHeaders = () => {
    const token = localStorage.getItem('hiretrax_jwt');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const api = {
    // ─── AUTH ────────────────────────────────────────────────────────────────
    register: async (userData) => {
        const res = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    login: async (credentials) => {
        const res = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    createCompanyStaff: async (userData) => {
        const res = await fetch(`${API_BASE_URL}/users/company-staff`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(userData)
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    getCompanyStaff: async () => {
        const res = await fetch(`${API_BASE_URL}/users/company-staff`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // ─── COMPANIES ───────────────────────────────────────────────────────────
    getCompanies: async () => {
        const res = await fetch(`${API_BASE_URL}/companies`);
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    createCompany: async (companyData) => {
        const res = await fetch(`${API_BASE_URL}/companies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(companyData)
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // ─── JOBS ────────────────────────────────────────────────────────────────
    getJobs: async () => {
        const res = await fetch(`${API_BASE_URL}/jobs`);
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    createJob: async (jobData) => {
        const res = await fetch(`${API_BASE_URL}/jobs`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(jobData)
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    updateJob: async (id, jobData) => {
        const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(jobData)
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    deleteJob: async (id) => {
        const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // ─── APPLICATIONS ────────────────────────────────────────────────────────

    // Candidate: view my own applications
    getMyApplications: async () => {
        const res = await fetch(`${API_BASE_URL}/applications/my`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // Recruiter/Admin/HiringManager: view all applications
    getAllApplications: async () => {
        const res = await fetch(`${API_BASE_URL}/applications`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // Recruiter/Admin: view applications for a specific job
    getApplicationsForJob: async (jobId) => {
        const res = await fetch(`${API_BASE_URL}/applications/job/${jobId}`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // Candidate: submit a job application
    getAuditLogs: async () => {
        const res = await fetch(`${API_BASE_URL}/auditlogs`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch audit logs');
        return res.json();
    },

    // Candidate: submit a job application
    createApplication: async (appData) => {
        const res = await fetch(`${API_BASE_URL}/applications`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(appData)
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // Recruiter/Admin: update application status
    updateApplicationStatus: async (id, data) => {
        const res = await fetch(`${API_BASE_URL}/applications/${id}/status`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // Recruiter/Admin: trigger AI scoring for an application
    computeAiScore: async (applicationId) => {
        const res = await fetch(`${API_BASE_URL}/applications/${applicationId}/ai-score`, {
            method: 'PUT',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // ─── INTERVIEWS ──────────────────────────────────────────────────────────

    // View interviews for a specific application
    getInterviewsForApplication: async (applicationId) => {
        const res = await fetch(`${API_BASE_URL}/interviews/application/${applicationId}`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // Recruiter/Admin: schedule an interview
    scheduleInterview: async (data) => {
        const res = await fetch(`${API_BASE_URL}/interviews`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // Recruiter/Admin: update interview status
    updateInterviewStatus: async (id, status) => {
        const res = await fetch(`${API_BASE_URL}/interviews/${id}/status`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(status)
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // ─── EVALUATIONS ─────────────────────────────────────────────────────────

    // View evaluations for an application
    getEvaluationsForApplication: async (applicationId) => {
        const res = await fetch(`${API_BASE_URL}/evaluations/application/${applicationId}`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // HiringManager: submit evaluation
    submitEvaluation: async (data) => {
        const res = await fetch(`${API_BASE_URL}/evaluations`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // ─── CANDIDATE PROFILE ───────────────────────────────────────────────────

    // Get profile for a user
    getProfile: async (userId) => {
        const res = await fetch(`${API_BASE_URL}/profiles/${userId}`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // Save/update profile
    saveProfile: async (profileData) => {
        const res = await fetch(`${API_BASE_URL}/profiles/manage`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(profileData)
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // Upload resume file
    uploadResume: async (userId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        const token = localStorage.getItem('hiretrax_jwt');
        const res = await fetch(`${API_BASE_URL}/profiles/upload-resume/${userId}`, {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: formData
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // ─── ADMIN ───────────────────────────────────────────────────────────────

    // Get all users (admin only)
    getAdminUsers: async () => {
        const res = await fetch(`${API_BASE_URL}/admin/users`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // Update user role (admin only)
    updateUserRole: async (userId, roleId) => {
        const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ roleId })
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // Delete user (admin only)
    deleteUser: async (userId) => {
        const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // Get analytics (admin only)
    getAnalytics: async () => {
        const res = await fetch(`${API_BASE_URL}/admin/analytics`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // Get roles list (admin only)
    getRoles: async () => {
        const res = await fetch(`${API_BASE_URL}/admin/roles`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // ─── NOTIFICATIONS ───────────────────────────────────────────────────────

    sendEmail: async (to, subject, message) => {
        const res = await fetch(`${API_BASE_URL}/notification/email`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ to, subject, message })
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    sendSms: async (to, message) => {
        const res = await fetch(`${API_BASE_URL}/notification/sms`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ to, message })
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // ─── AI RECOMMENDATIONS ──────────────────────────────────────────────────

    // Candidate: get AI-powered job recommendations based on profile skills
    getRecommendations: async () => {
        const res = await fetch(`${API_BASE_URL}/recommendations`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    // ─── AUDIT LOGS ──────────────────────────────────────────────────────────

    // Admin: get system audit logs
    getAuditLogs: async () => {
        const res = await fetch(`${API_BASE_URL}/admin/audit-logs`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },

    getAuditLogsByUser: async (userId) => {
        const res = await fetch(`${API_BASE_URL}/admin/audit-logs/user/${userId}`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },
};
