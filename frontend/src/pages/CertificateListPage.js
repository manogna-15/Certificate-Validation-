import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCertificates, getMyCertificates, getUploadedCertificates } from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  HiOutlineSearch,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineEye,
  HiOutlinePlus,
} from 'react-icons/hi';

const CertificateListPage = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [filteredCerts, setFilteredCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    if (user) {
      fetchCertificates();
    }
  }, [user]);

  useEffect(() => {
    filterCertificates();
  }, [searchQuery, statusFilter, certificates]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      let response;
      if (user?.role === 'ADMIN') {
        try {
          response = await getCertificates();
        } catch {
          response = await getUploadedCertificates();
        }
      } else if (user?.role === 'STUDENT') {
        response = await getMyCertificates();
      } else {
        // VERIFIER or other roles - try all certificates first, then my certificates
        try {
          response = await getCertificates();
        } catch {
          try {
            response = await getMyCertificates();
          } catch {
            response = { data: [] };
          }
        }
      }
      const data = Array.isArray(response.data) ? response.data : [];
      setCertificates(data);
    } catch (error) {
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const filterCertificates = () => {
    let filtered = [...certificates];

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((cert) => cert.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (cert) =>
          (cert.certificateId && cert.certificateId.toLowerCase().includes(query)) ||
          (cert.studentName && cert.studentName.toLowerCase().includes(query)) ||
          (cert.studentEmail && cert.studentEmail.toLowerCase().includes(query)) ||
          (cert.courseName && cert.courseName.toLowerCase().includes(query)) ||
          (cert.institutionName && cert.institutionName.toLowerCase().includes(query))
      );
    }

    setFilteredCerts(filtered);
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
        <LoadingSpinner size="lg" text="Loading certificates..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Certificates</h1>
            <p className="mt-1 text-gray-500">
              {user?.role === 'ADMIN' ? 'Manage all certificates' : 'Your certificates'}
            </p>
          </div>
          {user?.role === 'ADMIN' && (
            <Link
              to="/certificates/upload"
              className="mt-4 sm:mt-0 btn-primary"
            >
              <HiOutlinePlus className="h-4 w-4 mr-2" />
              Upload Certificate
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
                placeholder="Search by ID, name, course, or institution..."
              />
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="REVOKED">Revoked</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden p-0">
          {filteredCerts.length === 0 ? (
            <div className="text-center py-16 px-4">
              <HiOutlineDocumentText className="mx-auto h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No certificates found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchQuery || statusFilter !== 'ALL'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No certificates have been issued yet.'}
              </p>
              {user?.role === 'ADMIN' && (
                <Link to="/certificates/upload" className="btn-primary mt-4">
                  <HiOutlinePlus className="h-4 w-4 mr-2" />
                  Upload First Certificate
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Certificate ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Institution
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Issue Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredCerts.map((cert, index) => (
                    <tr key={cert.id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-700">
                          {cert.certificateId
                            ? cert.certificateId.substring(0, 12) + '...'
                            : cert.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {cert.studentName || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">{cert.studentEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {cert.courseName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cert.institutionName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(cert.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <HiOutlineClock className="h-4 w-4 mr-1" />
                          {cert.issueDate
                            ? new Date(cert.issueDate).toLocaleDateString()
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/certificates/${cert.certificateId || cert.id}`}
                          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
                        >
                          <HiOutlineEye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Count */}
        {filteredCerts.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Showing {filteredCerts.length} of {certificates.length} certificates
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateListPage;
