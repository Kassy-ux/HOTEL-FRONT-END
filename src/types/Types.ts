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
  amenities: string[]; // make sure this is string[]
  available: boolean;
}

export interface HotelData {
  hotelId: number;
  name: string;
  location: string;
  address?: string;
  rating?: number;
  hotelImage: string;
  rooms: RoomData[];
}
export interface BookingDetails {
  bookingId: number;
  hotel: {
    hotelId: number;
    name: string;
    location: string;
    imageUrl: string;
  };
  room: {
    roomId: number;
    roomType: string;
    pricePerNight: number;
  };
  user: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  bookingStatus: "Pending" | "Confirmed" | "Cancelled" | "Completed" | "CheckedIn";
  createdAt: string;
}
export interface Ticket {
  ticketId: number;
  userId: number;
  subject: string;
  description: string;
  status: "Open" | "Closed" | "InProgress";
  createdAt: string;
  updatedAt: string;
}

export interface NewTicketData {
  subject: string;
  description: string;
}

  