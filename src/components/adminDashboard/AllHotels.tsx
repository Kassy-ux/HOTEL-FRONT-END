import { useState } from "react";
import { MdStar, MdLocationOn, MdAdd, MdClose, MdSearch } from "react-icons/md";
import { PuffLoader } from "react-spinners";
import { hotelApi, useCreateHotelMutation } from "../../features/api/hotelApi";
import { useCreateRoomMutation } from "../../features/api/roomApi";
import type { HotelData } from "../../types/Types";
import { RoomCardSection } from "../hotels/RoomCardSection";
import Swal from "sweetalert2";
import axios from "axios";





export const AllHotels = () => {


  const preset_key ="stayluxe"
  const cloud_name ="dzddrmfs3"
  const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null);
  const [showAddHotelForm, setShowAddHotelForm] = useState(false);
  const [showAddRoomForm, setShowAddRoomForm] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [roomUploadProgress] = useState<number>(0);
  const [roomUploading] = useState(false);

  const {
    data: hotelData = [],
    isLoading,
    error,
  } = hotelApi.useGetAllHotelsQuery("all");

  const [addHotel] = useCreateHotelMutation();
  const [addRoom] = useCreateRoomMutation();

  const [newHotel, setNewHotel] = useState({
    name: "",
    location: "",
    rating: "",
    hotelImage: "",
  });

  const [newRoom, setNewRoom] = useState({
    roomType: "",
    pricePerNight: "",
    capacity: "",
    roomImage: "",
    amenities: "",
    available: true,
  });

  const filteredHotels = hotelData.filter(
    (hotel: HotelData) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addHotel({
        name: newHotel.name,
        location: newHotel.location,
        rating: parseFloat(newHotel.rating),
        hotelImage: newHotel.hotelImage,
      }).unwrap();
      setNewHotel({ name: "", location: "", rating: "", hotelImage: "" });
      setShowAddHotelForm(false);
      Swal.fire({
        title: "Success!",
        text: "Hotel created successfully",
        icon: "success",
        confirmButtonColor: "#7c3aed",
      });
    } catch (err) {
      console.error("Failed to add hotel:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to create hotel",
        icon: "error",
        confirmButtonColor: "#7c3aed",
      });
    }
  };



  const uploadToCloudinary = async (file: File) => {
    const cloudFormData = new FormData();
    cloudFormData.append("file", file);
    cloudFormData.append("upload_preset", preset_key);
    try {
      setUploading(true);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        cloudFormData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setUploadProgress(percent);
          },
        }
      );
      setUploading(false);
      return response.data.secure_url;
    } catch (error) {
      setUploading(false);
      console.error("Cloudinary upload failed", error);
      Swal.fire("Upload Failed", "Failed to upload image to Cloudinary", "error");
      return null;
    }
  };
  const handleHotelImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadedUrl = await uploadToCloudinary(file);
    if (uploadedUrl) {
      setNewHotel((prev) => ({ ...prev, hotelImage: uploadedUrl }));
    }
  };
  const handleRoomImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadedUrl = await uploadToCloudinary(file);
    if (uploadedUrl) {
      setNewRoom((prev) => ({ ...prev, roomImage: uploadedUrl }));
    }
  };

  const handleAddRoom = async (e: React.FormEvent, hotelId: number) => {
    e.preventDefault();
    try {
      await addRoom({
        hotelId,
        roomType: newRoom.roomType,
        pricePerNight: parseFloat(newRoom.pricePerNight),
        capacity: parseInt(newRoom.capacity),
        roomImage: newRoom.roomImage,
        amenities: newRoom.amenities.split(",").map((a) => a.trim()),
        available: newRoom.available,
      }).unwrap();
      setNewRoom({
        roomType: "",
        pricePerNight: "",
        capacity: "",
        roomImage: "",
        amenities: "",
        available: true,
      });
      setShowAddRoomForm(null);
      Swal.fire({
        title: "Success!",
        text: "Room added successfully",
        icon: "success",
        confirmButtonColor: "#7c3aed",
      });
    } catch (err) {
      console.error("Failed to add room:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to add room",
        icon: "error",
        confirmButtonColor: "#7c3aed",
      });
    }
  };

  if (selectedHotel) {
    return <RoomCardSection hotel={selectedHotel} onBack={() => setSelectedHotel(null)} />;
  }
  const hotelForm = (
    <form
      onSubmit={handleAddHotel}
      className="bg-white p-6 rounded-2xl mb-8 shadow-lg border border-purple-100/50"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">Hotel Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            value={newHotel.name}
            onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">Location</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            value={newHotel.location}
            onChange={(e) => setNewHotel({ ...newHotel, location: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">Rating</label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            className="w-full px-4 py-2 border rounded-lg"
            value={newHotel.rating}
            onChange={(e) => setNewHotel({ ...newHotel, rating: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">Hotel Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full px-4 py-2 border rounded-lg bg-white"
            onChange={handleHotelImageUpload}
            required
          />
          {uploading && (
            <div className="mt-2 text-xs text-purple-600">
              Uploading: {uploadProgress}%
              <div className="w-full bg-purple-100 h-2 mt-1 rounded">
                <div
                  className="h-2 bg-purple-500 rounded"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          {newHotel.hotelImage && (
            <img
              src={newHotel.hotelImage}
              alt="Uploaded Hotel"
              className="mt-3 w-32 h-20 object-cover rounded"
            />
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
      >
        Create Hotel
      </button>
    </form>
  );

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-purple-50/80 via-white/40 to-pink-50/60 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Hotel Dashboard
            </h2>
            <p className="text-purple-700/80">Manage all hotel properties</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="text-purple-500" />
              </div>
              <input
                type="text"
                placeholder="Search hotels..."
                className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowAddHotelForm(!showAddHotelForm)}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg whitespace-nowrap"
            >
              {showAddHotelForm ? (
                <>
                  <MdClose size={18} />
                  Close Form
                </>
              ) : (
                <>
                  <MdAdd size={18} />
                  Add Hotel
                </>
              )}
            </button>
          </div>
        </div>
  
        {/* ✅ Render the hotelForm variable here */}
        {showAddHotelForm && hotelForm}
  
        {/* Loading and Error States */}
        {error ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="text-pink-600 text-lg font-medium">Failed to load hotels</div>
            <p className="text-purple-700 mt-2">Please try again later</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-20 bg-white rounded-xl shadow-sm">
            <PuffLoader color="#7c3aed" size={60} />
          </div>
        ) : (
          /* Hotel Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredHotels.map((hotel: HotelData) => (
              <div
                key={hotel.hotelId}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-purple-100/50"
              >
                {/* Hotel Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      hotel.hotelImage ||
                      "https://source.unsplash.com/random/600x400/?hotel"
                    }
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 flex flex-col justify-end">
                    <h3 className="text-white text-xl font-bold">{hotel.name}</h3>
                    <p className="text-white/90 text-sm flex items-center">
                      <MdLocationOn className="mr-1 text-pink-300" />
                      {hotel.location}
                    </p>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full flex items-center gap-1 text-sm shadow-md">
                    <MdStar className="text-amber-400" />
                    <span className="font-medium text-purple-900">
                      {hotel.rating ?? "N/A"}
                    </span>
                  </div>
                </div>
  
                {/* Hotel Info */}
                <div className="p-5">
                  <p className="text-sm text-purple-600 mb-4">
                    {hotel.rooms?.length || 0} room type(s) available
                  </p>
  
                  {/* Buttons now in a single row */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedHotel(hotel)}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm font-medium"
                    >
                      View Rooms
                    </button>
  
                    <button
                      onClick={() => setShowAddRoomForm(showAddRoomForm === hotel.hotelId ? null : hotel.hotelId)}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all shadow-sm font-medium flex items-center justify-center gap-2"
                    >
                      {showAddRoomForm === hotel.hotelId ? (
                        <>
                          <MdClose size={16} />
                          Close
                        </>
                      ) : (
                        <>
                          <MdAdd size={16} />
                          Add Room
                        </>
                      )}
                    </button>
                  </div>
  
                  {/* Add Room Form */}
                  {showAddRoomForm === hotel.hotelId && (
                    <form
                      onSubmit={(e) => handleAddRoom(e, hotel.hotelId)}
                      className="mt-4 space-y-3 bg-purple-50/50 p-4 rounded-lg"
                    >
                    <div>
  <label className="block text-xs font-medium text-purple-700 mb-1">Room Image</label>
  <input
    type="file"
    accept="image/*"
    className="w-full px-3 py-2 text-sm border border-purple-200 rounded-lg bg-white"
    onChange={handleRoomImageUpload}
    required
  />
  {roomUploading && (
    <div className="mt-2 text-xs text-purple-600">
      Uploading: {roomUploadProgress}%
      <div className="w-full bg-purple-100 h-2 mt-1 rounded">
        <div
          className="h-2 bg-purple-500 rounded"
          style={{ width: `${roomUploadProgress}%` }}
        />
      </div>
    </div>
  )}
  {newRoom.roomImage && (
    <img
      src={newRoom.roomImage}
      alt="Uploaded Room"
      className="mt-3 w-32 h-20 object-cover rounded"
    />
  )}
</div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-purple-700 mb-1">Price</label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 text-sm border border-purple-200 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                            value={newRoom.pricePerNight}
                            onChange={(e) =>
                              setNewRoom({ ...newRoom, pricePerNight: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-purple-700 mb-1">Capacity</label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 text-sm border border-purple-200 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                            value={newRoom.capacity}
                            onChange={(e) =>
                              setNewRoom({ ...newRoom, capacity: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-purple-700 mb-1">Image URL</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-purple-200 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          value={newRoom.roomImage}
                          onChange={(e) =>
                            setNewRoom({ ...newRoom, roomImage: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-purple-700 mb-1">Amenities</label>
                        <input
                          type="text"
                          placeholder="Comma separated list"
                          className="w-full px-3 py-2 text-sm border border-purple-200 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          value={newRoom.amenities}
                          onChange={(e) =>
                            setNewRoom({ ...newRoom, amenities: e.target.value })
                          }
                          required
                        />
                      </div>
                      <label className="flex items-center space-x-2 text-xs text-purple-700">
                        <input
                          type="checkbox"
                          className="rounded text-purple-600 focus:ring-purple-500"
                          checked={newRoom.available}
                          onChange={(e) =>
                            setNewRoom({
                              ...newRoom,
                              available: e.target.checked,
                            })
                          }
                        />
                        <span>Available</span>
                      </label>
                      <button
                        type="submit"
                        className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-sm font-medium"
                      >
                        Add Room
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
  
};