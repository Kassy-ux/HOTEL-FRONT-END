import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';

export const hotelApi = createApi({
  reducerPath: 'hotelApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://stayluxe-e76y.onrender.com/api/',
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
  
  tagTypes: ['hotels', 'hotel'],
  endpoints: (builder) => ({
    // Create a new hotel
    createHotel: builder.mutation({
      query: (createHotelPayload) => ({
        url: 'hotels',
        method: 'POST',
        body: createHotelPayload,
      }),
      invalidatesTags: ['hotels']
    }),
    
    // Update an existing hotel
    updateHotel: builder.mutation({
      query: ({ hotelId, ...body }) => ({
        url: `hotels/${hotelId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['hotels', 'hotel'],
    }),
    
    // Get all hotels
    getAllHotels: builder.query({
      query: () => 'hotels',
      providesTags: ['hotels']
    }),
    
    // Get a single hotel by ID
    getHotelById: builder.query({
      query: (hotelId) => `hotels/${hotelId}`,
      providesTags: ['hotel']
    }),
    
    // Delete a hotel
    deleteHotel: builder.mutation({
      query: (hotelId) => ({
        url: `hotels/${hotelId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['hotels']
    }),
    
    // Search hotels (optional)
    searchHotels: builder.query({
      query: ({ location, category, rating }) => ({
        url: 'hotels/search',
        method: 'GET',
        params: { location, category, rating }
      }),
      providesTags: ['hotels']
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useGetAllHotelsQuery,
  useGetHotelByIdQuery,
  useDeleteHotelMutation,
  useSearchHotelsQuery,
} = hotelApi;