import React, { useState, useEffect } from 'react';
import { ExternalLink, FileText, Calendar, Globe, AlertCircle, Loader } from 'lucide-react';
import { API_BASE_URL } from '../lib/utils';

const RelatedArticles = ({ noteId }) => {
  const [articles, setArticles] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRelatedArticles();
  }, [noteId]);

  const fetchRelatedArticles = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}/related-articles`);
      
      if (response.ok) {
        const data = await response.json();
        setArticles(data.data.articles || []);
        setKeywords(data.data.keywords || []);
      } else {
        setError('Failed to fetch related articles');
      }
    } catch (err) {
      console.error('Error fetching related articles:', err);
      setError('Failed to load related articles');
    } finally {
      setLoading(false);
    }
  };

  const openArticle = (url) => {
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
          <span className="text-muted-foreground">Loading related articles...</span>
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
              onClick={fetchRelatedArticles}
              className="mt-3 text-primary hover:text-primary/80 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="card-interactive p-6 animate-slide-up">
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Related Articles</h3>
          <p className="text-muted-foreground text-sm">
            No related educational articles found for this note.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-interactive p-6 animate-slide-up">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground mb-2">
          Related Educational Articles
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
        {articles.map((article, index) => (
          <div
            key={index}
            className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors cursor-pointer group"
            onClick={() => openArticle(article.url)}
          >
            <div className="flex gap-4">
              {/* Article Image (if available) */}
              {article.image && (
                <div className="flex-shrink-0">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-24 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Article Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {article.snippet}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span className="font-medium">{getDomainFromUrl(article.url)}</span>
                  </div>
                  
                  {article.publishedDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{article.publishedDate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* External Link Icon */}
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-sm text-primary">
          💡 <strong>Tip:</strong> Click on any article to read it in a new tab.
        </p>
      </div>
    </div>
  );
};

export default RelatedArticles; 