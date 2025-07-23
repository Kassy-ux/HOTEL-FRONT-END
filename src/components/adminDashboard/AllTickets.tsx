import { useState } from 'react';
import {
  Loader2,
  AlertCircle,
  Edit,
  Trash2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import {
  useGetAllTicketsQuery,
  useDeleteTicketMutation,
  useResolveTicketMutation,
} from '../../features/api/TictetsApi';
import type { Ticket } from '../../types/Types';

const MySwal = withReactContent(Swal);

export const AllTickets = () => {
  const { data: tickets = [], isLoading, error } = useGetAllTicketsQuery();

  const [deleteTicket, { isLoading: isDeleting }] = useDeleteTicketMutation();
  const [resolveTicket, { isLoading: isResolving }] = useResolveTicketMutation();

  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});

  const toggleDescription = (ticketId: number) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [ticketId]: !prev[ticketId],
    }));
  };

  const handleDelete = async (ticketId: number) => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: 'This ticket will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ec4899',
      cancelButtonColor: '#8b5cf6',
      confirmButtonText: 'Delete',
    });

    if (result.isConfirmed) {
      try {
        await deleteTicket(ticketId).unwrap();
        MySwal.fire('Deleted!', 'Ticket has been deleted.', 'success');
      } catch (err) {
        console.error(err);
        MySwal.fire('Error', 'Failed to delete ticket.', 'error');
      }
    }
  };

  const handleResolve = async (ticketId: number) => {
    try {
      await resolveTicket(ticketId).unwrap();
      MySwal.fire('Success', 'Ticket resolved successfully.', 'success');
    } catch (err) {
      console.error(err);
      MySwal.fire('Error', 'Failed to resolve ticket.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
            <Edit className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Admin Ticket Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Manage all submitted support tickets with elegance</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-500">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Edit className="mr-3 text-white" />
              All Tickets
            </h2>
          </div>

          {error ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <AlertCircle className="text-red-500 w-8 h-8" />
              </div>
              <p className="text-gray-600 text-lg">Failed to load tickets.</p>
            </div>
          ) : isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
                <Loader2 className="animate-spin text-purple-500 w-8 h-8" />
              </div>
              <p className="text-gray-600 text-lg">Loading tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
                <AlertCircle className="text-purple-500 w-8 h-8" />
              </div>
              <p className="text-gray-600 text-lg">No tickets found.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {tickets.map((ticket: Ticket) => (
                <div
                  key={ticket.ticketId}
                  className="p-8 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-3">
                        <h3 className="text-xl font-bold text-gray-900 truncate mr-4 group-hover:text-purple-700 transition-colors">
                          {ticket.subject}
                        </h3>
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm
                          ${
                            ticket.status === 'Open'
                              ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200'
                              : ticket.status === 'InProgress'
                              ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border border-orange-200'
                              : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mb-4 font-medium">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                          Submitted by user #{ticket.userId} on{' '}
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div
                        className={`text-gray-700 text-base leading-relaxed ${
                          expandedDescriptions[ticket.ticketId] ? '' : 'line-clamp-2'
                        }`}
                      >
                        {ticket.description}
                      </div>
                      <button
                        onClick={() => toggleDescription(ticket.ticketId)}
                        className="mt-3 text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 font-semibold flex items-center transition-all duration-200 hover:scale-105"
                      >
                        {expandedDescriptions[ticket.ticketId] ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1 text-purple-500" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1 text-purple-500" />
                            Show More
                          </>
                        )}
                      </button>
                    </div>

                    <div className="ml-6 flex flex-col space-y-3">
                      {ticket.status === 'Open' && (
                        <button
                          onClick={() => handleResolve(ticket.ticketId)}
                          disabled={isResolving}
                          className="flex items-center px-5 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isResolving ? (
                            <Loader2 className="animate-spin w-4 h-4 mr-2" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          Resolve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(ticket.ticketId)}
                        disabled={isDeleting}
                        className="flex items-center px-5 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting ? (
                          <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllTickets;