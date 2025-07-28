import  { useState } from 'react';
import { Loader2, AlertCircle, CalendarCheck, History, Repeat, Hotel, MapPin, Clock, Check, X, ArrowRight, Bed, Users, Wifi, Tv, AirVent, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useGetBookingsByUserQuery ,useLazyGetAvailableRoomsQuery,useCancelBookingMutation,useChangeRoomMutation, useDeleteBookingMutation} from '../../features/api/bookingsApi';
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
  const [deleteBooking] = useDeleteBookingMutation();


  const handleCancelBooking = async (bookingId: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This booking will be cancelled.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9c27b0',
      cancelButtonColor: '#e91e63',
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

  const handleDeleteBooking = async (bookingId: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This booking will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteBooking(bookingId).unwrap();
        await Swal.fire('Deleted!', 'Your booking has been deleted.', 'success');
        refetch();
      } catch (err) {
        Swal.fire('Error', 'Failed to delete booking. Please try again.', 'error');
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
      confirmButtonColor: '#9c27b0',
      cancelButtonColor: '#e91e63',
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
      case 'wifi': return <Wifi size={16} className="text-purple-400" />;
      case 'tv': return <Tv size={16} className="text-pink-400" />;
      case 'air conditioning': return <AirVent size={16} className="text-purple-600" />;
      default: return <Check size={16} className="text-purple-300" />;
    }
  };

  const renderBookingCard = (booking: BookingDetails, isUpcoming: boolean) => (
    <div key={booking.bookingId} className="border border-purple-100 rounded-xl p-5 mb-5 shadow-sm hover:shadow-lg transition-all bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-1/3 h-48 rounded-xl overflow-hidden relative">
          <img
            src={booking.room.roomImage || 'https://placehold.co/400x300/f5e1ff/e91e63?text=Room'}
            alt={booking.room.roomType}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/400x300/f5e1ff/e91e63?text=Room';
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/70 to-transparent p-3">
            <h3 className="font-bold text-white text-lg">{booking.room.hotel.name}</h3>
            <div className="flex items-center text-pink-200 text-sm">
              <MapPin size={14} className="mr-1" />
              {booking.room.hotel.location}
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {booking.room.roomType}
              </span>
              <div className="mt-2 flex items-center text-sm text-purple-700">
                <Clock size={14} className="mr-1" />
                {calculateNights(booking.checkInDate, booking.checkOutDate)} nights
              </div>
              <div className="mt-1 flex items-center text-sm text-purple-700">
                <CalendarCheck size={14} className="mr-1" />
                {formatDate(booking.checkInDate)} <ArrowRight size={14} className="mx-1" /> {formatDate(booking.checkOutDate)}
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-xl font-bold text-pink-600">{formatAmount(booking.totalAmount)}</span>
              <div className={`mt-1 text-xs px-2 py-1 rounded-full inline-flex items-center 
                ${booking.bookingStatus === 'Confirmed' ? 'bg-purple-100 text-purple-800' :
                  booking.bookingStatus === 'Pending' ? 'bg-pink-100 text-pink-800' :
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
            <h4 className="text-sm font-semibold text-purple-800 mb-1">Amenities:</h4>
            <div className="flex flex-wrap gap-2">
              {booking.room.amenities?.split(', ').map((amenity, i) => (
                <span key={i} className="inline-flex items-center text-xs bg-purple-50 rounded-full px-2 py-1 border border-purple-100">
                  {renderAmenityIcon(amenity)}
                  <span className="ml-1 text-purple-700">{amenity}</span>
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {isUpcoming && booking.bookingStatus === 'Pending' && (
              <>
                <button
                  onClick={() => handleChangeRoom(booking)}
                  className="flex items-center gap-1 px-3 py-2 bg-white border border-purple-500 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors"
                >
                  <Bed size={14} /> Change Room
                </button>
                <button
                  onClick={() => handleCancelBooking(booking.bookingId)}
                  className="flex items-center gap-1 px-3 py-2 bg-white border border-pink-500 text-pink-600 rounded-lg text-sm font-medium hover:bg-pink-50 transition-colors"
                >
                  <X size={14} /> Cancel
                </button>
                <StripeCheckoutButton bookingId={booking.bookingId} amount={parseFloat(booking.totalAmount) * 100} />
              </>
            )}
            {!isUpcoming && (
              <button
                onClick={() => handleRebook(booking)}
                className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-colors"
              >
                <Repeat size={14} /> Rebook
              </button>
            )}
             <button
              onClick={() => handleDeleteBooking(booking.bookingId)}
              className="flex items-center gap-1 px-3 py-2 bg-white border border-red-500 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} /> 
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChangeRoomModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-b from-purple-50 to-pink-50 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-200">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-purple-800">Change Your Room</h2>
          <p className="text-purple-700 mb-6">Select a different room for your stay at {selectedBooking?.room.hotel.name}</p>
          
          <div className="mb-6 p-4 bg-purple-100 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-2">Current Room</h3>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-purple-300">
                <img 
                  src={selectedBooking?.room.roomImage || 'https://placehold.co/100x100/f5e1ff/e91e63?text=Room'} 
                  alt="Current room" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <p className="font-medium text-purple-800">{selectedBooking?.room.roomType}</p>
                <p className="text-sm text-pink-600">{formatAmount(selectedBooking?.room.pricePerNight || '0')}/night</p>
              </div>
            </div>
          </div>
          
          <h3 className="font-semibold mb-3 text-purple-800">Available Rooms</h3>
          <div className="space-y-4">
            {availableRooms.map(room => (
              <div key={room.roomId} className="border border-purple-200 rounded-lg p-4 hover:border-purple-400 transition-colors bg-white">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-purple-200">
                    <img 
                      src={room.roomImage || 'https://placehold.co/100x100/f5e1ff/e91e63?text=Room'} 
                      alt={room.roomType} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-purple-800">{room.roomType}</h4>
                    <p className="text-pink-600 font-semibold">{formatAmount(room.pricePerNight)}/night</p>
                    <div className="flex items-center text-sm text-purple-700 mt-1">
                      <Users size={14} className="mr-1" /> Capacity: {room.capacity}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {room.amenities?.split(', ').map((amenity: string, i: number) => (
                        <span key={i} className="inline-flex items-center text-xs bg-purple-50 rounded-full px-2 py-1 border border-purple-100">
                          {renderAmenityIcon(amenity)}
                          <span className="ml-1 text-purple-700">{amenity}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => confirmRoomChange(room)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-colors"
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
              className="px-4 py-2 bg-white border border-purple-500 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors"
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
        <Loader2 className="animate-spin text-purple-500 mr-2" size={24} />
        <span className="text-lg text-purple-800">Loading your bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto text-pink-500 mb-3" size={32} />
        <h3 className="text-xl font-medium text-purple-800 mb-2">Error loading bookings</h3>
        <p className="text-purple-700 max-w-md mx-auto">We couldn't load your bookings. Please check your connection and try again.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
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
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Your Travel Dashboard</h1>
        <p className="text-purple-700">Manage your upcoming trips and view booking history</p>
      </div>
      
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-3 text-2xl font-semibold text-purple-800">
            <CalendarCheck className="text-pink-500" size={24} /> Upcoming Trips
          </h2>
          <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
            {upcomingBookings.length} {upcomingBookings.length === 1 ? 'Trip' : 'Trips'}
          </span>
        </div>
        
        {upcomingBookings.length === 0 ? (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 text-center border border-purple-100">
            <Hotel size={48} className="mx-auto text-purple-400 mb-3" />
            <h3 className="text-xl font-medium text-purple-800 mb-2">No upcoming trips</h3>
            <p className="text-purple-700 max-w-md mx-auto">You don't have any upcoming trips. Start planning your next adventure!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {upcomingBookings.map((booking: BookingDetails) => renderBookingCard(booking, true))}
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-3 text-2xl font-semibold text-purple-800">
            <History className="text-purple-500" size={24} /> Booking History
          </h2>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            {previousBookings.length} {previousBookings.length === 1 ? 'Booking' : 'Bookings'}
          </span>
        </div>
        
        {previousBookings.length === 0 ? (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 text-center border border-purple-100">
            <Hotel size={48} className="mx-auto text-purple-400 mb-3" />
            <h3 className="text-xl font-medium text-purple-800 mb-2">No booking history</h3>
            <p className="text-purple-700 max-w-md mx-auto">Your past bookings will appear here once you make them.</p>
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