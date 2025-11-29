import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Save, 
  ArrowLeft, 
  Users,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  CreditCard,
  DollarSign,
  Bed,
  Clock,
  UserPlus
} from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const EditReservation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    guest_type: 'existing',
    guest_id: '',
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    guest_address: '',
    guest_city: '',
    guest_state: '',
    guest_country: 'India',
    guest_id_type: 'passport',
    guest_id_number: '',
    check_in_date: '',
    check_out_date: '',
    num_adults: 1,
    num_children: 0,
    special_requests: '',
    room_type: '',
    room_number: '',
    rate_plan: 'standard',
    base_rate: '',
    taxes: '',
    total_amount: '',
    deposit_amount: '',
    payment_method: 'cash',
    payment_status: 'pending',
    source: 'direct',
    assigned_to: '',
    notes: '',
    status: 'confirmed'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [availableRooms, setAvailableRooms] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Mock reservation data
  const mockReservation = {
    id: 1,
    guest_type: 'existing',
    guest_id: '1',
    guest_name: 'John Smith',
    guest_email: 'john@example.com',
    guest_phone: '+91 98765 43210',
    guest_address: '123 Main Street',
    guest_city: 'Mumbai',
    guest_state: 'Maharashtra',
    guest_country: 'India',
    guest_id_type: 'passport',
    guest_id_number: 'P1234567',
    check_in_date: '2024-03-15',
    check_out_date: '2024-03-18',
    num_adults: 2,
    num_children: 1,
    special_requests: 'Late check-in requested',
    room_type: 'deluxe',
    room_number: '101',
    rate_plan: 'standard',
    base_rate: '5000',
    taxes: '900',
    total_amount: '5900',
    deposit_amount: '1770',
    payment_method: 'card',
    payment_status: 'paid',
    source: 'online',
    assigned_to: '1',
    notes: 'VIP guest',
    status: 'confirmed'
  };

  const mockGuests = [
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+91 98765 43210' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+91 87654 32109' },
    { id: 3, name: 'Michael Chen', email: 'michael@example.com', phone: '+91 76543 21098' }
  ];

  const mockRoomTypes = [
    { id: 'deluxe', name: 'Deluxe Room', base_rate: 5000 },
    { id: 'suite', name: 'Executive Suite', base_rate: 8000 },
    { id: 'presidential', name: 'Presidential Suite', base_rate: 15000 },
    { id: 'standard', name: 'Standard Room', base_rate: 3000 }
  ];

  const mockStaff = [
    { id: 1, name: 'Alice Manager' },
    { id: 2, name: 'Bob Receptionist' },
    { id: 3, name: 'Carol Supervisor' }
  ];

  useEffect(() => {
    loadReservationData();
  }, [id]);

  const loadReservationData = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormData(mockReservation);
      
      // Load available rooms for current selection
      const rooms = [
        { number: '101', floor: 1, status: 'available' },
        { number: '102', floor: 1, status: 'available' },
        { number: '201', floor: 2, status: 'available' }
      ];
      setAvailableRooms(rooms);
    } catch (error) {
      console.error('Error loading reservation:', error);
      toast.error('Failed to load reservation data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (name === 'base_rate') {
      calculateTotals(value);
    }

    if (['check_in_date', 'check_out_date', 'room_type'].includes(name)) {
      checkRoomAvailability();
    }
  };

  const handleGuestSelect = (guestId) => {
    const guest = mockGuests.find(g => g.id === parseInt(guestId));
    if (guest) {
      setFormData(prev => ({
        ...prev,
        guest_id: guestId,
        guest_name: guest.name,
        guest_email: guest.email,
        guest_phone: guest.phone
      }));
    }
  };

  const handleRoomTypeChange = (roomTypeId) => {
    const roomType = mockRoomTypes.find(rt => rt.id === roomTypeId);
    if (roomType) {
      setFormData(prev => ({
        ...prev,
        room_type: roomTypeId,
        base_rate: roomType.base_rate.toString()
      }));
      calculateTotals(roomType.base_rate);
    }
  };

  const calculateTotals = (baseRate) => {
    const rate = parseFloat(baseRate) || 0;
    const taxes = rate * 0.18; // 18% GST
    const total = rate + taxes;
    
    setFormData(prev => ({
      ...prev,
      taxes: taxes.toFixed(2),
      total_amount: total.toFixed(2),
      deposit_amount: prev.deposit_amount || (total * 0.3).toFixed(2)
    }));
  };

  const checkRoomAvailability = async () => {
    if (!formData.check_in_date || !formData.check_out_date || !formData.room_type) return;
    
    try {
      setCheckingAvailability(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const rooms = [
        { number: '101', floor: 1, status: 'available' },
        { number: '102', floor: 1, status: 'available' },
        { number: '201', floor: 2, status: 'available' },
        { number: '202', floor: 2, status: 'maintenance' }
      ].filter(room => room.status === 'available');
      
      setAvailableRooms(rooms);
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Failed to check room availability');
    } finally {
      setCheckingAvailability(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.guest_type === 'existing' && !formData.guest_id) {
      newErrors.guest_id = 'Please select a guest';
    }
    
    if (formData.guest_type === 'new') {
      if (!formData.guest_name.trim()) newErrors.guest_name = 'Guest name is required';
      if (!formData.guest_email.trim() || !/^\S+@\S+\.\S+$/.test(formData.guest_email)) {
        newErrors.guest_email = 'Valid email is required';
      }
      if (!formData.guest_phone.trim()) newErrors.guest_phone = 'Phone number is required';
    }

    if (!formData.check_in_date) newErrors.check_in_date = 'Check-in date is required';
    if (!formData.check_out_date) newErrors.check_out_date = 'Check-out date is required';
    if (formData.check_in_date && formData.check_out_date) {
      if (new Date(formData.check_in_date) >= new Date(formData.check_out_date)) {
        newErrors.check_out_date = 'Check-out date must be after check-in date';
      }
    }
    if (!formData.room_type) newErrors.room_type = 'Room type is required';
    if (!formData.room_number) newErrors.room_number = 'Please select a room';
    if (!formData.base_rate || formData.base_rate <= 0) {
      newErrors.base_rate = 'Valid room rate is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    try {
      setSaving(true);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Reservation updated successfully!');
      navigate('/owner/reservations');
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast.error('Failed to update reservation');
    } finally {
      setSaving(false);
    }
  };

  const calculateNights = () => {
    if (formData.check_in_date && formData.check_out_date) {
      const checkIn = new Date(formData.check_in_date);
      const checkOut = new Date(formData.check_out_date);
      const diffTime = Math.abs(checkOut - checkIn);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/owner/reservations')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Reservation</h1>
            <p className="text-gray-600">Update reservation details</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Guest Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Guest Information</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Guest Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="guest_type"
                      value="existing"
                      checked={formData.guest_type === 'existing'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Existing Guest
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="guest_type"
                      value="new"
                      checked={formData.guest_type === 'new'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    New Guest
                  </label>
                </div>
              </div>

              {formData.guest_type === 'existing' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Guest *
                  </label>
                  <select
                    name="guest_id"
                    value={formData.guest_id}
                    onChange={(e) => handleGuestSelect(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.guest_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a guest</option>
                    {mockGuests.map(guest => (
                      <option key={guest.id} value={guest.id}>
                        {guest.name} - {guest.email}
                      </option>
                    ))}
                  </select>
                  {errors.guest_id && <p className="text-red-500 text-sm mt-1">{errors.guest_id}</p>}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="guest_name"
                          value={formData.guest_name}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.guest_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Enter guest name"
                        />
                      </div>
                      {errors.guest_name && <p className="text-red-500 text-sm mt-1">{errors.guest_name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="guest_email"
                          value={formData.guest_email}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.guest_email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Enter email address"
                        />
                      </div>
                      {errors.guest_email && <p className="text-red-500 text-sm mt-1">{errors.guest_email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="guest_phone"
                          value={formData.guest_phone}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.guest_phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Enter phone number"
                        />
                      </div>
                      {errors.guest_phone && <p className="text-red-500 text-sm mt-1">{errors.guest_phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ID Type
                      </label>
                      <select
                        name="guest_id_type"
                        value={formData.guest_id_type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="passport">Passport</option>
                        <option value="driving_license">Driving License</option>
                        <option value="aadhaar">Aadhaar Card</option>
                        <option value="pan">PAN Card</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Section 2: Reservation Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-green-50 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Reservation Details</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    name="check_in_date"
                    value={formData.check_in_date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.check_in_date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.check_in_date && <p className="text-red-500 text-sm mt-1">{errors.check_in_date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    name="check_out_date"
                    value={formData.check_out_date}
                    onChange={handleInputChange}
                    min={formData.check_in_date}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.check_out_date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.check_out_date && <p className="text-red-500 text-sm mt-1">{errors.check_out_date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adults
                  </label>
                  <select
                    name="num_adults"
                    value={formData.num_adults}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Children
                  </label>
                  <select
                    name="num_children"
                    value={formData.num_children}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {[0,1,2,3,4].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  name="special_requests"
                  value={formData.special_requests}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Any special requests or notes"
                />
              </div>
            </div>
          </motion.div>

          {/* Section 3: Room & Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Bed className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Room & Pricing</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Type *
                  </label>
                  <select
                    name="room_type"
                    value={formData.room_type}
                    onChange={(e) => handleRoomTypeChange(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.room_type ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select room type</option>
                    {mockRoomTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name} - ₹{type.base_rate}/night
                      </option>
                    ))}
                  </select>
                  {errors.room_type && <p className="text-red-500 text-sm mt-1">{errors.room_type}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Number *
                  </label>
                  <select
                    name="room_number"
                    value={formData.room_number}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.room_number ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select room</option>
                    {availableRooms.map(room => (
                      <option key={room.number} value={room.number}>
                        Room {room.number} (Floor {room.floor})
                      </option>
                    ))}
                  </select>
                  {errors.room_number && <p className="text-red-500 text-sm mt-1">{errors.room_number}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate Plan
                  </label>
                  <select
                    name="rate_plan"
                    value={formData.rate_plan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="standard">Standard Rate</option>
                    <option value="corporate">Corporate Rate</option>
                    <option value="government">Government Rate</option>
                    <option value="group">Group Rate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Rate (per night) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="base_rate"
                      value={formData.base_rate}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.base_rate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter rate"
                    />
                  </div>
                  {errors.base_rate && <p className="text-red-500 text-sm mt-1">{errors.base_rate}</p>}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-8">
          {/* Reservation Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-orange-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Booking Summary</h2>
            </div>

            <div className="space-y-4">
              {formData.check_in_date && formData.check_out_date && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="font-medium">{calculateNights()} night(s)</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(formData.check_in_date).toLocaleDateString()} - {new Date(formData.check_out_date).toLocaleDateString()}
                  </div>
                </div>
              )}

              {formData.base_rate && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Room Rate</span>
                    <span className="font-medium">₹{formData.base_rate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taxes (18%)</span>
                    <span className="font-medium">₹{formData.taxes}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Total Amount</span>
                      <span className="font-bold text-lg text-blue-600">₹{formData.total_amount}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="checked_in">Checked In</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no_show">No Show</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deposit Amount
                  </label>
                  <input
                    type="number"
                    name="deposit_amount"
                    value={formData.deposit_amount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter deposit"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    name="payment_status"
                    value={formData.payment_status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partially Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Internal Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Internal notes for staff"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </form>

      {/* Bottom Action Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 rounded-lg shadow-sm">
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/owner/reservations')}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <LoadingSpinner size="sm" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Update Reservation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReservation;