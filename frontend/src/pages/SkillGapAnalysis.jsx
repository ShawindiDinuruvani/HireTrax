import React, { useState } from 'react';

const SkillGapAnalysis = () => {
  // Example candidate skills and job required skills
  const [candidateSkills, setCandidateSkills] = useState(['Java', 'React', 'HTML', 'CSS']);
  const [jobSkills, setJobSkills] = useState(['Java', 'React', 'Spring Boot', 'MySQL', 'Tailwind']);
  const [newSkill, setNewSkill] = useState('');

  // Find matching and missing skills
  const matchingSkills = jobSkills.filter(skill =>
    candidateSkills.some(cSkill => cSkill.toLowerCase() === skill.toLowerCase())
  );

  const missingSkills = jobSkills.filter(skill =>
    !candidateSkills.some(cSkill => cSkill.toLowerCase() === skill.toLowerCase())
  );

  // Calculate percentage
  const matchPercentage = Math.round((matchingSkills.length / jobSkills.length) * 100);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !candidateSkills.includes(newSkill)) {
      setCandidateSkills([...candidateSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: 'auto', fontFamily: 'sans-serif' }}>
      {/* MODIFIED: Removed the emoji from the heading */}
      <h2>Skill Gap Analysis Dashboard</h2>

      {/* Match Score Card */}
      <div style={{
        background: '#f0f4f8',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '25px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ margin: 0, color: '#555' }}>Overall Skill Match</h3>
        <h1 style={{ color: matchPercentage >= 70 ? '#2e7d32' : '#d32f2f', fontSize: '52px', margin: '10px 0' }}>
          {matchPercentage}%
        </h1>
      </div>

      {/* Input to add candidate skill */}
      <form onSubmit={handleAddSkill} style={{ marginBottom: '25px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a new skill (e.g. Spring Boot)..."
          style={{ padding: '10px', flex: 1, borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', background: '#1976d2', color: 'white', border: 'none' }}>
          Add Skill
        </button>
      </form>

      {/* Skills Display Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Matching Skills */}
        <div style={{ border: '1px solid #c8e6c9', padding: '20px', borderRadius: '10px', background: '#e8f5e9' }}>
          {/* MODIFIED: Removed the checkmark emoji from the header */}
          <h4 style={{ color: '#2e7d32', marginTop: 0 }}>Matching Skills ({matchingSkills.length})</h4>
          <ul style={{ paddingLeft: '20px' }}>
            {matchingSkills.map((skill, index) => (
              // MODIFIED: Changed the skill list item color from dark green (#2e7d32) to gray (#555)
              <li key={index} style={{ fontWeight: 'bold', margin: '8px 0', color: '#555' }}>{skill}</li>
            ))}
          </ul>
        </div>

        {/* Missing Skills */}
        <div style={{ border: '1px solid #ffcdd2', padding: '20px', borderRadius: '10px', background: '#ffebee' }}>
          {/* MODIFIED: Removed the warning emoji from the header */}
          <h4 style={{ color: '#c62828', marginTop: 0 }}>Missing Skills / Gap ({missingSkills.length})</h4>
          <ul style={{ paddingLeft: '20px' }}>
            {missingSkills.map((skill, index) => (
              <li key={index} style={{ color: '#c62828', margin: '8px 0' }}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SkillGapAnalysis;