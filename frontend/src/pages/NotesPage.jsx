import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import ReviewList from '../components/Reviews/ReviewList';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL



const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.userId || decoded.id);
      } catch {
        setCurrentUserId(null);
      }
    } else {
      setCurrentUserId(null);
    }
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/notes`);
      setNotes(res.data.notes);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (editModalOpen && noteToEdit) {
      setEditTitle(noteToEdit.title || "");
      setEditSubject(noteToEdit.subject || "");
      setEditDescription(noteToEdit.description || "");
      setEditFile(null);
      setEditError("");
    }
  }, [editModalOpen, noteToEdit]);

  const uploadedNotes = currentUserId
    ? notes.filter(note => {
        if (!note.uploadedBy) return false;
        const uploaderId = typeof note.uploadedBy === 'object' ? note.uploadedBy._id : note.uploadedBy;
        return String(uploaderId) === String(currentUserId);
      })
    : [];

  const downloadedNotes = currentUserId
    ? notes.filter(note => {
        if (!Array.isArray(note.downloadedBy)) return false;
        return note.downloadedBy.some(user => {
          const userId = typeof user === 'object' ? user._id : user;
          return String(userId) === String(currentUserId);
        });
      })
    : [];

  const handleDownload = async (note) => {
    const token = localStorage.getItem('token');
    if (!token || !currentUserId) {
      alert("Please log in to download notes.");
      return;
    }
    setDownloading(note._id);
    try {
      await axios.put(`${API_BASE_URL}/notes/${note._id}/download`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await axios.get(note.fileUrl, { responseType: 'blob' });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const cleanTitle = (note.title || "note").replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
      link.href = url;
      link.setAttribute('download', `${cleanTitle}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      await fetchNotes(); // Refresh notes after download
    } catch (err) {
      alert('Download failed.');
      console.error(err);
    } finally {
      setDownloading(null);
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    setDeleting(noteId);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchNotes();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    } finally {
      setDeleting(null);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      let data;
      let headers;
      const token = localStorage.getItem('token');
      if (editFile) {
        data = new FormData();
        data.append("title", editTitle);
        data.append("subject", editSubject);
        data.append("description", editDescription);
        data.append("file", editFile);
        headers = { Authorization: `Bearer ${token}` };
      } else {
        data = { title: editTitle, subject: editSubject, description: editDescription };
        headers = { Authorization: `Bearer ${token}` };
      }
      await axios.patch(`${API_BASE_URL}/notes/${noteToEdit._id}`, data, {
        headers: editFile ? { ...headers, "Content-Type": "multipart/form-data" } : headers,
      });
      setEditModalOpen(false);
      setNoteToEdit(null);
      await fetchNotes(); 
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update note.");
    } finally {
      setEditLoading(false);
    }
  };

  const renderNoteCard = (note) => {
    const fileExt = note.fileUrl?.split('.').pop().split('?')[0].toUpperCase();
    const isUploader = currentUserId && (note.uploadedBy && (note.uploadedBy._id === currentUserId || note.uploadedBy === currentUserId));

    return (
      <div key={note._id} className="bg-white p-5 rounded-xl shadow border flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{note.title}</h3>
          <p className="text-sm text-gray-600">{note.subject}
            {note.status && (
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold border ${
                note.status === 'approved' ? 'bg-green-100 text-green-700 border-green-300' :
                note.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                'bg-red-100 text-red-700 border-red-300'
              }`}>
                {note.status.charAt(0).toUpperCase() + note.status.slice(1)}
              </span>
            )}
          </p>
          {note.description && <p className="text-gray-700 mt-1">{note.description}</p>}
          <p className="text-xs text-gray-500 mt-2">File: {fileExt} | Downloads: {note.downloadCount}</p>
          <p className="text-xs text-gray-500">By: {note.uploadedBy?.username || note.uploadedBy?.email || 'Anonymous'}</p>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            onClick={() => handleDownload(note)}
            className="px-3 py-1 text-sm bg-coral text-white rounded hover:bg-coral-dark"
            disabled={downloading === note._id}
          >
            {downloading === note._id ? 'Downloading...' : 'Download'}
          </button>
          {isUploader && (
            <>
              <button
                onClick={() => handleDelete(note._id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                disabled={deleting === note._id}
              >
                {deleting === note._id ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => { setNoteToEdit(note); setEditModalOpen(true); }}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>
            </>
          )}
          <button
            onClick={() => { setSelectedNoteId(note._id); setModalOpen(true); }}
            className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Add/View Reviews
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffb3a7] via-[#ff6f61] to-[#e05a47] p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">📚 My Notes Dashboard</h2>

      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading notes...</p>
      ) : (
        <>
          <section className="mb-12">
            <h3 className="text-2xl font-semibold mb-4 text-green-800">🟢 Uploaded Notes</h3>
            {uploadedNotes.length === 0 ? (
              <p className="text-gray-600">You haven't uploaded any notes yet.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {uploadedNotes.map(renderNoteCard)}
              </div>
            )}
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-4 text-accent">🔵 Downloaded Notes</h3>
            {downloadedNotes.length === 0 ? (
              <p className="text-gray-600">You haven't downloaded any notes yet.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {downloadedNotes.map(renderNoteCard)}
              </div>
            )}
          </section>
        </>
      )}

     
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-2 right-4 text-xl text-gray-600 hover:text-red-500">&times;</button>
            <ReviewList noteId={selectedNoteId} currentUserId={currentUserId} />
          </div>
        </div>
      )}

      {editModalOpen && noteToEdit && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full relative">
            <button onClick={() => setEditModalOpen(false)} className="absolute top-2 right-4 text-xl text-gray-600 hover:text-red-500">&times;</button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Note</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Title" required className="w-full p-2 border rounded" />
              <input type="text" value={editSubject} onChange={e => setEditSubject(e.target.value)} placeholder="Subject" required className="w-full p-2 border rounded" />
              <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={4} placeholder="Description" required className="w-full p-2 border rounded" />
              <input type="file" accept=".pdf,.doc,.docx" onChange={e => setEditFile(e.target.files[0])} className="w-full" />
              {editError && <p className="text-red-500 text-sm">{editError}</p>}
              <button type="submit" disabled={editLoading} className="w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
