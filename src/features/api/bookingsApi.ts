import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';

export const bookingsApi = createApi({
  reducerPath: 'bookingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl:"https://stayluxe-e76y.onrender.com/api/",
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
    getAllBookings: builder.query({
      query: () => 'bookings',
      providesTags: ['Bookings']
    }),

    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: 'bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Bookings']
    }),

    deleteBooking: builder.mutation<void, number>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}`, // 👈 Pass booking ID in the URL
        method: 'DELETE',
      }),
      invalidatesTags: ['Bookings', 'Booking']
    }),
    

    updateBooking: builder.mutation({
      query: ({ bookingId, ...updateData }) => ({
        url: `bookings/${bookingId}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['Bookings', 'Booking']
    }),

    cancelBooking: builder.mutation({
      query: (bookingId) => ({
        url: `bookings/${bookingId}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Bookings', 'Booking']
    }),

    confirmBooking: builder.mutation({
      query: (bookingId) => ({
        url: `bookings/${bookingId}/confirm`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Bookings', 'Booking']
    }),

    getAvailableRooms: builder.query<any[], { checkInDate: string, checkOutDate: string, hotelId: number }>({
      query: ({ checkInDate, checkOutDate, hotelId }) =>
        `/rooms/available?checkIn=${checkInDate}&checkOut=${checkOutDate}&hotelId=${hotelId}`,
    }),

    changeRoom: builder.mutation<void, { bookingId: number, newRoomId: number }>({
      query: ({ bookingId, newRoomId }) => ({
        url: `/bookings/${bookingId}/change-room`,
        method: 'PATCH',
        body: { newRoomId },
      }),
      invalidatesTags: ['Bookings'],
    }),

    checkRoomAvailability: builder.query({
      query: ({ roomId, checkInDate, checkOutDate }) => ({
        url: 'bookings/room-availability',
        params: { roomId, checkInDate, checkOutDate }
      })
    }),

    searchBookingsByDate: builder.query({
      query: ({ startDate, endDate }) => ({
        url: 'bookings/search-date',
        params: { startDate, endDate }
      }),
      providesTags: ['Bookings']
    }),

    getBookingsByUser: builder.query({
      query: (userId) => `bookings/user/${userId}`,
      providesTags: ['Bookings']
    }),

    getBookingsByRoom: builder.query({
      query: (roomId) => `bookings/room/${roomId}`,
      providesTags: ['Bookings']
    }),

    getBookingsByStatus: builder.query({
      query: (status) => `bookings/status/${status}`,
      providesTags: ['Bookings']
    }),

    checkIn: builder.mutation({
      query: (bookingId) => ({
        url: `bookings/${bookingId}/checkin`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Bookings', 'Booking']
    }),

    getBookingHistory: builder.query({
      query: (userId) => `bookings/history/${userId}`,
      providesTags: ['Bookings']
    }),

    checkOut: builder.mutation({
      query: (bookingId) => ({
        url: `bookings/${bookingId}/checkout`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Bookings', 'Booking']
    }),

    getBookingStats: builder.query({
      query: () => 'bookings/stats',
      providesTags: ['Bookings']
    }),

    getBookingDetails: builder.query({
      query: (bookingId) => `bookings/${bookingId}/details`,
      providesTags: ['Booking']
    }),
  }),
});

// ✅ Export all hooks — including lazy version
export const {
  useGetAllBookingsQuery,
  useCreateBookingMutation,
  useDeleteBookingMutation,
  useUpdateBookingMutation,
  useCancelBookingMutation,
  useConfirmBookingMutation,
  useGetAvailableRoomsQuery,
  useLazyGetAvailableRoomsQuery,
  useChangeRoomMutation,
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
