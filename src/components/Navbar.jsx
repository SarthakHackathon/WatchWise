import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bookmark, LogIn, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';

export default function Navbar({ onAuthClick, onToggleSidebar, sidebarOpen }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { watchlist } = useWatchlist();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-orange-500' : 'text-gray-300 hover:text-white'
    }`;

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const handleAuthClick = () => {
    setMobileOpen(false);
    onAuthClick();
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <nav className="sticky top-0 z-40 w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <img
              src="/Logo.png"
              alt="WatchWise"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/browse" className={navLinkClass}>
              Browse
            </NavLink>
            <NavLink to="/ai-picks" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Picks
              </span>
            </NavLink>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Watchlist — toggles sidebar when authenticated, else navigates */}
            {isAuthenticated ? (
              <button
                onClick={onToggleSidebar}
                className={`relative p-2 rounded-lg transition-all duration-200 ${
                  sidebarOpen
                    ? 'text-orange-500 bg-orange-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                aria-label="Toggle watchlist"
              >
                <Bookmark className={`w-5 h-5 ${sidebarOpen ? 'fill-orange-500' : ''}`} />
                {watchlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold leading-none">
                    {watchlist.length > 99 ? '99+' : watchlist.length}
                  </span>
                )}
              </button>
            ) : (
              <Link
                to="/watchlist"
                className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                aria-label="Watchlist"
              >
                <Bookmark className="w-5 h-5" />
              </Link>
            )}

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-all duration-200 group"
                >
                  <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white max-w-[120px] truncate">
                    {user?.name || 'User'}
                  </span>
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-gray-800 border border-gray-700 shadow-xl shadow-black/40 z-20 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-sm text-white font-medium truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/watchlist"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                      >
                        <Bookmark className="w-4 h-4" />
                        My Watchlist
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={handleAuthClick}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile: watchlist + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/watchlist"
              className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
              aria-label="Watchlist"
            >
              <Bookmark className="w-5 h-5" />
              {watchlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold leading-none">
                  {watchlist.length > 99 ? '99+' : watchlist.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900/98 backdrop-blur-sm">
          <div className="px-4 pt-3 pb-4 space-y-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-500'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/browse"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-500'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              Browse
            </NavLink>
            <NavLink
              to="/ai-picks"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-500'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              <Sparkles className="w-4 h-4" />
              AI Picks
            </NavLink>
          </div>

          <div className="px-4 pb-4 border-t border-gray-800 pt-3">
            {isAuthenticated ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleAuthClick}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium transition-all"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
