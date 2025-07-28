import { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Loader2,
  AlertCircle,

  CalendarCheck,
  DollarSign,
  Hotel,
  KeyRound,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useGetHotelPaymentsByUserIdQuery } from '../../features/api/paymentApi';
import type { RootState } from '../../app/store';

const MyPayments = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.userId);
  const [sortKey, setSortKey] = useState<'fallbackDate' | 'amount' | 'paymentStatus'>('fallbackDate');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Completed' | 'Pending' | 'Failed'>('All');

  console.log('👤 User ID:', userId);

  const {
    data: bookings = [],
    isLoading,
    error,
    refetch,
  } = useGetHotelPaymentsByUserIdQuery(userId, { skip: !userId });

  useEffect(() => {
    console.log('📦 Raw bookings data from backend:', bookings);
  }, [bookings]);

  const allPayments = useMemo(() => {
    const payments = bookings?.flatMap((booking: any) =>
      (booking.payments || []).map((payment: any) => ({
        ...payment,
        bookingId: booking.bookingId,
        roomType: booking.room?.roomType ?? 'Unknown',
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        fallbackDate: payment.createdAt || payment.updatedAt || booking.createdAt,
      }))
    ) ?? [];
    console.log('💳 Flattened payments:', payments);
    return payments;
  }, [bookings]);

  const filteredPayments = useMemo(() => {
    const result = allPayments
      .filter((p: { paymentStatus: string }) => filterStatus === 'All' || p.paymentStatus === filterStatus)
      .sort((a: any, b: any) => {
        if (sortKey === 'fallbackDate') {
          return new Date(b.fallbackDate).getTime() - new Date(a.fallbackDate).getTime();
        } else if (sortKey === 'amount') {
          return parseFloat(b.amount) - parseFloat(a.amount);
        } else {
          return (a.paymentStatus || '').localeCompare(b.paymentStatus || '');
        }
      });
    console.log('📊 Filtered & sorted payments:', result);
    return result;
  }, [allPayments, sortKey, filterStatus]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? 'Invalid date'
      : date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
  };

  const formatAmount = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return isNaN(num)
      ? '$0.00'
      : `$${num.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })}`;
  };

  const exportCSV = () => {
    const headers = ['Date', 'Amount', 'Transaction ID', 'Status', 'Method', 'Room', 'Stay'];
    const rows = filteredPayments.map((p: { fallbackDate: string; amount: string | number; transactionId: any; paymentStatus: any; paymentMethod: any; roomType: any; checkInDate: string; checkOutDate: string; }) => [
      formatDate(p.fallbackDate),
      formatAmount(p.amount),
      p.transactionId || 'N/A',
      p.paymentStatus,
      p.paymentMethod || 'N/A',
      p.roomType,
      `${formatDate(p.checkInDate)} - ${formatDate(p.checkOutDate)}`,
    ]);

    const csvContent = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'payments.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Your Payment History', 14, 16);
    filteredPayments.forEach((p: { fallbackDate: string; amount: string | number; transactionId: any; paymentStatus: any; }, i: number) => {
      const y = 30 + i * 10;
      doc.text([
        formatDate(p.fallbackDate),
        formatAmount(p.amount),
        p.transactionId || 'N/A',
        p.paymentStatus,
      ].join(' | '), 14, y);
    });
    doc.save('payments.pdf');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-purple-500 mr-2" size={24} />
        <span className="text-lg text-purple-800">Loading your payments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto text-pink-500 mb-3" size={32} />
        <h3 className="text-xl font-medium text-purple-800 mb-2">Error loading payments</h3>
        <p className="text-purple-700">Please check your connection or try refreshing.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Your Payment History</h2>

      <div className="flex flex-wrap justify-between gap-4 mb-6">
        <div className="flex gap-3">
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as any)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="fallbackDate">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="paymentStatus">Sort by Status</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="bg-teal-600 text-white px-3 py-2 rounded hover:bg-teal-700 text-sm"
          >
            Export CSV
          </button>
          <button
            onClick={exportPDF}
            className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 text-sm"
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredPayments.map((payment: any, index: number) => (
          <div
            key={`${payment.transactionId || payment.bookingId}-${index}`}
            className="bg-white border rounded-xl shadow p-4"
          >
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium text-purple-800">
                  TXN: {payment.transactionId || 'N/A'}
                </h4>
                <p className="text-sm text-gray-500">{formatDate(payment.fallbackDate)}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-pink-600">
                  {formatAmount(payment.amount)}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1
                  ${payment.paymentStatus === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : payment.paymentStatus === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'}`}>
                  {payment.paymentStatus}
                </span>
              </div>
            </div>

            <div className="mt-3 text-sm text-purple-700">
              <p><DollarSign size={14} className="inline mr-1" /> Method: {payment.paymentMethod ?? 'N/A'}</p>
              <p><KeyRound size={14} className="inline mr-1" /> Booking ID: {payment.bookingId}</p>
              <p><Hotel size={14} className="inline mr-1" /> Room Type: {payment.roomType}</p>
              <p><CalendarCheck size={14} className="inline mr-1" /> Stay: {formatDate(payment.checkInDate)} - {formatDate(payment.checkOutDate)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPayments;
