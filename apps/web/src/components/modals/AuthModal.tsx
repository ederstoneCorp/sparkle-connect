import React, { useState } from 'react';
import { useSparkle } from '../../context/SparkleContext';
import {
  Sparkles,
  X,
  Mail,
  Lock,
  User,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Database,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    signIn,
    signInWithGmail,
    signUp,
    universities,
    currentUser,
  } = useSparkle();

  const [mode, setMode] = useState<'signin' | 'signup' | 'gmail'>('gmail');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [universityId, setUniversityId] = useState(universities[0]?.id || 'uon');
  const [faculty, setFaculty] = useState('School of Computing & Informatics');
  const [course, setCourse] = useState('BSc Computer Science');
  const [yearOfStudy, setYearOfStudy] = useState(2);
  const [gmailAddress, setGmailAddress] = useState('');
  const [gmailName, setGmailName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen && currentUser) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const res = await signIn(email, password);
    setIsLoading(false);
    if (!res.success) {
      setError(res.error || 'Failed to sign in');
    }
  };

  const handleGmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!gmailAddress.trim()) {
      setError('Please provide your Gmail address');
      return;
    }
    setIsLoading(true);
    const res = await signInWithGmail(gmailAddress, gmailName);
    setIsLoading(false);
    if (!res.success) {
      setError(res.error || 'Failed to authenticate with Gmail');
    } else {
      setSuccessMsg(`Welcome, ${res.account?.profile.displayName}! Saved to database.`);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!displayName.trim() || !email.trim()) {
      setError('Please complete all required fields');
      return;
    }
    setIsLoading(true);
    const res = await signUp({
      displayName,
      email,
      password,
      universityId,
      faculty,
      course,
      yearOfStudy,
      skills: ['Campus Networking', 'Collaborative Studies'],
      interests: ['Tech & Coding', 'Campus Life'],
    });
    setIsLoading(false);
    if (!res.success) {
      setError(res.error || 'Failed to register account');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-sparkle-purple via-sparkle-purple-dark to-sparkle-pink p-6 text-white text-center relative">
          {currentUser && (
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="w-12 h-12 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner">
            <Sparkles className="w-7 h-7 text-white animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Sparkle Connect</h2>
          <p className="text-xs text-white/90 mt-1 font-medium">
            Kenya's Premier Student Campus Network & Gig Hub 🇰🇪
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[11px] font-semibold text-white backdrop-blur-xs">
            <Database className="w-3.5 h-3.5 text-sparkle-mint" />
            <span>Database Synced (Room / Local / Supabase)</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-1">
          <button
            onClick={() => {
              setMode('gmail');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'gmail'
                ? 'bg-white text-sparkle-purple shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Gmail Instant Login
          </button>
          <button
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signin'
                ? 'bg-white text-sparkle-purple shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-white text-sparkle-purple shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* GMAIL INSTANT LOGIN */}
          {mode === 'gmail' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-slate-700 text-xs leading-relaxed">
                <span className="font-bold text-indigo-900">✨ Zero Password Friction:</span> Enter your Gmail address. Sparkle Connect automatically fetches your student name, generates a safe token, and saves your profile straight to the database.
              </div>

              <form onSubmit={handleGmailSignIn} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Gmail Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. holdstonez@gmail.com"
                      value={gmailAddress}
                      onChange={(e) => setGmailAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Name (Optional - auto-derived if blank)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Holdstone Z."
                      value={gmailName}
                      onChange={(e) => setGmailName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sparkle-purple to-sparkle-pink hover:opacity-95 text-white font-extrabold text-xs shadow-md shadow-sparkle-purple/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Authenticating with Gmail...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Log in with Gmail (Auto-Save to DB)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>


            </div>
          )}

          {/* SIGN IN WITH EMAIL & PASSWORD */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="student@uonbi.ac.ke"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-sparkle-purple hover:bg-sparkle-purple-dark text-white font-extrabold text-xs shadow-md shadow-sparkle-purple/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : 'Sign In to Sparkle Connect'}
              </button>
            </form>
          )}

          {/* CREATE ACCOUNT */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Student Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Brian Mutua"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campus Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="brian@student.ku.ac.ke"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">University</label>
                  <select
                    value={universityId}
                    onChange={(e) => setUniversityId(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-semibold"
                  >
                    {universities.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.shortName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Year of Study</label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(Number(e.target.value))}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-semibold"
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                    <option value={5}>Postgrad</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course / Degree</label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="BSc Software Engineering"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-sparkle-purple hover:bg-sparkle-purple-dark text-white font-extrabold text-xs shadow-md shadow-sparkle-purple/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Complete Registration & Save to DB'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
