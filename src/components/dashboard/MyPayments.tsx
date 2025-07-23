import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

interface Payment {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}

const MyPayments = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/payments/user/${userId}`);
      setPayments(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load payment history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPayments();
    }
  }, [userId]);

  const totalSpending = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {error && (
        <div className="text-red-600 text-sm flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5" /> {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Total Spending</h2>
        <p className="text-3xl font-extrabold text-purple-700">${(totalSpending / 100).toFixed(2)}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white p-6 border-b border-gray-200 dark:border-gray-700">
          Payment History
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700 dark:text-gray-200">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                <th className="p-4">Payment ID</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="p-4">{payment.id}</td>
                    <td className="p-4">${(payment.amount / 100).toFixed(2)}</td>
                    <td className="p-4 capitalize">{payment.status}</td>
                    <td className="p-4">{new Date(payment.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-4 text-center text-gray-500 dark:text-gray-400" colSpan={4}>
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyPayments;
