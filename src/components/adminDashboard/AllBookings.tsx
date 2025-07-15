import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';

// Assuming these paths are correct for your project structure
import { useGetAllBookingsQuery } from '../../features/api/bookingsApi';
import type { RootState } from '../../app/store';

// Define the BookingDetails interface directly for clarity within this component
// In a real project, this would likely be imported from a shared types file.
export interface BookingDetails {
  bookingId: number;
  hotel: {
    hotelId: number;
    name: string;
    location: string;
    imageUrl: string;
  };
  room: {
    roomId: number;
    roomType: string;
    pricePerNight: number;
  };
  user: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  bookingStatus: "Pending" | "Confirmed" | "Cancelled" | "Completed" | "CheckedIn";
  createdAt: string;
}

export const AllBookings = () => {
  // Get authentication status from Redux store to conditionally fetch bookings
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Fetch all bookings using the RTK Query hook
  // 'allBookings' is typed as an array of BookingDetails and defaults to an empty array
  // 'skip' ensures the query only runs if the user is authenticated
  const {
    data: allBookings = [],
    isLoading, // Combines loading states for simplicity
    error,
  } = useGetAllBookingsQuery(undefined, {
    skip: !isAuthenticated,
  });

  return (
    <>
      {/* Page title with Tailwind CSS for styling */}
      <div className="text-2xl font-bold text-center mb-6 text-orange-600">All Bookings Overview</div>

      {/* Responsive table container with modern styling */}
      <div className="overflow-x-auto p-4 bg-white shadow-xl rounded-lg border border-gray-200 mx-auto max-w-7xl">
        {/* Table structure with compact JSX to avoid whitespace text node errors */}
        <table className="table w-full min-w-max border-collapse">
          <thead>
            <tr className="bg-orange-50 text-orange-800 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left font-semibold">#</th>
              <th className="py-3 px-6 text-left font-semibold">Room & Hotel</th>
              <th className="py-3 px-6 text-left font-semibold">Guest Info</th>
              <th className="py-3 px-6 text-left font-semibold">Dates</th>
              <th className="py-3 px-6 text-left font-semibold">Amount</th>
              <th className="py-3 px-6 text-left font-semibold">Status</th>
            </tr>
          </thead>
          {/* Ensure no whitespace between <tbody> and its direct <tr> children */}
          <tbody>{error ? (
              <tr>
                <td colSpan={6} className="text-center text-red-600 py-6">
                  <div className="flex items-center justify-center space-x-2">
                    <AlertCircle className="inline-block text-red-500" size={24} />
                    <span className="text-lg font-medium">Error fetching bookings. Please try again.</span>
                  </div>
                </td>
              </tr>
            ) : isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  <div className="flex items-center justify-center space-x-2 text-gray-500">
                    <Loader2 className="animate-spin inline-block text-orange-500" size={28} />
                    <span className="text-lg font-medium">Loading bookings...</span>
                  </div>
                </td>
              </tr>
            ) : allBookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-600 py-6">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <AlertCircle className="mx-auto text-gray-400" size={32} />
                    <span className="text-lg font-medium">No bookings found.</span>
                    <p className="text-sm text-gray-500">It looks like there are no bookings to display at the moment.</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Map through the fetched bookings and render each row
              allBookings.map((booking: BookingDetails, idx: number) => (
                <tr key={booking.bookingId} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <th className="py-4 px-6 text-left text-gray-700">{idx + 1}</th>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-14 w-14 overflow-hidden rounded-lg shadow-sm">
                          <img
                            // Display hotel image or a placeholder if not available/fails to load
                            src={booking.hotel?.imageUrl || `https://placehold.co/56x56/f0f0f0/333333?text=${booking.room?.roomType[0] || 'R'}`}
                            alt={`${booking.hotel?.name || 'Hotel'} Image`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to a generic placeholder on image load error
                              e.currentTarget.src = `https://placehold.co/56x56/f0f0f0/333333?text=${booking.room?.roomType[0] || 'R'}`;
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-orange-600">{booking.room?.roomType || 'Unknown Room'}</div>
                        <div className="text-sm text-gray-600">{booking.hotel?.name || 'Unknown Hotel'}</div>
                        <div className="text-xs text-gray-500">{booking.hotel?.location || 'Unknown Location'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-800 font-medium">{booking.user?.firstName} {booking.user?.lastName}</div>
                    <div className="text-xs text-gray-500">{booking.user?.email}</div>
                  </td>
                  <td className="py-4 px-6 text-gray-700 text-sm">
                    <div>Check-in: <span className="font-medium">{booking.checkInDate}</span></div>
                    <div>Check-out: <span className="font-medium">{booking.checkOutDate}</span></div>
                  </td>
                  <td className="py-4 px-6 text-orange-700 font-bold text-lg">KES {booking.totalAmount.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    {/* Dynamic badge styling based on booking status */}
                    <span className={`badge text-xs px-3 py-1 rounded-full font-semibold
                      ${booking.bookingStatus === 'Confirmed'
                        ? 'bg-green-100 text-green-700 border border-green-400'
                        : booking.bookingStatus === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-400'
                        : booking.bookingStatus === 'Cancelled'
                        ? 'bg-red-100 text-red-700 border border-red-400'
                        : booking.bookingStatus === 'Completed'
                        ? 'bg-blue-100 text-blue-700 border border-blue-400'
                        : booking.bookingStatus === 'CheckedIn'
                        ? 'bg-purple-100 text-purple-700 border border-purple-400'
                        : 'bg-gray-100 text-gray-700 border border-gray-400' // Default for unknown status
                      }`}>
                      {booking.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}</tbody>
        </table>
      </div>
    </>
  );
};

export default AllBookings;
