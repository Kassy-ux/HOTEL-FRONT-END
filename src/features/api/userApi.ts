import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/' }),
  tagTypes: ['users', 'user'],
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
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
    getUserById: builder.query({
      query: (userId: number) => `users/${userId}`,
      providesTags: ["user"]
    }),
    getAllUsersProfiles: builder.query({
      query: () => 'users',
      providesTags: ["users"]
    }),
    updateUserProfile: builder.mutation({
      query: ({ userId, ...patch }) => ({
        url: `users/${userId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ["user", "users"]
    }),
    updateUserProfileImage: builder.mutation({
      query: ({ userId, profileUrl }: { userId: number; profileUrl: string }) => ({
        url: `users/${userId}`,
        method: 'PUT',
        body: { profileUrl },
      }),
      invalidatesTags: ["user", "users"]
    }),
    deleteUserProfile: builder.mutation({
      query: (userId: number) => ({
        url: `users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["user", "users"]
    }),


    // useGetUserById:builder.query({
    //   query:()=> Users
    // }),
  }),
});

// Export hooks
export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetUserByIdQuery,
  useGetAllUsersProfilesQuery,
  useUpdateUserProfileMutation,
  useUpdateUserProfileImageMutation,
  useDeleteUserProfileMutation,
} = userApi;