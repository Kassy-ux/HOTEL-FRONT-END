import {
  MdLocationOn,
  MdPeople,
  MdWifi,
  MdPool,
  MdRestaurant,
  MdKingBed,
  MdTv,
  MdAcUnit,
  MdLocalBar,
  MdBatteryFull,
} from "react-icons/md";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useState } from "react";
import { bookingsApi } from "../../features/api/bookingsApi";
import type { RootState } from "../../app/store";
import type { HotelData, RoomData } from "../../types/Types";

interface RoomCardProps {
  hotel: HotelData;
  onBack: () => void;
}

const AmenityIcon = ({ amenity }: { amenity: string }) => {
  const amenityLower = amenity.toLowerCase();
  switch (amenityLower) {
    case "wifi":
      return <MdWifi className="text-blue-500" />;
    case "pool":
      return <MdPool className="text-teal-500" />;
    case "restaurant":
    case "breakfast":
      return <MdRestaurant className="text-orange-500" />;
    case "tv":
      return <MdTv className="text-purple-500" />;
    case "air conditioning":
    case "ac":
      return <MdAcUnit className="text-green-500" />;
    case "mini bar":
      return <MdLocalBar className="text-red-500" />;
    case "battery":
      return <MdBatteryFull className="text-yellow-500" />;
    default:
      return <MdKingBed className="text-indigo-500" />;
  }
};

const formatPrice = (price: unknown): string => {
  const num = Number(price);
  return isNaN(num) ? "0.00" : num.toFixed(2);
};

export const RoomCardSection = ({ hotel, onBack }: RoomCardProps) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [selectedRooms, setSelectedRooms] = useState<RoomData[]>([]);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [createBooking] = bookingsApi.useCreateBookingMutation();

  const toggleRoomSelection = (room: RoomData) => {
    const alreadySelected = selectedRooms.find((r) => r.roomId === room.roomId);
    if (alreadySelected) {
      setSelectedRooms(selectedRooms.filter((r) => r.roomId !== room.roomId));
    } else {
      setSelectedRooms([...selectedRooms, room]);
    }
  };

  const handleBook = async () => {
    if (selectedRooms.length === 0 || !checkInDate || !checkOutDate) {
      Swal.fire("Missing Info", "Please select at least one room and dates.", "warning");
      return;
    }

    const nights = Math.ceil(
      (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const totalAmount = selectedRooms.reduce((sum, room) => {
      return sum + (Number(room.pricePerNight) || 0) * nights;
    }, 0);

    const roomList = selectedRooms.map((r) => r.roomType).join(", ");

    Swal.fire({
      title: "Confirm Booking",
      html: `
        <b>${hotel.name}</b><br/>
        Rooms: ${roomList}<br/>
        Dates: ${new Date(checkInDate).toLocaleDateString()} to ${new Date(checkOutDate).toLocaleDateString()}<br/>
        Nights: ${nights}<br/>
        Total: $${formatPrice(totalAmount)}
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      confirmButtonColor: "#2563eb",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          for (const room of selectedRooms) {
            await createBooking({
              userId: user?.userId,
              roomId: room.roomId,
              checkInDate,
              checkOutDate,
              totalAmount: (Number(room.pricePerNight) || 0) * nights,
            });
          }
          Swal.fire("Success", "Booking confirmed!", "success");
          onBack();
        } catch (e) {
          Swal.fire("Error", "Failed to book room(s).", "error");
        }
      }
    });
  };

  const renderAmenities = (amenities: unknown) => {
    if (typeof amenities === "string") {
      amenities = amenities.split(",").map((a: string) => a.trim());
    }

    if (!Array.isArray(amenities)) {
      return <div className="text-xs text-gray-500">No amenities listed</div>;
    }

    return (
      <div className="flex flex-wrap gap-3 mt-3">
        {amenities.map((a: string, i: number) => (
          <div
            key={i}
            className="flex items-center text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full"
          >
            <AmenityIcon amenity={a} />
            <span className="ml-2">{a}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg max-w-5xl mx-auto mb-32 overflow-hidden relative">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-50 to-white">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{hotel.name}</h2>
          <p className="flex items-center text-gray-500 mt-1">
            <MdLocationOn className="mr-1" /> {hotel.location}
          </p>
        </div>
        <button onClick={onBack} className="text-blue-600 hover:underline text-sm">
          ← Back to Hotels
        </button>
      </div>

      {/* Dates */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-b">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            min={checkInDate || new Date().toISOString().split("T")[0]}
            disabled={!checkInDate}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Room List */}
      <div className="p-6 space-y-6">
        {hotel.rooms?.map((room) => {
          const isSelected = selectedRooms.some((r) => r.roomId === room.roomId);
          return (
            <div
              key={room.roomId}
              onClick={() => toggleRoomSelection(room)}
              className={`cursor-pointer overflow-hidden rounded-xl transition-all border-2 ${
                isSelected
                  ? "border-blue-600 ring-2 ring-blue-200 bg-blue-50"
                  : "border-gray-200 hover:border-blue-400"
              }`}
            >
              {room.roomImage && (
                <img
                  src={room.roomImage}
                  alt={room.roomType}
                  className="w-full h-[350px] object-cover hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-indigo-700">{room.roomType}</h3>
                  <p className="text-lg font-bold text-blue-600">
                    ${formatPrice(room.pricePerNight)}{" "}
                    <span className="text-sm text-gray-500">/night</span>
                  </p>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <MdPeople className="mr-1" />
                  {room.capacity} {room.capacity > 1 ? "guests" : "guest"}
                </div>
                {renderAmenities(room.amenities)}
                {isSelected && (
                  <div className="mt-3 text-xs font-medium text-green-600">✓ Selected</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Booking Button */}
      {selectedRooms.length > 0 && checkInDate && checkOutDate && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="bg-white border border-gray-200 shadow-2xl rounded-lg p-4 backdrop-blur-md">
            {isAuthenticated ? (
              <button
                onClick={handleBook}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-all shadow-lg"
              >
                Book Now – $
                {formatPrice(
                  selectedRooms.reduce(
                    (sum, room) =>
                      sum +
                      (Number(room.pricePerNight) || 0) *
                        Math.ceil(
                          (new Date(checkOutDate).getTime() -
                            new Date(checkInDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        ),
                    0
                  )
                )}
              </button>
            ) : (
              <a
                href="/login"
                className="block text-center bg-gray-800 text-white py-3 rounded-md hover:bg-gray-900 transition-colors shadow-md"
              >
                Sign in to Book
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};



