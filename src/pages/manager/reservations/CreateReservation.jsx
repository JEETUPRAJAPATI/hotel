import React, { useState, useEffect } from 'react';
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
  CreditCard,
  DollarSign,
  Bed,
  Clock,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CreateManagerReservation = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Guest Information
    guest_type: 'new', // 'existing' or 'new'
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
    check_in_time: '14:00',
    check_out_time: '11:00',
    num_adults: 1,
    num_children: 0,
    special_requests: '',
    
    // Room & Pricing
    room_type: '',
    room_number: '',
    rate_plan: 'standard',
    base_rate: 0,
    extra_charges: 0,
    discount: 0,
    taxes: 0,
    total_amount: 0,
    
    // Payment
    deposit_amount: 0,
    payment_method: 'cash',
    payment_status: 'pending',
    
    // Additional
    source: 'direct',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [availableRooms, setAvailableRooms] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [step, setStep] = useState(1); // Multi-step form: 1=Guest, 2=Stay, 3=Room&Payment, 4=Review

  // Mock data - Manager sees only their hotel's resources
  const mockGuests = [
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+91 98765 43210' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+91 87654 32109' },
    { id: 3, name: 'Michael Chen', email: 'michael@example.com', phone: '+91 76543 21098' }
  ];

  // Manager Restriction: Fixed base rates, cannot be modified beyond 5%
  const mockRoomTypes = [
    { 
      id: 'standard', 
      name: 'Standard Room', 
      base_rate: 3000,
      max_discount: 5, // Manager can give max 5% discount
      capacity: { adults: 2, children: 1 }
    },
    { 
      id: 'deluxe', 
      name: 'Deluxe Room', 
      base_rate: 5000,
      max_discount: 5,
      capacity: { adults: 2, children: 2 }
    },
    { 
      id: 'suite', 
      name: 'Executive Suite', 
      base_rate: 8000,
      max_discount: 5,
      capacity: { adults: 3, children: 2 }
    },
    { 
      id: 'family', 
      name: 'Family Room', 
      base_rate: 6500,
      max_discount: 5,
      capacity: { adults: 4, children: 2 }
    }
  ];

  const TAX_RATE = 0.18; // 18% GST - Manager cannot modify

  useEffect(() => {
    // Auto-calculate totals when relevant fields change
    calculateTotals();
  }, [formData.base_rate, formData.extra_charges, formData.discount, formData.check_in_date, formData.check_out_date]);

  const calculateTotals = () => {
    const nights = calculateNights();
    if (nights <= 0) return;

    const baseTotal = formData.base_rate * nights;
    const withExtras = baseTotal + parseFloat(formData.extra_charges || 0);
    const afterDiscount = withExtras - parseFloat(formData.discount || 0);
    const taxes = afterDiscount * TAX_RATE;
    const total = afterDiscount + taxes;

    setFormData(prev => ({
      ...prev,
      taxes: Math.round(taxes),
      total_amount: Math.round(total),
      deposit_amount: Math.round(total * 0.3) // Auto-suggest 30% deposit
    }));
  };

  const calculateNights = () => {
    if (!formData.check_in_date || !formData.check_out_date) return 0;
    const checkIn = new Date(formData.check_in_date);
    const checkOut = new Date(formData.check_out_date);
    const diff = checkOut - checkIn;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleGuestSelect = (guestId) => {
    if (guestId === '') {
      setFormData(prev => ({
        ...prev,
        guest_id: '',
        guest_name: '',
        guest_email: '',
        guest_phone: ''
      }));
      return;
    }

    const guest = mockGuests.find(g => g.id === parseInt(guestId));
    if (guest) {
      setFormData(prev => ({
        ...prev,
        guest_id: guestId,
        guest_name: guest.name,
        guest_email: guest.email,
        guest_phone: guest.phone,
        guest_type: 'existing'
      }));
    }
  };

  const handleRoomTypeChange = (roomTypeId) => {
    const roomType = mockRoomTypes.find(rt => rt.id === roomTypeId);
    if (roomType) {
      // Manager Restriction: Cannot modify base rate
      setFormData(prev => ({
        ...prev,
        room_type: roomTypeId,
        base_rate: roomType.base_rate
      }));
      
      // Check availability
      checkRoomAvailability(roomTypeId);
    }
  };

  const checkRoomAvailability = async (roomTypeId = formData.room_type) => {
    if (!formData.check_in_date || !formData.check_out_date || !roomTypeId) return;

    // Manager Restriction: Cannot book dates in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkInDate = new Date(formData.check_in_date);
    
    if (checkInDate < today) {
      toast.error('Cannot book dates in the past');
      setFormData(prev => ({ ...prev, check_in_date: '' }));
      return;
    }

    try {
      setCheckingAvailability(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock available rooms
      const mockAvailable = [
        { id: 101, number: '101', floor: 1, view: 'Garden' },
        { id: 102, number: '102', floor: 1, view: 'Pool' },
        { id: 201, number: '201', floor: 2, view: 'City' },
        { id: 202, number: '202', floor: 2, view: 'Garden' }
      ];
      
      setAvailableRooms(mockAvailable);
      toast.success(`${mockAvailable.length} rooms available`);
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Failed to check availability');
    } finally {
      setCheckingAvailability(false);
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      // Guest Information
      if (!formData.guest_name.trim()) newErrors.guest_name = 'Guest name is required';
      if (!formData.guest_email.trim()) newErrors.guest_email = 'Email is required';
      if (!formData.guest_phone.trim()) newErrors.guest_phone = 'Phone is required';
      if (!formData.guest_id_number.trim()) newErrors.guest_id_number = 'ID number is required';
    }

    if (currentStep === 2) {
      // Stay Information
      if (!formData.check_in_date) newErrors.check_in_date = 'Check-in date is required';
      if (!formData.check_out_date) newErrors.check_out_date = 'Check-out date is required';
      
      // Manager Restriction: Validate check-in date is not in past
      if (formData.check_in_date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkIn = new Date(formData.check_in_date);
        if (checkIn < today) {
          newErrors.check_in_date = 'Cannot book dates in the past';
        }
      }
      
      if (formData.check_in_date && formData.check_out_date) {
        const checkIn = new Date(formData.check_in_date);
        const checkOut = new Date(formData.check_out_date);
        if (checkOut <= checkIn) {
          newErrors.check_out_date = 'Check-out must be after check-in';
        }
      }
      
      if (formData.num_adults < 1) newErrors.num_adults = 'At least 1 adult required';
    }

    if (currentStep === 3) {
      // Room & Payment
      if (!formData.room_type) newErrors.room_type = 'Room type is required';
      
      // Manager Restriction: Validate discount doesn't exceed limit
      if (formData.discount > 0) {
        const roomType = mockRoomTypes.find(rt => rt.id === formData.room_type);
        if (roomType) {
          const maxDiscount = formData.base_rate * calculateNights() * (roomType.max_discount / 100);
          if (formData.discount > maxDiscount) {
            newErrors.discount = `Maximum discount allowed: ₹${maxDiscount} (${roomType.max_discount}%)`;
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;

    try {
      setLoading(true);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Reservation created successfully!');
      navigate('/manager/reservations');
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast.error('Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[
        { num: 1, label: 'Guest Info' },
        { num: 2, label: 'Stay Details' },
        { num: 3, label: 'Room & Payment' },
        { num: 4, label: 'Review' }
      ].map((s, index) => (
        <React.Fragment key={s.num}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step > s.num ? 'bg-green-600 text-white' :
              step === s.num ? 'bg-blue-600 text-white' :
              'bg-gray-200 text-gray-600'
            }`}>
              {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
            </div>
            <span className="text-xs mt-2 text-gray-600 font-medium">{s.label}</span>
          </div>
          {index < 3 && (
            <div className={`w-16 h-1 mx-2 rounded ${
              step > s.num ? 'bg-green-600' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderGuestInfo = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-medium">Select existing guest or create new</p>
          <p className="text-blue-700 mt-1">All guest information is required for check-in</p>
        </div>
      </div>

      {/* Guest Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Guest Type</label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="guest_type"
              value="existing"
              checked={formData.guest_type === 'existing'}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Existing Guest</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="guest_type"
              value="new"
              checked={formData.guest_type === 'new'}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">New Guest</span>
          </label>
        </div>
      </div>

      {/* Select Existing Guest */}
      {formData.guest_type === 'existing' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Guest</label>
          <select
            value={formData.guest_id}
            onChange={(e) => handleGuestSelect(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a guest</option>
            {mockGuests.map(guest => (
              <option key={guest.id} value={guest.id}>
                {guest.name} - {guest.email} - {guest.phone}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Guest Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="guest_name"
              value={formData.guest_name}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.guest_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter guest name"
            />
          </div>
          {errors.guest_name && (
            <p className="mt-1 text-sm text-red-600">{errors.guest_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="guest_email"
              value={formData.guest_email}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.guest_email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="guest@example.com"
            />
          </div>
          {errors.guest_email && (
            <p className="mt-1 text-sm text-red-600">{errors.guest_email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              name="guest_phone"
              value={formData.guest_phone}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.guest_phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+91 98765 43210"
            />
          </div>
          {errors.guest_phone && (
            <p className="mt-1 text-sm text-red-600">{errors.guest_phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Type <span className="text-red-500">*</span>
          </label>
          <select
            name="guest_id_type"
            value={formData.guest_id_type}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="passport">Passport</option>
            <option value="driving_license">Driving License</option>
            <option value="aadhar">Aadhar Card</option>
            <option value="voter_id">Voter ID</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="guest_id_number"
            value={formData.guest_id_number}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.guest_id_number ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter ID number"
          />
          {errors.guest_id_number && (
            <p className="mt-1 text-sm text-red-600">{errors.guest_id_number}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <textarea
              name="guest_address"
              value={formData.guest_address}
              onChange={handleInputChange}
              rows="2"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter full address"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input
            type="text"
            name="guest_city"
            value={formData.guest_city}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter city"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <input
            type="text"
            name="guest_state"
            value={formData.guest_state}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter state"
          />
        </div>
      </div>
    </div>
  );

  const renderStayDetails = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-yellow-900">
          <p className="font-medium">Manager Restriction</p>
          <p className="text-yellow-700 mt-1">Cannot book dates in the past. All bookings must be for current or future dates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              name="check_in_date"
              value={formData.check_in_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.check_in_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.check_in_date && (
            <p className="mt-1 text-sm text-red-600">{errors.check_in_date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="time"
              name="check_in_time"
              value={formData.check_in_time}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-out Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              name="check_out_date"
              value={formData.check_out_date}
              onChange={handleInputChange}
              min={formData.check_in_date || new Date().toISOString().split('T')[0]}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.check_out_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.check_out_date && (
            <p className="mt-1 text-sm text-red-600">{errors.check_out_date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-out Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="time"
              name="check_out_time"
              value={formData.check_out_time}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {formData.check_in_date && formData.check_out_date && (
          <div className="md:col-span-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-900">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">Duration:</span>
              <span className="text-blue-600 font-bold">{calculateNights()} night(s)</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Adults <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              name="num_adults"
              value={formData.num_adults}
              onChange={handleInputChange}
              min="1"
              max="10"
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.num_adults ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.num_adults && (
            <p className="mt-1 text-sm text-red-600">{errors.num_adults}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Children
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              name="num_children"
              value={formData.num_children}
              onChange={handleInputChange}
              min="0"
              max="5"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Booking Source
          </label>
          <select
            name="source"
            value={formData.source}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="direct">Walk-in / Direct</option>
            <option value="phone">Phone Booking</option>
            <option value="email">Email Booking</option>
            <option value="booking.com">Booking.com</option>
            <option value="makemytrip">MakeMyTrip</option>
            <option value="goibibo">Goibibo</option>
            <option value="agent">Travel Agent</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Requests / Notes
          </label>
          <textarea
            name="special_requests"
            value={formData.special_requests}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any special requests or dietary requirements..."
          />
        </div>
      </div>
    </div>
  );

  const renderRoomAndPayment = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-orange-900">
          <p className="font-medium">Manager Discount Limit</p>
          <p className="text-orange-700 mt-1">Maximum discount allowed: 5% of base rate. Cannot modify tax rates (fixed at 18% GST).</p>
        </div>
      </div>

      {/* Room Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Room Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockRoomTypes.map(roomType => (
            <div
              key={roomType.id}
              onClick={() => handleRoomTypeChange(roomType.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.room_type === roomType.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{roomType.name}</h4>
                <Bed className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-blue-600">₹{roomType.base_rate}</p>
              <p className="text-xs text-gray-600 mt-1">per night</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                <Users className="w-3 h-3" />
                <span>{roomType.capacity.adults} Adults, {roomType.capacity.children} Children</span>
              </div>
            </div>
          ))}
        </div>
        {errors.room_type && (
          <p className="mt-2 text-sm text-red-600">{errors.room_type}</p>
        )}
      </div>

      {/* Available Rooms */}
      {formData.room_type && formData.check_in_date && formData.check_out_date && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Available Rooms
            </label>
            <button
              onClick={() => checkRoomAvailability()}
              disabled={checkingAvailability}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              {checkingAvailability ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Checking...</span>
                </>
              ) : (
                'Refresh'
              )}
            </button>
          </div>
          {availableRooms.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availableRooms.map(room => (
                <button
                  key={room.id}
                  onClick={() => setFormData(prev => ({ ...prev, room_number: room.number }))}
                  className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                    formData.room_number === room.number
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-bold">Room {room.number}</div>
                  <div className="text-xs text-gray-600">{room.view} View</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              Click "Check Availability" to see available rooms
            </div>
          )}
        </div>
      )}

      {/* Pricing */}
      {formData.room_type && calculateNights() > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Pricing Summary
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Room Rate (₹{formData.base_rate} × {calculateNights()} nights)</span>
              <span className="font-semibold text-gray-900">₹{(formData.base_rate * calculateNights()).toLocaleString()}</span>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Extra Charges</span>
                <input
                  type="number"
                  name="extra_charges"
                  value={formData.extra_charges}
                  onChange={handleInputChange}
                  min="0"
                  className="w-32 px-3 py-1 text-right border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Discount (Max 5%)</span>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-32 px-3 py-1 text-right border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.discount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
              </div>
              {errors.discount && (
                <p className="text-xs text-red-600 text-right">{errors.discount}</p>
              )}
            </div>

            <div className="border-t border-gray-300 pt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Taxes (18% GST) - Fixed</span>
                <span className="font-semibold text-gray-900">₹{formData.taxes.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t-2 border-gray-400 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-green-600">₹{formData.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="cash">Cash</option>
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Status
          </label>
          <select
            name="payment_status"
            value={formData.payment_status}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="pending">Pending</option>
            <option value="partial">Partial Payment</option>
            <option value="paid">Paid in Full</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deposit Amount (Suggested: 30%)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              name="deposit_amount"
              value={formData.deposit_amount}
              onChange={handleInputChange}
              min="0"
              max={formData.total_amount}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Remaining: ₹{(formData.total_amount - formData.deposit_amount).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Internal Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Internal notes for staff..."
        />
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-green-900">
          <p className="font-medium">Review your reservation details</p>
          <p className="text-green-700 mt-1">Please verify all information before creating the reservation</p>
        </div>
      </div>

      {/* Guest Details Review */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Guest Information
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Name:</span>
            <span className="ml-2 font-medium text-gray-900">{formData.guest_name}</span>
          </div>
          <div>
            <span className="text-gray-600">Email:</span>
            <span className="ml-2 font-medium text-gray-900">{formData.guest_email}</span>
          </div>
          <div>
            <span className="text-gray-600">Phone:</span>
            <span className="ml-2 font-medium text-gray-900">{formData.guest_phone}</span>
          </div>
          <div>
            <span className="text-gray-600">ID:</span>
            <span className="ml-2 font-medium text-gray-900 capitalize">{formData.guest_id_type} - {formData.guest_id_number}</span>
          </div>
        </div>
      </div>

      {/* Stay Details Review */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-600" />
          Stay Details
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Check-in:</span>
            <span className="ml-2 font-medium text-gray-900">
              {new Date(formData.check_in_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} at {formData.check_in_time}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Check-out:</span>
            <span className="ml-2 font-medium text-gray-900">
              {new Date(formData.check_out_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} at {formData.check_out_time}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Duration:</span>
            <span className="ml-2 font-medium text-blue-600">{calculateNights()} night(s)</span>
          </div>
          <div>
            <span className="text-gray-600">Guests:</span>
            <span className="ml-2 font-medium text-gray-900">{formData.num_adults} Adult(s), {formData.num_children} Child(ren)</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600">Source:</span>
            <span className="ml-2 font-medium text-gray-900 capitalize">{formData.source}</span>
          </div>
        </div>
      </div>

      {/* Room & Pricing Review */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building className="w-5 h-5 text-purple-600" />
          Room & Pricing
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Room Type:</span>
            <span className="font-medium text-gray-900 capitalize">{mockRoomTypes.find(rt => rt.id === formData.room_type)?.name}</span>
          </div>
          {formData.room_number && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Room Number:</span>
              <span className="font-medium text-blue-600">{formData.room_number}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Base Rate × {calculateNights()} nights:</span>
              <span className="font-medium text-gray-900">₹{(formData.base_rate * calculateNights()).toLocaleString()}</span>
            </div>
            {formData.extra_charges > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Extra Charges:</span>
                <span className="font-medium text-gray-900">₹{formData.extra_charges.toLocaleString()}</span>
              </div>
            )}
            {formData.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium text-red-600">-₹{formData.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxes (18% GST):</span>
              <span className="font-medium text-gray-900">₹{formData.taxes.toLocaleString()}</span>
            </div>
            <div className="border-t-2 border-gray-300 pt-2 flex justify-between">
              <span className="text-lg font-bold text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-green-600">₹{formData.total_amount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Review */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-orange-600" />
          Payment Details
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Payment Method:</span>
            <span className="ml-2 font-medium text-gray-900 capitalize">{formData.payment_method.replace('_', ' ')}</span>
          </div>
          <div>
            <span className="text-gray-600">Payment Status:</span>
            <span className="ml-2 font-medium text-gray-900 capitalize">{formData.payment_status}</span>
          </div>
          <div>
            <span className="text-gray-600">Deposit Amount:</span>
            <span className="ml-2 font-medium text-blue-600">₹{formData.deposit_amount.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Remaining:</span>
            <span className="ml-2 font-medium text-red-600">₹{(formData.total_amount - formData.deposit_amount).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {formData.special_requests && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm font-medium text-yellow-900">Special Requests:</p>
          <p className="text-sm text-yellow-800 mt-1">{formData.special_requests}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/manager/reservations')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Reservation</h1>
              <p className="text-sm text-gray-600 mt-1">Fill in the details to create a new booking</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          {renderStepIndicator()}

          <form onSubmit={handleSubmit}>
            {step === 1 && renderGuestInfo()}
            {step === 2 && renderStayDetails()}
            {step === 3 && renderRoomAndPayment()}
            {step === 4 && renderReview()}

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={step === 1 ? () => navigate('/manager/reservations') : handlePrevious}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {step === 1 ? 'Cancel' : 'Previous'}
              </button>

              <div className="flex items-center gap-3">
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Create Reservation</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateManagerReservation;
