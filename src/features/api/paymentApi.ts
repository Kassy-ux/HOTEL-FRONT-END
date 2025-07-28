// src/features/api/paymentApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/", // Update to production URL on deploy
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Payments"],
  endpoints: (builder) => ({
    // Fetch all payments for admin dashboard (optional)
    getAllPayments: builder.query({
      query: ({ page, pageSize }) => ({
        url: "hotel-payments",
        params: { page, pageSize },
      }),
      providesTags: ["Payments"],
    }),

    // Fetch payments for a specific user (e.g. user dashboard)
    getHotelPaymentsByUserId: builder.query({
      query: (userId: number) => ({
        url: `hotel-payments/user/${userId}`,
      }),
      providesTags: ["Payments"],
    }),



    

    // Create Stripe Checkout session for a room booking
    createPaymentSession: builder.mutation({
      query: ({ amount, bookingId }: { amount: number; bookingId: number }) => ({
        url: "hotel-payments/create-checkout-session",
        method: "POST",
        body: { amount, bookingId },
      }),
      invalidatesTags: ["Payments"],
    }),

    // Optionally confirm or cancel after webhook or failed redirect
    confirmPaymentStatus: builder.mutation({
      query: ({ bookingId, status }: { bookingId: number; status: string }) => ({
        url: "hotel-payments/status",
        method: "PATCH",
        body: { bookingId, status },
      }),
      invalidatesTags: ["Payments"],
    }),
  }),
});

export const {
  useGetAllPaymentsQuery,
  useGetHotelPaymentsByUserIdQuery,
  useCreatePaymentSessionMutation,
  useConfirmPaymentStatusMutation,
} = paymentApi;
