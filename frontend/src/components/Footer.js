import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineShieldCheck } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <HiOutlineShieldCheck className="h-6 w-6 text-primary-600" />
              <span className="text-lg font-bold text-gray-900">CertifyChain</span>
            </div>
            <p className="text-sm text-gray-500">
              Blockchain-powered certificate verification system ensuring tamper-proof,
              instant validation of academic credentials.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/verify" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                  Verify Certificate
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              About
            </h3>
            <p className="text-sm text-gray-500">
              CertifyChain leverages blockchain technology to provide secure, transparent,
              and decentralized certificate management for educational institutions.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} CertifyChain. All rights reserved. Built with Blockchain Technology.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
