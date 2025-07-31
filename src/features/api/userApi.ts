import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://stayluxe-e76y.onrender.com/api/',
  }),
  tagTypes: ['users', 'user'],
  endpoints: (builder) => ({
    // LOGIN
    loginUser: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // REGISTER
    registerUser: builder.mutation({
      query: (user: {
        firstName: string;
        lastName: string;
        profileUrl?: string;
        email: string;
        password: string;
      }) => ({
        url: 'auth/register',
        method: 'POST',
        body: user,
      }),
    }),

    // GET USER BY ID
    getUserById: builder.query({
      query: (userId: number) => `users/${userId}`,
      providesTags: ['user'],
    }),

    // GET ALL USERS
    getAllUsersProfiles: builder.query({
      query: () => 'users',
      providesTags: ['users'], // ✅ Links to invalidatesTags
    }),

    // UPDATE USER ROLE / PROFILE (ADMIN)
    updateUserProfile: builder.mutation({
      query: ({ userId, ...patch }) => ({
        url: 'admin/update-user',
        method: 'PATCH',
        body: { userId, ...patch },
      }),
      invalidatesTags: ['users'], // ✅ Forces list to refresh
    }),

    // UPDATE ONLY PROFILE IMAGE
    updateUserProfileImage: builder.mutation({
      query: ({ userId, profileUrl }: { userId: number; profileUrl: string }) => ({
        url: `users/${userId}`,
        method: 'PUT',
        body: { profileUrl },
      }),
      invalidatesTags: ['users'],
    }),

    // DELETE USER
    deleteUserProfile: builder.mutation({
      query: (userId: number) => ({
        url: `users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['users'],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetUserByIdQuery,
  useGetAllUsersProfilesQuery,
  useUpdateUserProfileMutation,
  useUpdateUserProfileImageMutation,
  useDeleteUserProfileMutation,
} = userApi;
