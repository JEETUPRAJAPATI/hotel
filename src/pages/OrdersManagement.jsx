import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Eye, Clock, CheckCircle, XCircle, Play, Pause,
  MapPin, Phone, User, Calendar, DollarSign, Utensils, Car, Home,
  ChevronDown, RefreshCw, AlertCircle, Package
} from 'lucide-react';

const OrdersManagement = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const orderTabs = [
    { id: 'all', name: 'All Orders', count: 12 },
    { id: 'pending', name: 'Pending', count: 3 },
    { id: 'in_progress', name: 'In Progress', count: 4 },
    { id: 'prepared', name: 'Prepared', count: 2 },
    { id: 'completed', name: 'Completed', count: 3 }
  ];

  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      order_number: 1,
      customer_name: 'Alice Cooper',
      customer_phone: '+1-555-0123',
      order_type: 'dine_in',
      table_number: 5,
      status: 'pending',
      total_amount: 45.50,
      items_count: 3,
      created_at: '2024-01-15T14:30:00Z',
      estimated_time: 25,
      special_instructions: 'No onions in burger',
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 14.99, notes: 'Extra cheese' },
        { name: 'Caesar Salad', quantity: 1, price: 12.99, notes: '' },
        { name: 'Chocolate Cake', quantity: 1, price: 8.99, notes: '' }
      ],
      payment_status: 'pending'
    },
    {
      id: 'ORD002',
      order_number: 2,
      customer_name: 'Bob Smith',
      customer_phone: '+1-555-0124',
      order_type: 'takeaway',
      status: 'in_progress',
      total_amount: 23.75,
      items_count: 2,
      created_at: '2024-01-15T14:45:00Z',
      estimated_time: 15,
      special_instructions: '',
      items: [
        { name: 'Chicken Wings', quantity: 2, price: 11.99, notes: 'Extra spicy' },
        { name: 'Soft Drink', quantity: 1, price: 2.99, notes: 'Coca-Cola' }
      ],
      payment_status: 'paid'
    },
    {
      id: 'ORD003',
      order_number: 3,
      customer_name: 'Carol Johnson',
      customer_phone: '+1-555-0125',
      customer_address: '123 Main St, City',
      order_type: 'delivery',
      status: 'prepared',
      total_amount: 67.25,
      items_count: 4,
      created_at: '2024-01-15T13:20:00Z',
      estimated_time: 35,
      delivery_fee: 5.00,
      special_instructions: 'Ring doorbell twice',
      items: [
        { name: 'Pepperoni Pizza', quantity: 2, price: 16.99, notes: '' },
        { name: 'Garlic Bread', quantity: 1, price: 6.99, notes: '' },
        { name: 'Tiramisu', quantity: 2, price: 9.99, notes: '' }
      ],
      payment_status: 'paid'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'prepared': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOrderTypeIcon = (type) => {
    switch (type) {
      case 'dine_in': return <Utensils className="w-4 h-4" />;
      case 'takeaway': return <Package className="w-4 h-4" />;
      case 'delivery': return <Car className="w-4 h-4" />;
      default: return <Utensils className="w-4 h-4" />;
    }
  };

  const getOrderTypeLabel = (type) => {
    switch (type) {
      case 'dine_in': return 'Dine In';
      case 'takeaway': return 'Takeaway';
      case 'delivery': return 'Delivery';
      default: return type;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesTab = selectedTab === 'all' || order.status === selectedTab;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const orderTime = new Date(dateString);
    const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} mins ago`;
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours} hours ago`;
    }
  };

  const OrderCard = ({ order }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            {getOrderTypeIcon(order.order_type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Order #{order.order_number}</h3>
            <p className="text-sm text-gray-600">{order.customer_name}</p>
            <p className="text-xs text-gray-500">{formatTimeAgo(order.created_at)}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
          {order.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {getOrderTypeIcon(order.order_type)}
          <span>{getOrderTypeLabel(order.order_type)}</span>
          {order.table_number && <span>- Table {order.table_number}</span>}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{order.estimated_time} mins</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package className="w-4 h-4" />
          <span>{order.items_count} items</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-green-600">
          <DollarSign className="w-4 h-4" />
          <span>${order.total_amount.toFixed(2)}</span>
        </div>
      </div>

      {order.special_instructions && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Special Instructions:</strong> {order.special_instructions}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            setSelectedOrder(order);
            setShowOrderModal(true);
          }}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
        
        <div className="flex gap-2">
          {order.status === 'pending' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'in_progress')}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
            >
              <Play className="w-3 h-3" />
              Start
            </button>
          )}
          {order.status === 'in_progress' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'prepared')}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
            >
              <CheckCircle className="w-3 h-3" />
              Ready
            </button>
          )}
          {order.status === 'prepared' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'completed')}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
            >
              <CheckCircle className="w-3 h-3" />
              Complete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

  const OrderDetailsModal = ({ order, onClose }) => {
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
                <h2 className="text-xl font-semibold text-gray-900">Order #{order.order_number}</h2>
                <p className="text-gray-600">{order.customer_name}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{order.customer_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{order.customer_phone}</span>
                </div>
                {order.customer_address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{order.customer_address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{new Date(order.created_at).toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {getOrderTypeIcon(order.order_type)}
                  <span className="text-gray-700">{getOrderTypeLabel(order.order_type)}</span>
                  {order.table_number && <span className="text-gray-500">- Table {order.table_number}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{order.estimated_time} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      {item.notes && (
                        <p className="text-sm text-gray-600 mt-1">Note: {item.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">x{item.quantity}</p>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            {order.special_instructions && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Instructions</h3>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800">{order.special_instructions}</p>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${(order.total_amount - (order.delivery_fee || 0)).toFixed(2)}</span>
                </div>
                {order.delivery_fee && (
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>${order.delivery_fee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold text-gray-900 border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>${order.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.payment_status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.payment_status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
            {order.status !== 'completed' && order.status !== 'cancelled' && (
              <button
                onClick={() => {
                  // Handle status update logic
                  onClose();
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
              >
                Update Status
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Orders Management</h1>
          <p className="text-gray-600">Track and manage all restaurant orders</p>
        </div>
          <div className="mt-4 md:mt-0 flex gap-3">
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

        {/* Tabs and Search */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4 lg:mb-0">
                {orderTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedTab === tab.id
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.name} ({tab.count})
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:w-80">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedTab !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No orders available at the moment'
              }
            </p>
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => {
              setShowOrderModal(false);
              setSelectedOrder(null);
            }}
          />
        )}
      </div>
  );
};

export default OrdersManagement;