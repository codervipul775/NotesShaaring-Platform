import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function DoubtDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doubt, setDoubt] = useState(null);
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [posting, setPosting] = useState(false);
    const [editingAnswerId, setEditingAnswerId] = useState(null);
    const [editAnswerText, setEditAnswerText] = useState('');
    const [editingDoubt, setEditingDoubt] = useState(false);
    const [editDoubtTitle, setEditDoubtTitle] = useState('');
    const [editDoubtSubject, setEditDoubtSubject] = useState('');
    let currentUserId = null;
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            currentUserId = decoded.userId || decoded.id || decoded.sub;
        } catch {
            currentUserId = null;
        }
    }

    useEffect(() => {
        fetchDoubt();
        // eslint-disable-next-line
    }, [id]);

    const fetchDoubt = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get('https://notesshaaring-platform-1.onrender.com/api/doubts/' + id);
            setDoubt(res.data.doubt);
        } catch {
            setError('Failed to load doubt.');
        }
        setLoading(false);
    };

    const handlePostAnswer = async () => {
        if (!answer.trim()) return;
        setPosting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`/api/doubts/${id}/answers`, { text: answer }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoubt((prev) => ({ ...prev, answers: [...(prev.answers || []), res.data.answer] }));
            setAnswer('');
        } catch {
            // handle error
        }
        setPosting(false);
    };

    const handleEditAnswer = (ans) => {
        setEditingAnswerId(ans._id);
        setEditAnswerText(ans.text);
    };

    const handleEditAnswerSave = async (ansId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`/api/doubts/${id}/answers/${ansId}`, { text: editAnswerText }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoubt(prev => ({
                ...prev,
                answers: prev.answers.map(a => a._id === ansId ? res.data.answer : a)
            }));
            setEditingAnswerId(null);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                alert('This answer no longer exists. The page will refresh.');
                fetchDoubt();
                setEditingAnswerId(null);
            } else {
                alert('Failed to edit answer.');
            }
        }
    };

    const handleDeleteAnswer = async (ansId) => {
        if (!window.confirm('Delete this answer?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/doubts/${id}/answers/${ansId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoubt(prev => ({
                ...prev,
                answers: prev.answers.filter(a => a._id !== ansId)
            }));
        } catch (err) {
            if (err.response && err.response.status === 404) {
                alert('This answer was already deleted. The page will refresh.');
                fetchDoubt();
            } else {
                alert('Failed to delete answer.');
            }
        }
    };
    const handleEditDoubt = () => {
        setEditingDoubt(true);
        setEditDoubtTitle(doubt.title);
        setEditDoubtSubject(doubt.subject);
    };
    const handleEditDoubtSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`/api/doubts/${id}`, {
                title: editDoubtTitle,
                subject: editDoubtSubject,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoubt(res.data.doubt);
            setEditingDoubt(false);
        } catch {
            // handle error
        }
    };
    const handleDeleteDoubt = async () => {
        if (!window.confirm('Delete this doubt?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/doubts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/doubts');
        } catch {
            // handle error
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!doubt) return <div className="p-8 text-center text-gray-500">Doubt not found.</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#ffb3a7] via-[#ff6f61] to-[#e05a47] font-sans px-4 py-10">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 border-t-4 border-accent">
                <button onClick={() => navigate(-1)} className="mb-4 text-accent hover:underline">&larr; Back</button>
                <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-3 py-1 bg-accent-light text-accent rounded-full text-xs font-semibold">{doubt.subject}</span>
                </div>
                {editingDoubt ? (
                    <div className="flex gap-2 mb-4">
                        <input value={editDoubtTitle} onChange={e => setEditDoubtTitle(e.target.value)} className="flex-1 p-2 border rounded" />
                        <input value={editDoubtSubject} onChange={e => setEditDoubtSubject(e.target.value)} className="p-2 border rounded" />
                        <button onClick={handleEditDoubtSave} className="px-3 py-1 bg-green-500 text-white rounded">Save</button>
                        <button onClick={() => setEditingDoubt(false)} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold text-accent mb-2">{doubt.title}</h2>
                        <p className="text-sm text-gray-500 mb-4 flex flex-wrap gap-2 items-center">
                            By <span className="font-semibold text-accent">{doubt.userId?.name || doubt.userId?.username || doubt.userId?.email || 'User'}</span> on {new Date(doubt.timestamp).toLocaleDateString()} <span className="text-gray-400">at {new Date(doubt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                        {currentUserId && doubt.userId && doubt.userId._id === currentUserId && (
                            <div className="flex gap-2 mb-4">
                                <button onClick={handleEditDoubt} className="px-3 py-1 bg-yellow-400 text-white rounded">Edit</button>
                                <button onClick={handleDeleteDoubt} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                            </div>
                        )}
                    </>
                )}
                <p className="mb-6 text-gray-700">{doubt.description}</p>

                <div className="mt-6">
                    <h4 className="font-semibold text-lg text-gray-700 mb-2">Answers</h4>
                    {(!doubt.answers || doubt.answers.length === 0) ? (
                        <p className="text-gray-400 text-sm mb-2">No answers yet. Be the first to answer!</p>
                    ) : (
                        <ul className="space-y-2 mb-2">
                            {doubt.answers.map((ans, idx) => (
                                <li key={ans._id || idx} className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium text-accent-700">{ans.author?.name || ans.author?.username || ans.author?.email || 'User'}</span>
                                        <span className="text-xs text-gray-400">{ans.time ? ans.time : ''}</span>
                                    </div>
                                    {editingAnswerId === ans._id ? (
                                        <div className="flex gap-2 mt-1">
                                            <input value={editAnswerText} onChange={e => setEditAnswerText(e.target.value)} className="flex-1 p-1 border rounded" />
                                            <button onClick={() => handleEditAnswerSave(ans._id)} className="px-2 py-1 bg-green-500 text-white rounded">Save</button>
                                            <button onClick={() => setEditingAnswerId(null)} className="px-2 py-1 bg-gray-300 rounded">Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="text-gray-700 text-sm">
                                            {ans.text}
                                            {(ans.updatedAt && ans.createdAt && ans.updatedAt !== ans.createdAt) && (
                                                <div className="text-xs text-gray-400 mt-1">(edited)</div>
                                            )}
                                        </div>
                                    )}
                                    {currentUserId && ans.author && ans.author._id === currentUserId && !editingAnswerId && (
                                        <div className="flex gap-2 mt-1">
                                            <button onClick={() => handleEditAnswer(ans)} className="px-2 py-1 bg-yellow-400 text-white rounded">Edit</button>
                                            <button onClick={() => handleDeleteAnswer(ans._id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="flex gap-2 mt-2">
                        <input
                            type="text"
                            placeholder="Add your answer..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                            disabled={posting}
                        />
                        <button
                            onClick={handlePostAnswer}
                            className="px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark text-sm"
                            disabled={posting}
                        >
                            {posting ? 'Posting...' : 'Answer'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 