import { MdStar, MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { hotelApi } from "../../features/api/hotelApi";

interface Hotel {
  hotelId: number;
  name: string;
  location: string;
  rating?: number | string;
  hotelImage?: string;
  rooms: {
    pricePerNight: number;
  }[];
}

export const HeroTeaser = () => {
  const { data: hotels = [], isLoading, error } = hotelApi.useGetAllHotelsQuery({
    refetchOnMountOrArgChange: true,
  });

  const featuredHotels = hotels.slice(0, 3); // Only show 6

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Discover Your Perfect Stay</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our selection of premium hotels and find the perfect room for your next getaway.
          </p>
        </div>

        {/* Error/Loading */}
        {error ? (
          <p className="text-red-500 text-center">Failed to load hotels.</p>
        ) : isLoading ? (
          <div className="flex justify-center">
            <PuffLoader color="#3b82f6" />
          </div>
        ) : (
          <>
            {/* Hotel Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {featuredHotels.map((hotel:Hotel) => (
                <div
                key={hotel.hotelId}
                className="group bg-white rounded-xl shadow-md overflow-hidden relative transition hover:shadow-lg"
              >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
    <img
      src={hotel.hotelImage || "https://source.unsplash.com/random/600x400/?hotel"}
      alt={hotel.name}
      className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
    />
                    {/* Rating */}
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center gap-1 text-sm font-semibold shadow">
                      <MdStar className="text-orange-400" />
                      <span>
                        {isNaN(Number(hotel.rating))
                          ? "N/A"
                          : Number(hotel.rating).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">{hotel.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MdLocationOn className="text-blue-500" />
                      {hotel.location}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {hotel.rooms.length} room type{hotel.rooms.length !== 1 ? "s" : ""} available
                    </p>

                    <Link
                      to={`/hotels/${hotel.hotelId}/rooms`}
                      className="mt-4 inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
                    >
                      View Rooms
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* View More Button */}
            <div className="text-center mt-12">
              <Link
                to="/hotels"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium px-6 py-3 border border-blue-200 rounded-full hover:border-blue-300 transition"
              >
                View More Hotels
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
