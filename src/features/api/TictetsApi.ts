import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';
import type { Ticket } from '../../types/Types';

export const TicketsApi = createApi({
  reducerPath: 'supportTicketsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://stayluxe-e76y.onrender.com/api/tickets',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    }
  }),
  tagTypes: ['Tickets', 'Ticket'],
  endpoints: (builder) => ({
    // Get all support tickets (admin only)
    getAllTickets: builder.query<Ticket[], void>({ // <--- void means no argument expected
      query: () => '/tickets',
      providesTags: ['Tickets'],
    }),

    // Create a new support ticket
    createTicket: builder.mutation({
      query: (ticketData) => ({
        url: '',
        method: 'POST',
        body: ticketData,
      }),
      invalidatesTags: ['Tickets']
    }),

    // Get ticket by ID
    getTicketById: builder.query({
      query: (ticketId) => `/${ticketId}`,
      providesTags: (id) => [{ type: 'Ticket', id }]
    }),

    // Update a ticket
    updateTicket: builder.mutation({
      query: ({ ticketId, ...updateData }) => ({
        url: `/${ticketId}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['Tickets', 'Ticket']
    }),
    deleteTicket: builder.mutation({
      query: (ticketId: number) => ({
        url: `/${ticketId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tickets', 'Ticket']
    }),
    
    // Resolve a ticket
    resolveTicket: builder.mutation({
      query: (ticketId) => ({
        url: `/${ticketId}/resolve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Tickets', 'Ticket']
    }),

    // Reopen a ticket
    reopenTicket: builder.mutation({
      query: (ticketId) => ({
        url: `/${ticketId}/reopen`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Tickets', 'Ticket']
    }),

    // Get tickets by status
    getTicketsByStatus: builder.query({
      query: (status) => `/status/${status}`,
      providesTags: ['Tickets']
    }),

    // Get tickets by user
    getTicketsByUser: builder.query({
      query: (userId) => `/user/${userId}`,
      providesTags: ['Tickets']
    }),

    // Add response to ticket
    addResponse: builder.mutation({
      query: ({ ticketId, response }) => ({
        url: `/${ticketId}/response`,
        method: 'POST',
        body: { response },
      }),
      invalidatesTags: ['Ticket']
    }),

    // Get ticket statistics
    getTicketStats: builder.query({
      query: () => '/stats',
      providesTags: ['Tickets']
    }),

    // Search tickets
    searchTickets: builder.query({
      query: ({ query, status }) => ({
        url: '/search',
        params: { query, status }
      }),
      providesTags: ['Tickets']
    }),

    // Assign ticket to support agent
    assignTicket: builder.mutation({
      query: ({ ticketId, agentId }) => ({
        url: `/${ticketId}/assign`,
        method: 'PATCH',
        body: { agentId },
      }),
      invalidatesTags: ['Ticket']
    }),

    // Close ticket
    closeTicket: builder.mutation({
      query: (ticketId) => ({
        url: `/${ticketId}/close`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Tickets', 'Ticket']
    }),

    // Get ticket history
    getTicketHistory: builder.query({
      query: (ticketId) => `/${ticketId}/history`,
      providesTags: ['Ticket']
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllTicketsQuery,

  useCreateTicketMutation,

  useGetTicketByIdQuery,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useResolveTicketMutation,
  useReopenTicketMutation,
  useGetTicketsByStatusQuery,
  useGetTicketsByUserQuery,
  useAddResponseMutation,
  useGetTicketStatsQuery,
  useSearchTicketsQuery,
  useAssignTicketMutation,
  useCloseTicketMutation,
  useGetTicketHistoryQuery,
} = TicketsApi;