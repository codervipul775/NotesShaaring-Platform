import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "https://notesshaaring-platform-1.onrender.com/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      setMessage('If an account with that email exists, a password reset link has been sent.');
    } catch (error) {
      console.error('Forgot Password Error:', error);
      setError('Failed to send reset email. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="relative max-w-md w-full animate-slide-up">
        <Card className="w-full shadow-xl border-none">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-2 text-primary">Forgot Password?</CardTitle>
            <p className="text-center text-muted-foreground mb-2 text-base">Enter your email to receive a password reset link.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
            {message && <div className="mt-4 text-green-600 text-center">{message}</div>}
            {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
