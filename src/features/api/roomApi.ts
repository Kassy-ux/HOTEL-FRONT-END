import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';

export const roomApi = createApi({
  reducerPath: 'roomApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    }
  }),
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  
  tagTypes: ['rooms', 'room'],
  endpoints: (builder) => ({
    // Create a new room
    createRoom: builder.mutation({
      query: (createRoomPayload) => ({
        url: 'rooms',
        method: 'POST',
        body: createRoomPayload,
      }),
      invalidatesTags: ['rooms']
    }),
    
    // Update an existing room
    updateRoom: builder.mutation({
      query: ({ roomId, ...body }) => ({
        url: `rooms/${roomId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['rooms', 'room'],
    }),
    
    // Get all rooms
    getAllRooms: builder.query({
      query: () => 'rooms',
      providesTags: ['rooms']
    }),
    
    // Get a single room by ID
    getRoomById: builder.query({
      query: (roomId) => `rooms/${roomId}`,
      providesTags: ['room']
    }),
    
    // Get rooms by hotel ID
    getRoomsByHotelId: builder.query({
      query: (hotelId) => `rooms/hotel/${hotelId}`,
      providesTags: ['rooms']
    }),
    
    // Delete a room
    deleteRoom: builder.mutation({
      query: (roomId) => ({
        url: `rooms/${roomId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['rooms']
    }),
    
    // Check room availability
    checkRoomAvailability: builder.query({
      query: ({ roomId, checkInDate, checkOutDate }) => ({
        url: `rooms/${roomId}/availability`,
        method: 'GET',
        params: { checkInDate, checkOutDate }
      }),
      providesTags: ['room']
    }),
    
    // Update room availability status
    updateRoomAvailability: builder.mutation({
      query: ({ roomId, isAvailable }) => ({
        url: `rooms/${roomId}/availability`,
        method: 'PATCH',
        body: { isAvailable },
      }),
      invalidatesTags: ['room']
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useGetAllRoomsQuery,
  useGetRoomByIdQuery,
  useGetRoomsByHotelIdQuery,
  useDeleteRoomMutation,
  useCheckRoomAvailabilityQuery,
  useUpdateRoomAvailabilityMutation,
} = roomApi;