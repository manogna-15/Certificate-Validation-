import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getCertificateById,
  revokeCertificate,
  getQrCode,
  getCertificateTransactions,
} from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  HiOutlineArrowLeft,
  HiOutlineClipboardCopy,
  HiOutlineDownload,
  HiOutlineExclamation,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineQrcode,
  HiOutlineDocumentText,
  HiOutlineFingerPrint,
  HiOutlineCube,
  HiOutlineUser,
  HiOutlineAcademicCap,
  HiOutlineOfficeBuilding,
} from 'react-icons/hi';

const CertificateDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  const fetchCertificate = async () => {
    try {
      setLoading(true);
      const [certRes, txRes] = await Promise.allSettled([
        getCertificateById(id),
        getCertificateTransactions(id),
      ]);

      if (certRes.status === 'fulfilled') {
        setCertificate(certRes.value.data);
      } else {
        toast.error('Certificate not found');
        navigate('/certificates');
        return;
      }

      if (txRes.status === 'fulfilled') {
        setTransactions(Array.isArray(txRes.value.data) ? txRes.value.data : []);
      }
    } catch (error) {
      toast.error('Failed to load certificate');
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    setRevoking(true);
    try {
      await revokeCertificate(id);
      toast.success('Certificate revoked successfully');
      setShowRevokeModal(false);
      fetchCertificate();
    } catch (error) {
      const message =
        error.response?.data?.message || error.response?.data || 'Failed to revoke certificate';
      toast.error(typeof message === 'string' ? message : 'Revocation failed');
    } finally {
      setRevoking(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadQrCode = async () => {
    try {
      const qrUrl = getQrCode(id);
      const link = document.createElement('a');
      link.href = qrUrl;
      link.download = `certificate-${id}-qrcode.png`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      toast.error('Failed to download QR code');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <HiOutlineCheckCircle className="h-4 w-4 mr-1" />
            Active
          </span>
        );
      case 'REVOKED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <HiOutlineXCircle className="h-4 w-4 mr-1" />
            Revoked
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <HiOutlineClock className="h-4 w-4 mr-1" />
            Expired
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner size="lg" text="Loading certificate..." />
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <HiOutlineDocumentText className="mx-auto h-16 w-16 text-gray-300" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Certificate Not Found</h2>
          <Link to="/certificates" className="btn-primary mt-4">
            Back to Certificates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          to="/certificates"
          className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-6"
        >
          <HiOutlineArrowLeft className="h-4 w-4 mr-1" />
          Back to Certificates
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Certificate Info Card */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-gray-900">Certificate Details</h1>
                {getStatusBadge(certificate.status)}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <HiOutlineUser className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Student</p>
                    <p className="text-sm font-medium text-gray-900">
                      {certificate.studentName || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">{certificate.studentEmail}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <HiOutlineAcademicCap className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Course</p>
                    <p className="text-sm font-medium text-gray-900">{certificate.courseName}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <HiOutlineOfficeBuilding className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Institution</p>
                    <p className="text-sm font-medium text-gray-900">{certificate.institutionName}</p>
                  </div>
                </div>

                {certificate.grade && (
                  <div className="flex items-start space-x-3">
                    <HiOutlineAcademicCap className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Grade</p>
                      <p className="text-sm font-medium text-gray-900">{certificate.grade}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <HiOutlineClock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Issue Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {certificate.issueDate
                        ? new Date(certificate.issueDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {certificate.expiryDate && (
                  <div className="flex items-start space-x-3">
                    <HiOutlineClock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Expiry Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(certificate.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Blockchain Info Card */}
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <HiOutlineCube className="h-5 w-5 mr-2 text-primary-600" />
                Blockchain Details
              </h2>

              <div className="space-y-4">
                {certificate.certificateId && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Certificate ID
                    </label>
                    <div className="flex items-center mt-1">
                      <code className="flex-1 text-sm font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 break-all">
                        {certificate.certificateId}
                      </code>
                      <button
                        onClick={() => copyToClipboard(certificate.certificateId)}
                        className="ml-2 p-2 text-gray-400 hover:text-primary-600"
                        title="Copy"
                      >
                        <HiOutlineClipboardCopy className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}

                {certificate.certificateHash && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      SHA-256 Hash
                    </label>
                    <div className="flex items-center mt-1">
                      <code className="flex-1 text-sm font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 break-all">
                        {certificate.certificateHash}
                      </code>
                      <button
                        onClick={() => copyToClipboard(certificate.certificateHash)}
                        className="ml-2 p-2 text-gray-400 hover:text-primary-600"
                        title="Copy"
                      >
                        <HiOutlineClipboardCopy className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}

                {certificate.transactionId && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </label>
                    <div className="flex items-center mt-1">
                      <code className="flex-1 text-sm font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 break-all">
                        {certificate.transactionId}
                      </code>
                      <button
                        onClick={() => copyToClipboard(certificate.transactionId)}
                        className="ml-2 p-2 text-gray-400 hover:text-primary-600"
                        title="Copy"
                      >
                        <HiOutlineClipboardCopy className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}

                {certificate.blockHash && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Block Hash
                    </label>
                    <div className="flex items-center mt-1">
                      <code className="flex-1 text-sm font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 break-all">
                        {certificate.blockHash}
                      </code>
                      <button
                        onClick={() => copyToClipboard(certificate.blockHash)}
                        className="ml-2 p-2 text-gray-400 hover:text-primary-600"
                        title="Copy"
                      >
                        <HiOutlineClipboardCopy className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}

                {certificate.blockNumber !== undefined && certificate.blockNumber !== null && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Block Number
                    </label>
                    <p className="mt-1 text-sm font-mono text-gray-900">{certificate.blockNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Transaction History */}
            {transactions.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Transaction History</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                          Transaction ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                          Action
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                          Performed By
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {transactions.map((tx, index) => (
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
                            {tx.performedBy || tx.performedByEmail || 'System'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {tx.timestamp
                              ? new Date(tx.timestamp).toLocaleString()
                              : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code */}
            <div className="card text-center">
              <div className="flex items-center justify-center mb-3">
                <HiOutlineQrcode className="h-5 w-5 text-primary-600 mr-2" />
                <h3 className="font-semibold text-gray-900">QR Code</h3>
              </div>
              <div className="inline-block p-4 bg-white rounded-xl border border-gray-200">
                <img
                  src={getQrCode(certificate.certificateId || id)}
                  alt="Certificate QR Code"
                  className="w-48 h-48"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML =
                      '<p class="text-sm text-gray-400 p-8">QR code not available</p>';
                  }}
                />
              </div>
              <button
                onClick={downloadQrCode}
                className="mt-4 btn-secondary w-full"
              >
                <HiOutlineDownload className="h-4 w-4 mr-2" />
                Download QR Code
              </button>
            </div>

            {/* Actions */}
            {user?.role === 'ADMIN' && certificate.status === 'ACTIVE' && (
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-3">Actions</h3>
                <button
                  onClick={() => setShowRevokeModal(true)}
                  className="btn-danger w-full"
                >
                  <HiOutlineXCircle className="h-4 w-4 mr-2" />
                  Revoke Certificate
                </button>
              </div>
            )}

            {/* Verification Link */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Verification Link</h3>
              <p className="text-xs text-gray-500 mb-2">Share this link for public verification:</p>
              <div className="flex items-center">
                <code className="flex-1 text-xs font-mono bg-gray-50 px-2 py-1.5 rounded border border-gray-200 break-all">
                  {window.location.origin}/verify/{certificate.certificateId || id}
                </code>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `${window.location.origin}/verify/${certificate.certificateId || id}`
                    )
                  }
                  className="ml-2 p-1.5 text-gray-400 hover:text-primary-600"
                >
                  <HiOutlineClipboardCopy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revoke Confirmation Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setShowRevokeModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                <HiOutlineExclamation className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Revoke Certificate</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to revoke this certificate? This action will be recorded
                on the blockchain and cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRevokeModal(false)}
                  className="flex-1 btn-secondary"
                  disabled={revoking}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevoke}
                  className="flex-1 btn-danger"
                  disabled={revoking}
                >
                  {revoking ? (
                    <div className="flex items-center justify-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                      Revoking...
                    </div>
                  ) : (
                    'Yes, Revoke'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateDetailPage;
