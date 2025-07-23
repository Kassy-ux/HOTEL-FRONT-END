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
  MdEdit,
  MdDelete,
} from "react-icons/md";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useState } from "react";
import { bookingsApi } from "../../features/api/bookingsApi";
import { roomApi } from "../../features/api/roomApi";
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
      return <MdWifi className="text-purple-500" />;
    case "pool":
      return <MdPool className="text-pink-500" />;
    case "restaurant":
    case "breakfast":
      return <MdRestaurant className="text-amber-500" />;
    case "tv":
      return <MdTv className="text-indigo-500" />;
    case "air conditioning":
    case "ac":
      return <MdAcUnit className="text-teal-500" />;
    case "mini bar":
      return <MdLocalBar className="text-red-400" />;
    case "battery":
      return <MdBatteryFull className="text-yellow-500" />;
    default:
      return <MdKingBed className="text-purple-600" />;
  }
};

const formatPrice = (price: unknown): string => {
  const num = Number(price);
  return isNaN(num) ? "0.00" : num.toFixed(2);
};

export const RoomCardSection = ({ hotel, onBack }: RoomCardProps) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === "admin";

  const [selectedRooms, setSelectedRooms] = useState<RoomData[]>([]);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const [createBooking] = bookingsApi.useCreateBookingMutation();
  const [deleteRoom] = roomApi.useDeleteRoomMutation();
  const [updateRoom] = roomApi.useUpdateRoomMutation();

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
      (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)
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
      confirmButtonColor: "#7c3aed",
      background: "#faf5ff",
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

  const handleDelete = async (roomId: number) => {
    const confirm = await Swal.fire({
      title: "Delete Room?",
      text: "Are you sure you want to delete this room?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteRoom(roomId).unwrap();
        Swal.fire("Deleted!", "Room has been deleted.", "success");
      } catch (e) {
        Swal.fire("Error", "Failed to delete room.", "error");
      }
    }
  };

  const handleEdit = async (room: RoomData) => {
    const { value: formValues } = await Swal.fire({
      title: `Edit Room - ${room.roomType}`,
      html: `
        <input id="swal-roomType" class="swal2-input" placeholder="Room Type" value="${room.roomType}">
        <input id="swal-price" class="swal2-input" type="number" min="0" placeholder="Price Per Night" value="${room.pricePerNight}">
        <input id="swal-capacity" class="swal2-input" type="number" min="1" placeholder="Capacity" value="${room.capacity}">
        <input id="swal-roomImage" class="swal2-input" placeholder="Image URL" value="${room.roomImage || ""}">
        <input id="swal-amenities" class="swal2-input" placeholder="Amenities (comma-separated)" value="${Array.isArray(room.amenities) ? room.amenities.join(', ') : ''}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const roomType = (document.getElementById("swal-roomType") as HTMLInputElement)?.value;
        const price = Number((document.getElementById("swal-price") as HTMLInputElement)?.value);
        const capacity = Number((document.getElementById("swal-capacity") as HTMLInputElement)?.value);
        const roomImage = (document.getElementById("swal-roomImage") as HTMLInputElement)?.value;
        const amenitiesRaw = (document.getElementById("swal-amenities") as HTMLInputElement)?.value;
  
        if (!roomType || isNaN(price) || isNaN(capacity)) {
          Swal.showValidationMessage("Please fill out all required fields correctly.");
          return;
        }
  
        return {
          roomId: room.roomId,
          roomType,
          pricePerNight: price,
          capacity,
          roomImage,
          amenities: amenitiesRaw.split(",").map((a) => a.trim()).filter((a) => a !== "")
        };
      }
    });
  
    if (formValues) {
      try {
        await updateRoom(formValues).unwrap();
        Swal.fire("Updated!", "Room details updated successfully.", "success");
      } catch (e) {
        Swal.fire("Error", "Failed to update room.", "error");
      }
    }
  };
  

  const renderAmenities = (amenities: unknown) => {
    if (typeof amenities === "string") {
      amenities = amenities.split(",").map((a: string) => a.trim());
    }

    if (!Array.isArray(amenities)) {
      return <div className="text-xs text-purple-300">No amenities listed</div>;
    }

    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {amenities.map((a: string, i: number) => (
          <div
            key={i}
            className="flex items-center text-xs text-purple-800 bg-purple-50 px-2 py-1 rounded-full"
          >
            <AmenityIcon amenity={a} />
            <span className="ml-1">{a}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        {/* Hotel Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-6 bg-white rounded-xl shadow-sm">
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {hotel.name}
            </h2>
            <p className="flex items-center text-purple-700 mt-2">
              <MdLocationOn className="mr-1 text-pink-500" /> 
              {hotel.location}
            </p>
          </div>
          <button 
            onClick={onBack} 
            className="mt-4 md:mt-0 px-4 py-2 bg-white text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-all flex items-center"
          >
            ← Back to Hotels
          </button>
        </div>

        {/* Date Selection */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-purple-900 mb-4">Select Dates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">Check-in</label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-3 border border-purple-200 rounded-lg shadow-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">Check-out</label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                min={checkInDate || new Date().toISOString().split("T")[0]}
                disabled={!checkInDate}
                className="w-full p-3 border border-purple-200 rounded-lg shadow-sm bg-white disabled:bg-purple-50"
              />
            </div>
          </div>
        </div>

        {/* Rooms */}
        <h3 className="text-xl font-semibold text-purple-900 mb-6">Available Rooms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotel.rooms?.map((room) => {
            const isSelected = selectedRooms.some((r) => r.roomId === room.roomId);
            return (
              <div
                key={room.roomId}
                onClick={() => toggleRoomSelection(room)}
                className={`relative bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg ${
                  isSelected ? "ring-2 ring-purple-500" : "hover:ring-1 hover:ring-purple-300"
                }`}
              >
                {/* Admin Icons */}
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(room); }}>
                      <MdEdit className="text-indigo-500 hover:text-indigo-700" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(room.roomId); }}>
                      <MdDelete className="text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                )}
                {room.roomImage && (
                  <div className="h-48 overflow-hidden rounded-t-xl">
                    <img
                      src={room.roomImage}
                      alt={room.roomType}
                      className="w-full h-full object-cover transition-transform hover:scale-110"
                    />
                    {isSelected && (
                      <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        SELECTED
                      </div>
                    )}
                  </div>
                )}
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-purple-900">{room.roomType}</h3>
                    <div className="text-right">
                      <p className="text-xl font-bold text-pink-600">${formatPrice(room.pricePerNight)}</p>
                      <p className="text-xs text-purple-400">per night</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-purple-700 mt-3">
                    <MdPeople className="mr-1 text-pink-500" />
                    {room.capacity} {room.capacity > 1 ? "guests" : "guest"}
                  </div>
                  {renderAmenities(room.amenities)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Book Button */}
      {selectedRooms.length > 0 && checkInDate && checkOutDate && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="bg-white border border-purple-200 shadow-xl rounded-xl p-4 bg-opacity-90">
            {isAuthenticated ? (
              <button
                onClick={handleBook}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg font-medium flex justify-between items-center px-6"
              >
                <span>Book {selectedRooms.length} Room{selectedRooms.length > 1 ? "s" : ""}</span>
                <span>
                  ${formatPrice(
                    selectedRooms.reduce(
                      (sum, room) =>
                        sum + (Number(room.pricePerNight) || 0) *
                        Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)),
                      0
                    )
                  )}
                </span>
              </button>
            ) : (
              <a
                href="/login"
                className="block w-full text-center bg-purple-900 text-white py-4 rounded-lg hover:bg-purple-800 transition-colors shadow-md font-medium"
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
