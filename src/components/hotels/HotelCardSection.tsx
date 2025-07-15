// HotelCardSection.tsx
import { MdStar, MdLocationOn } from "react-icons/md";
import { hotelApi } from "../../features/api/hotelApi";
import { PuffLoader } from "react-spinners";
import { useState } from "react";
import type { HotelData } from "../../types/Types";
import { RoomCardSection } from "./RoomCardSection"; // Named export

export const HotelCardSection = () => {
  const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null);

  // Fetching all hotels
  const {
    data: hotelData = [],
    isLoading,
    error,
  } = hotelApi.useGetAllHotelsQuery("all");

  // If a hotel is selected, show its RoomCardSection
  if (selectedHotel) {
    return (
      <RoomCardSection
        hotel={selectedHotel}
        onBack={() => setSelectedHotel(null)}
      />
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-sky-50/80 via-white/40 to-blue-100/60">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2">Discover Your Perfect Stay</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our selection of premium hotels and find the perfect room for your next getaway.
          </p>
        </div>

        {error ? (
          <div className="text-red-500 text-center">Something went wrong.</div>
        ) : isLoading ? (
          <div className="flex justify-center py-20">
            <PuffLoader color="#3b82f6" size={60} />
          </div>
        ) : hotelData.length === 0 ? (
          <div className="text-center text-gray-600">
            No hotels available at the moment.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {hotelData.map((hotel: HotelData) => (
              <div
                key={hotel.hotelId}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              >
                {/* Hotel Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      hotel.hotelImage ||
                      "https://source.unsplash.com/random/600x400/?hotel"
                    }
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Overlay Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-white text-xl font-semibold">
                      {hotel.name}
                    </h3>
                    <p className="text-white text-sm flex items-center">
                      <MdLocationOn className="mr-1" />
                      {hotel.location}
                    </p>
                  </div>
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center gap-1 text-sm shadow">
                    <MdStar className="text-amber-500" />
                    <span>{hotel.rating ?? "N/A"}</span>
                  </div>
                </div>

                {/* Hotel Card Footer */}
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-2">
                    {hotel.rooms?.length || 0} room type(s) available
                  </p>
                  <button
                    onClick={() => setSelectedHotel(hotel)}
                    className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700"
                  >
                    View Rooms
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
