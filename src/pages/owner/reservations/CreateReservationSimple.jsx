import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Save, 
  ArrowLeft, 
  Users,
  User,
  CreditCard
} from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CreateReservation = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Guest Details
    guest_name: '',
    email_id: '',
    phone: '',
    id_card: 'adhar card',
    guest_id_number: '',
    city: '',
    address: '',
    
    // Guest Count
    adult: 1,
    child_with_bed: 0,
    infant: 0,
    
    // Travel Dates
    check_in_date: '',
    check_out_date: '',
    no_of_nights: 0,
    
    // Room & Pricing
    room_category: '',
    no_of_rooms: 1,
    room_price: 0,
    total_amount: 0,
    extra_bed: 0,
    extra_bed_price: 0,
    extra_bed_total: 0,
    meal_plan: '',
    
    // Booking Details
    status: 'confirmed',
    release_date: '',
    arrival_time: '',
    booking_source: 'direct',
    agent_name: '',
    priority_level: 'normal',
    communication_preference: 'email'
  });
  
  const [loading, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Mock data
  const mockRoomTypes = [
    { id: 'deluxe', name: 'Deluxe', base_rate: 5000 },
    { id: 'suite', name: 'Suite', base_rate: 8000 },
    { id: 'standard', name: 'Standard', base_rate: 3000 }
  ];

  const mockAgents = [
    { id: 1, name: 'Agent 1' },
    { id: 2, name: 'Agent 2' },
    { id: 3, name: 'Agent 3' }
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-calculate nights when dates change
    if (name === 'check_in_date' || name === 'check_out_date') {
      const checkIn = name === 'check_in_date' ? value : formData.check_in_date;
      const checkOut = name === 'check_out_date' ? value : formData.check_out_date;
      
      if (checkIn && checkOut) {
        const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
        setFormData(prev => ({ ...prev, no_of_nights: nights > 0 ? nights : 0 }));
      }
    }

    // Auto-calculate totals when room details change
    if (name === 'room_price' || name === 'no_of_rooms' || name === 'extra_bed_price' || name === 'extra_bed') {
      setTimeout(() => calculateTotals(), 0);
    }
  };

  // Calculate total amounts
  const calculateTotals = () => {
    const roomTotal = (formData.room_price || 0) * (formData.no_of_rooms || 0) * (formData.no_of_nights || 0);
    const extraBedTotal = (formData.extra_bed_price || 0) * (formData.extra_bed || 0) * (formData.no_of_nights || 0);
    const totalAmount = roomTotal + extraBedTotal;

    setFormData(prev => ({
      ...prev,
      extra_bed_total: extraBedTotal,
      total_amount: totalAmount
    }));
  };

  // Handle room type change
  const handleRoomTypeChange = (e) => {
    const roomType = mockRoomTypes.find(room => room.id === e.target.value);
    setFormData(prev => ({
      ...prev,
      room_category: e.target.value,
      room_price: roomType ? roomType.base_rate : 0
    }));
    setTimeout(() => calculateTotals(), 0);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.guest_name.trim()) newErrors.guest_name = 'Guest name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.check_in_date) newErrors.check_in_date = 'Check-in date is required';
    if (!formData.check_out_date) newErrors.check_out_date = 'Check-out date is required';
    if (!formData.room_category) newErrors.room_category = 'Room category is required';

    if (formData.check_in_date && formData.check_out_date) {
      if (new Date(formData.check_in_date) >= new Date(formData.check_out_date)) {
        newErrors.check_out_date = 'Check-out date must be after check-in date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    try {
      setSaving(true);
      
      // Mock API call
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

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Guest Details Section */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded">
              <User className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Guest Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name *</label>
              <input
                type="text"
                name="guest_name"
                value={formData.guest_name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.guest_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Guest name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
              <input
                type="email"
                name="email_id"
                value={formData.email_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Phone number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Card</label>
              <select
                name="id_card"
                value={formData.id_card}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="adhar card">Adhar Card</option>
                <option value="passport">Passport</option>
                <option value="driving license">Driving License</option>
                <option value="voter id">Voter ID</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
              <input
                type="text"
                name="guest_id_number"
                value={formData.guest_id_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ID number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="City"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Full address"
              />
            </div>
          </div>
        </div>

        {/* Number of Guests Section */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded">
              <Users className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">No of Guest</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adult</label>
              <input
                type="number"
                name="adult"
                value={formData.adult}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Child with bed</label>
              <input
                type="number"
                name="child_with_bed"
                value={formData.child_with_bed}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Infant</label>
              <input
                type="number"
                name="infant"
                value={formData.infant}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Travel Date Section */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Travel Date</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check in date *</label>
              <input
                type="date"
                name="check_in_date"
                value={formData.check_in_date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.check_in_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check out date *</label>
              <input
                type="date"
                name="check_out_date"
                value={formData.check_out_date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.check_out_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No of Nights</label>
              <input
                type="number"
                name="no_of_nights"
                value={formData.no_of_nights}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Rooming & Price Section */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded">
              <CreditCard className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Rooming & Price</h2>
          </div>
          
          <div className="space-y-4">
            {/* Room Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room category *</label>
                <select
                  name="room_category"
                  value={formData.room_category}
                  onChange={handleRoomTypeChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.room_category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select room</option>
                  {mockRoomTypes.map(room => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No of Room</label>
                <input
                  type="number"
                  name="no_of_rooms"
                  value={formData.no_of_rooms}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Price</label>
                <input
                  type="number"
                  name="room_price"
                  value={formData.room_price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total amount</label>
                <input
                  type="number"
                  name="total_amount"
                  value={formData.total_amount}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meal plan</label>
                <select
                  name="meal_plan"
                  value={formData.meal_plan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select meal plan</option>
                  <option value="MAPI">MAPI</option>
                  <option value="API">API</option>
                  <option value="CP">CP</option>
                  <option value="EP">EP</option>
                </select>
              </div>
            </div>

            {/* Extra Bed Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Extra bed</label>
                <input
                  type="number"
                  name="extra_bed"
                  value={formData.extra_bed}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Extra bed price</label>
                <input
                  type="number"
                  name="extra_bed_price"
                  value={formData.extra_bed_price}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                <input
                  type="number"
                  name="extra_bed_total"
                  value={formData.extra_bed_total}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details Section */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Booking</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Release date</label>
              <input
                type="date"
                name="release_date"
                value={formData.release_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking source</label>
              <select
                name="booking_source"
                value={formData.booking_source}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="direct">Direct</option>
                <option value="agent">Agent</option>
                <option value="online">Online</option>
                <option value="phone">Phone</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agent name</label>
              <select
                name="agent_name"
                value={formData.agent_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={formData.booking_source !== 'agent'}
              >
                <option value="">Select agent</option>
                {mockAgents.map(agent => (
                  <option key={agent.id} value={agent.name}>{agent.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority level</label>
              <select
                name="priority_level"
                value={formData.priority_level}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="normal">Normal</option>
                <option value="vip">VIP</option>
                <option value="corporate">Corporate</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Communication</label>
              <select
                name="communication_preference"
                value={formData.communication_preference}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arrival time</label>
              <input
                type="time"
                name="arrival_time"
                value={formData.arrival_time}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/owner/reservations')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
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
      </form>
    </div>
  );
};

export default CreateReservation;