import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BookOpen,
  Download,
  Eye,
  Edit,
  Trash2,
  Upload,
  Calendar,
  User,
  Star,
  AlertCircle,
  Loader
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const NotesHistory = () => {
  const navigate = useNavigate();
  const [uploadedNotes, setUploadedNotes] = useState([]);
  const [downloadedNotes, setDownloadedNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData.user || userData);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }, [navigate]);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch all notes
      const response = await axios.get(`${API_BASE_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const notes = response.data.notes || [];
      setAllNotes(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCurrentUser();
    fetchNotes();
  }, [fetchCurrentUser, fetchNotes]);
  useEffect(() => {
    if (!currentUser || !Array.isArray(allNotes)) return;
    const userId = String(currentUser.userId || currentUser._id);
    const userUploadedNotes = allNotes.filter(note => {
      const uploaderId = typeof note.uploadedBy === 'object' ? note.uploadedBy._id : note.uploadedBy;
      return String(uploaderId) === userId;
    });
    const userDownloadedNotes = allNotes.filter(note => {
      if (!Array.isArray(note.downloadedBy)) return false;
      return note.downloadedBy.some(user => {
        const dId = typeof user === 'object' ? user._id : user;
        return String(dId) === userId;
      });
    });
    setUploadedNotes(userUploadedNotes);
    setDownloadedNotes(userDownloadedNotes);
  }, [allNotes, currentUser]);

  const handleDownload = async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to download notes');
        return;
      }
      await axios.put(`${API_BASE_URL}/notes/${noteId}/download`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const note = [...uploadedNotes, ...downloadedNotes].find(n => n._id === noteId);
      if (note && note.fileUrl) {
        const link = document.createElement('a');
        link.href = note.fileUrl;
        link.setAttribute('download', note.title || 'note');
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      fetchNotes();
    } catch (error) {
      console.error('Error downloading note:', error);
      alert('Failed to download note');
    }
  };

  const handleDelete = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to delete notes');
        return;
      }

      await axios.delete(`${API_BASE_URL}/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUploadedNotes(prev => prev.filter(note => note._id !== noteId));
      setDownloadedNotes(prev => prev.filter(note => note._id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground font-medium">Loading your notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="card-interactive p-8 text-center max-w-md animate-scale-in">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Notes</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={fetchNotes}
            className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover-scale btn-animated"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            My Notes
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your uploaded notes and access your downloaded materials
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="card-interactive p-6 mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Upload className="w-6 h-6 text-primary" />
                Uploaded Notes
              </h2>
              <p className="text-muted-foreground mb-4">
                Notes you've shared with the community
              </p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{uploadedNotes.length} notes uploaded</span>
                <button
                  onClick={() => navigate('/upload')}
                  className="bg-gradient-primary text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover-scale btn-animated"
                >
                  Upload New
                </button>
              </div>
            </div>

            {uploadedNotes.length === 0 ? (
              <div className="card-interactive p-12 text-center animate-slide-up" style={{ animationDelay: '200ms' }}>
                <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">No notes uploaded yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start sharing your knowledge with the community
                </p>
                <button
                  onClick={() => navigate('/upload')}
                  className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover-scale btn-animated"
                >
                  Upload Your First Note
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {uploadedNotes.map((note, index) => (
                  <div 
                    key={note._id} 
                    className="card-interactive p-6 group animate-slide-up hover-lift"
                    style={{ animationDelay: `${300 + index * 50}ms`, borderTop: '7px solid var(--accent)' }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {note.subject}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/notes/${note._id}/edit`)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 hover-scale"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(note._id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 hover-scale"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {note.title}
                    </h3>

                    {note.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {note.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(note.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Download className="w-3 h-3" />
                        <span>{note.downloadCount || 0} downloads</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          if (!note.fileUrl) return;
                          const token = localStorage.getItem('token');
                          try {
                            const response = await fetch(note.fileUrl, {
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            if (!response.ok) throw new Error('Failed to fetch PDF');
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
                            const newWindow = window.open();
                            if (newWindow) {
                              newWindow.document.write(
                                `<iframe src="${url}" frameborder="0" style="width:100vw;height:100vh;" allowfullscreen></iframe>`
                              );
                            } else {
                              alert('Please allow popups for this site');
                            }
                            setTimeout(() => window.URL.revokeObjectURL(url), 10000);
                          } catch {
                            alert('Could not open PDF.');
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-border rounded-lg text-foreground hover:bg-accent transition-all duration-200 hover-scale"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownload(note._id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gradient-primary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover-scale btn-animated"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
            <div className="card-interactive p-6 mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Download className="w-6 h-6 text-accent" />
                Downloaded Notes
              </h2>
              <p className="text-muted-foreground mb-4">
                Notes you've downloaded from the community
              </p>
              <div className="text-sm text-muted-foreground">
                <span>{downloadedNotes.length} notes downloaded</span>
              </div>
            </div>

            {downloadedNotes.length === 0 ? (
              <div className="card-interactive p-12 text-center animate-slide-up" style={{ animationDelay: '250ms' }}>
                <Download className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">No notes downloaded yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start exploring and downloading notes from the community
                </p>
                <button
                  onClick={() => navigate('/browse')}
                  className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover-scale btn-animated"
                >
                  Browse Notes
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {downloadedNotes.map((note, index) => (
                  <div 
                    key={note._id} 
                    className="card-interactive p-6 group animate-slide-up hover-lift"
                    style={{ animationDelay: `${350 + index * 50}ms`, borderTop: '7px solid var(--accent)' }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                        {note.subject}
                      </span>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Star className="w-3 h-3" />
                        <span>{note.averageRating > 0 ? note.averageRating.toFixed(1) : 'No ratings'}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {note.title}
                    </h3>

                    {note.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {note.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-3 h-3" />
                        <span>{note.uploadedBy?.username || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(note.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center space-x-2">
                        <Download className="w-3 h-3" />
                        <span>{note.downloadCount || 0} downloads</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-3 h-3" />
                        <span>{note.reviewCount || 0} reviews</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          if (!note.fileUrl) return;
                          const token = localStorage.getItem('token');
                          try {
                            const response = await fetch(note.fileUrl, {
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            if (!response.ok) throw new Error('Failed to fetch PDF');
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
                            const newWindow = window.open();
                            if (newWindow) {
                              newWindow.document.write(
                                `<iframe src="${url}" frameborder="0" style="width:100vw;height:100vh;" allowfullscreen></iframe>`
                              );
                            } else {
                              alert('Please allow popups for this site');
                            }
                            setTimeout(() => window.URL.revokeObjectURL(url), 10000);
                          } catch {
                            alert('Could not open PDF.');
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-border rounded-lg text-foreground hover:bg-accent transition-all duration-200 hover-scale"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownload(note._id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gradient-primary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover-scale btn-animated"
                      >
                        <Download className="w-4 h-4" />
                        Download Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesHistory; 