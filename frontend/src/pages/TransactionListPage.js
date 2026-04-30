import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTransactions } from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  HiOutlineDocumentText,
  HiOutlineSearch,
  HiOutlineClock,
  HiOutlineArrowRight,
} from 'react-icons/hi';

const TransactionListPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTx, setFilteredTx] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [searchQuery, actionFilter, transactions]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getTransactions();
      const data = Array.isArray(response.data) ? response.data : [];
      setTransactions(data);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    if (actionFilter !== 'ALL') {
      filtered = filtered.filter((tx) => tx.action === actionFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tx) =>
          (tx.transactionId && tx.transactionId.toLowerCase().includes(query)) ||
          (tx.certificateId && tx.certificateId.toLowerCase().includes(query)) ||
          (tx.performedBy && tx.performedBy.toLowerCase().includes(query)) ||
          (tx.performedByEmail && tx.performedByEmail.toLowerCase().includes(query))
      );
    }

    setFilteredTx(filtered);
  };

  const getActionBadge = (action) => {
    switch (action) {
      case 'UPLOAD':
      case 'ISSUE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {action}
          </span>
        );
      case 'VERIFY':
      case 'VERIFICATION':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {action}
          </span>
        );
      case 'REVOKE':
      case 'REVOCATION':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {action}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {action}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner size="lg" text="Loading transactions..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Transaction Log</h1>
          <p className="mt-1 text-gray-500">Blockchain transaction history for all certificate operations.</p>
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
                placeholder="Search by transaction ID, certificate ID, or user..."
              />
            </div>
            <div className="sm:w-48">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="input-field"
              >
                <option value="ALL">All Actions</option>
                <option value="UPLOAD">Upload</option>
                <option value="ISSUE">Issue</option>
                <option value="VERIFY">Verify</option>
                <option value="VERIFICATION">Verification</option>
                <option value="REVOKE">Revoke</option>
                <option value="REVOCATION">Revocation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden p-0">
          {filteredTx.length === 0 ? (
            <div className="text-center py-16 px-4">
              <HiOutlineDocumentText className="mx-auto h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No transactions found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchQuery || actionFilter !== 'ALL'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No transactions have been recorded yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Certificate ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Performed By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredTx.map((tx, index) => (
                    <tr key={tx.id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-700">
                          {tx.transactionId
                            ? tx.transactionId.substring(0, 16) + '...'
                            : tx.id || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getActionBadge(tx.action)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tx.certificateId ? (
                          <Link
                            to={`/certificates/${tx.certificateId}`}
                            className="text-sm font-mono text-primary-600 hover:text-primary-500"
                          >
                            {tx.certificateId.substring(0, 12)}...
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tx.performedBy || tx.performedByEmail || 'System'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <HiOutlineClock className="h-4 w-4 mr-1" />
                          {tx.timestamp
                            ? new Date(tx.timestamp).toLocaleString()
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tx.certificateId ? (
                          <Link
                            to={`/certificates/${tx.certificateId}`}
                            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500"
                          >
                            View
                            <HiOutlineArrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Count */}
        {filteredTx.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Showing {filteredTx.length} of {transactions.length} transactions
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionListPage;
