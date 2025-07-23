import { useSelector } from 'react-redux';
import { useGetAllBookingsQuery } from '../../features/api/bookingsApi';
import { Loader2, AlertCircle, Check, X } from 'lucide-react';
import type { RootState } from '../../app/store';

interface BookingDetails {
  bookingId: number;
  userId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: string;
  bookingStatus: 'Pending' | 'Confirmed' | 'Cancelled';
  room: {
    roomId: number;
    hotelId: number;
    roomType: string;
    pricePerNight: string;
    capacity: number;
    amenities: string;
    roomImage: string;
    hotel: {
      name: string;
      location: string;
      address: string;
      category: string;
      rating: string;
    };
  };
}

const formatDate = (dateString: string) => {
  try {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('en-US', options);
  } catch {
    return 'Invalid date';
  }
};

const formatAmount = (amount: string) => {
  try {
    const num = parseFloat(amount);
    return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
  } catch {
    return '$0.00';
  }
};

export const AllBookings = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const {
    data: bookings = [],
    isLoading,
    error,
    refetch,
  } = useGetAllBookingsQuery(undefined, {
    skip: !isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-purple-600 mr-2" size={24} />
        <span className="text-lg text-purple-900">Loading all bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto text-pink-600 mb-3" size={32} />
        <h3 className="text-xl font-medium text-purple-900 mb-2">Error loading bookings</h3>
        <p className="text-purple-700 max-w-md mx-auto">Something went wrong. Please try again.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors shadow-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
          All Bookings
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 text-center shadow-sm border border-purple-100">
          <p className="text-purple-800 text-lg">No bookings found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-purple-100">
          <table className="min-w-full bg-white">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold">
              <tr>
                <th className="p-4 text-left rounded-tl-xl">Booking ID</th>
                <th className="p-4 text-left">User ID</th>
                <th className="p-4 text-left">Hotel</th>
                <th className="p-4 text-left">Room</th>
                <th className="p-4 text-left">Check-in</th>
                <th className="p-4 text-left">Check-out</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left rounded-tr-xl">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-purple-900 divide-y divide-purple-100">
              {(bookings as BookingDetails[]).map((booking) => (
                <tr 
                  key={booking.bookingId} 
                  className="hover:bg-purple-50 transition duration-150 ease-in-out"
                >
                  <td className="p-4 font-medium">{booking.bookingId}</td>
                  <td className="p-4">{booking.userId}</td>
                  <td className="p-4">{booking.room.hotel.name}</td>
                  <td className="p-4">{booking.room.roomType}</td>
                  <td className="p-4">{formatDate(booking.checkInDate)}</td>
                  <td className="p-4">{formatDate(booking.checkOutDate)}</td>
                  <td className="p-4 font-medium">{formatAmount(booking.totalAmount)}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                      ${booking.bookingStatus === 'Confirmed' ? 
                        'bg-green-100 text-green-800' :
                        booking.bookingStatus === 'Pending' ? 
                        'bg-yellow-100 text-yellow-800' :
                        'bg-pink-100 text-pink-800'
                      }`}>
                      {booking.bookingStatus === 'Confirmed' && <Check size={12} className="mr-1" />}
                      {booking.bookingStatus === 'Cancelled' && <X size={12} className="mr-1" />}
                      {booking.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllBookings;