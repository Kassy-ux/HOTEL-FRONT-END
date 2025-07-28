import { MdStar, MdLocationOn } from "react-icons/md";
import { PuffLoader } from "react-spinners";
import { hotelApi } from "../../features/api/hotelApi";
import { RoomCardSection } from "./RoomCardSection";
import { useState } from "react";
import type { HotelData } from "../../types/Types";

export const HeroTeaser = () => {
  const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null);

  const {
    data: hotels = [],
    isLoading,
    error,
  } = hotelApi.useGetAllHotelsQuery({
    refetchOnMountOrArgChange: true,
  });

  const featuredHotels = hotels.slice(0, 3);

  if (selectedHotel) {
    return (
      <RoomCardSection
        hotel={selectedHotel}
        onBack={() => setSelectedHotel(null)}
      />
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-pink-500 mb-4">
            Discover Your Perfect Stay
          </h2>
          <p className="text-lg text-purple-700 max-w-2xl mx-auto">
            Browse our selection of luxurious hotels and experience true elegance on your next getaway.
          </p>
        </div>

        {/* Error/Loading */}
        {error ? (
          <p className="text-red-500 text-center">Failed to load hotels.</p>
        ) : isLoading ? (
          <div className="flex justify-center">
            <PuffLoader color="#d946ef" />
          </div>
        ) : (
          <>
            {/* Hotel Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {featuredHotels.map((hotel: HotelData) => (
                <div
                  key={hotel.hotelId}
                  className="group bg-white rounded-2xl shadow-md overflow-hidden relative transition hover:shadow-xl border border-pink-100"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={hotel.hotelImage || "https://source.unsplash.com/random/600x400/?hotel"}
                      alt={hotel.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                    {/* Rating */}
                    <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1 text-sm font-semibold shadow">
                      <MdStar className="text-pink-500" />
                      <span>
                        {isNaN(Number(hotel.rating))
                          ? "N/A"
                          : Number(hotel.rating).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-purple-900">{hotel.name}</h3>
                    <p className="text-sm text-purple-700 flex items-center gap-1">
                      <MdLocationOn className="text-pink-500" />
                      {hotel.location}
                    </p>
                    <p className="text-sm text-purple-500 mt-2">
                      {hotel.rooms.length} room type{hotel.rooms.length !== 1 ? "s" : ""} available
                    </p>

                    <button
                      onClick={() => setSelectedHotel(hotel)}
                      className="mt-4 w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-2 rounded-md shadow transition"
                    >
                      View Rooms
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* View More Button */}
            <div className="text-center mt-12">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium px-6 py-3 border border-purple-300 rounded-full hover:bg-purple-50 transition"
              >
                View More Hotels
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
