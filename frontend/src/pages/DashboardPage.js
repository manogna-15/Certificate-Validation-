import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats, getMyCertificates, getUploadedCertificates } from '../services/api';
import { toast } from 'react-toastify';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineUsers,
  HiOutlineEye,
  HiOutlineCloudUpload,
  HiOutlineShieldCheck,
  HiOutlineArrowRight,
  HiOutlineClock,
} from 'react-icons/hi';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentCerts, setRecentCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (user?.role === 'ADMIN') {
        const [statsRes, certsRes] = await Promise.allSettled([
          getDashboardStats(),
          getUploadedCertificates(),
        ]);

        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value.data);
        } else {
          setStats({
            totalCertificates: 0,
            activeCertificates: 0,
            revokedCertificates: 0,
            totalStudents: 0,
            totalVerifications: 0,
          });
        }

        if (certsRes.status === 'fulfilled') {
          setRecentCerts(Array.isArray(certsRes.value.data) ? certsRes.value.data.slice(0, 5) : []);
        }
      } else {
        try {
          const certsRes = await getMyCertificates();
          const certs = Array.isArray(certsRes.data) ? certsRes.data : [];
          setRecentCerts(certs.slice(0, 5));
          setStats({
            totalCertificates: certs.length,
            activeCertificates: certs.filter((c) => c.status === 'ACTIVE').length,
            revokedCertificates: certs.filter((c) => c.status === 'REVOKED').length,
            totalStudents: 0,
            totalVerifications: 0,
          });
        } catch {
          setStats({
            totalCertificates: 0,
            activeCertificates: 0,
            revokedCertificates: 0,
            totalStudents: 0,
            totalVerifications: 0,
          });
        }
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="badge-active">Active</span>;
      case 'REVOKED':
        return <span className="badge-revoked">Revoked</span>;
      case 'EXPIRED':
        return <span className="badge-expired">Expired</span>;
      default:
        return <span className="badge-active">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'User'}
          </h1>
          <p className="mt-1 text-gray-500">
            {user?.role === 'ADMIN'
              ? 'Manage certificates and monitor system activity.'
              : 'View and manage your certificates.'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatsCard
            icon={HiOutlineDocumentText}
            value={stats?.totalCertificates || 0}
            label="Total Certificates"
            color="primary"
          />
          <StatsCard
            icon={HiOutlineCheckCircle}
            value={stats?.activeCertificates || 0}
            label="Active"
            color="green"
          />
          <StatsCard
            icon={HiOutlineXCircle}
            value={stats?.revokedCertificates || 0}
            label="Revoked"
            color="red"
          />
          {user?.role === 'ADMIN' && (
            <>
              <StatsCard
                icon={HiOutlineUsers}
                value={stats?.totalStudents || 0}
                label="Total Students"
                color="blue"
              />
              <StatsCard
                icon={HiOutlineEye}
                value={stats?.totalVerifications || 0}
                label="Verifications"
                color="purple"
              />
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {user?.role === 'ADMIN' && (
            <Link
              to="/certificates/upload"
              className="card flex items-center space-x-4 hover:shadow-md transition-shadow group"
            >
              <div className="flex-shrink-0 p-3 rounded-xl bg-primary-50 group-hover:bg-primary-100 transition-colors">
                <HiOutlineCloudUpload className="h-6 w-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Upload Certificate</h3>
                <p className="text-sm text-gray-500">Issue a new certificate</p>
              </div>
              <HiOutlineArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
            </Link>
          )}

          <Link
            to="/verify"
            className="card flex items-center space-x-4 hover:shadow-md transition-shadow group"
          >
            <div className="flex-shrink-0 p-3 rounded-xl bg-green-50 group-hover:bg-green-100 transition-colors">
              <HiOutlineShieldCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Verify Certificate</h3>
              <p className="text-sm text-gray-500">Validate a certificate</p>
            </div>
            <HiOutlineArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
          </Link>

          <Link
            to="/certificates"
            className="card flex items-center space-x-4 hover:shadow-md transition-shadow group"
          >
            <div className="flex-shrink-0 p-3 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
              <HiOutlineDocumentText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">View Certificates</h3>
              <p className="text-sm text-gray-500">Browse all certificates</p>
            </div>
            <HiOutlineArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </Link>
        </div>

        {/* Recent Certificates */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Certificates</h2>
            <Link
              to="/certificates"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all
            </Link>
          </div>

          {recentCerts.length === 0 ? (
            <div className="text-center py-8">
              <HiOutlineDocumentText className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">No certificates found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Certificate ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Institution
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Issue Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentCerts.map((cert, index) => (
                    <tr key={cert.id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link
                          to={`/certificates/${cert.certificateId || cert.id}`}
                          className="text-sm font-medium text-primary-600 hover:text-primary-500"
                        >
                          {cert.certificateId
                            ? cert.certificateId.substring(0, 16) + '...'
                            : cert.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{cert.courseName}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{cert.institutionName}</td>
                      <td className="px-4 py-3">{getStatusBadge(cert.status)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        <div className="flex items-center">
                          <HiOutlineClock className="h-4 w-4 mr-1" />
                          {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Transactions (Admin only) */}
        {user?.role === 'ADMIN' && stats?.recentTransactions && stats.recentTransactions.length > 0 && (
          <div className="card mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <Link
                to="/transactions"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentTransactions.slice(0, 5).map((tx, index) => (
                    <tr key={tx.id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-700">
                        {tx.transactionId
                          ? tx.transactionId.substring(0, 16) + '...'
                          : tx.id}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tx.action === 'UPLOAD'
                              ? 'bg-blue-100 text-blue-800'
                              : tx.action === 'VERIFY'
                              ? 'bg-green-100 text-green-800'
                              : tx.action === 'REVOKE'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {tx.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
