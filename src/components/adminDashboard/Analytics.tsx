import { useGetAllBookingsQuery } from '../../features/api/bookingsApi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Loader2, TrendingUp, DollarSign, Users, Calendar, Hotel, Activity } from 'lucide-react';

interface Payment {
  paymentId: number;
  amount: number;
  paymentStatus: string;
  paymentDate: string;
}

interface Booking {
  bookingId: number;
  user: { firstName: string; lastName: string };
  room: {
    hotel: { name: string };
    price: number;
  };
  checkInDate: string;
  checkOutDate: string;
  bookingStatus: string;
  createdAt: string;
  payments: Payment[];
}

const Analytics = () => {
  const { data: bookings = [], isLoading } = useGetAllBookingsQuery({});

  // Total bookings
  const totalBookings = bookings.length;
  
  // Total revenue from confirmed payments only
  const totalRevenue = bookings.reduce((acc: any, booking: any) => {
    const confirmedPayments = booking.payments?.filter((payment: any) => payment.paymentStatus === "Completed") || [];
    console.log(confirmedPayments);
    const totalConfirmedAmount = confirmedPayments.reduce((sum: any, payment: any) => sum + Number(payment.amount), 0);
    return acc + totalConfirmedAmount;
  }, 0);
  
  console.log("Total Revenue:", totalRevenue);
  
  const uniqueUsers = new Set(
    bookings.map((b: { user: { firstName: any; lastName: any; }; }) => `${b.user?.firstName} ${b.user?.lastName}`)
  ).size;

  // Bookings Over Time
  const bookingsByMonth = bookings.reduce((acc: Record<string, number>, booking: { createdAt: any; checkInDate: any; }) => {
    const date = new Date(booking.createdAt || booking.checkInDate);
    const month = date.toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const bookingsData = Object.entries(bookingsByMonth).map(([month, value]) => ({
    month,
    value,
  }));

  // Revenue by Hotel
  const revenuePerHotel = bookings.reduce((acc: Record<string, number>, booking: Booking) => {
    const hotelName = booking.room?.hotel?.name || 'Unknown';
    const confirmedPayments = booking.payments?.filter((p) => p.paymentStatus === "Completed") || [];
    const totalConfirmed = confirmedPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  
    acc[hotelName] = (acc[hotelName] || 0) + totalConfirmed;
    return acc;
  }, {});

  const revenueData = Object.entries(revenuePerHotel).map(([hotel, revenue]) => ({
    hotel,
    revenue,
  }));

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Confirmed': 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200',
      'Pending': 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-200',
      'Cancelled': 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200',
      'default': 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200'
    };
    
    return statusStyles[status as keyof typeof statusStyles] || statusStyles.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 shadow-lg">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 text-xl">Comprehensive insights into your business performance</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6">
              <Loader2 className="animate-spin h-10 w-10 text-purple-500" />
            </div>
            <p className="text-gray-600 text-lg">Loading analytics data...</p>
          </div>
        ) : (
          <>
            {/* Metrics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                      <Calendar className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Bookings</p>
                    </div>
                  </div>
                  <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    {totalBookings.toLocaleString()}
                  </p>
                  <div className="flex items-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 text-sm font-semibold">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12%
                    </div>
                    <span className="text-gray-500 text-sm ml-2">vs last month</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl shadow-lg">
                      <DollarSign className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Revenue</p>
                    </div>
                  </div>
                  <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                    ${totalRevenue.toLocaleString()}
                  </p>
                  <div className="flex items-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 text-sm font-semibold">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +8%
                    </div>
                    <span className="text-gray-500 text-sm ml-2">vs last month</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Active Users</p>
                    </div>
                  </div>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    {uniqueUsers.toLocaleString()}
                  </p>
                  <div className="flex items-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 text-sm font-semibold">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +5%
                    </div>
                    <span className="text-gray-500 text-sm ml-2">vs last month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-500">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <TrendingUp className="mr-3" />
                    Bookings Over Time
                  </h3>
                </div>
                <div className="p-8">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={bookingsData}>
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <YAxis 
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="url(#purplePinkGradient)"
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, fill: '#ec4899' }}
                      />
                      <defs>
                        <linearGradient id="purplePinkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="px-8 py-6 bg-gradient-to-r from-emerald-500 to-green-500">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Hotel className="mr-3" />
                    Revenue by Hotel
                  </h3>
                </div>
                <div className="p-8">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <XAxis 
                        dataKey="hotel"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="revenue" 
                        fill="url(#greenGradient)"
                        radius={[8, 8, 0, 0]}
                      />
                      <defs>
                        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="px-8 py-6 bg-gradient-to-r from-indigo-500 to-purple-500">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Activity className="mr-3" />
                  Recent Activity
                </h3>
              </div>
              <div className="p-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-2 font-semibold text-gray-700">User</th>
                        <th className="text-left py-4 px-2 font-semibold text-gray-700">Hotel</th>
                        <th className="text-left py-4 px-2 font-semibold text-gray-700">Check-In</th>
                        <th className="text-left py-4 px-2 font-semibold text-gray-700">Check-Out</th>
                        <th className="text-left py-4 px-2 font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map((booking: Booking) => (
                        <tr key={booking.bookingId} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-200">
                          <td className="py-4 px-2">
                            <div className="font-medium text-gray-900">
                              {booking.user?.firstName} {booking.user?.lastName}
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold">
                              <Hotel className="w-3 h-3 mr-1" />
                              {booking.room?.hotel?.name}
                            </div>
                          </td>
                          <td className="py-4 px-2 text-gray-600 font-medium">{booking.checkInDate}</td>
                          <td className="py-4 px-2 text-gray-600 font-medium">{booking.checkOutDate}</td>
                          <td className="py-4 px-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(booking.bookingStatus)}`}>
                              {booking.bookingStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;