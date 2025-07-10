export interface AuthState {
    user: null | any;
    token: string | null;
    isAuthenticated: boolean;
    role: string | null;
}
// types.ts
export interface RoomData {
  roomId: number;
  roomType: string;
  pricePerNight: number;
  capacity: number;
  roomImage: string;
  amenities: string[];
  available: boolean;
}
  
  export interface HotelData {
    hotelId: number;
    name: string;
    location: string;
    address: string;
    rating: number;
    hotelImage: string;
    rooms: RoomData[];
  }
  