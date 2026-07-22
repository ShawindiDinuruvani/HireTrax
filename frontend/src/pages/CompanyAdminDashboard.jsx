import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Users, Briefcase, Plus, Shield, RefreshCw } from 'lucide-react';

export default function CompanyAdminDashboard() {
  const { currentUser } = useApp();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaff, setNewStaff] = useState({ fullName: '', email: '', password: '', roleId: '2' });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await api.getCompanyStaff();
      setStaff(data);
    } catch (err) {
      setError('Failed to load staff list.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.fullName || !newStaff.email || !newStaff.password) {
      alert('Please fill all fields');
      return;
    }

    try {
      await api.createCompanyStaff({
        fullName: newStaff.fullName,
        email: newStaff.email,
        password: newStaff.password,
        roleId: parseInt(newStaff.roleId)
      });
      setShowAddForm(false);
      setNewStaff({ fullName: '', email: '', password: '', roleId: '2' });
      fetchStaff();
    } catch (err) {
      alert(err.message || 'Failed to add staff');
    }
  };

  const pageStyle = {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  };

  const cardStyle = {
    background: 'linear-gradient(145deg, hsl(220 30% 12%), hsl(220 30% 8%))',
    border: '1px solid hsl(220 20% 20%)',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
  };

  const tableHeaderStyle = {
    textAlign: 'left',
    padding: '12px 15px',
    color: 'hsl(215 20% 65%)',
    fontWeight: '500',
    fontSize: '0.85rem',
    borderBottom: '1px solid hsl(220 20% 20%)'
  };

  const tableCellStyle = {
    padding: '15px',
    color: 'white',
    borderBottom: '1px solid hsl(220 20% 16%)',
    fontSize: '0.9rem'
  };

  const btnPrimary = {
    background: 'hsl(263 85% 64%)',
    color: 'white',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem'
  };

  const inputStyle = {
    background: 'hsl(220 30% 8%)',
    border: '1px solid hsl(220 20% 25%)',
    padding: '10px 14px',
    borderRadius: '8px',
    color: 'white',
    width: '100%',
    marginBottom: '15px'
  };

  return (
    <div style={pageStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '2rem', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={28} color="hsl(263 85% 64%)" /> Company Admin Dashboard
          </h1>
          <p style={{ color: 'hsl(215 20% 65%)', margin: 0, fontSize: '0.95rem' }}>
            Manage your recruitment team and view company activity.
          </p>
        </div>
        <button style={btnPrimary} onClick={() => setShowAddForm(true)}>
          <Plus size={16} /> Add Staff Member
        </button>
      </div>

      {showAddForm && (
        <div style={cardStyle}>
          <h2 style={{ color: 'white', marginTop: 0 }}>Add New Staff Member</h2>
          <form onSubmit={handleAddStaff} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', color: 'hsl(215 20% 65%)', marginBottom: '5px' }}>Full Name</label>
              <input style={inputStyle} value={newStaff.fullName} onChange={e => setNewStaff({...newStaff, fullName: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'hsl(215 20% 65%)', marginBottom: '5px' }}>Email Address</label>
              <input type="email" style={inputStyle} value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'hsl(215 20% 65%)', marginBottom: '5px' }}>Temporary Password</label>
              <input type="password" style={inputStyle} value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'hsl(215 20% 65%)', marginBottom: '5px' }}>Role</label>
              <select style={inputStyle} value={newStaff.roleId} onChange={e => setNewStaff({...newStaff, roleId: e.target.value})}>
                <option value="2">Recruiter</option>
                <option value="3">Hiring Manager</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowAddForm(false)} style={{ ...btnPrimary, background: 'transparent', border: '1px solid hsl(220 20% 30%)', color: 'white' }}>Cancel</button>
              <button type="submit" style={btnPrimary}>Create Account</button>
            </div>
          </form>
        </div>
      )}

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} color="hsl(190 95% 50%)" /> Staff Members
          </h2>
          <button onClick={fetchStaff} style={{ background: 'transparent', border: 'none', color: 'hsl(215 20% 65%)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {loading ? (
          <p style={{ color: 'white' }}>Loading staff...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : staff.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'hsl(215 20% 55%)' }}>
            No staff members found. Add some to get started!
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>ID</th>
                <th style={tableHeaderStyle}>Email</th>
                <th style={tableHeaderStyle}>Role</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(s => (
                <tr key={s.id} style={{ transition: 'background 0.2s', ':hover': { background: 'hsl(220 30% 15%)' } }}>
                  <td style={tableCellStyle}>#{s.id}</td>
                  <td style={tableCellStyle}>{s.email}</td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      background: s.role === 'recruiter' ? 'hsl(263 85% 64% / 0.2)' : 'hsl(45 93% 47% / 0.2)',
                      color: s.role === 'recruiter' ? 'hsl(263 85% 74%)' : 'hsl(45 93% 60%)',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {s.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
