import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineShieldCheck,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineChevronDown,
} from 'react-icons/hi';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive(path)
        ? 'text-primary-600 bg-primary-50'
        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
    }`;

  const mobileLinkClass = (path) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
      isActive(path)
        ? 'text-primary-600 bg-primary-50'
        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <HiOutlineShieldCheck className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                CertifyChain
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <Link to="/" className={linkClass('/')}>Home</Link>
            <Link to="/verify" className={linkClass('/verify')}>Verify Certificate</Link>

            {isAuthenticated && (
              <>
                <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
                <Link to="/certificates" className={linkClass('/certificates')}>Certificates</Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/transactions" className={linkClass('/transactions')}>Transactions</Link>
                )}
              </>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <HiOutlineUser className="h-4 w-4 text-primary-600" />
                  </div>
                  <span>{user?.name || 'User'}</span>
                  <HiOutlineChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-700">
                          {user?.role}
                        </span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <HiOutlineLogout className="mr-2 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="btn-primary !py-2 !px-4"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              {mobileOpen ? (
                <HiOutlineX className="h-6 w-6" />
              ) : (
                <HiOutlineMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className={mobileLinkClass('/')} onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/verify" className={mobileLinkClass('/verify')} onClick={() => setMobileOpen(false)}>Verify Certificate</Link>

            {isAuthenticated && (
              <>
                <Link to="/dashboard" className={mobileLinkClass('/dashboard')} onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <Link to="/certificates" className={mobileLinkClass('/certificates')} onClick={() => setMobileOpen(false)}>Certificates</Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/transactions" className={mobileLinkClass('/transactions')} onClick={() => setMobileOpen(false)}>Transactions</Link>
                )}
              </>
            )}
          </div>

          <div className="border-t border-gray-200 px-4 py-3">
            {isAuthenticated ? (
              <div>
                <div className="flex items-center mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <HiOutlineUser className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <HiOutlineLogout className="mr-2 h-4 w-4" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center btn-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
