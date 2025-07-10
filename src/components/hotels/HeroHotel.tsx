import { FaSearch, FaCalendarAlt, FaUserFriends } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

export const HeroHotel = () => {
  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Luxury Hotel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="mb-4">
              <span className="text-sm font-medium tracking-wider text-white/80 uppercase bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm inline-block">
                Luxury Experience
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Discover Your Perfect <span className="text-blue-400">Getaway</span>
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-lg">
              Find and book exceptional hotels with premium amenities for your next vacation or business trip.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-2xl max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdLocationOn className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-500" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-500" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserFriends className="text-gray-500" />
                  </div>
                  <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white">
                    <option>1 Adult</option>
                    <option>2 Adults</option>
                    <option>3 Adults</option>
                    <option>4 Adults</option>
                    <option>Family</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                <FaSearch />
                <span>Search Hotels</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Rating Badge */}
      <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg flex items-center gap-2">
        <div className="text-amber-500 font-bold text-xl">4.9</div>
        <div className="text-gray-700 text-sm">
          <div>Excellent</div>
          <div className="text-xs text-gray-500">2,500+ Reviews</div>
        </div>
      </div>
    </section>
  );
};