import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Save, 
  ArrowLeft, 
  User,
  Mail,
  Phone,
  Building,
  DollarSign,
  AlertCircle,
  Lock,
  X
} from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const EditManagerReservation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const TAX_RATE = 0.18;

  useEffect(() => {
    loadReservation();
  }, [id]);

  const loadReservation = async () => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock reservation data
      const mockReservation = {
        id: parseInt(id),
        reservation_number: 'RES-2024-001',
        guest_name: 'John Smith',
        guest_email: 'john@example.com',
        guest_phone: '+91 98765 43210',
        guest_address: '123 Main Street',
        guest_city: 'Mumbai',
        guest_state: 'Maharashtra',
        guest_id_type: 'passport',
        guest_id_number: 'P1234567',
        check_in_date: '2024-03-15',
        check_out_date: '2024-03-18',
        check_in_time: '14:00',
        check_out_time: '11:00',
        num_adults: 2,
        num_children: 1,
        room_type: 'deluxe',
        room_number: '101',
        base_rate: 5000,
        extra_charges: 0,
        discount: 0,
        taxes: 2700,
        total_amount: 17700,
        deposit_amount: 5310,
        payment_method: 'card',
        payment_status: 'partial',
        status: 'confirmed', // confirmed, checked_in, checked_out, cancelled
        source: 'direct',
        special_requests: 'Late check-in requested',
        notes: 'VIP guest'
      };
      
      setFormData(mockReservation);
      setOriginalData(mockReservation);
    } catch (error) {
      console.error('Error loading reservation:', error);
      toast.error('Failed to load reservation');
      navigate('/manager/reservations');
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    if (!formData.check_in_date || !formData.check_out_date) return 0;
    const checkIn = new Date(formData.check_in_date);
    const checkOut = new Date(formData.check_out_date);
    const diff = checkOut - checkIn;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

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
      total_amount: Math.round(total)
    }));
  };

  useEffect(() => {
    if (formData) {
      calculateTotals();
    }
  }, [formData?.base_rate, formData?.extra_charges, formData?.discount, formData?.check_in_date, formData?.check_out_date]);

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
  };

  const validateForm = () => {
    const newErrors = {};

    // Manager Restriction: Cannot edit certain fields after check-in
    if (formData.status === 'checked_in' || formData.status === 'checked_out') {
      // Only special requests and notes can be edited after check-in
      return Object.keys(newErrors).length === 0;
    }

    if (!formData.guest_name.trim()) newErrors.guest_name = 'Guest name is required';
    if (!formData.guest_email.trim()) newErrors.guest_email = 'Email is required';
    if (!formData.guest_phone.trim()) newErrors.guest_phone = 'Phone is required';
    if (!formData.check_in_date) newErrors.check_in_date = 'Check-in date is required';
    if (!formData.check_out_date) newErrors.check_out_date = 'Check-out date is required';

    // Manager Restriction: Cannot backdate reservations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkIn = new Date(formData.check_in_date);
    checkIn.setHours(0, 0, 0, 0);
    
    if (checkIn < today && checkIn.getTime() !== new Date(originalData.check_in_date).setHours(0, 0, 0, 0)) {
      newErrors.check_in_date = 'Cannot change to past dates';
    }

    if (formData.check_in_date && formData.check_out_date) {
      const checkOut = new Date(formData.check_out_date);
      if (checkOut <= checkIn) {
        newErrors.check_out_date = 'Check-out must be after check-in';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    try {
      setSaving(true);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Reservation updated successfully!');
      navigate('/manager/reservations');
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast.error('Failed to update reservation');
    } finally {
      setSaving(false);
    }
  };

  // Determine if field should be disabled based on reservation status
  const isFieldDisabled = (fieldName) => {
    // After check-in, only special_requests and notes can be edited
    if (formData.status === 'checked_in' || formData.status === 'checked_out') {
      return !['special_requests', 'notes'].includes(fieldName);
    }
    
    // Cannot edit cancelled reservations
    if (formData.status === 'cancelled') {
      return true;
    }
    
    return false;
  };

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const isPostCheckIn = formData.status === 'checked_in' || formData.status === 'checked_out';
  const isCancelled = formData.status === 'cancelled';

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
              <h1 className="text-2xl font-bold text-gray-900">Edit Reservation</h1>
              <p className="text-sm text-gray-600 mt-1">
                {formData.reservation_number} - {formData.guest_name}
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg font-medium text-sm ${
            formData.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
            formData.status === 'checked_in' ? 'bg-green-100 text-green-700' :
            formData.status === 'checked_out' ? 'bg-purple-100 text-purple-700' :
            'bg-red-100 text-red-700'
          }`}>
            {formData.status.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        {/* Restriction Alerts */}
        {isPostCheckIn && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3"
          >
            <Lock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-900">
              <p className="font-medium">Limited Editing After Check-in</p>
              <p className="text-yellow-700 mt-1">
                Guest has already checked in. Only special requests and internal notes can be modified.
              </p>
            </div>
          </motion.div>
        )}

        {isCancelled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
          >
            <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-900">
              <p className="font-medium">Reservation Cancelled</p>
              <p className="text-red-700 mt-1">
                This reservation has been cancelled and cannot be edited. Create a new reservation if needed.
              </p>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 space-y-8">
          {/* Guest Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Guest Information
              {isFieldDisabled('guest_name') && <Lock className="w-4 h-4 text-gray-400" />}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="guest_name"
                  value={formData.guest_name}
                  onChange={handleInputChange}
                  disabled={isFieldDisabled('guest_name')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.guest_name ? 'border-red-500' : 'border-gray-300'
                  } ${isFieldDisabled('guest_name') ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
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
                    disabled={isFieldDisabled('guest_email')}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.guest_email ? 'border-red-500' : 'border-gray-300'
                    } ${isFieldDisabled('guest_email') ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                </div>
                {errors.guest_email && (
                  <p className="mt-1 text-sm text-red-600">{errors.guest_email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="guest_phone"
                    value={formData.guest_phone}
                    onChange={handleInputChange}
                    disabled={isFieldDisabled('guest_phone')}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.guest_phone ? 'border-red-500' : 'border-gray-300'
                    } ${isFieldDisabled('guest_phone') ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                </div>
                {errors.guest_phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.guest_phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Number
                </label>
                <input
                  type="text"
                  name="guest_id_number"
                  value={formData.guest_id_number}
                  onChange={handleInputChange}
                  disabled={isFieldDisabled('guest_id_number')}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isFieldDisabled('guest_id_number') ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Stay Details */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Stay Details
              {isFieldDisabled('check_in_date') && <Lock className="w-4 h-4 text-gray-400" />}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="check_in_date"
                  value={formData.check_in_date}
                  onChange={handleInputChange}
                  disabled={isFieldDisabled('check_in_date')}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.check_in_date ? 'border-red-500' : 'border-gray-300'
                  } ${isFieldDisabled('check_in_date') ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
                {errors.check_in_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.check_in_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="check_out_date"
                  value={formData.check_out_date}
                  onChange={handleInputChange}
                  disabled={isFieldDisabled('check_out_date')}
                  min={formData.check_in_date}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.check_out_date ? 'border-red-500' : 'border-gray-300'
                  } ${isFieldDisabled('check_out_date') ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
                {errors.check_out_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.check_out_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adults
                </label>
                <input
                  type="number"
                  name="num_adults"
                  value={formData.num_adults}
                  onChange={handleInputChange}
                  disabled={isFieldDisabled('num_adults')}
                  min="1"
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isFieldDisabled('num_adults') ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Children
                </label>
                <input
                  type="number"
                  name="num_children"
                  value={formData.num_children}
                  onChange={handleInputChange}
                  disabled={isFieldDisabled('num_children')}
                  min="0"
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isFieldDisabled('num_children') ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
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
            </div>
          </div>

          {/* Room & Pricing */}
          {!isPostCheckIn && (
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-purple-600" />
                Room & Pricing
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Room Rate × {calculateNights()} nights:</span>
                  <span className="font-semibold text-gray-900">₹{(formData.base_rate * calculateNights()).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Taxes (18% GST - Fixed):</span>
                  <span className="font-semibold text-gray-900">₹{formData.taxes.toLocaleString()}</span>
                </div>
                <div className="border-t-2 border-gray-300 pt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-600">₹{formData.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Special Requests - Always Editable */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Special Requests & Notes
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guest Special Requests
                </label>
                <textarea
                  name="special_requests"
                  value={formData.special_requests}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any special requests from guest..."
                />
              </div>

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
          </div>

          {/* Action Buttons */}
          {!isCancelled && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/manager/reservations')}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditManagerReservation;
