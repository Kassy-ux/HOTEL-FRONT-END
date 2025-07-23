import React, { useState } from 'react';
import { Loader2, AlertCircle, CalendarCheck, History, Repeat, Hotel, MapPin, Clock, Check, X, ArrowRight, Bed, Users, Wifi, Tv, AirVent } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useGetBookingsByUserQuery ,useLazyGetAvailableRoomsQuery,useCancelBookingMutation,useChangeRoomMutation} from '../../features/api/bookingsApi';
import type { RootState } from '../../app/store';
import Swal from 'sweetalert2';
import StripeCheckoutButton from './StripeCheckoutButton';



interface BookingDetails {
  bookingId: number;
  userId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: string;
  bookingStatus: "Pending" | "Confirmed" | "Cancelled";
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

export const Bookings = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId ? Number(user.userId) : undefined;
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(null);
  const [showChangeRoom, setShowChangeRoom] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);

  const {
    data: userBookings = [],
    isLoading,
    error,
    refetch,
  } = useGetBookingsByUserQuery(userId, {
    skip: !isAuthenticated || typeof userId !== 'number',
  });

  // Safe filtering with proper type checking
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcomingBookings = (userBookings || []).filter((booking: BookingDetails) => {
    if (!booking?.checkOutDate) return false;
    try {
      const checkOut = new Date(booking.checkOutDate);
      checkOut.setHours(0, 0, 0, 0);
      return checkOut >= now;
    } catch (e) {
      console.error('Invalid date in booking:', booking);
      return false;
    }
  });

  const previousBookings = (userBookings || []).filter((booking: BookingDetails) => {
    if (!booking?.checkOutDate) return false;
    try {
      const checkOut = new Date(booking.checkOutDate);
      checkOut.setHours(0, 0, 0, 0);
      return checkOut < now;
    } catch (e) {
      console.error('Invalid date in booking:', booking);
      return false;
    }
  });

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('en-US', options);
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid date';
    }
  };

  const formatAmount = (amount: string) => {
    try {
      const num = parseFloat(amount);
      return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
    } catch (e) {
      console.error('Error formatting amount:', e);
      return '$0.00';
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    try {
      const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
      return Math.ceil(diff / (1000 * 3600 * 24));
    } catch (e) {
      console.error('Error calculating nights:', e);
      return 0;
    }
  };

  const handleRebook = (booking: BookingDetails) => {
    console.log('Rebooking:', booking);
    alert(`Rebooking initiated for ${booking.room.hotel.name}`);
  };

  const [cancelBooking] = useCancelBookingMutation();

  const handleCancelBooking = async (bookingId: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This booking will be cancelled.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53e3e',
      cancelButtonColor: '#718096',
      confirmButtonText: 'Yes, cancel it!',
    });
  
    if (result.isConfirmed) {
      try {
        await cancelBooking(bookingId).unwrap();
        await Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success');
        refetch();
      } catch (err) {
        Swal.fire('Error', 'Failed to cancel booking. Try again later.', 'error');
      }
    }
  };
  
  const [triggerGetRooms] = useLazyGetAvailableRoomsQuery();

const handleChangeRoom = async (booking: BookingDetails) => {
  setSelectedBooking(booking);
  setShowChangeRoom(true);

  try {
    const res = await triggerGetRooms({
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      hotelId: booking.room.hotelId,
    }).unwrap();
    setAvailableRooms(res);
  } catch (e) {
    Swal.fire('Error', 'Could not load available rooms.', 'error');
  }
};


const [changeRoom] = useChangeRoomMutation();

