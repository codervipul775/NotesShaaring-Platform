import React, { useEffect, useState } from 'react';
import { ExternalLink, FileText, Play, Loader, AlertCircle, Globe } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api';

const RelatedResources = ({ noteId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (!noteId) return;
    fetchSuggestions();
    // eslint-disable-next-line
  }, [noteId]);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}/suggestions`);
      if (!response.ok) throw new Error('Failed to fetch related resources');
      const data = await response.json();
      setArticles(data.articles || []);
      setVideos(data.videos || []);
    } catch {
      setError('Failed to load related resources');
    } finally {
      setLoading(false);
    }
  };

  const openLink = (url) => {
    window.open(url, '_blank');
  };

  const getDomainFromUrl = (url) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain;
    } catch {
      return 'unknown';
    }
  };

  if (loading) {
    return (
      <div className="card-interactive p-6 animate-slide-up">
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 animate-spin text-primary mr-3" />
          <span className="text-muted-foreground">Loading related resources...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-interactive p-6 animate-slide-up">
        <div className="flex items-center justify-center py-8 text-center">
          <div>
            <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">{error}</p>
            <button
              onClick={fetchSuggestions}
              className="mt-3 text-primary hover:text-primary/80 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (articles.length === 0 && videos.length === 0) {
    return (
      <div className="card-interactive p-6 animate-slide-up">
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Related Resources</h3>
          <p className="text-muted-foreground text-sm">
            No related articles or videos found for this note.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-interactive p-6 animate-slide-up">
      <h3 className="text-xl font-bold text-foreground mb-4">Related Resources</h3>
      {articles.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Articles
          </h4>
          <div className="space-y-4">
            {articles.map((article, idx) => (
              <div
                key={idx}
                className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors cursor-pointer group"
                onClick={() => openLink(article.url)}
              >
                <div className="flex gap-4 items-center">
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h5>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Globe className="w-3 h-3" />
                      <span className="font-medium">{getDomainFromUrl(article.url)}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {videos.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" /> YouTube Videos
          </h4>
          <div className="space-y-4">
            {videos.map((video, idx) => (
              <div
                key={video.id || idx}
                className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors cursor-pointer group"
                onClick={() => openLink(video.url)}
              >
                <div className="flex gap-4 items-center">
                  <div className="relative flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-32 h-20 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h5>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">{video.channelTitle}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatedResources; 