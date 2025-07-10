import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';

export const bookingsApi = createApi({
  reducerPath: 'bookingsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    }
  }),
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  
  tagTypes: ['Bookings', 'Booking'],
  endpoints: (builder) => ({
    // Get all bookings (admin only)
    getAllBookings: builder.query({
      query: () => 'bookings',
      providesTags: ['Bookings']
    }),

    // Create a new booking
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: 'bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Bookings']
    }),

    // Update a booking
    updateBooking: builder.mutation({
      query: ({ bookingId, ...updateData }) => ({
        url: `bookings/${bookingId}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['Bookings', 'Booking']
    }),

    // Cancel a booking
    cancelBooking: builder.mutation({
      query: (bookingId) => ({
        url: `bookings/${bookingId}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Bookings', 'Booking']
    }),

    // Confirm a booking
    confirmBooking: builder.mutation({
      query: (bookingId) => ({
        url: `bookings/${bookingId}/confirm`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Bookings', 'Booking']
    }),

    // Check room availability
    checkRoomAvailability: builder.query({
      query: ({ roomId, checkInDate, checkOutDate }) => ({
        url: 'bookings/room-availability',
        params: { roomId, checkInDate, checkOutDate }
      })
    }),

    // Search bookings by date strings
    searchBookingsByDate: builder.query({
      query: ({ startDate, endDate }) => ({
        url: 'bookings/search-date',
        params: { startDate, endDate }
      }),
      providesTags: ['Bookings']
    }),

    // Get bookings by user
    getBookingsByUser: builder.query({
      query: (userId) => `bookings/user/${userId}`,
      providesTags: ['Bookings']
    }),

    // Get bookings by room
    getBookingsByRoom: builder.query({
      query: (roomId) => `bookings/room/${roomId}`,
      providesTags: ['Bookings']
    }),

    // Get bookings by status
    getBookingsByStatus: builder.query({
      query: (status) => `bookings/status/${status}`,
      providesTags: ['Bookings']
    }),

    // Check-in operation
    checkIn: builder.mutation({
      query: (bookingId) => ({
        url: `bookings/${bookingId}/checkin`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Bookings', 'Booking']
    }),

    // Get booking history
    getBookingHistory: builder.query({
      query: (userId) => `bookings/history/${userId}`,
      providesTags: ['Bookings']
    }),

    // Check-out operation
    checkOut: builder.mutation({
      query: (bookingId) => ({
        url: `bookings/${bookingId}/checkout`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Bookings', 'Booking']
    }),

    // Get booking statistics
    getBookingStats: builder.query({
      query: () => 'bookings/stats',
      providesTags: ['Bookings']
    }),

    // Get booking details
    getBookingDetails: builder.query({
      query: (bookingId) => `bookings/${bookingId}/details`,
      providesTags: ['Booking']
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllBookingsQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useCancelBookingMutation,
  useConfirmBookingMutation,
  useCheckRoomAvailabilityQuery,
  useSearchBookingsByDateQuery,
  useGetBookingsByUserQuery,
  useGetBookingsByRoomQuery,
  useGetBookingsByStatusQuery,
  useCheckInMutation,
  useGetBookingHistoryQuery,
  useCheckOutMutation,
  useGetBookingStatsQuery,
  useGetBookingDetailsQuery,
} = bookingsApi;