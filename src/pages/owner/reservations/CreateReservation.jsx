import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  UserPlus,
  Home,
  Star,
  Plane
} from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CreateReservation = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Guest Information
    guest_type: 'existing', // 'existing' or 'new'
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
    
    // Reservation Details
    check_in_date: '',
    check_out_date: '',
    num_adults: 1,
    num_children: 0,
    special_requests: '',
    
    // Room & Pricing
    room_type: '',
    room_number: '',
    rate_plan: 'standard',
    base_rate: '',
    taxes: '',
    total_amount: '',
    
    // Room Details
    room_view: '',
    bed_type: '',
    room_floor: '',
    room_size: '',
    room_amenities: [],
    room_notes: '',
    
    // Payment & Deposit
    deposit_amount: '',
    payment_method: 'cash',
    payment_status: 'pending',
    
    // Additional
    source: 'direct',
    assigned_to: '',
    notes: '',
    
    // General Information
    reservation_status: 'confirmed',
    priority_level: 'normal',
    guest_category: 'regular',
    booking_reference: '',
    arrival_time: '',
    departure_time: '',
    marketing_source: '',
    communication_preference: 'email',
    
    // Payment Information
    billing_name: '',
    billing_address: '',
    billing_city: '',
    billing_state: '',
    billing_country: 'India',
    billing_postal: '',
    card_number: '',
    card_expiry: '',
    card_cvv: '',
    card_holder_name: '',
    
    // Special Requests
    dietary_preferences: '',
    accessibility_needs: '',
    bed_preference: '',
    room_location_preference: '',
    arrival_instructions: '',
    
    // Additional Services
    airport_transfer: false,
    airport_transfer_type: '',
    flight_details: '',
    spa_services: false,
    spa_package: '',
    restaurant_booking: false,
    restaurant_preference: '',
    laundry_service: false,
    tour_packages: false,
    
    // Emergency Contact
    emergency_name: '',
    emergency_relationship: '',
    emergency_phone: '',
    emergency_email: '',
    
    // Company Information
    is_corporate: false,
    company_name: '',
    company_gst: '',
    company_address: '',
    company_contact_person: '',
    company_email: ''
  });
  
  const [loading, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [availableRooms, setAvailableRooms] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Mock data
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Auto-calculate totals when rates change
    if (name === 'base_rate') {
      calculateTotals(value);
    }

    // Check availability when dates or room type change
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
      deposit_amount: (total * 0.3).toFixed(2) // 30% deposit
    }));
  };

  const checkRoomAvailability = async () => {
    if (!formData.check_in_date || !formData.check_out_date || !formData.room_type) return;
    
    try {
      setCheckingAvailability(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock available rooms
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

    // Guest validation
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

    // Reservation validation
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
      
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Reservation created successfully!');
      navigate('/owner/reservations');
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast.error('Failed to create reservation');
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
            <h1 className="text-2xl font-bold text-gray-900">Create New Reservation</h1>
            <p className="text-gray-600">Add a new hotel reservation</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Guest Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Guest Information</h2>
            </div>

            <div className="space-y-4">
              {/* Guest Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  {/* New Guest Form */}
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

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ID Number
                      </label>
                      <input
                        type="text"
                        name="guest_id_number"
                        value={formData.guest_id_number}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter ID number"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        name="guest_address"
                        value={formData.guest_address}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        placeholder="Enter complete address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="guest_city"
                          value={formData.guest_city}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter city"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="guest_state"
                        value={formData.guest_state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter state"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="guest_country"
                          value={formData.guest_country}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter country"
                        />
                      </div>
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
                    min={new Date().toISOString().split('T')[0]}
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
                    min={formData.check_in_date || new Date().toISOString().split('T')[0]}
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
                    disabled={availableRooms.length === 0}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.room_number ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    } ${availableRooms.length === 0 ? 'bg-gray-100' : ''}`}
                  >
                    <option value="">
                      {checkingAvailability ? 'Checking availability...' : 
                       availableRooms.length === 0 ? 'Select dates and room type first' : 'Select room'}
                    </option>
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

          {/* Section 4: Room Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Home className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Room Details</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room View
                  </label>
                  <select
                    name="room_view"
                    value={formData.room_view || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select room view</option>
                    <option value="city">City View</option>
                    <option value="garden">Garden View</option>
                    <option value="pool">Pool View</option>
                    <option value="mountain">Mountain View</option>
                    <option value="ocean">Ocean View</option>
                    <option value="courtyard">Courtyard View</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bed Type
                  </label>
                  <select
                    name="bed_type"
                    value={formData.bed_type || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select bed type</option>
                    <option value="single">Single Bed</option>
                    <option value="twin">Twin Beds</option>
                    <option value="double">Double Bed</option>
                    <option value="queen">Queen Bed</option>
                    <option value="king">King Bed</option>
                    <option value="sofa_bed">Sofa Bed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Floor
                  </label>
                  <select
                    name="room_floor"
                    value={formData.room_floor || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select floor</option>
                    <option value="ground">Ground Floor</option>
                    <option value="1">1st Floor</option>
                    <option value="2">2nd Floor</option>
                    <option value="3">3rd Floor</option>
                    <option value="4">4th Floor</option>
                    <option value="5">5th Floor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Size (sq ft)
                  </label>
                  <input
                    type="number"
                    name="room_size"
                    value={formData.room_size || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter room size"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Wi-Fi', 'Air Conditioning', 'TV', 'Mini Bar', 'Safe', 'Balcony',
                    'Room Service', 'Coffee Maker', 'Iron & Board', 'Hair Dryer',
                    'Bathtub', 'Work Desk'
                  ].map(amenity => (
                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.room_amenities?.includes(amenity) || false}
                        onChange={(e) => {
                          const amenities = formData.room_amenities || [];
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              room_amenities: [...amenities, amenity]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              room_amenities: amenities.filter(a => a !== amenity)
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Room Notes
                </label>
                <textarea
                  name="room_notes"
                  value={formData.room_notes || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Any specific room requirements or notes"
                />
              </div>
            </div>
          </motion.div>

        
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">

                 {/* Booking Settings & Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Booking Settings & Details
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reservation Status
                    </label>
                    <select
                      name="reservation_status"
                      value={formData.reservation_status || 'confirmed'}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="waitlist">Waitlist</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <select
                      name="priority_level"
                      value={formData.priority_level || 'normal'}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="low">Low Priority</option>
                      <option value="normal">Normal Priority</option>
                      <option value="high">High Priority</option>
                      <option value="vip">VIP</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guest Category
                    </label>
                    <select
                      name="guest_category"
                      value={formData.guest_category || 'regular'}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="regular">Regular Guest</option>
                      <option value="corporate">Corporate</option>
                      <option value="group">Group Booking</option>
                      <option value="loyalty">Loyalty Member</option>
                      <option value="travel_agent">Travel Agent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Booking Source
                    </label>
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="direct">Direct Booking</option>
                      <option value="online">Online Platform</option>
                      <option value="phone">Phone Booking</option>
                      <option value="agent">Travel Agent</option>
                      <option value="corporate">Corporate Booking</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arrival Time
                    </label>
                    <input
                      type="time"
                      name="arrival_time"
                      value={formData.arrival_time || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departure Time
                    </label>
                    <input
                      type="time"
                      name="departure_time"
                      value={formData.departure_time || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assigned Staff
                    </label>
                    <select
                      name="assigned_to"
                      value={formData.assigned_to}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select staff member</option>
                      {mockStaff.map(staff => (
                        <option key={staff.id} value={staff.id}>
                          {staff.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Communication Preference
                    </label>
                    <select
                      name="communication_preference"
                      value={formData.communication_preference || 'email'}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="sms">SMS</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="no_contact">No Contact</option>
                    </select>
                  </div>
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
                    placeholder="Internal notes for staff members"
                  />
                </div>
              </div>
            </div>
          </motion.div>
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
                    Payment Method
                  </label>
                  <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    Assign to Staff
                  </label>
                  <select
                    name="assigned_to"
                    value={formData.assigned_to}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select staff member</option>
                    {mockStaff.map(staff => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Booking Source
                  </label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="direct">Direct</option>
                    <option value="online">Online</option>
                    <option value="phone">Phone</option>
                    <option value="agent">Travel Agent</option>
                    <option value="corporate">Corporate</option>
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
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create Reservation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateReservation;