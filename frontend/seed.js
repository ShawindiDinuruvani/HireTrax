const API_BASE = 'http://localhost:5027/api';

async function req(endpoint, method = 'GET', body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`[${method}] ${endpoint} failed: ${err}`);
    }
    try { return await res.json(); } catch { return null; }
}

async function seed() {
    console.log("🌱 Starting Full Database Seed (with Companies)...");

    // 1. Admin login
    console.log("Authenticating as Admin...");
    let adminToken;
    try {
        const r = await req('/users/login', 'POST', { email: 'admin@gmail.com', password: 'admin123' });
        adminToken = r.token;
        console.log("✅ Admin logged in.");
    } catch (e) {
        console.error("❌ Admin login failed:", e.message); return;
    }

    // 2. Register 2 Companies
    console.log("\n📦 Creating Companies...");
    let companyA, companyB;
    try {
        companyA = (await req('/companies', 'POST', { name: 'HireTrax Corp', industry: 'Technology', contactEmail: 'hr@hiretrax.io' })).company;
        console.log(`✅ Company A: "${companyA.name}" (ID: ${companyA.id})`);
    } catch (e) { console.log("⚠️ Company A:", e.message); }

    try {
        companyB = (await req('/companies', 'POST', { name: 'FinTech Solutions Ltd', industry: 'Finance', contactEmail: 'hr@fintech.io' })).company;
        console.log(`✅ Company B: "${companyB.name}" (ID: ${companyB.id})`);
    } catch (e) { console.log("⚠️ Company B:", e.message); }

    if (!companyA || !companyB) { console.error("❌ Companies not created. Aborting."); return; }

    // 3. Register Recruiters (one per company)
    console.log("\n👔 Registering Recruiters...");
    let recruiterAToken, recruiterAId;
    let recruiterBToken, recruiterBId;

    try {
        const r = await req('/users/register', 'POST', { fullName: 'Emma (HireTrax)', email: 'emma@hiretrax.io', password: 'Password@123', roleId: 2, companyId: companyA.id });
        recruiterAId = r.userId;
        const login = await req('/users/login', 'POST', { email: 'emma@hiretrax.io', password: 'Password@123' });
        recruiterAToken = login.token;
        console.log(`✅ Recruiter A: Emma (Company: ${companyA.name})`);
    } catch (e) { console.log("⚠️ Recruiter A:", e.message); }

    try {
        const r = await req('/users/register', 'POST', { fullName: 'James (FinTech)', email: 'james@fintech.io', password: 'Password@123', roleId: 2, companyId: companyB.id });
        recruiterBId = r.userId;
        const login = await req('/users/login', 'POST', { email: 'james@fintech.io', password: 'Password@123' });
        recruiterBToken = login.token;
        console.log(`✅ Recruiter B: James (Company: ${companyB.name})`);
    } catch (e) { console.log("⚠️ Recruiter B:", e.message); }

    // 4. Register Hiring Managers (one per company)
    console.log("\n🎯 Registering Hiring Managers...");
    try {
        await req('/users/register', 'POST', { fullName: 'Sara HM (HireTrax)', email: 'sara.hm@hiretrax.io', password: 'Password@123', roleId: 3, companyId: companyA.id });
        console.log(`✅ Hiring Manager A: Sara (Company: ${companyA.name})`);
    } catch (e) { console.log("⚠️ HM A:", e.message); }

    try {
        await req('/users/register', 'POST', { fullName: 'Kevin HM (FinTech)', email: 'kevin.hm@fintech.io', password: 'Password@123', roleId: 3, companyId: companyB.id });
        console.log(`✅ Hiring Manager B: Kevin (Company: ${companyB.name})`);
    } catch (e) { console.log("⚠️ HM B:", e.message); }

    // 5. Register Candidates (no company needed)
    console.log("\n👤 Registering Candidates...");
    const candidateData = [
        { fullName: "John Developer", email: "john@example.com", skills: "React, Node.js, JavaScript, TypeScript, SQL", experience: "5 years building web applications." },
        { fullName: "Sarah Designer",  email: "sarah@example.com", skills: "Figma, UI/UX, CSS, HTML, Adobe XD",           experience: "3 years designing mobile apps." },
        { fullName: "Mike Data",       email: "mike@example.com",  skills: "Python, Machine Learning, SQL, TensorFlow",    experience: "Data scientist with 4 years in finance." }
    ];

    const candidates = [];
    for (const c of candidateData) {
        try {
            const r = await req('/users/register', 'POST', { fullName: c.fullName, email: c.email, password: 'Password@123', roleId: 1 });
            const login = await req('/users/login', 'POST', { email: c.email, password: 'Password@123' });
            await req('/profiles/manage', 'POST', { userId: r.userId, fullName: c.fullName, professionalSummary: 'Passionate professional.', skills: c.skills, experience: c.experience }, login.token);
            candidates.push({ id: r.userId, token: login.token });
            console.log(`✅ Candidate: ${c.fullName}`);
        } catch (e) { console.log(`⚠️ Candidate ${c.fullName}:`, e.message); }
    }

    // 6. Create Jobs — 2 for Company A, 1 for Company B
    console.log("\n💼 Creating Jobs...");
    const jobIds = [];

    if (recruiterAToken) {
        const jobsA = [
            { title: "Senior React Engineer", department: "Engineering", location: "Remote", type: "Full-Time", description: "Build our frontend platform.", requirements: "React, TypeScript experience.", aiPreferredSkills: "React, Node.js, TypeScript, JavaScript", companyName: companyA.name, postedByUserId: recruiterAId },
            { title: "UI/UX Designer",        department: "Design",       location: "Colombo", type: "Full-Time", description: "Design beautiful interfaces.",   requirements: "Figma expertise.",           aiPreferredSkills: "Figma, UI/UX, CSS, Adobe XD",           companyName: companyA.name, postedByUserId: recruiterAId }
        ];
        for (const j of jobsA) {
            try {
                const r = await req('/jobs', 'POST', j, recruiterAToken);
                jobIds.push({ id: r.job.id, company: 'A' });
                console.log(`✅ Job "${j.title}" (Company A, ID: ${r.job.id})`);
            } catch (e) { console.log(`⚠️ Job error:`, e.message); }
        }
    }

    if (recruiterBToken) {
        const jobB = { title: "Data Scientist", department: "Engineering", location: "London, UK", type: "Contract", description: "Analyze large financial datasets.", requirements: "Python and ML knowledge.", aiPreferredSkills: "Python, Machine Learning, Data Analysis, SQL", companyName: companyB.name, postedByUserId: recruiterBId };
        try {
            const r = await req('/jobs', 'POST', jobB, recruiterBToken);
            jobIds.push({ id: r.job.id, company: 'B' });
            console.log(`✅ Job "${jobB.title}" (Company B, ID: ${r.job.id})`);
        } catch (e) { console.log(`⚠️ Job error:`, e.message); }
    }

    // 7. Submit Applications
    console.log("\n📋 Submitting Applications...");
    const companyAJobs = jobIds.filter(j => j.company === 'A');
    const companyBJobs = jobIds.filter(j => j.company === 'B');

    if (candidates[0] && companyAJobs[0]) {
        await req('/applications', 'POST', { jobId: companyAJobs[0].id, candidateId: candidates[0].id }, candidates[0].token);
        console.log("✅ John → Senior React Engineer (Company A)");
    }
    if (candidates[1] && companyAJobs[1]) {
        await req('/applications', 'POST', { jobId: companyAJobs[1].id, candidateId: candidates[1].id }, candidates[1].token);
        console.log("✅ Sarah → UI/UX Designer (Company A)");
    }
    if (candidates[2] && companyBJobs[0]) {
        await req('/applications', 'POST', { jobId: companyBJobs[0].id, candidateId: candidates[2].id }, candidates[2].token);
        console.log("✅ Mike → Data Scientist (Company B)");
    }
    // Cross-apply test
    if (candidates[0] && companyBJobs[0]) {
        await req('/applications', 'POST', { jobId: companyBJobs[0].id, candidateId: candidates[0].id }, candidates[0].token);
        console.log("✅ John → Data Scientist (Company B) [Low match test]");
    }

    console.log("\n🎉 Full Seed Complete!\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔑 LOGIN CREDENTIALS");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Admin:                admin@gmail.com      / admin123");
    console.log("Recruiter (Co. A):    emma@hiretrax.io       / Password@123");
    console.log("Recruiter (Co. B):    james@fintech.io       / Password@123");
    console.log("Hiring Mgr (Co. A):   sara.hm@hiretrax.io   / Password@123");
    console.log("Hiring Mgr (Co. B):   kevin.hm@fintech.io   / Password@123");
    console.log("Candidate:            john@example.com       / Password@123");
    console.log("Candidate:            sarah@example.com      / Password@123");
    console.log("Candidate:            mike@example.com       / Password@123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

seed();
