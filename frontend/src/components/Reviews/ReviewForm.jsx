import React, { useState, useEffect } from 'react';
import { Star, Send, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const ReviewForm = ({ noteId, existingReview, refreshReviews }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingReview) {
      setComment(existingReview.comment);
      setRating(existingReview.rating || '');
    }
  }, [existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to submit a review');
      setLoading(false);
      return;
    }

    try {
      const url = `${API_BASE_URL}/reviews/${noteId}/reviews`;
      const method = 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment, rating: parseInt(rating) }),
      });

      if (response.ok) {
        refreshReviews();
        if (!existingReview) {
          setComment('');
          setRating('');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (selectedRating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setRating((i + 1).toString())}
        className={`w-6 h-6 transition-colors ${
          i < selectedRating 
            ? 'text-yellow-500 fill-current' 
            : 'text-gray-300 hover:text-yellow-400'
        }`}
      >
        <Star className="w-full h-full" />
      </button>
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Rating
        </label>
        <div className="flex items-center space-x-1">
          {renderStars(parseInt(rating) || 0)}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating ? `${rating} star${parseInt(rating) > 1 ? 's' : ''}` : 'Select rating'}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Comment
        </label>
        <textarea
          className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          rows={4}
          placeholder="Share your thoughts about this note..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading || !comment.trim() || !rating}
        className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{existingReview ? 'Updating...' : 'Submitting...'}</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>{existingReview ? 'Update Review' : 'Submit Review'}</span>
          </>
        )}
      </button>
    </form>
  );
};
export default ReviewForm;