const confirmRoomChange = async (newRoom: any) => {
  const result = await Swal.fire({
    title: 'Change Room?',
    html: `You are changing from <b>${selectedBooking?.room.roomType}</b> to <b>${newRoom.roomType}</b>.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, change it!',
    cancelButtonText: 'No, keep current room',
  });

  if (result.isConfirmed && selectedBooking) {
    try {
      await changeRoom({
        bookingId: selectedBooking.bookingId,
        newRoomId: newRoom.roomId,
      }).unwrap();

      Swal.fire('Success!', 'Your room has been changed.', 'success');
      setShowChangeRoom(false);
      setSelectedBooking(null);
      refetch();
    } catch (err) {
      Swal.fire('Error', 'Failed to change room. Try again.', 'error');
    }
  }
};


  const renderAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi size={16} className="text-blue-500" />;
      case 'tv': return <Tv size={16} className="text-purple-500" />;
      case 'air conditioning': return <AirVent size={16} className="text-green-500" />;
      default: return <Check size={16} className="text-gray-500" />;
    }
  };

  const renderBookingCard = (booking: BookingDetails, isUpcoming: boolean) => (
    <div key={booking.bookingId} className="border rounded-xl p-5 mb-5 shadow-sm hover:shadow-lg transition-all bg-white">
      <div className="flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-1/3 h-48 rounded-xl overflow-hidden relative">
          <img
            src={booking.room.roomImage || 'https://placehold.co/400x300/f0f0f0/333333?text=Room'}
            alt={booking.room.roomType}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/400x300/f0f0f0/333333?text=Room';
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <h3 className="font-bold text-white text-lg">{booking.room.hotel.name}</h3>
            <div className="flex items-center text-white/90 text-sm">
              <MapPin size={14} className="mr-1" />
              {booking.room.hotel.location}
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {booking.room.roomType}
              </span>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <Clock size={14} className="mr-1" />
                {calculateNights(booking.checkInDate, booking.checkOutDate)} nights
              </div>
              <div className="mt-1 flex items-center text-sm text-gray-600">
                <CalendarCheck size={14} className="mr-1" />
                {formatDate(booking.checkInDate)} <ArrowRight size={14} className="mx-1" /> {formatDate(booking.checkOutDate)}
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-xl font-bold text-orange-600">{formatAmount(booking.totalAmount)}</span>
              <div className={`mt-1 text-xs px-2 py-1 rounded-full inline-flex items-center 
                ${booking.bookingStatus === 'Confirmed' ? 'bg-green-100 text-green-800' :
                  booking.bookingStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  booking.bookingStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                {booking.bookingStatus === 'Confirmed' && <Check size={12} className="mr-1" />}
                {booking.bookingStatus === 'Cancelled' && <X size={12} className="mr-1" />}
                {booking.bookingStatus}
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Amenities:</h4>
            <div className="flex flex-wrap gap-2">
              {booking.room.amenities?.split(', ').map((amenity, i) => (
                <span key={i} className="inline-flex items-center text-xs bg-gray-100 rounded-full px-2 py-1">
                  {renderAmenityIcon(amenity)}
                  <span className="ml-1">{amenity}</span>
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {isUpcoming && booking.bookingStatus === 'Pending' && (
              <>
                <button
                  onClick={() => handleChangeRoom(booking)}
                  className="flex items-center gap-1 px-3 py-2 bg-white border border-blue-500 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                >
                  <Bed size={14} /> Change Room
                </button>
                <button
                  onClick={() => handleCancelBooking(booking.bookingId)}
                  className="flex items-center gap-1 px-3 py-2 bg-white border border-red-500 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  <X size={14} /> Cancel
                </button>
                <StripeCheckoutButton  bookingId={booking.bookingId} amount={parseFloat(booking.totalAmount) * 100} />

              </>
            )}
            {!isUpcoming && (
              <button
                onClick={() => handleRebook(booking)}
                className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Repeat size={14} /> Rebook
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderChangeRoomModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Change Your Room</h2>
          <p className="text-gray-600 mb-6">Select a different room for your stay at {selectedBooking?.room.hotel.name}</p>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Current Room</h3>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden">
                <img 
                  src={selectedBooking?.room.roomImage || 'https://placehold.co/100x100/f0f0f0/333333?text=Room'} 
                  alt="Current room" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <p className="font-medium">{selectedBooking?.room.roomType}</p>
                <p className="text-sm text-gray-600">{formatAmount(selectedBooking?.room.pricePerNight || '0')}/night</p>
              </div>
            </div>
          </div>
          
          <h3 className="font-semibold mb-3">Available Rooms</h3>
          <div className="space-y-4">
            {availableRooms.map(room => (
              <div key={room.roomId} className="border rounded-lg p-4 hover:border-blue-400 transition-colors">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden">
                    <img 
                      src={room.roomImage || 'https://placehold.co/100x100/f0f0f0/333333?text=Room'} 
                      alt={room.roomType} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">{room.roomType}</h4>
                    <p className="text-orange-600 font-semibold">{formatAmount(room.pricePerNight)}/night</p>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Users size={14} className="mr-1" /> Capacity: {room.capacity}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {room.amenities?.split(', ').map((amenity: string, i: number) => (
                        <span key={i} className="inline-flex items-center text-xs bg-gray-100 rounded-full px-2 py-1">
                          {renderAmenityIcon(amenity)}
                          <span className="ml-1">{amenity}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => confirmRoomChange(room)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowChangeRoom(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500 mr-2" size={24} />
        <span className="text-lg">Loading your bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto text-red-500 mb-3" size={32} />
        <h3 className="text-xl font-medium text-gray-800 mb-2">Error loading bookings</h3>
        <p className="text-gray-600 max-w-md mx-auto">We couldn't load your bookings. Please check your connection and try again.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {showChangeRoom && selectedBooking && renderChangeRoomModal()}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Travel Dashboard</h1>
        <p className="text-gray-600">Manage your upcoming trips and view booking history</p>
      </div>
      
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-3 text-2xl font-semibold">
            <CalendarCheck className="text-green-500" size={24} /> Upcoming Trips
          </h2>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {upcomingBookings.length} {upcomingBookings.length === 1 ? 'Trip' : 'Trips'}
          </span>
        </div>
        
        {upcomingBookings.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <Hotel size={48} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No upcoming trips</h3>
            <p className="text-gray-500 max-w-md mx-auto">You don't have any upcoming trips. Start planning your next adventure!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {upcomingBookings.map((booking: BookingDetails) => renderBookingCard(booking, true))}
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-3 text-2xl font-semibold">
            <History className="text-blue-500" size={24} /> Booking History
          </h2>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {previousBookings.length} {previousBookings.length === 1 ? 'Booking' : 'Bookings'}
          </span>
        </div>
        
        {previousBookings.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <Hotel size={48} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No booking history</h3>
            <p className="text-gray-500 max-w-md mx-auto">Your past bookings will appear here once you make them.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {previousBookings.map((booking: BookingDetails) => renderBookingCard(booking, false))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;