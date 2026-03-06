import { useState, useEffect } from 'react';
import { X, Film, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, signup, error, clearError } = useAuth();

  const [tab, setTab] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({ name: '', email: '', password: '' });

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTab('signin');
      setSignInForm({ email: '', password: '' });
      setSignUpForm({ name: '', email: '', password: '' });
      setShowPassword(false);
      setLoading(false);
      setSignUpSuccess(false);
      clearError?.();
    }
  }, [isOpen]);

  // Clear error when switching tabs
  const handleTabSwitch = (newTab) => {
    clearError?.();
    setTab(newTab);
    setShowPassword(false);
  };

  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(signInForm.email, signInForm.password);
    setLoading(false);
    if (ok) onClose();
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await signup(signUpForm.name, signUpForm.email, signUpForm.password);
    setLoading(false);
    if (ok) setSignUpSuccess(true);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  const inputClass =
    'w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-gray-900 rounded-2xl p-8 w-full max-w-md mx-4 border border-gray-700 shadow-2xl shadow-black/60 z-10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-all"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center mb-7">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-orange-500/10">
              <Film className="w-6 h-6 text-orange-500" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-white">Watch</span>
              <span className="text-orange-500">Wise</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            {tab === 'signin' ? 'Welcome back' : 'Join the community'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-800 rounded-xl p-1 mb-6">
          <button
            onClick={() => handleTabSwitch('signin')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              tab === 'signin'
                ? 'bg-gray-900 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleTabSwitch('signup')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              tab === 'signup'
                ? 'bg-gray-900 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Sign In Form */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={signInForm.email}
                onChange={(e) =>
                  setSignInForm((f) => ({ ...f, email: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={signInForm.password}
                  onChange={(e) =>
                    setSignInForm((f) => ({ ...f, password: e.target.value }))
                  }
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

          </form>
        )}

        {/* Sign Up Form */}
        {tab === 'signup' && signUpSuccess && (
          <div className="px-4 py-6 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
            <p className="font-semibold mb-1">Check your email!</p>
            <p className="text-green-400/80 text-xs">We sent a confirmation link to <span className="font-mono">{signUpForm.email}</span>. Click it to activate your account.</p>
          </div>
        )}
        {tab === 'signup' && !signUpSuccess && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                Full Name
              </label>
              <input
                type="text"
                required
                autoComplete="name"
                placeholder="Alex Johnson"
                value={signUpForm.name}
                onChange={(e) =>
                  setSignUpForm((f) => ({ ...f, name: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={signUpForm.email}
                onChange={(e) =>
                  setSignUpForm((f) => ({ ...f, email: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  minLength={6}
                  value={signUpForm.password}
                  onChange={(e) =>
                    setSignUpForm((f) => ({ ...f, password: e.target.value }))
                  }
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              By signing up you agree to our{' '}
              <span className="text-orange-500/80 cursor-pointer hover:text-orange-400">
                Terms of Service
              </span>
              .
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
