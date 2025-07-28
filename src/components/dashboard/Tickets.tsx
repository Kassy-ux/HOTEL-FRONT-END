import React, { useState } from 'react';
import { Loader2, AlertCircle, PlusCircle, Trash2, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import {
  useGetTicketsByUserQuery,
  useCreateTicketMutation,
  useDeleteTicketMutation,
} from '../../features/api/TictetsApi';
import type { RootState } from '../../app/store';
import type { NewTicketData, Ticket } from '../../types/Types';

const MySwal = withReactContent(Swal);

export const Tickets = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId ? Number(user.userId) : undefined;

  // RTK Query hooks
  const {
    data: userTickets = [],
    isLoading: isLoadingTickets,
    error: ticketsError,
  } = useGetTicketsByUserQuery(userId, {
    skip: !isAuthenticated || typeof userId !== 'number',
  });

  const [createTicket, { isLoading: isCreatingTicket }] = useCreateTicketMutation();
  const [deleteTicket, { isLoading: isDeletingTicket }] = useDeleteTicketMutation();

  // State for new ticket form
  const [newTicket, setNewTicket] = useState<NewTicketData>({ subject: '', description: '' });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTicket(prev => ({ ...prev, [name]: value }));
  };

  const toggleDescription = (ticketId: number) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [ticketId]: !prev[ticketId]
    }));
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject || !newTicket.description) {
      MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in both subject and description.',
        confirmButtonColor: '#7c3aed',
        background: '#f8fafc'
      });
      return;
    }

    try {
      await createTicket({
        userId,
        subject: newTicket.subject,
        description: newTicket.description
      }).unwrap();
      
      MySwal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Ticket created successfully!',
        confirmButtonColor: '#7c3aed',
        background: '#f8fafc'
      });
      
      setNewTicket({ subject: '', description: '' });
      setShowCreateForm(false);
    } catch (err) {
      console.error('Failed to create ticket:', err);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create ticket',
        confirmButtonColor: '#7c3aed',
        background: '#f8fafc'
      });
    }
  };

  const handleDeleteTicket = async (ticketId: number) => {
    if (!ticketId) {
      console.error('Ticket ID is undefined');
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ticket ID is missing',
        confirmButtonColor: '#7c3aed',
        background: '#f8fafc'
      });
      return;
    }

    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      reverseButtons: true,
      background: '#f8fafc'
    });

    if (result.isConfirmed) {
      try {
        await deleteTicket(ticketId).unwrap();
        MySwal.fire({
          title: 'Deleted!',
          text: 'Your ticket has been deleted.',
          icon: 'success',
          confirmButtonColor: '#7c3aed',
          background: '#f8fafc'
        });
      } catch (err) {
        console.error('Failed to delete ticket:', err);
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete ticket',
          confirmButtonColor: '#7c3aed',
          background: '#f8fafc'
        });
      }
    }
  };

  if (!isAuthenticated || typeof userId !== 'number') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="p-6 max-w-md w-full bg-white rounded-xl shadow-lg border border-purple-100">
          <div className="flex flex-col items-center text-center">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-full mb-4">
              <AlertCircle className="text-purple-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h3>
            <p className="text-gray-600">Please log in to view your support tickets.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
          Support Center
        </h1>
        <p className="text-gray-600">Manage your support tickets and requests</p>
      </div>

      {/* Create Ticket Section */}
      <div className="bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden mb-8 transition-all duration-300">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-lg hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          <div className="flex items-center">
            <PlusCircle className="mr-3" />
            {showCreateForm ? 'Hide Ticket Form' : 'Create New Ticket'}
          </div>
          {showCreateForm ? <ChevronUp /> : <ChevronDown />}
        </button>

        {showCreateForm && (
          <form onSubmit={handleCreateTicket} className="p-6 border-t border-purple-100">
            <div className="space-y-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={newTicket.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Briefly describe your issue"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newTicket.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Provide detailed information about your issue..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-70"
                disabled={isCreatingTicket}
              >
                {isCreatingTicket ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2" />
                    Submit Ticket
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Tickets List Section */}
      <div className="bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-purple-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Edit className="mr-2 text-purple-600" />
            Your Support Tickets
          </h2>
        </div>

        {ticketsError ? (
  <div className="p-8 text-center">
    <div className="inline-flex items-center justify-center bg-gradient-to-r from-pink-100 to-rose-100 rounded-full p-4 mb-4">
      <AlertCircle className="text-rose-600 w-8 h-8" />
    </div>
    <p className="text-gray-600">
      {(ticketsError as any)?.data?.message || (ticketsError as any)?.error || 'Something went wrong. Please try again.'}
    </p>
  </div>
) : isLoadingTickets ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center">
              <Loader2 className="animate-spin text-purple-600 w-8 h-8 mr-3" />
              <span className="text-gray-700">Loading your tickets...</span>
            </div>
          </div>
        ) : userTickets.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-4 mb-4">
              <AlertCircle className="text-purple-600 w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tickets Found</h3>
            <p className="text-gray-600">You haven't submitted any support tickets yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-purple-100">
            {userTickets.map((ticket: Ticket) => (
              <div key={ticket.ticketId} className="p-6 hover:bg-purple-50/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-3">
                      <h3 className="text-lg font-medium text-gray-900 truncate mr-3">{ticket.subject}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                        ${ticket.status === 'Open' ? 'bg-red-100 text-red-800' :
                          ticket.status === 'InProgress' ? 'bg-amber-100 text-amber-800' :
                          ticket.status === 'Closed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      Created on {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className={`text-gray-600 ${expandedDescriptions[ticket.ticketId] ? '' : 'line-clamp-2'}`}>
                      {ticket.description}
                    </div>
                    <button
                      onClick={() => toggleDescription(ticket.ticketId)}
                      className="mt-3 text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center"
                    >
                      {expandedDescriptions[ticket.ticketId] ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          Show More
                        </>
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => handleDeleteTicket(ticket.ticketId)}
                    className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
                    disabled={isDeletingTicket}
                  >
                    {isDeletingTicket ? (
                      <Loader2 className="animate-spin mr-1 w-3 h-3" />
                    ) : (
                      <Trash2 className="mr-1 w-3 h-3" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;