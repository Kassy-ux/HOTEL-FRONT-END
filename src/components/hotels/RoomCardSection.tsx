import React from 'react';
import { MdLocationOn, MdWifi, MdPool, MdTv } from 'react-icons/md';

interface Room {
  roomId: number;
  roomType: string;
  pricePerNight: number;
  capacity: number;
  amenities: string | string[];
  roomImage: string;
  isAvailable: boolean;
}

interface RoomCardProps {
  room: Room;
  hotelName: string;
  location: string;
}

const AmenityIcon = ({ amenity }: { amenity: string }) => {
  switch (amenity.toLowerCase()) {
    case 'wifi':
      return <MdWifi />;
    case 'pool':
      return <MdPool />;
    case 'tv':
      return <MdTv />;
    default:
      return null;
  }
};

const RoomCardSection: React.FC<RoomCardProps> = ({ room, hotelName, location }) => {
  const renderAmenities = (amenities: string | string[]) => {
    if (typeof amenities === 'string') {
      amenities = amenities.split(',').map((a) => a.trim());
    }

    if (!Array.isArray(amenities) || amenities.length === 0) {
      return <div className="text-xs text-gray-500">No amenities listed</div>;
    }

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {amenities.map((a, i) => (
          <div
            key={i}
            className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full"
          >
            <AmenityIcon amenity={a} />
            <span className="ml-1">{a}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <img
        src={room.roomImage}
        alt={room.roomType}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="text-sm text-gray-600 flex items-center mb-1">
          <MdLocationOn className="mr-1" />
          {location}
        </div>
        <h3 className="text-lg font-semibold">{hotelName}</h3>
        <p className="text-sm text-gray-500">{room.roomType}</p>
        <p className="text-sm text-gray-700 mt-2">
          Capacity: {room.capacity} person(s)
        </p>
        <p className="text-sm font-bold text-blue-600">
          ${room.pricePerNight} / night
        </p>

        {/* Amenities */}
        {renderAmenities(room.amenities)}

        <div className="mt-3">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCardSection;
