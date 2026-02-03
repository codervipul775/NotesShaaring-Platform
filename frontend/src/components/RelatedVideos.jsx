import React, { useState, useEffect } from 'react';
import { Play, ExternalLink, Eye, ThumbsUp, Clock, AlertCircle, Loader } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const RelatedVideos = ({ noteId }) => {
  const [videos, setVideos] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRelatedVideos();
  }, [noteId]);

  const fetchRelatedVideos = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/api/notes/${noteId}/related-videos`);
      
      if (response.ok) {
        const data = await response.json();
        setVideos(data.data.videos || []);
        setKeywords(data.data.keywords || []);
      } else {
        setError('Failed to fetch related videos');
      }
    } catch (err) {
      console.error('Error fetching related videos:', err);
      setError('Failed to load related videos');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const openVideo = (url) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="card-interactive p-6 animate-slide-up">
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 animate-spin text-primary mr-3" />
          <span className="text-muted-foreground">Loading related videos...</span>
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
              onClick={fetchRelatedVideos}
              className="mt-3 text-primary hover:text-primary/80 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="card-interactive p-6 animate-slide-up">
        <div className="text-center py-8">
          <Play className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Related Videos</h3>
          <p className="text-muted-foreground text-sm">
            No related educational videos found for this note.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-interactive p-6 animate-slide-up">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground mb-2">
          Related Educational Videos
        </h3>
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm text-muted-foreground">Keywords:</span>
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors cursor-pointer group"
            onClick={() => openVideo(video.url)}
          >
            <div className="flex gap-4">
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
                <h4 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h4>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {video.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{video.channelTitle}</span>
                  </div>
                  
                  {video.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{video.duration}</span>
                    </div>
                  )}
                  
                  {video.viewCount && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{video.viewCount} views</span>
                    </div>
                  )}
                  
                  {video.likeCount && (
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{video.likeCount}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <span>{formatDate(video.publishedAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-sm text-primary">
          💡 <strong>Tip:</strong> Click on any video to watch it on YouTube in a new tab.
        </p>
      </div>
    </div>
  );
};

export default RelatedVideos; 