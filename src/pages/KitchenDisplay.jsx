import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, AlertCircle, CheckCircle, Utensils, Timer, RefreshCw,
  Printer, Eye, Users, MapPin, MessageSquare, Calendar, ChevronRight
} from 'lucide-react';

const KitchenDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [selectedKOT, setSelectedKOT] = useState(null);
  const [showKOTModal, setShowKOTModal] = useState(false);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const [kotTickets, setKotTickets] = useState([
    {
      id: 'KOT001',
      order_id: 'ORD001',
      order_number: 1,
      table_number: 5,
      customer_name: 'Alice Cooper',
      order_type: 'dine_in',
      status: 'pending',
      priority: 'normal',
      created_at: '2024-01-15T14:30:00Z',
      estimated_time: 25,
      elapsed_time: 5,
      special_instructions: 'No onions in burger, extra cheese on pizza',
      items: [
        { 
          id: 1, 
          name: 'Margherita Pizza', 
          quantity: 1, 
          category: 'mains',
          notes: 'Extra cheese',
          prep_time: 15,
          status: 'pending'
        },
        { 
          id: 2, 
          name: 'Caesar Salad', 
          quantity: 1, 
          category: 'appetizers',
          notes: '',
          prep_time: 8,
          status: 'pending'
        },
        { 
          id: 3, 
          name: 'Chocolate Cake', 
          quantity: 1, 
          category: 'desserts',
          notes: '',
          prep_time: 5,
          status: 'pending'
        }
      ]
    },
    {
      id: 'KOT002',
      order_id: 'ORD002',
      order_number: 2,
      customer_name: 'Bob Smith',
      order_type: 'takeaway',
      status: 'in_progress',
      priority: 'high',
      created_at: '2024-01-15T14:45:00Z',
      estimated_time: 15,
      elapsed_time: 12,
      special_instructions: '',
      items: [
        { 
          id: 1, 
          name: 'Chicken Wings', 
          quantity: 2, 
          category: 'mains',
          notes: 'Extra spicy',
          prep_time: 12,
          status: 'in_progress'
        },
        { 
          id: 2, 
          name: 'Soft Drink', 
          quantity: 1, 
          category: 'beverages',
          notes: 'Coca-Cola',
          prep_time: 1,
          status: 'completed'
        }
      ]
    },
    {
      id: 'KOT003',
      order_id: 'ORD003',
      order_number: 3,
      customer_name: 'Carol Johnson',
      order_type: 'delivery',
      status: 'prepared',
      priority: 'normal',
      created_at: '2024-01-15T13:20:00Z',
      estimated_time: 35,
      elapsed_time: 28,
      special_instructions: 'Customer allergic to nuts',
      items: [
        { 
          id: 1, 
          name: 'Pepperoni Pizza', 
          quantity: 2, 
          category: 'mains',
          notes: '',
          prep_time: 18,
          status: 'completed'
        },
        { 
          id: 2, 
          name: 'Garlic Bread', 
          quantity: 1, 
          category: 'appetizers',
          notes: '',
          prep_time: 8,
          status: 'completed'
        }
      ]
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'prepared': return 'bg-green-100 text-green-800 border-green-300';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'normal': return 'bg-green-500';
      default: return 'bg-green-500';
    }
  };

  const getElapsedTimeColor = (elapsed, estimated) => {
    const percentage = (elapsed / estimated) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const updateKOTStatus = (kotId, newStatus) => {
    setKotTickets(tickets => 
      tickets.map(ticket => 
        ticket.id === kotId ? { ...ticket, status: newStatus } : ticket
      )
    );
  };

  const updateItemStatus = (kotId, itemId, newStatus) => {
    setKotTickets(tickets => 
      tickets.map(ticket => 
        ticket.id === kotId 
          ? {
              ...ticket,
              items: ticket.items.map(item => 
                item.id === itemId ? { ...item, status: newStatus } : item
              )
            }
          : ticket
      )
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const formatTimeElapsed = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMinutes = Math.floor((now - created) / (1000 * 60));
    return diffInMinutes;
  };

  const KOTCard = ({ ticket }) => {
    const elapsedTime = formatTimeElapsed(ticket.created_at);
    const isOverdue = elapsedTime > ticket.estimated_time;
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
          isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'
        }`}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getPriorityColor(ticket.priority)}`}></div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">KOT #{ticket.order_number}</h3>
                <p className="text-sm text-gray-600">{ticket.customer_name}</p>
                {ticket.table_number && (
                  <p className="text-xs text-gray-500">Table {ticket.table_number}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('_', ' ').toUpperCase()}
              </span>
              <p className="text-xs text-gray-500 mt-1">{ticket.order_type.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Elapsed:</span>
              <span className={`font-bold ${getElapsedTimeColor(elapsedTime, ticket.estimated_time)}`}>
                {elapsedTime} min
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-600">Est: {ticket.estimated_time} min</span>
              {isOverdue && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  <span className="text-xs font-medium">OVERDUE</span>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2 mb-4">
            {ticket.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{item.quantity}x {item.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  {item.notes && (
                    <p className="text-xs text-gray-600 mt-1">Note: {item.notes}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  {item.status === 'pending' && (
                    <button
                      onClick={() => updateItemStatus(ticket.id, item.id, 'in_progress')}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="Start cooking"
                    >
                      <Clock className="w-3 h-3" />
                    </button>
                  )}
                  {item.status === 'in_progress' && (
                    <button
                      onClick={() => updateItemStatus(ticket.id, item.id, 'completed')}
                      className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                      title="Mark as ready"
                    >
                      <CheckCircle className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Special Instructions */}
          {ticket.special_instructions && (
            <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Special Instructions:</p>
                  <p className="text-sm text-yellow-700">{ticket.special_instructions}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setSelectedKOT(ticket);
                setShowKOTModal(true);
              }}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
            
            <div className="flex gap-2">
              {ticket.status === 'pending' && (
                <button
                  onClick={() => updateKOTStatus(ticket.id, 'in_progress')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Start Cooking
                </button>
              )}
              {ticket.status === 'in_progress' && (
                <button
                  onClick={() => updateKOTStatus(ticket.id, 'prepared')}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Mark Ready
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Print KOT"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const KOTDetailsModal = ({ ticket, onClose }) => {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">KOT #{ticket.order_number}</h2>
                <p className="text-gray-600">{ticket.customer_name}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{ticket.customer_name}</span>
                  </div>
                  {ticket.table_number && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>Table {ticket.table_number}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{new Date(ticket.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-gray-500" />
                    <span>{ticket.order_type.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Timing</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Time:</span>
                    <span className="font-medium">{ticket.estimated_time} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Elapsed Time:</span>
                    <span className={`font-medium ${getElapsedTimeColor(formatTimeElapsed(ticket.created_at), ticket.estimated_time)}`}>
                      {formatTimeElapsed(ticket.created_at)} min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Details */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Items to Prepare</h3>
              <div className="space-y-3">
                {ticket.items.map((item) => (
                  <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.quantity}x {item.name}</h4>
                        <p className="text-sm text-gray-600">Category: {item.category}</p>
                        <p className="text-sm text-gray-600">Prep time: {item.prep_time} min</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    {item.notes && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> {item.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            {ticket.special_instructions && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Special Instructions</h3>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800">{ticket.special_instructions}</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print KOT
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
    );
  };

  // Group tickets by status
  const pendingTickets = kotTickets.filter(ticket => ticket.status === 'pending');
  const inProgressTickets = kotTickets.filter(ticket => ticket.status === 'in_progress');
  const preparedTickets = kotTickets.filter(ticket => ticket.status === 'prepared');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Kitchen Display (KOT)</h1>
          <p className="text-gray-600">Real-time kitchen order management and tracking</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Current Time: </span>
              {currentTime.toLocaleTimeString()}
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Kitchen Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Orders */}
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-yellow-800">
                Pending ({pendingTickets.length})
              </h2>
            </div>
            <div className="space-y-4">
              <AnimatePresence>
                {pendingTickets.map((ticket) => (
                  <KOTCard key={ticket.id} ticket={ticket} />
                ))}
              </AnimatePresence>
              {pendingTickets.length === 0 && (
                <div className="text-center py-8 text-yellow-600">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No pending orders</p>
                </div>
              )}
            </div>
          </div>

          {/* In Progress Orders */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Utensils className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-blue-800">
                Cooking ({inProgressTickets.length})
              </h2>
            </div>
            <div className="space-y-4">
              <AnimatePresence>
                {inProgressTickets.map((ticket) => (
                  <KOTCard key={ticket.id} ticket={ticket} />
                ))}
              </AnimatePresence>
              {inProgressTickets.length === 0 && (
                <div className="text-center py-8 text-blue-600">
                  <Utensils className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No orders being cooked</p>
                </div>
              )}
            </div>
          </div>

          {/* Prepared Orders */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-green-800">
                Ready ({preparedTickets.length})
              </h2>
            </div>
            <div className="space-y-4">
              <AnimatePresence>
                {preparedTickets.map((ticket) => (
                  <KOTCard key={ticket.id} ticket={ticket} />
                ))}
              </AnimatePresence>
              {preparedTickets.length === 0 && (
                <div className="text-center py-8 text-green-600">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No orders ready</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KOT Details Modal */}
        {showKOTModal && selectedKOT && (
          <KOTDetailsModal
            ticket={selectedKOT}
            onClose={() => {
              setShowKOTModal(false);
              setSelectedKOT(null);
            }}
          />
        )}
    </div>
  );
};

export default KitchenDisplay;