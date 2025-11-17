import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Minus, Search, ShoppingCart, CreditCard, DollarSign, Receipt,
  Users, MapPin, Trash2, Edit, Calculator, Check, X, Printer,
  Package, Utensils, Car, Home, Clock, Tag
} from 'lucide-react';

const POSSystem = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    order_type: 'dine_in',
    table_number: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amountReceived, setAmountReceived] = useState('');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(8.5); // 8.5% tax

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'appetizers', name: 'Appetizers' },
    { id: 'mains', name: 'Main Course' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'beverages', name: 'Beverages' }
  ];

  const menuItems = [
    {
      id: 1,
      name: 'Margherita Pizza',
      category: 'mains',
      price: 14.99,
      description: 'Fresh tomatoes, mozzarella, basil',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200',
      is_available: true,
      prep_time: 15
    },
    {
      id: 2,
      name: 'Chicken Caesar Salad',
      category: 'appetizers',
      price: 12.99,
      description: 'Grilled chicken, romaine lettuce, parmesan',
      image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=200',
      is_available: true,
      prep_time: 10
    },
    {
      id: 3,
      name: 'Chocolate Lava Cake',
      category: 'desserts',
      price: 8.99,
      description: 'Warm chocolate cake with molten center',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200',
      is_available: true,
      prep_time: 20
    },
    {
      id: 4,
      name: 'Chicken Wings',
      category: 'mains',
      price: 11.99,
      description: 'Buffalo style with ranch dressing',
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=200',
      is_available: true,
      prep_time: 12
    },
    {
      id: 5,
      name: 'Soft Drink',
      category: 'beverages',
      price: 2.99,
      description: 'Coca-Cola, Pepsi, Sprite',
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200',
      is_available: true,
      prep_time: 2
    },
    {
      id: 6,
      name: 'Garlic Bread',
      category: 'appetizers',
      price: 6.99,
      description: 'Toasted bread with garlic butter',
      image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=200',
      is_available: true,
      prep_time: 8
    }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && item.is_available;
  });

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1, notes: '' }]);
    }
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      setCart(cart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const updateCartNotes = (itemId, notes) => {
    setCart(cart.map(item => 
      item.id === itemId ? { ...item, notes } : item
    ));
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDiscountAmount = () => {
    return (getSubtotal() * discount) / 100;
  };

  const getTaxAmount = () => {
    return ((getSubtotal() - getDiscountAmount()) * tax) / 100;
  };

  const getTotal = () => {
    return getSubtotal() - getDiscountAmount() + getTaxAmount();
  };

  const getChange = () => {
    return parseFloat(amountReceived) - getTotal();
  };

  const clearCart = () => {
    setCart([]);
    setCustomerInfo({
      name: '',
      phone: '',
      address: '',
      order_type: 'dine_in',
      table_number: ''
    });
    setDiscount(0);
    setAmountReceived('');
  };

  const handlePrintReceipt = () => {
    // This would trigger the receipt printing
    window.print();
  };

  const processOrder = () => {
    // Here you would send the order to the backend
    console.log('Processing order:', {
      customer: customerInfo,
      items: cart,
      subtotal: getSubtotal(),
      discount: getDiscountAmount(),
      tax: getTaxAmount(),
      total: getTotal(),
      payment_method: paymentMethod,
      amount_received: parseFloat(amountReceived),
      change: getChange()
    });
    
    // Clear cart and show success message
    clearCart();
    setShowPaymentModal(false);
    setShowCheckout(false);
    alert('Order processed successfully!');
  };

  const MenuItem = ({ item }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden cursor-pointer"
      onClick={() => addToCart(item)}
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-32 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-green-600 text-lg">${item.price.toFixed(2)}</span>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {item.prep_time}m
          </div>
        </div>
      </div>
    </motion.div>
  );

  const CartItem = ({ item }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <img
        src={item.image}
        alt={item.name}
        className="w-12 h-12 object-cover rounded"
      />
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{item.name}</h4>
        <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
        <input
          type="text"
          placeholder="Special notes..."
          value={item.notes}
          onChange={(e) => updateCartNotes(item.id, e.target.value)}
          className="w-full mt-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
          className="p-1 text-gray-600 hover:bg-gray-200 rounded"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="font-medium text-gray-900 min-w-[20px] text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
          className="p-1 text-gray-600 hover:bg-gray-200 rounded"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          onClick={() => updateCartQuantity(item.id, 0)}
          className="text-red-600 hover:text-red-800 p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Point of Sale</h1>
          <p className="text-gray-600">Process orders and manage billing</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button
              onClick={clearCart}
              className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            {/* Search and Categories */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search menu items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                        selectedCategory === category.id
                          ? 'bg-orange-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>

          {/* Cart and Checkout */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Current Order ({cart.length})
              </h2>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Your cart is empty</p>
                <p className="text-sm text-gray-500">Add items from the menu to start</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${getSubtotal().toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discount}%)</span>
                      <span>-${getDiscountAmount().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Tax ({tax}%)</span>
                    <span>${getTaxAmount().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-900 border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Discount Input */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="0"
                  />
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full mt-6 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Checkout Modal */}
        {showCheckout && (
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
                    <h2 className="text-xl font-semibold text-gray-900">Checkout</h2>
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Customer Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Customer Name
                        </label>
                        <input
                          type="text"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Enter customer name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order Type
                      </label>
                      <div className="flex gap-4">
                        {[
                          { value: 'dine_in', label: 'Dine In', icon: Utensils },
                          { value: 'takeaway', label: 'Takeaway', icon: Package },
                          { value: 'delivery', label: 'Delivery', icon: Car }
                        ].map(type => (
                          <button
                            key={type.value}
                            onClick={() => setCustomerInfo({...customerInfo, order_type: type.value})}
                            className={`flex-1 p-3 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                              customerInfo.order_type === type.value
                                ? 'border-orange-500 bg-orange-50 text-orange-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <type.icon className="w-4 h-4" />
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {customerInfo.order_type === 'dine_in' && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Table Number
                        </label>
                        <input
                          type="number"
                          value={customerInfo.table_number}
                          onChange={(e) => setCustomerInfo({...customerInfo, table_number: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Enter table number"
                        />
                      </div>
                    )}

                    {customerInfo.order_type === 'delivery' && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Delivery Address
                        </label>
                        <textarea
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Enter delivery address"
                        />
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${getSubtotal().toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount ({discount}%)</span>
                            <span>-${getDiscountAmount().toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Tax ({tax}%)</span>
                          <span>${getTaxAmount().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold border-t border-gray-300 pt-2">
                          <span>Total</span>
                          <span>${getTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Back to Cart
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
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
                className="bg-white rounded-xl shadow-2xl max-w-md w-full"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Payment</h2>
                    <button
                      onClick={() => setShowPaymentModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-2xl font-bold text-gray-900">
                      ${getTotal().toFixed(2)}
                    </h3>
                    <p className="text-gray-600">Total Amount</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'cash', label: 'Cash', icon: DollarSign },
                        { value: 'card', label: 'Card', icon: CreditCard }
                      ].map(method => (
                        <button
                          key={method.value}
                          onClick={() => setPaymentMethod(method.value)}
                          className={`p-3 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                            paymentMethod === method.value
                              ? 'border-orange-500 bg-orange-50 text-orange-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <method.icon className="w-4 h-4" />
                          {method.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {paymentMethod === 'cash' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount Received
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={amountReceived}
                        onChange={(e) => setAmountReceived(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter amount received"
                      />
                      {amountReceived && parseFloat(amountReceived) >= getTotal() && (
                        <div className="mt-2 p-2 bg-green-50 rounded">
                          <p className="text-green-800 font-medium">
                            Change: ${getChange().toFixed(2)}
                          </p>
                        </div>
                      )}
                      {amountReceived && parseFloat(amountReceived) < getTotal() && (
                        <div className="mt-2 p-2 bg-red-50 rounded">
                          <p className="text-red-800 font-medium">
                            Insufficient amount
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={processOrder}
                    disabled={paymentMethod === 'cash' && (!amountReceived || parseFloat(amountReceived) < getTotal())}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Complete Order
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
  );
};

export default POSSystem;