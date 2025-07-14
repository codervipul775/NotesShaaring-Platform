import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Clock, Search } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api';

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const statusBadge = (status) => {
  if (status === 'approved') return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border bg-green-100 text-green-700 border-green-300"><CheckCircle className="w-4 h-4" /> Approved</span>;
  if (status === 'pending') return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border bg-yellow-100 text-yellow-700 border-yellow-300"><Clock className="w-4 h-4" /> Pending</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border bg-red-100 text-red-700 border-red-300"><XCircle className="w-4 h-4" /> Rejected</span>;
};

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [changePwdError, setChangePwdError] = useState("");
  const [changePwdSuccess, setChangePwdSuccess] = useState("");
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState("");
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Always require login on mount/refresh
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/admin/login`, { password });
      if (res.data.token) {
        localStorage.setItem('adminToken', res.data.token);
        setIsAuthenticated(true);
        setError("");
      } else {
        setError('Login failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect password');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePwdError("");
    setChangePwdSuccess("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setChangePwdError("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangePwdError("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/admin/change-password`, {
        oldPassword,
        newPassword
      });
      setChangePwdSuccess(res.data.message || "Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePassword(false);
    } catch (err) {
      setChangePwdError(err.response?.data?.message || 'Failed to change password');
    }
  };

  // Fetch all notes for admin
  const fetchNotes = async () => {
    setNotesLoading(true);
    setNotesError("");
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_BASE_URL}/notes/admin/all`, {
        headers: { 'x-admin-token': token }
      });
      setNotes(res.data.notes || []);
    } catch {
      setNotesError('Failed to load notes');
    } finally {
      setNotesLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchNotes();
  }, [isAuthenticated]);

  // Approve, Reject, Delete handlers with confirmation
  const handleApprove = async (id) => {
    if (!window.confirm('Approve this note?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`${API_BASE_URL}/notes/admin/${id}/approve`, {}, {
        headers: { 'x-admin-token': token }
      });
      fetchNotes();
    } catch (error) {
      console.error('Approve error:', error);
    }
  };
  const handleReject = async (id) => {
    if (!window.confirm('Reject this note?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`${API_BASE_URL}/notes/admin/${id}/reject`, {}, {
        headers: { 'x-admin-token': token }
      });
      fetchNotes();
    } catch (error) {
      console.error('Reject error:', error);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note? This cannot be undone.')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_BASE_URL}/notes/admin/${id}`, {
        headers: { 'x-admin-token': token }
      });
      fetchNotes();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Filtering and searching
  const filteredNotes = notes.filter(note =>
    (!filterStatus || note.status === filterStatus) &&
    (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.description || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Status summary
  const summary = {
    pending: notes.filter(n => n.status === 'pending').length,
    approved: notes.filter(n => n.status === 'approved').length,
    rejected: notes.filter(n => n.status === 'rejected').length,
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-background">
        {/* Admin Header */}
        <header className="w-full bg-card shadow p-6 flex flex-col md:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2 md:mb-0">Admin Panel</h1>
          <button
            className="bg-primary text-white py-2 px-4 rounded font-semibold shadow hover:bg-primary/90 transition"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            {showChangePassword ? 'Cancel' : 'Change Password'}
          </button>
        </header>
        {/* Change Password Form */}
        {showChangePassword && (
          <form onSubmit={handleChangePassword} className="bg-card p-6 rounded shadow-lg w-full max-w-md mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">Change Password</h2>
            <input
              type="password"
              placeholder="Old password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            />
            {changePwdError && <div className="text-red-500 mb-2">{changePwdError}</div>}
            {changePwdSuccess && <div className="text-green-600 mb-2">{changePwdSuccess}</div>}
            <button type="submit" className="w-full bg-primary text-white py-2 rounded font-semibold">Save Password</button>
          </form>
        )}
        {/* Status Summary & Filters */}
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
          <div className="flex gap-4">
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full"><Clock className="w-4 h-4" /> Pending: {summary.pending}</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full"><CheckCircle className="w-4 h-4" /> Approved: {summary.approved}</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-full"><XCircle className="w-4 h-4" /> Rejected: {summary.rejected}</span>
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="status" className="text-sm font-medium">Status:</label>
            <select
              id="status"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="relative">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="border rounded px-2 py-1 text-sm pl-8"
              />
              <Search className="absolute left-2 top-1.5 w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>
        {/* Notes Table */}
        <div className="bg-card p-4 rounded shadow-lg w-full max-w-4xl overflow-x-auto">
          <h3 className="text-xl font-bold mb-4 text-foreground">All Notes (Validation)</h3>
          {notesLoading ? (
            <div>Loading notes...</div>
          ) : notesError ? (
            <div className="text-red-500">{notesError}</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border-b p-2">Title</th>
                  <th className="border-b p-2">Subject</th>
                  <th className="border-b p-2">Status</th>
                  <th className="border-b p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotes.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-4 text-muted-foreground">No notes found.</td></tr>
                ) : (
                  filteredNotes.map((note, idx) => (
                    <tr key={note._id} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/50'}>
                      <td className="p-2 font-medium max-w-xs truncate" title={note.title}>{note.title}</td>
                      <td className="p-2 text-sm max-w-xs truncate" title={note.subject}>{note.subject}</td>
                      <td className="p-2">{statusBadge(note.status)}</td>
                      <td className="p-2 flex gap-2 flex-wrap">
                        {note.status !== 'approved' && (
                          <button title="Approve" onClick={() => handleApprove(note._id)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded transition">Approve</button>
                        )}
                        {note.status !== 'rejected' && (
                          <button title="Reject" onClick={() => handleReject(note._id)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded transition">Reject</button>
                        )}
                        <button title="Delete" onClick={() => handleDelete(note._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="bg-card p-8 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Admin Login</h2>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button type="submit" className="w-full bg-primary text-white py-2 rounded font-semibold">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin; 