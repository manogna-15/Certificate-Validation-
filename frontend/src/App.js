import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CertificateListPage from './pages/CertificateListPage';
import CertificateUploadPage from './pages/CertificateUploadPage';
import CertificateDetailPage from './pages/CertificateDetailPage';
import VerifyPage from './pages/VerifyPage';
import TransactionListPage from './pages/TransactionListPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify" element={<VerifyPage />} />
              <Route path="/verify/:certificateId" element={<VerifyPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/certificates"
                element={
                  <ProtectedRoute>
                    <CertificateListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/certificates/upload"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <CertificateUploadPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/certificates/:id"
                element={
                  <ProtectedRoute>
                    <CertificateDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <TransactionListPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-gray-300">404</h1>
                      <p className="mt-4 text-xl text-gray-600">Page not found</p>
                      <a href="/" className="btn-primary mt-6 inline-block">
                        Go Home
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>

        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
