import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { verifyCertificate, verifyCertificateById, verifyCertificateByFile, getQrCode, getCertificateFileUrl } from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  HiOutlineShieldCheck,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineSearch,
  HiOutlineFingerPrint,
  HiOutlineIdentification,
  HiOutlineClock,
  HiOutlineAcademicCap,
  HiOutlineOfficeBuilding,
  HiOutlineUser,
  HiOutlineQrcode,
  HiOutlineDocumentText,
  HiOutlineCube,
  HiOutlineDownload,
  HiOutlineClipboardCopy,
  HiOutlineExternalLink,
  HiOutlineUpload,
  HiOutlineCloudUpload,
} from 'react-icons/hi';

const VerifyPage = () => {
  const { certificateId: urlCertId } = useParams();
  const [activeTab, setActiveTab] = useState('id');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [verified, setVerified] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (urlCertId) {
      setInputValue(urlCertId);
      setActiveTab('id');
      handleVerify(urlCertId, 'id');
    }
  }, [urlCertId]);

  const handleVerify = async (value, type) => {
    const searchValue = value || inputValue;
    const searchType = type || activeTab;

    if (!searchValue.trim()) {
      toast.error('Please enter a certificate ID or hash');
      return;
    }

    setLoading(true);
    setResult(null);
    setVerified(false);

    try {
      let response;

      if (searchType === 'id') {
        try {
          response = await verifyCertificateById(searchValue.trim());
        } catch {
          response = await verifyCertificate({ certificateId: searchValue.trim() });
        }
      } else {
        response = await verifyCertificate({ certificateHash: searchValue.trim() });
      }

      setResult(response.data);
      setVerified(true);
    } catch (error) {
      if (error.response?.status === 404) {
        setResult({ valid: false, message: 'Certificate not found' });
        setVerified(true);
      } else {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Verification failed. Please try again.';
        toast.error(typeof message === 'string' ? message : 'Verification failed');
        setResult({ valid: false, message: 'Verification failed' });
        setVerified(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerify();
  };

  const handleFileVerify = async (file) => {
    const fileToVerify = file || selectedFile;
    if (!fileToVerify) {
      toast.error('Please select a certificate file to verify');
      return;
    }

    setLoading(true);
    setResult(null);
    setVerified(false);

    try {
      const response = await verifyCertificateByFile(fileToVerify);
      setResult(response.data);
      setVerified(true);
    } catch (error) {
      if (error.response?.status === 404) {
        setResult({ valid: false, message: 'Certificate not found', computedHash: error.response?.data?.computedHash });
        setVerified(true);
      } else {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Verification failed. Please try again.';
        toast.error(typeof message === 'string' ? message : 'Verification failed');
        setResult({ valid: false, message: 'Verification failed' });
        setVerified(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      handleFileVerify(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleFileVerify(file);
    }
  };

  const resetVerification = () => {
    setResult(null);
    setVerified(false);
    setInputValue('');
    setSelectedFile(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const cert = result?.certificateDetails;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white mb-4 shadow-lg shadow-primary-200">
            <HiOutlineShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Verify Certificate</h1>
          <p className="mt-2 text-gray-500 max-w-xl mx-auto">
            Enter a certificate ID or hash to instantly verify its authenticity on the blockchain.
          </p>
        </div>

        {/* Verification Form */}
        <div className="card mb-8">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'id'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('id');
                resetVerification();
              }}
            >
              <HiOutlineIdentification className="h-4 w-4 mr-2" />
              Verify by Certificate ID
            </button>
            <button
              className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'hash'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('hash');
                resetVerification();
              }}
            >
              <HiOutlineFingerPrint className="h-4 w-4 mr-2" />
              Verify by Hash
            </button>
            <button
              className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'file'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('file');
                resetVerification();
              }}
            >
              <HiOutlineUpload className="h-4 w-4 mr-2" />
              Verify by File Upload
            </button>
          </div>

          {activeTab === 'file' ? (
            <div>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                  dragOver
                    ? 'border-primary-500 bg-primary-50'
                    : selectedFile
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => document.getElementById('file-upload-input').click()}
              >
                <input
                  id="file-upload-input"
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileSelect}
                />
                {selectedFile ? (
                  <div>
                    <HiOutlineDocumentText className="h-10 w-10 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                    {loading && (
                      <div className="flex items-center justify-center mt-3">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent mr-2" />
                        <span className="text-sm text-primary-600">Verifying...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <HiOutlineCloudUpload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">
                      Drop your certificate file here or <span className="text-primary-600">browse</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload the same certificate file to verify it produces the same hash
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Supports PDF, PNG, JPG
                    </p>
                  </div>
                )}
              </div>
              {selectedFile && !loading && (
                <button
                  onClick={() => handleFileVerify()}
                  className="btn-primary w-full mt-3 !py-3"
                >
                  <HiOutlineShieldCheck className="h-5 w-5 mr-2" />
                  Verify Again
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="input-field pl-10 !py-3"
                    placeholder={
                      activeTab === 'id'
                        ? 'Enter certificate ID...'
                        : 'Enter SHA-256 hash...'
                    }
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary !py-3 whitespace-nowrap disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                      Verifying...
                    </div>
                  ) : (
                    <>
                      <HiOutlineShieldCheck className="h-5 w-5 mr-2" />
                      Verify
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Loading */}
        {loading && <LoadingSpinner text="Verifying certificate on blockchain..." />}

        {/* Result */}
        {verified && result && !loading && (
          <div>
            {result.valid || result.certificateDetails ? (
              /* Valid / Found Certificate */
              <div className="space-y-6">
                {/* Status Banner */}
                <div
                  className={`rounded-2xl p-6 text-center ${
                    result.valid
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
                      : 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200'
                  }`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                      result.valid ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    {result.valid ? (
                      <HiOutlineCheckCircle className="h-12 w-12 text-green-600" />
                    ) : (
                      <HiOutlineXCircle className="h-12 w-12 text-red-600" />
                    )}
                  </div>
                  <h2
                    className={`text-2xl font-bold ${
                      result.valid ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {result.valid ? 'Certificate is Valid' : 'Certificate is Invalid'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {result.message || 'Verification complete.'}
                  </p>
                  {result.verificationTimestamp && (
                    <p className="text-xs text-gray-400 mt-2">
                      Verified at: {new Date(result.verificationTimestamp).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Hash Comparison - shown when verifying by file upload */}
                {result.computedHash && cert?.certificateHash && (
                  <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <HiOutlineFingerPrint className="h-5 w-5 mr-2 text-primary-600" />
                      Hash Comparison
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Uploaded File Hash (Computed)
                        </label>
                        <div className="flex items-center mt-1">
                          <code className="flex-1 text-xs font-mono bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 break-all">
                            {result.computedHash}
                          </code>
                          <button
                            onClick={() => copyToClipboard(result.computedHash)}
                            className="ml-2 p-2 text-gray-400 hover:text-primary-600"
                            title="Copy"
                          >
                            <HiOutlineClipboardCopy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Stored Certificate Hash
                        </label>
                        <div className="flex items-center mt-1">
                          <code className="flex-1 text-xs font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 break-all">
                            {cert.certificateHash}
                          </code>
                          <button
                            onClick={() => copyToClipboard(cert.certificateHash)}
                            className="ml-2 p-2 text-gray-400 hover:text-primary-600"
                            title="Copy"
                          >
                            <HiOutlineClipboardCopy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className={`flex items-center p-3 rounded-lg ${
                        result.computedHash === cert.certificateHash
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-red-50 border border-red-200'
                      }`}>
                        {result.computedHash === cert.certificateHash ? (
                          <>
                            <HiOutlineCheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                            <span className="text-sm font-medium text-green-700">
                              Hashes match! The uploaded file is identical to the registered certificate.
                            </span>
                          </>
                        ) : (
                          <>
                            <HiOutlineXCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                            <span className="text-sm font-medium text-red-700">
                              Hashes do not match. The uploaded file differs from the registered certificate.
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {cert && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Certificate Details */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Student & Course Info */}
                      <div className="card">
                        <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
                          <HiOutlineDocumentText className="h-5 w-5 mr-2 text-primary-600" />
                          Certificate Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {cert.certificateId && (
                            <div className="flex items-start space-x-3">
                              <HiOutlineIdentification className="h-5 w-5 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Certificate ID</p>
                                <p className="text-sm font-mono font-medium text-gray-900">{cert.certificateId}</p>
                              </div>
                            </div>
                          )}

                          {cert.studentName && (
                            <div className="flex items-start space-x-3">
                              <HiOutlineUser className="h-5 w-5 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Student Name</p>
                                <p className="text-sm font-medium text-gray-900">{cert.studentName}</p>
                                {cert.studentEmail && (
                                  <p className="text-xs text-gray-500">{cert.studentEmail}</p>
                                )}
                              </div>
                            </div>
                          )}

                          {cert.courseName && (
                            <div className="flex items-start space-x-3">
                              <HiOutlineAcademicCap className="h-5 w-5 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Course</p>
                                <p className="text-sm font-medium text-gray-900">{cert.courseName}</p>
                              </div>
                            </div>
                          )}

                          {cert.institutionName && (
                            <div className="flex items-start space-x-3">
                              <HiOutlineOfficeBuilding className="h-5 w-5 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Institution</p>
                                <p className="text-sm font-medium text-gray-900">{cert.institutionName}</p>
                              </div>
                            </div>
                          )}

                          {cert.grade && (
                            <div className="flex items-start space-x-3">
                              <HiOutlineAcademicCap className="h-5 w-5 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Grade</p>
                                <p className="text-sm font-medium text-gray-900">{cert.grade}</p>
                              </div>
                            </div>
                          )}

                          {cert.status && (
                            <div className="flex items-start space-x-3">
                              <HiOutlineShieldCheck className="h-5 w-5 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    cert.status === 'ACTIVE'
                                      ? 'bg-green-100 text-green-800'
                                      : cert.status === 'REVOKED'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {cert.status === 'ACTIVE' && <HiOutlineCheckCircle className="h-3 w-3 mr-1" />}
                                  {cert.status === 'REVOKED' && <HiOutlineXCircle className="h-3 w-3 mr-1" />}
                                  {cert.status === 'EXPIRED' && <HiOutlineClock className="h-3 w-3 mr-1" />}
                                  {cert.status}
                                </span>
                              </div>
                            </div>
                          )}

                          {cert.issueDate && (
                            <div className="flex items-start space-x-3">
                              <HiOutlineClock className="h-5 w-5 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Issue Date</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {new Date(cert.issueDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </p>
                              </div>
                            </div>
                          )}

                          {cert.expiryDate && (
                            <div className="flex items-start space-x-3">
                              <HiOutlineClock className="h-5 w-5 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Expiry Date</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {new Date(cert.expiryDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </p>
                              </div>
                            </div>
                          )}

                          {cert.uploadedByName && (
                            <div className="flex items-start space-x-3">
                              <HiOutlineUser className="h-5 w-5 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Issued By</p>
                                <p className="text-sm font-medium text-gray-900">{cert.uploadedByName}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Blockchain Details */}
                      <div className="card">
                        <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
                          <HiOutlineCube className="h-5 w-5 mr-2 text-primary-600" />
                          Blockchain Verification
                        </h3>
                        <div className="space-y-4">
                          {cert.certificateHash && (
                            <div>
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                SHA-256 Hash
                              </label>
                              <div className="flex items-center mt-1">
                                <code className="flex-1 text-xs font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 break-all">
                                  {cert.certificateHash}
                                </code>
                                <button
                                  onClick={() => copyToClipboard(cert.certificateHash)}
                                  className="ml-2 p-2 text-gray-400 hover:text-primary-600"
                                  title="Copy"
                                >
                                  <HiOutlineClipboardCopy className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          )}

                          {cert.transactionId && (
                            <div>
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Transaction ID
                              </label>
                              <div className="flex items-center mt-1">
                                <code className="flex-1 text-xs font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 break-all">
                                  {cert.transactionId}
                                </code>
                                <button
                                  onClick={() => copyToClipboard(cert.transactionId)}
                                  className="ml-2 p-2 text-gray-400 hover:text-primary-600"
                                  title="Copy"
                                >
                                  <HiOutlineClipboardCopy className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          )}

                          {cert.blockHash && (
                            <div>
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Block Hash
                              </label>
                              <div className="flex items-center mt-1">
                                <code className="flex-1 text-xs font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 break-all">
                                  {cert.blockHash}
                                </code>
                                <button
                                  onClick={() => copyToClipboard(cert.blockHash)}
                                  className="ml-2 p-2 text-gray-400 hover:text-primary-600"
                                  title="Copy"
                                >
                                  <HiOutlineClipboardCopy className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-4 pt-2">
                            {cert.blockNumber !== undefined && cert.blockNumber !== null && (
                              <div className="bg-primary-50 rounded-lg px-4 py-2">
                                <p className="text-xs text-primary-600 font-medium">Block Number</p>
                                <p className="text-lg font-bold text-primary-700">#{cert.blockNumber}</p>
                              </div>
                            )}
                            {result.transactionId && (
                              <div className="bg-gray-50 rounded-lg px-4 py-2">
                                <p className="text-xs text-gray-500 font-medium">Verification TX</p>
                                <p className="text-xs font-mono text-gray-700 break-all">
                                  {result.transactionId.substring(0, 20)}...
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Certificate File Preview */}
                      {cert.certificateId && (
                        <div className="card">
                          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <HiOutlineDocumentText className="h-5 w-5 mr-2 text-primary-600" />
                            Certificate Document
                          </h3>
                          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                            {cert.originalFileName && (cert.originalFileName.endsWith('.pdf')) ? (
                              <iframe
                                src={getCertificateFileUrl(cert.certificateId)}
                                title="Certificate Document"
                                className="w-full h-96 border-0"
                              />
                            ) : (
                              <img
                                src={getCertificateFileUrl(cert.certificateId)}
                                alt="Certificate Document"
                                className="w-full max-h-[500px] object-contain p-4"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.parentElement.innerHTML =
                                    '<div class="flex flex-col items-center justify-center py-12 text-gray-400"><svg class="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><p class="text-sm">Certificate file preview not available</p></div>';
                                }}
                              />
                            )}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-3">
                            <a
                              href={getCertificateFileUrl(cert.certificateId)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-secondary inline-flex items-center text-sm"
                            >
                              <HiOutlineExternalLink className="h-4 w-4 mr-2" />
                              Open Full View
                            </a>
                            <a
                              href={getCertificateFileUrl(cert.certificateId)}
                              download
                              className="btn-secondary inline-flex items-center text-sm"
                            >
                              <HiOutlineDownload className="h-4 w-4 mr-2" />
                              Download Certificate
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column - QR Code & Actions */}
                    <div className="space-y-6">
                      {/* QR Code */}
                      {cert.certificateId && (
                        <div className="card text-center">
                          <div className="flex items-center justify-center mb-3">
                            <HiOutlineQrcode className="h-5 w-5 text-primary-600 mr-2" />
                            <h3 className="font-semibold text-gray-900">QR Code</h3>
                          </div>
                          <div className="inline-block p-4 bg-white rounded-xl border border-gray-200">
                            <img
                              src={getQrCode(cert.certificateId)}
                              alt="QR Code"
                              className="w-48 h-48"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-3">
                            Scan to verify this certificate
                          </p>
                        </div>
                      )}

                      {/* Verification Summary */}
                      <div className="card">
                        <h3 className="font-semibold text-gray-900 mb-3">Verification Summary</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Status</span>
                            <span
                              className={`font-medium ${
                                result.valid ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {result.valid ? 'Verified' : 'Invalid'}
                            </span>
                          </div>
                          {result.verificationTimestamp && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">Verified At</span>
                              <span className="text-gray-900 text-xs">
                                {new Date(result.verificationTimestamp).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {cert.originalFileName && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">File</span>
                              <span className="text-gray-900 text-xs truncate max-w-[150px]" title={cert.originalFileName}>
                                {cert.originalFileName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Verify Another */}
                      <button
                        onClick={resetVerification}
                        className="btn-primary w-full"
                      >
                        <HiOutlineSearch className="h-4 w-4 mr-2" />
                        Verify Another Certificate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Invalid Certificate - Not Found */
              <div className="card text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
                  <HiOutlineXCircle className="h-12 w-12 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-red-700">Certificate Not Found</h2>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  {result.message ||
                    'The certificate could not be verified. Please check the ID or hash and try again.'}
                </p>
                {result.computedHash && (
                  <div className="mt-4 max-w-lg mx-auto text-left">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Computed File Hash (SHA-256)
                    </label>
                    <div className="flex items-center mt-1">
                      <code className="flex-1 text-xs font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 break-all">
                        {result.computedHash}
                      </code>
                      <button
                        onClick={() => copyToClipboard(result.computedHash)}
                        className="ml-2 p-2 text-gray-400 hover:text-primary-600"
                        title="Copy"
                      >
                        <HiOutlineClipboardCopy className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      This hash does not match any registered certificate in the system.
                    </p>
                  </div>
                )}
                <button
                  onClick={resetVerification}
                  className="btn-primary mt-6"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;
