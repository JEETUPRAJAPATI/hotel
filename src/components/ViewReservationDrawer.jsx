import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Users, 
  Building,
  Phone, 
  Mail, 
  MapPin, 
  CreditCard,
  DollarSign,
  FileText,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserCheck,
  LogOut,
  Edit,
  Trash2,
  Receipt,
  PlusCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const ViewReservationDrawer = ({ reservation, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [folioLines, setFolioLines] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    amount: '',
    method: 'cash',
    reference: '',
    notes: ''
  });

  // Mock folio lines data
  const mockFolioLines = [
    {
      id: 1,
      date: '2024-03-15',
      description: 'Room Charge - Deluxe Room',
      amount: 5000,
      type: 'room_charge',
      posted_by: 'System',
      posted_at: '2024-03-15T15:00:00Z'
    },
    {
      id: 2,
      date: '2024-03-15',
      description: 'GST 18%',
      amount: 900,
      type: 'tax',
      posted_by: 'System',
      posted_at: '2024-03-15T15:00:00Z'
    },
    {
      id: 3,
      date: '2024-03-16',
      description: 'Restaurant Bill - Dinner',
      amount: 1250,
      type: 'restaurant',
      posted_by: 'Restaurant',
      posted_at: '2024-03-16T20:30:00Z'
    },
    {
      id: 4,
      date: '2024-03-16',
      description: 'Laundry Service',
      amount: 300,
      type: 'laundry',
      posted_by: 'Housekeeping',
      posted_at: '2024-03-16T18:15:00Z'
    }
  ];

  // Mock payments data
  const mockPayments = [
    {
      id: 1,
      date: '2024-03-14',
      amount: 1770,
      method: 'card',
      reference: 'TXN123456',
      type: 'deposit',
      status: 'completed',
      posted_by: 'Front Desk',
      posted_at: '2024-03-14T14:00:00Z'
    },
    {
      id: 2,
      date: '2024-03-16',
      amount: 1250,
      method: 'cash',
      reference: 'CASH001',
      type: 'payment',
      status: 'completed',
      posted_by: 'Restaurant',
      posted_at: '2024-03-16T20:35:00Z'
    }
  ];

  useEffect(() => {
    if (isOpen && reservation) {
      loadFolioData();
    }
  }, [isOpen, reservation]);

  const loadFolioData = async () => {
    try {
      setLoading(true);
      // Mock API calls
      await new Promise(resolve => setTimeout(resolve, 500));
      setFolioLines(mockFolioLines);
      setPayments(mockPayments);
    } catch (error) {
      console.error('Error loading folio data:', error);
      toast.error('Failed to load folio data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success(`Reservation ${newStatus} successfully`);
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    
    if (!newPayment.amount || newPayment.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const payment = {
        id: payments.length + 1,
        date: new Date().toISOString().split('T')[0],
        amount: parseFloat(newPayment.amount),
        method: newPayment.method,
        reference: newPayment.reference,
        type: 'payment',
        status: 'completed',
        posted_by: 'Front Desk',
        posted_at: new Date().toISOString(),
        notes: newPayment.notes
      };
      
      setPayments(prev => [...prev, payment]);
      setNewPayment({ amount: '', method: 'cash', reference: '', notes: '' });
      setShowAddPayment(false);
      toast.success('Payment added successfully');
    } catch (error) {
      console.error('Error adding payment:', error);
      toast.error('Failed to add payment');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
      case 'checked_in': return <UserCheck className="w-5 h-5 text-green-600" />;
      case 'checked_out': return <LogOut className="w-5 h-5 text-purple-600" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'no_show': return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'checked_in': return 'bg-green-50 text-green-700 border-green-200';
      case 'checked_out': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      case 'no_show': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateNights = () => {
    if (reservation?.check_in_date && reservation?.check_out_date) {
      const diff = new Date(reservation.check_out_date) - new Date(reservation.check_in_date);
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const calculateTotalFolio = () => {
    return folioLines.reduce((sum, line) => sum + line.amount, 0);
  };

  const calculateTotalPayments = () => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const calculateBalance = () => {
    return calculateTotalFolio() - calculateTotalPayments();
  };

  if (!reservation) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Reservation Details
                  </h2>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(reservation.status)}`}>
                    {getStatusIcon(reservation.status)}
                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1).replace('_', ' ')}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(`/owner/reservations/edit/${reservation.id}`, '_blank')}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Reservation"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-8">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Guest Information */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Guest Information</h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Name
                          </label>
                          <p className="text-gray-900 font-medium">{reservation.guest_name}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Email
                            </label>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <p className="text-gray-900">{reservation.guest_email}</p>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Phone
                            </label>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <p className="text-gray-900">{reservation.guest_phone}</p>
                            </div>
                          </div>
                        </div>

                        {reservation.guest_id_number && (
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              ID Details
                            </label>
                            <p className="text-gray-900">
                              {reservation.guest_id_type.toUpperCase()}: {reservation.guest_id_number}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reservation Details */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Reservation Details</h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Reservation Number
                          </label>
                          <p className="text-gray-900 font-medium">{reservation.reservation_number}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Check-in
                            </label>
                            <p className="text-gray-900">{formatDate(reservation.check_in_date)}</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Check-out
                            </label>
                            <p className="text-gray-900">{formatDate(reservation.check_out_date)}</p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Duration
                          </label>
                          <p className="text-gray-900">{calculateNights()} night(s)</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Adults
                            </label>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <p className="text-gray-900">{reservation.num_adults}</p>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Children
                            </label>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <p className="text-gray-900">{reservation.num_children}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Room
                          </label>
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            <p className="text-gray-900">{reservation.room_type} - Room {reservation.room_number}</p>
                          </div>
                        </div>

                        {reservation.special_requests && (
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Special Requests
                            </label>
                            <p className="text-gray-900">{reservation.special_requests}</p>
                          </div>
                        )}

                        {reservation.notes && (
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Internal Notes
                            </label>
                            <p className="text-gray-900">{reservation.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <DollarSign className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Financial Summary</h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-blue-600 mb-1">Total Charges</div>
                        <div className="text-2xl font-bold text-blue-900">₹{calculateTotalFolio().toLocaleString()}</div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-green-600 mb-1">Total Payments</div>
                        <div className="text-2xl font-bold text-green-900">₹{calculateTotalPayments().toLocaleString()}</div>
                      </div>

                      <div className="bg-orange-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-orange-600 mb-1">Outstanding Balance</div>
                        <div className="text-2xl font-bold text-orange-900">₹{calculateBalance().toLocaleString()}</div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-gray-600 mb-1">Original Amount</div>
                        <div className="text-2xl font-bold text-gray-900">₹{reservation.total_amount.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Folio Lines */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Receipt className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Folio Lines</h3>
                      </div>
                      
                      <button
                        onClick={() => toast.info('Add folio line feature coming soon')}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Add Charge
                      </button>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posted By</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {folioLines.map((line) => (
                            <tr key={line.id}>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {formatDate(line.date)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {line.description}
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                  {line.type.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                ₹{line.amount.toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">
                                {line.posted_by}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Payments */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CreditCard className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Payments</h3>
                      </div>
                      
                      <button
                        onClick={() => setShowAddPayment(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Add Payment
                      </button>
                    </div>

                    {showAddPayment && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <form onSubmit={handleAddPayment} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount *
                              </label>
                              <input
                                type="number"
                                value={newPayment.amount}
                                onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="Enter amount"
                                min="0"
                                step="0.01"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Method
                              </label>
                              <select
                                value={newPayment.method}
                                onChange={(e) => setNewPayment(prev => ({ ...prev, method: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              >
                                <option value="cash">Cash</option>
                                <option value="card">Credit/Debit Card</option>
                                <option value="upi">UPI</option>
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="cheque">Cheque</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reference Number
                              </label>
                              <input
                                type="text"
                                value={newPayment.reference}
                                onChange={(e) => setNewPayment(prev => ({ ...prev, reference: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="Transaction reference"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes
                              </label>
                              <input
                                type="text"
                                value={newPayment.notes}
                                onChange={(e) => setNewPayment(prev => ({ ...prev, notes: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="Payment notes"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="submit"
                              disabled={loading}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                            >
                              Add Payment
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowAddPayment(false)}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}

                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posted By</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {payments.map((payment) => (
                            <tr key={payment.id}>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {formatDate(payment.date)}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-green-600">
                                ₹{payment.amount.toLocaleString()}
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                  {payment.method.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {payment.reference || '-'}
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                  {payment.type}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {payment.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">
                                {payment.posted_by}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Created: {formatDateTime(reservation.created_at)}
                    {reservation.updated_at !== reservation.created_at && (
                      <span className="ml-4">Updated: {formatDateTime(reservation.updated_at)}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {reservation.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange('checked_in')}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                      >
                        <UserCheck className="w-4 h-4" />
                        Check In
                      </button>
                    )}

                    {reservation.status === 'checked_in' && (
                      <button
                        onClick={() => handleStatusChange('checked_out')}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Check Out
                      </button>
                    )}

                    {['confirmed', 'checked_in'].includes(reservation.status) && (
                      <button
                        onClick={() => handleStatusChange('cancelled')}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    )}

                    <button
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ViewReservationDrawer;