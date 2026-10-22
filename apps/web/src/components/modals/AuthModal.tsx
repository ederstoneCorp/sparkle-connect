import React, { useState } from 'react';
import { useSparkle } from '../../context/SparkleContext';
import { useTheme } from '../../context/ThemeContext';
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
  Eye,
  EyeOff,
  Sun,
  Moon,
  Globe,
  Shield,
  Compass,
} from 'lucide-react';
import { CourseSearchModal } from './CourseSearchModal';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    signIn,
    signInWithGmail,
    resetPassword,
    updatePassword,
    signUp,
    universities,
    currentUser,
    isPasswordRecovery,
  } = useSparkle();

  const { theme, toggleTheme } = useTheme();

  const [mode, setMode] = useState<'signin' | 'signup' | 'gmail'>('gmail');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [universityId, setUniversityId] = useState(universities[0]?.id || 'uon');
  const [faculty, setFaculty] = useState('School of Computing & Informatics');
  const [course, setCourse] = useState('BSc Computer Science');
  const [yearOfStudy, setYearOfStudy] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCourseSearchOpen, setIsCourseSearchOpen] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

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
    setIsLoading(true);
    const res = await signInWithGmail('', '');
    setIsLoading(false);
    if (!res.success) setError(res.error || 'Could not start Google sign-in.');
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
    } else if (res.confirmationRequired) {
      setSuccessMsg('Your account has been created. Check your email and confirm your address before signing in.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    if (!resetEmail.trim()) {
      setError('Enter the email address for your account.');
      return;
    }
    setIsLoading(true);
    const result = await resetPassword(resetEmail);
    setIsLoading(false);
    if (!result.success) {
      setError(result.error || 'Could not send password reset email.');
      return;
    }
    setSuccessMsg('If an account exists for that email, password reset instructions have been sent. Check your inbox.');
    setForgotPasswordMode(false);
    setResetEmail('');
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);
    const result = await updatePassword(newPassword);
    setIsLoading(false);
    if (!result.success) {
      setError(result.error || 'Could not update your password.');
      return;
    }
    setSuccessMsg('Your password has been updated. You can continue using Sparkle Connect.');
    setNewPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#0B0B18] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col lg:flex-row my-auto animate-in fade-in zoom-in-95 duration-300">

        {/* LEFT BRAND EXPERIENCE (Desktop Split Screen) */}
        <div className="lg:w-5/12 bg-gradient-to-br from-[#0B0B18] via-[#151330] to-[#251A4A] p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
          {/* Glowing ambient orbs */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#7545FF]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#FF7043]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7545FF] to-[#53D6E8] flex items-center justify-center shadow-lg shadow-[#7545FF]/40">
                <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
              </div>
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Sparkle Connect
              </span>
            </div>

            {/* Theme Switcher Quick Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-cyan-300" />}
            </button>
          </div>

          {/* Center Brand Message & Campus Universe Highlights */}
          <div className="relative z-10 my-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-extrabold text-[#53D6E8] backdrop-blur-md border border-white/10">
              <Compass className="w-3.5 h-3.5" />
              <span>The Campus Universe 🇰🇪</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Your campus. Your people. Your next opportunity.
            </h1>

            <p className="text-xs lg:text-sm text-slate-300 font-medium leading-relaxed">
              Connect with comrades across Kenyan universities, discover funded student gigs, collaborate on open-source projects, and build thriving campus communities.
            </p>

            {/* Rotating / Feature Highlights */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {[
                { label: 'Connect', desc: 'Peer Networks', icon: Globe, color: 'text-cyan-400' },
                { label: 'Discover', desc: 'Campus Gigs', icon: Sparkles, color: 'text-amber-400' },
                { label: 'Create', desc: 'Projects & Hubs', icon: BookOpen, color: 'text-emerald-400' },
                { label: 'Grow', desc: 'Startup Ventures', icon: Shield, color: 'text-purple-400' },
              ].map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-white/10 ${item.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white">{item.label}</p>
                      <p className="text-[10px] text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Database Sync Badge */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-[#53D6E8]" />
              <span>Secure sign-in • Campus community</span>
            </div>
            <span className="font-mono text-[10px]">v2.6 Secure</span>
          </div>
        </div>

        {/* RIGHT AUTHENTICATION PANEL */}
        <div className="lg:w-7/12 p-8 lg:p-12 flex flex-col justify-between bg-white dark:bg-[#0B0B18] text-slate-900 dark:text-slate-100 relative">
          
          {/* Close button if user is already logged in */}
          {currentUser && (
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div>
            {/* Header / Greeting */}
            <div className="mb-6">
              <h2 className="text-2xl font-black tracking-tight">
                {isPasswordRecovery || forgotPasswordMode ? 'Reset Password' : 'Welcome back.'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {isPasswordRecovery ? 'Choose a new password for your account' : forgotPasswordMode ? 'Enter your email to receive recovery instructions' : 'Sign in or create an account to continue your campus journey.'}
              </p>
            </div>

            {/* Error / Success Alerts */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* PASSWORD RECOVERY AND RESET REQUEST VIEWS */}
            {isPasswordRecovery ? (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7545FF]/40 font-medium dark:text-white"
                    />
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl bg-[#7545FF] hover:bg-[#6235E0] text-white font-extrabold text-xs disabled:opacity-50">
                  {isLoading ? 'Updating password...' : 'Save New Password'}
                </button>
              </form>
            ) : forgotPasswordMode ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Campus Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="student@university.ac.ke"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7545FF]/40 font-medium dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-[#7545FF] hover:bg-[#6235E0] text-white font-extrabold text-xs shadow-lg shadow-[#7545FF]/25 flex items-center justify-center gap-2 transition-all"
                >
                  {isLoading ? 'Sending instructions...' : 'Send Password Reset Instructions'}
                </button>

                <button
                  type="button"
                  onClick={() => setForgotPasswordMode(false)}
                  className="w-full text-center text-xs text-slate-500 hover:text-[#7545FF] font-bold transition-colors pt-2"
                >
                  Back to Sign In
                </button>
              </form>
            ) : (
              <>
                {/* Tab Switcher */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/70 p-1 rounded-2xl mb-6">
                  <button
                    onClick={() => { setMode('gmail'); setError(null); }}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                      mode === 'gmail'
                        ? 'bg-white dark:bg-slate-800 text-[#7545FF] dark:text-cyan-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                    }`}
                  >
                    Gmail Instant
                  </button>
                  <button
                    onClick={() => { setMode('signin'); setError(null); }}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                      mode === 'signin'
                        ? 'bg-white dark:bg-slate-800 text-[#7545FF] dark:text-cyan-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setMode('signup'); setError(null); }}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                      mode === 'signup'
                        ? 'bg-white dark:bg-slate-800 text-[#7545FF] dark:text-cyan-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                    }`}
                  >
                    Register
                  </button>
                </div>

                {/* GOOGLE OAUTH */}
                {mode === 'gmail' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[#7545FF]/5 dark:bg-[#7545FF]/10 border border-[#7545FF]/20 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                      <span className="font-extrabold text-[#7545FF] dark:text-cyan-400">Continue securely with Google.</span> Sparkle Connect will use Google's sign-in page to verify your account. Entering an email address alone does not authenticate you.
                    </div>
                    <button
                      type="button"
                      onClick={(event) => { void handleGmailSignIn(event); }}
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7545FF] via-indigo-600 to-[#FF7043] hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-[#7545FF]/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {isLoading ? 'Opening Google sign-in...' : 'Continue with Google'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* SIGN IN WITH EMAIL & PASSWORD */}
                {mode === 'signin' && (
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Campus Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="student@uonbi.ac.ke"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7545FF]/40 font-medium dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                        <button
                          type="button"
                          onClick={() => setForgotPasswordMode(true)}
                          className="text-[11px] font-bold text-[#7545FF] dark:text-cyan-400 hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7545FF]/40 font-medium dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-[#7545FF] focus:ring-[#7545FF]"
                      />
                      <label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 font-medium select-none">
                        Remember this device
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#7545FF] hover:bg-[#6235E0] text-white font-extrabold text-xs shadow-lg shadow-[#7545FF]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {isLoading ? 'Signing In...' : 'Sign In to Sparkle Connect'}
                    </button>
                  </form>
                )}

                {/* CREATE ACCOUNT / REGISTRATION */}
                {mode === 'signup' && (
                  <form onSubmit={handleSignUp} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Student Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="Brian Mutua"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7545FF]/40 font-medium dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Campus Email</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="brian@student.uonbi.ac.ke"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7545FF]/40 font-medium dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">University</label>
                        <select
                          value={universityId}
                          onChange={(e) => setUniversityId(e.target.value)}
                          className="w-full px-2.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7545FF]/40 font-semibold dark:text-white"
                        >
                          {universities.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.shortName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Year of Study</label>
                        <select
                          value={yearOfStudy}
                          onChange={(e) => setYearOfStudy(Number(e.target.value))}
                          className="w-full px-2.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7545FF]/40 font-semibold dark:text-white"
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
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Course / Degree</label>
                      <button
                        type="button"
                        onClick={() => setIsCourseSearchOpen(true)}
                        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white transition-all text-left"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <BookOpen className="w-4 h-4 text-[#7545FF] shrink-0" />
                          <span className="truncate">{course || 'Select accredited course or enter manually'}</span>
                        </div>
                        <span className="text-[10px] text-[#7545FF] dark:text-cyan-400 font-extrabold px-2 py-0.5 rounded-md bg-[#7545FF]/10 shrink-0">Browse CUE</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Create a strong password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#7545FF]/40 font-medium dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#7545FF] hover:bg-[#6235E0] text-white font-extrabold text-xs shadow-lg shadow-[#7545FF]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-1"
                    >
                      {isLoading ? 'Creating Account...' : 'Complete Registration & Save to DB'}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>

          {/* Footer Terms & Privacy */}
          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <span>By continuing, you agree to Sparkle Terms & Privacy Policy</span>
            <div className="flex items-center gap-3">
              <span className="hover:text-[#7545FF] cursor-pointer">Support</span>
              <span>•</span>
              <span className="hover:text-[#7545FF] cursor-pointer">Security</span>
            </div>
          </div>
        </div>

      </div>

      <CourseSearchModal
        isOpen={isCourseSearchOpen}
        onClose={() => setIsCourseSearchOpen(false)}
        onSelectCourse={(selectedTitle) => setCourse(selectedTitle)}
        selectedUniversityId={universityId}
      />
    </div>
  );
};
