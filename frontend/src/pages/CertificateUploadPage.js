import React, { useState, useRef } from 'react';
import { uploadCertificate, getQrCode } from '../services/api';
import { toast } from 'react-toastify';
import {
  HiOutlineCloudUpload,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineX,
  HiOutlineQrcode,
  HiOutlineClipboardCopy,
  HiOutlineArrowLeft,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

const CertificateUploadPage = () => {
  const [formData, setFormData] = useState({
    studentEmail: '',
    courseName: '',
    institutionName: '',
    grade: '',
    issueDate: '',
    expiryDate: '',
  });
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.studentEmail || !formData.courseName || !formData.institutionName || !formData.issueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!file) {
      toast.error('Please select a certificate file');
      return;
    }

    setLoading(true);
    try {
      const certificateData = {
        studentEmail: formData.studentEmail,
        courseName: formData.courseName,
        institutionName: formData.institutionName,
        grade: formData.grade,
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate || null,
      };

      const response = await uploadCertificate(file, certificateData);
      setResult(response.data);
      toast.success('Certificate uploaded successfully!');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        'Failed to upload certificate';
      toast.error(typeof message === 'string' ? message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      studentEmail: '',
      courseName: '',
      institutionName: '',
      grade: '',
      issueDate: '',
      expiryDate: '',
    });
    setFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <HiOutlineCheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Certificate Uploaded Successfully!
            </h2>
            <p className="text-gray-500 mb-8">
              The certificate has been hashed and stored on the blockchain.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 text-left space-y-4 mb-6">
              {/* Certificate ID */}
              {result.certificateId && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Certificate ID
                  </label>
                  <div className="flex items-center mt-1">
                    <code className="flex-1 text-sm font-mono bg-white px-3 py-2 rounded-lg border border-gray-200 break-all">
                      {result.certificateId}
                    </code>
                    <button
                      onClick={() => copyToClipboard(result.certificateId)}
                      className="ml-2 p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      title="Copy"
                    >
                      <HiOutlineClipboardCopy className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Certificate Hash */}
              {result.certificateHash && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    SHA-256 Hash
                  </label>
                  <div className="flex items-center mt-1">
                    <code className="flex-1 text-sm font-mono bg-white px-3 py-2 rounded-lg border border-gray-200 break-all">
                      {result.certificateHash}
                    </code>
                    <button
                      onClick={() => copyToClipboard(result.certificateHash)}
                      className="ml-2 p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      title="Copy"
                    >
                      <HiOutlineClipboardCopy className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Transaction ID */}
              {result.transactionId && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </label>
                  <div className="flex items-center mt-1">
                    <code className="flex-1 text-sm font-mono bg-white px-3 py-2 rounded-lg border border-gray-200 break-all">
                      {result.transactionId}
                    </code>
                    <button
                      onClick={() => copyToClipboard(result.transactionId)}
                      className="ml-2 p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      title="Copy"
                    >
                      <HiOutlineClipboardCopy className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Block Hash */}
              {result.blockHash && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Block Hash
                  </label>
                  <div className="flex items-center mt-1">
                    <code className="flex-1 text-sm font-mono bg-white px-3 py-2 rounded-lg border border-gray-200 break-all">
                      {result.blockHash}
                    </code>
                    <button
                      onClick={() => copyToClipboard(result.blockHash)}
                      className="ml-2 p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      title="Copy"
                    >
                      <HiOutlineClipboardCopy className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* QR Code */}
            {result.certificateId && (
              <div className="mb-6">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  QR Code
                </label>
                <div className="mt-2 inline-block p-4 bg-white rounded-xl border border-gray-200">
                  <img
                    src={getQrCode(result.certificateId)}
                    alt="Certificate QR Code"
                    className="w-48 h-48"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={resetForm} className="btn-primary">
                <HiOutlineCloudUpload className="h-4 w-4 mr-2" />
                Upload Another
              </button>
              {result.certificateId && (
                <Link
                  to={`/certificates/${result.certificateId}`}
                  className="btn-secondary"
                >
                  View Certificate
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/certificates"
            className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-4"
          >
            <HiOutlineArrowLeft className="h-4 w-4 mr-1" />
            Back to Certificates
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Upload Certificate</h1>
          <p className="mt-1 text-gray-500">Issue a new certificate and store it on the blockchain.</p>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Student Email */}
            <div>
              <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Student Email <span className="text-red-500">*</span>
              </label>
              <input
                id="studentEmail"
                name="studentEmail"
                type="email"
                value={formData.studentEmail}
                onChange={handleChange}
                className="input-field"
                placeholder="student@example.com"
                required
              />
            </div>

            {/* Course Name */}
            <div>
              <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
                Course Name <span className="text-red-500">*</span>
              </label>
              <input
                id="courseName"
                name="courseName"
                type="text"
                value={formData.courseName}
                onChange={handleChange}
                className="input-field"
                placeholder="Bachelor of Computer Science"
                required
              />
            </div>

            {/* Institution Name */}
            <div>
              <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-1">
                Institution Name <span className="text-red-500">*</span>
              </label>
              <input
                id="institutionName"
                name="institutionName"
                type="text"
                value={formData.institutionName}
                onChange={handleChange}
                className="input-field"
                placeholder="University of Technology"
                required
              />
            </div>

            {/* Grade */}
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                Grade
              </label>
              <input
                id="grade"
                name="grade"
                type="text"
                value={formData.grade}
                onChange={handleChange}
                className="input-field"
                placeholder="A, B+, 3.8 GPA, etc."
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="issueDate"
                  name="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certificate File <span className="text-red-500">*</span>
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-primary-500 bg-primary-50'
                    : file
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="flex items-center justify-center space-x-3">
                    <HiOutlineDocumentText className="h-8 w-8 text-green-600" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <HiOutlineX className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <HiOutlineCloudUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="font-semibold text-primary-600 hover:text-primary-500"
                      >
                        Click to upload
                      </button>{' '}
                      or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    Uploading & Processing...
                  </div>
                ) : (
                  <>
                    <HiOutlineCloudUpload className="h-5 w-5 mr-2" />
                    Upload Certificate
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CertificateUploadPage;
