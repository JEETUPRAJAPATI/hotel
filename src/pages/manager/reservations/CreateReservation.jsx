import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, Save, ArrowLeft, Users, User, Mail, Phone, MapPin, 
  Building, Globe, CreditCard, DollarSign, Bed, Clock, UserPlus,
  Home, Star, Plane, Train, Car, Upload, Plus, X, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const CreateReservation = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('guest');
  const [guestType, setGuestType] = useState('existing'); // 'existing' or 'new'
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Guest Information - Basic Details
    title: 'Mr',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: 'male',
    date_of_birth: '',
    nationality: 'India',
    guest_category: 'Regular',
    
    // Identification
    id_type: 'Passport',
    id_number: '',
    id_expiry_date: '',
    id_document: null,
    
    // Stay Information
    check_in_date: '',
    check_out_date: '',
    adults: 1,
    children: 0,
    infants: 0,
    extra_bed: 0,
    reservation_type: 'Confirm',
    release_date: '',
    
    // Arrival Information
    arrival_mode: 'Air',
    arrival_flight_train: '',
    arrival_date: '',
    arrival_time: '',
    assign_arrival_task: false,
    
    // Departure Information
    departure_mode: 'Air',
    departure_flight_train: '',
    departure_date: '',
    departure_time: '',
    
    // General Information
    source_reference: 'Walk-In',
    purpose_of_stay: 'Leisure',
    bill_to: 'Guest',
    payment_type: 'Cash',
    payment_method: '',
    advance_amount: 0,
    payment_note: '',
    
    // Room Details
    room_type: '',
    room_number: '',
    rate_plan: 'Standard',
    base_rate: 0,
    discount: 0,
    extra_charges: 0,
    
    // Additional Services
    valet_parking: false,
    airport_pickup: false,
    early_checkin: false,
    late_checkout: false,
    
    // Special Instructions
    special_instructions: []
  });

  const [folioCharges, setFolioCharges] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState([]);

  // Calculate nights
  const calculateNights = () => {
    if (formData.check_in_date && formData.check_out_date) {
      const checkIn = new Date(formData.check_in_date);
      const checkOut = new Date(formData.check_out_date);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  // Calculate billing summary
  const calculateBilling = () => {
    const nights = calculateNights();
    const roomCharges = formData.base_rate * nights;
    const discountAmount = (roomCharges * formData.discount) / 100;
    const subtotal = roomCharges - discountAmount;
    const taxAmount = (subtotal * 12) / 100; // 12% tax
    const extraChargesTotal = parseFloat(formData.extra_charges || 0);
    const totalAmount = subtotal + taxAmount + extraChargesTotal;
    const amountPaid = parseFloat(formData.advance_amount || 0);
    const balanceDue = totalAmount - amountPaid;

    return {
      nights,
      roomCharges,
      discountAmount,
      subtotal,
      taxAmount,
      extraChargesTotal,
      totalAmount,
      amountPaid,
      balanceDue
    };
  };

  const billing = calculateBilling();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, id_document: file }));
      toast.success('Document uploaded');
    }
  };

  const addFolioCharge = () => {
    const newCharge = {
      id: Date.now(),
      posting_date: new Date().toISOString().split('T')[0],
      description: '',
      amount: 0,
      category: 'Room'
    };
    setFolioCharges([...folioCharges, newCharge]);
  };

  const removeFolioCharge = (id) => {
    setFolioCharges(folioCharges.filter(charge => charge.id !== id));
  };

  const addSpecialInstruction = () => {
    const newInstruction = {
      id: Date.now(),
      department: 'Front Office',
      description: '',
      priority: 'Normal'
    };
    setSpecialInstructions([...specialInstructions, newInstruction]);
  };

  const removeSpecialInstruction = (id) => {
    setSpecialInstructions(specialInstructions.filter(inst => inst.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.first_name || !formData.last_name) {
        toast.error('Please fill in required fields');
        setLoading(false);
        return;
      }

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Reservation created successfully!');
      navigate('/manager/reservations');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Fixed */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/manager/reservations')}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Reservation</h1>
            <p className="text-sm text-gray-500">Fill in the details to create a reservation</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 p-6 max-w-[1920px] mx-auto items-start">
        {/* Main Form Area - Scrollable */}
        <div className="flex-1 max-w-5xl">
          <div className="space-y-6 pb-8">
            {/* Guest Type Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setGuestType('existing')}
                  className={`flex flex-col items-center justify-center py-4 px-6 rounded-xl border-2 transition-all ${
                    guestType === 'existing'
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-6 h-6 mb-2" />
                  <div className="font-semibold">Existing Guest</div>
                </button>
                <button
                  type="button"
                  onClick={() => setGuestType('new')}
                  className={`flex flex-col items-center justify-center py-4 px-6 rounded-xl border-2 transition-all ${
                    guestType === 'new'
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                  }`}
                >
                  <UserPlus className="w-6 h-6 mb-2" />
                  <div className="font-semibold">New Guest</div>
                </button>
              </div>
            </div>

            {/* Existing Guest Search */}
            {guestType === 'existing' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Search Existing Guest</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                    Search
                  </button>
                </div>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. Guest Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Guest Information</h2>
                </div>

                {/* Basic Details */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Basic Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                      <select
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        required
                      >
                        <option value="Mr">Mr</option>
                        <option value="Ms">Ms</option>
                        <option value="Mrs">Mrs</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Guest Category</label>
                      <select
                        name="guest_category"
                        value={formData.guest_category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="Regular">Regular</option>
                        <option value="VIP">VIP</option>
                        <option value="Corporate">Corporate</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Identification */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Identification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ID Type</label>
                      <select
                        name="id_type"
                        value={formData.id_type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="Passport">Passport</option>
                        <option value="Aadhaar">Aadhaar</option>
                        <option value="National ID">National ID</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
                      <input
                        type="text"
                        name="id_number"
                        value={formData.id_number}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ID Expiry Date</label>
                      <input
                        type="date"
                        name="id_expiry_date"
                        value={formData.id_expiry_date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload ID Document</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="id-upload"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <label
                          htmlFor="id-upload"
                          className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 w-full"
                        >
                          <Upload className="w-4 h-4" />
                          {formData.id_document ? 'File Selected' : 'Choose File'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Stay Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Stay Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-In Date *</label>
                    <input
                      type="date"
                      name="check_in_date"
                      value={formData.check_in_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-Out Date *</label>
                    <input
                      type="date"
                      name="check_out_date"
                      value={formData.check_out_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Nights</label>
                    <input
                      type="text"
                      value={calculateNights()}
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adults</label>
                    <input
                      type="number"
                      name="adults"
                      value={formData.adults}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Children</label>
                    <input
                      type="number"
                      name="children"
                      value={formData.children}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Infants</label>
                    <input
                      type="number"
                      name="infants"
                      value={formData.infants}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Extra Bed</label>
                    <input
                      type="number"
                      name="extra_bed"
                      value={formData.extra_bed}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reservation Type</label>
                    <select
                      name="reservation_type"
                      value={formData.reservation_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="Confirm">Confirm</option>
                      <option value="Tentative">Tentative</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Release Date</label>
                    <input
                      type="date"
                      name="release_date"
                      value={formData.release_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Arrival/Departure Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Plane className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Arrival / Departure Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Arrival */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Arrival</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Arrival Mode</label>
                        <select
                          name="arrival_mode"
                          value={formData.arrival_mode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="Air">Air</option>
                          <option value="Train">Train</option>
                          <option value="Car">Car</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Flight/Train No</label>
                        <input
                          type="text"
                          name="arrival_flight_train"
                          value={formData.arrival_flight_train}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Arrival Date</label>
                        <input
                          type="date"
                          name="arrival_date"
                          value={formData.arrival_date}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Arrival Time</label>
                        <input
                          type="time"
                          name="arrival_time"
                          value={formData.arrival_time}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="assign_arrival_task"
                          checked={formData.assign_arrival_task}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">Assign Task</label>
                      </div>
                    </div>
                  </div>

                  {/* Departure */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Departure</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Departure Mode</label>
                        <select
                          name="departure_mode"
                          value={formData.departure_mode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="Air">Air</option>
                          <option value="Train">Train</option>
                          <option value="Car">Car</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Flight/Train No</label>
                        <input
                          type="text"
                          name="departure_flight_train"
                          value={formData.departure_flight_train}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                        <input
                          type="date"
                          name="departure_date"
                          value={formData.departure_date}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Departure Time</label>
                        <input
                          type="time"
                          name="departure_time"
                          value={formData.departure_time}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. General Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">General Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Source/Reference</label>
                    <select
                      name="source_reference"
                      value={formData.source_reference}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="OTA">OTA</option>
                      <option value="Walk-In">Walk-In</option>
                      <option value="Agent">Agent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purpose of Stay</label>
                    <select
                      name="purpose_of_stay"
                      value={formData.purpose_of_stay}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="Business">Business</option>
                      <option value="Leisure">Leisure</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bill To</label>
                    <select
                      name="bill_to"
                      value={formData.bill_to}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="Guest">Guest</option>
                      <option value="Company">Company</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                    <select
                      name="payment_type"
                      value={formData.payment_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <input
                      type="text"
                      name="payment_method"
                      value={formData.payment_method}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Advance Amount</label>
                    <input
                      type="number"
                      name="advance_amount"
                      value={formData.advance_amount}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Note</label>
                    <textarea
                      name="payment_note"
                      value={formData.payment_note}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Room Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Bed className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Room Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Type *</label>
                    <select
                      name="room_type"
                      value={formData.room_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      required
                    >
                      <option value="">Select Room Type</option>
                      <option value="Standard">Standard</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Suite">Suite</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                    <select
                      name="room_number"
                      value={formData.room_number}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="">Select Room</option>
                      <option value="101">101</option>
                      <option value="102">102</option>
                      <option value="103">103</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rate Plan</label>
                    <select
                      name="rate_plan"
                      value={formData.rate_plan}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Rate (Per Night) *</label>
                    <input
                      type="number"
                      name="base_rate"
                      value={formData.base_rate}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Extra Charges</label>
                    <input
                      type="number"
                      name="extra_charges"
                      value={formData.extra_charges}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* 6. Folio Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-yellow-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Folio Details</h2>
                  </div>
                  <button
                    type="button"
                    onClick={addFolioCharge}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Charge
                  </button>
                </div>
                
                {folioCharges.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No charges added yet</p>
                ) : (
                  <div className="space-y-3">
                    {folioCharges.map((charge) => (
                      <div key={charge.id} className="flex gap-3 items-end">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Posting Date</label>
                          <input
                            type="date"
                            value={charge.posting_date}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <input
                            type="text"
                            placeholder="Charge description"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                          <input
                            type="number"
                            placeholder="0"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white">
                            <option value="Room">Room</option>
                            <option value="F&B">F&B</option>
                            <option value="Laundry">Laundry</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFolioCharge(charge.id)}
                          className="px-3 py-2.5 text-red-600 hover:text-red-700 border border-red-300 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 7. Special Instructions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-pink-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Special Instructions</h2>
                  </div>
                  <button
                    type="button"
                    onClick={addSpecialInstruction}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Instruction
                  </button>
                </div>
                
                {specialInstructions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No instructions added yet</p>
                ) : (
                  <div className="space-y-3">
                    {specialInstructions.map((instruction) => (
                      <div key={instruction.id} className="flex gap-3 items-end">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                          <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white">
                            <option value="HK">Housekeeping</option>
                            <option value="Front Office">Front Office</option>
                            <option value="F&B">F&B</option>
                          </select>
                        </div>
                        <div className="flex-[2]">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <input
                            type="text"
                            placeholder="Instruction description"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                          <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white">
                            <option value="Normal">Normal</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSpecialInstruction(instruction.id)}
                          className="px-3 py-2.5 text-red-600 hover:text-red-700 border border-red-300 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 9. Additional Services */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-teal-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Additional Services</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="valet_parking"
                      checked={formData.valet_parking}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">Valet Parking</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="airport_pickup"
                      checked={formData.airport_pickup}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">Airport Pickup</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="early_checkin"
                      checked={formData.early_checkin}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">Early Check-In</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="late_checkout"
                      checked={formData.late_checkout}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">Late Check-Out</label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/manager/reservations')}
                    className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Reservation'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Sidebar - Billing Summary (Sticky) */}
        <aside className="w-96 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Billing Summary</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Nights:</span>
                <span className="font-semibold text-gray-900">{billing.nights}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Base Rate:</span>
                <span className="font-semibold text-gray-900">₹{formData.base_rate || 0}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Room Charges:</span>
                <span className="font-semibold text-gray-900">₹{billing.roomCharges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Discount ({formData.discount}%):</span>
                <span className="font-semibold text-red-600">-₹{billing.discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-900">₹{billing.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Tax (12%):</span>
                <span className="font-semibold text-gray-900">₹{billing.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Extra Charges:</span>
                <span className="font-semibold text-gray-900">₹{billing.extraChargesTotal.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-gray-200 mt-4 pt-4">
                <div className="flex justify-between py-2 bg-blue-50 px-3 rounded-lg">
                  <span className="font-semibold text-gray-900">Total Amount:</span>
                  <span className="font-bold text-lg text-blue-600">₹{billing.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Amount Paid:</span>
                <span className="font-semibold text-green-600">₹{billing.amountPaid.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-gray-200 mt-4 pt-4">
                <div className="flex justify-between py-2 bg-red-50 px-3 rounded-lg">
                  <span className="font-semibold text-gray-900">Balance Due:</span>
                  <span className="font-bold text-lg text-red-600">₹{billing.balanceDue.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Guest Summary */}
            <div className="mt-6 pt-6 border-t-2 border-gray-200">
              <h4 className="font-semibold mb-4 text-gray-900">Guest Summary</h4>
              <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between py-1">
                  <span className="text-sm text-gray-600">Guest:</span>
                  <span className="font-medium text-sm text-gray-900">{formData.first_name || '-'} {formData.last_name || ''}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="font-medium text-xs text-gray-900">{formData.email || '-'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="font-medium text-sm text-gray-900">{formData.phone || '-'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-sm text-gray-600">Adults:</span>
                  <span className="font-medium text-sm text-gray-900">{formData.adults}</span>
                </div>
                {formData.children > 0 && (
                  <div className="flex justify-between py-1">
                    <span className="text-sm text-gray-600">Children:</span>
                    <span className="font-medium text-sm text-gray-900">{formData.children}</span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-sm text-gray-600">Room Type:</span>
                  <span className="font-medium text-sm text-gray-900">{formData.room_type || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CreateReservation;
