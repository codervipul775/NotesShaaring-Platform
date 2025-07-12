import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserPlus, 
  Upload, 
  Search, 
  Download, 
  Eye, 
  Heart, 
  List, 
  Filter, 
  BookOpen, 
  Users, 
  Clock, 
  Star,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Globe,
  Shield,
  Smartphone,
  Cloud,
  CheckCircle,
  Play
} from 'lucide-react';

const features = [
  { 
    title: "Smart Search", 
    desc: "Find notes instantly with AI-powered search that understands context and content.", 
    icon: Search, 
    color: "text-accent",
    bg: "bg-accent-light/20 dark:bg-accent/30",
    gradient: "from-[#ffb3a7] to-[#ff6f61]"
  },
  { 
    title: "Organize Everything", 
    desc: "Keep your notes organized with tags, folders, and intelligent categorization.", 
    icon: Filter, 
    color: "text-accent", 
    bg: "bg-accent-light/20 dark:bg-accent/30",
    gradient: "from-accent to-accent-600"
  },
  { 
    title: "Collaborate Seamlessly", 
    desc: "Share notes with classmates and work together in real-time.", 
    icon: Users, 
    color: "text-accent", 
    bg: "bg-accent-light/20 dark:bg-accent/30",
    gradient: "from-accent to-accent-600"
  },
  { 
    title: "Access Anywhere", 
    desc: "Your notes sync across all devices, available offline when you need them.", 
    icon: Cloud, 
    color: "text-accent", 
    bg: "bg-accent-light/20 dark:bg-accent/30",
    gradient: "from-accent to-accent-600"
  },
  { 
    title: "Secure & Private", 
    desc: "Your data is encrypted and secure, with complete control over your privacy.", 
    icon: Shield, 
    color: "text-accent", 
    bg: "bg-accent-light/20 dark:bg-accent/30",
    gradient: "from-accent to-accent-600"
  },
  { 
    title: "Mobile First", 
    desc: "Optimized for mobile devices with a native app-like experience.", 
    icon: Smartphone, 
    color: "text-accent", 
    bg: "bg-accent-light/20 dark:bg-accent/30",
    gradient: "from-accent to-accent-600"
  },
];

const steps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    description: 'Sign up in seconds and join our growing community of learners.',
    step: '01',
    delay: '0ms'
  },
  {
    icon: Upload,
    title: 'Upload Notes',
    description: 'Share your knowledge by uploading study materials and resources.',
    step: '02',
    delay: '200ms'
  },
  {
    icon: Search,
    title: 'Discover Content',
    description: 'Browse and search through thousands of high-quality materials.',
    step: '03',
    delay: '400ms'
  },
  {
    icon: Download,
    title: 'Learn & Grow',
    description: 'Download notes instantly and accelerate your learning journey.',
    step: '04',
    delay: '600ms'
  }
];

const typingWords = [
  "achieve",
  "learn",
  "understand",
  "explore",
  "create",
  "master",
  "discover",
  "improve"
];

function TypingWord() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let timeout;
    if (typing) {
      if (displayed.length < typingWords[wordIndex].length) {
        timeout = setTimeout(() => {
          setDisplayed(typingWords[wordIndex].slice(0, displayed.length + 1));
        }, 120);
      } else {
        timeout = setTimeout(() => setTyping(false), 1800);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, 70);
      } else {
        setTyping(true);
        setWordIndex((prev) => (prev + 1) % typingWords.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, wordIndex]);

  return (
    <span className="text-accent"> {displayed}<span className="blinking-cursor">|</span> </span>
  );
}

export default function HomePage() {
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token');
  const [stats, setStats] = useState({
    userCount: null,
    noteCount: null,
    avgRating: null
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetch("/api/auth/public-stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoadingStats(false);
      })
      .catch(() => setLoadingStats(false));
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center space-x-2 bg-accent/50 dark:bg-accent/20 px-4 py-2 rounded-full mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Join {loadingStats ? '...' : (stats.userCount?.toLocaleString() + '+')} students already learning
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              What will you
              <TypingWord />
              today?
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Remember everything and tackle any project with your notes, tasks, and schedule all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link 
                to="/browse" 
                className="group bg-gradient-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover-scale btn-animated inline-flex items-center gap-3"
              >
                <Search className="w-5 h-5" />
                Start Browsing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              {!isLoggedIn && (
                <Link 
                  to="/signup" 
                  className="group border-2 border-border text-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:bg-accent transition-all duration-300 hover-scale inline-flex items-center gap-3"
                >
                  <Upload className="w-5 h-5" />
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="text-center group hover-scale">
              <div className="flex justify-center mb-3 text-accent">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {loadingStats ? '...' : stats.userCount?.toLocaleString() + '+'}
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center group hover-scale">
              <div className="flex justify-center mb-3 text-accent">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {loadingStats ? '...' : stats.noteCount?.toLocaleString() + '+'}
              </div>
              <div className="text-sm text-muted-foreground">Notes Shared</div>
            </div>
            <div className="text-center group hover-scale">
              <div className="flex justify-center mb-3 text-accent">
                <Star className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {loadingStats ? '...' : (stats.avgRating ? stats.avgRating + '/5' : 'N/A')}
              </div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Everything you need to
              <span className="text-accent"> succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful features designed to help you capture, organize, and access your knowledge effortlessly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card-interactive p-8 group animate-slide-up rounded-2xl shadow-md bg-white/90 dark:bg-card transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms`, borderTop: '7px solid var(--accent)' }}
              >
                <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Get started in
              <span className="text-accent"> minutes</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Simple steps to transform how you learn and share knowledge.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={index} 
                  className="relative group animate-slide-up"
                  style={{ animationDelay: step.delay }}
                >
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent transform translate-x-4 z-0"></div>
                  )}
                  <div className="relative z-10 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <div className="relative">
                        <Icon className="w-12 h-12 text-white" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary text-sm font-bold shadow-md">
                          {step.step}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {!isLoggedIn && (
        <section className="py-20 px-4 bg-gradient-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
          <div className="relative max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to transform your learning?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of students who are already achieving more with NoteNest.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover-scale btn-animated inline-flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5" />
                Start Free Today
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/browse"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-300 hover-scale inline-flex items-center gap-3"
              >
                <Play className="w-5 h-5" />
                See How It Works
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}