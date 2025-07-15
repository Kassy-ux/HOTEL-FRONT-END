import { useParams, useNavigate } from "react-router-dom";
import { hotelApi } from "../features/api/hotelApi";
import { PuffLoader } from "react-spinners";
import { RoomCardSection } from "../components/hotels/RoomCardSection";


export const Room= () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const {
    data: hotel,
    isLoading,
    isError,
  } = hotelApi.useGetHotelByIdQuery(Number(hotelId));

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <PuffLoader color="#3b82f6" size={60} />
      </div>
    );
  }

  if (isError || !hotel) {
    return <div className="text-center text-gray-500">Hotel not found.</div>;
  }

  return <RoomCardSection hotel={hotel} onBack={() => navigate(-1)} />;
};
