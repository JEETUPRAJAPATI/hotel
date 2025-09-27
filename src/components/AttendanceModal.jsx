import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  User,
  FileText,
  Save,
  AlertCircle,
  Timer,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { attendanceAPI, staffAPI } from '../services/staffService';
import toast from 'react-hot-toast';

const AttendanceModal = ({ 
  isOpen, 
  onClose, 
  mode = 'add', // 'add', 'edit', 'view'
  attendanceData = null,
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    staff_id: '',
    date: new Date().toISOString().split('T')[0],
    check_in_time: '',
    check_out_time: '',
    status: 'Present',
    notes: ''
  });

  const [staff, setStaff] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const statusOptions = ['Present', 'Absent', 'Late', 'Half Day'];

  // Load staff and initialize form data
  useEffect(() => {
    if (isOpen) {
      loadStaff();
      if (mode === 'edit' && attendanceData) {
        setFormData({
          staff_id: attendanceData.staff_id?._id || '',
          date: attendanceData.date ? new Date(attendanceData.date).toISOString().split('T')[0] : '',
          check_in_time: attendanceData.check_in_time || '',
          check_out_time: attendanceData.check_out_time || '',
          status: attendanceData.status || 'Present',
          notes: attendanceData.notes || ''
        });
      } else if (mode === 'view' && attendanceData) {
        setFormData({
          staff_id: attendanceData.staff_id?._id || '',
          date: attendanceData.date ? new Date(attendanceData.date).toISOString().split('T')[0] : '',
          check_in_time: attendanceData.check_in_time || '',
          check_out_time: attendanceData.check_out_time || '',
          status: attendanceData.status || 'Present',
          notes: attendanceData.notes || ''
        });
      } else {
        // Reset form for add mode
        setFormData({
          staff_id: '',
          date: new Date().toISOString().split('T')[0],
          check_in_time: '',
          check_out_time: '',
          status: 'Present',
          notes: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, attendanceData]);

  const loadStaff = async () => {
    try {
      const response = await staffAPI.getStaff({
        hotel_id: '60f1b2b3b3b3b3b3b3b3b3b3', // Replace with actual hotel ID
        status: 'Active',
        limit: 100 // Get all active staff
      });

      if (response.data.success) {
        setStaff(response.data.data);
      }
    } catch (error) {
      console.error('Error loading staff:', error);
    }
  };

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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.staff_id) {
      newErrors.staff_id = 'Staff member is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (formData.status === 'Present' || formData.status === 'Late') {
      if (!formData.check_in_time) {
        newErrors.check_in_time = 'Check-in time is required for present/late status';
      }
    }

    if (formData.check_in_time && formData.check_out_time) {
      const checkInTime = new Date(`2000-01-01T${formData.check_in_time}`);
      const checkOutTime = new Date(`2000-01-01T${formData.check_out_time}`);
      
      if (checkOutTime <= checkInTime) {
        newErrors.check_out_time = 'Check-out time must be after check-in time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        hotel_id: '60f1b2b3b3b3b3b3b3b3b3b3' // Replace with actual hotel ID
      };

      // Remove empty fields
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '') {
          delete submitData[key];
        }
      });

      let response;
      if (mode === 'edit') {
        response = await attendanceAPI.updateAttendance(attendanceData._id, submitData);
      } else {
        response = await attendanceAPI.createAttendance(submitData);
      }

      if (response.data.success) {
        toast.success(`Attendance ${mode === 'edit' ? 'updated' : 'marked'} successfully`);
        onSuccess && onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      toast.error(`Failed to ${mode === 'edit' ? 'update' : 'mark'} attendance`);
    } finally {
      setLoading(false);
    }
  };

  const calculateWorkingHours = () => {
    if (!formData.check_in_time || !formData.check_out_time) return null;
    
    const checkInTime = new Date(`2000-01-01T${formData.check_in_time}`);
    const checkOutTime = new Date(`2000-01-01T${formData.check_out_time}`);
    const diff = checkOutTime - checkInTime;
    
    if (diff < 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const getSelectedStaff = () => {
    return staff.find(s => s._id === formData.staff_id);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h3 className="text-lg font-semibold text-gray-900">
              {mode === 'add' && 'Mark Attendance'}
              {mode === 'edit' && 'Edit Attendance'}
              {mode === 'view' && 'Attendance Details'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Staff Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staff Member *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    name="staff_id"
                    value={formData.staff_id}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.staff_id ? 'border-red-500' : 'border-gray-300'
                    } ${mode === 'view' ? 'bg-gray-50' : ''}`}
                  >
                    <option value="">Select Staff Member</option>
                    {staff.map(member => (
                      <option key={member._id} value={member._id}>
                        {member.full_name} - {member.designation}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.staff_id && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.staff_id}
                  </p>
                )}
              </div>

              {/* Selected Staff Info */}
              {formData.staff_id && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getSelectedStaff()?.profile_image ? (
                      <img
                        src={getSelectedStaff()?.profile_image}
                        alt={getSelectedStaff()?.full_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-blue-900">{getSelectedStaff()?.full_name}</h4>
                      <p className="text-sm text-blue-700">{getSelectedStaff()?.designation}</p>
                      <p className="text-xs text-blue-600">{getSelectedStaff()?.department_id?.department_name}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      disabled={mode === 'view'}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.date ? 'border-red-500' : 'border-gray-300'
                      } ${mode === 'view' ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                  {errors.date && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      mode === 'view' ? 'bg-gray-50' : 'border-gray-300'
                    }`}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* Check In Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check In Time {(formData.status === 'Present' || formData.status === 'Late') && '*'}
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="time"
                      name="check_in_time"
                      value={formData.check_in_time}
                      onChange={handleInputChange}
                      disabled={mode === 'view' || formData.status === 'Absent'}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.check_in_time ? 'border-red-500' : 'border-gray-300'
                      } ${mode === 'view' || formData.status === 'Absent' ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                  {errors.check_in_time && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.check_in_time}
                    </p>
                  )}
                </div>

                {/* Check Out Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check Out Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="time"
                      name="check_out_time"
                      value={formData.check_out_time}
                      onChange={handleInputChange}
                      disabled={mode === 'view' || formData.status === 'Absent'}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.check_out_time ? 'border-red-500' : 'border-gray-300'
                      } ${mode === 'view' || formData.status === 'Absent' ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                  {errors.check_out_time && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.check_out_time}
                    </p>
                  )}
                </div>
              </div>

              {/* Working Hours Display */}
              {calculateWorkingHours() && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Working Hours:</span>
                    <span className="text-green-800">{calculateWorkingHours()}</span>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    disabled={mode === 'view'}
                    rows="3"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      mode === 'view' ? 'bg-gray-50' : 'border-gray-300'
                    }`}
                    placeholder="Add any additional notes about this attendance record..."
                  />
                </div>
              </div>

              {/* View mode additional details */}
              {mode === 'view' && attendanceData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Created
                    </label>
                    <div className="text-sm text-gray-600">
                      {new Date(attendanceData.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Updated
                    </label>
                    <div className="text-sm text-gray-600">
                      {new Date(attendanceData.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {mode === 'view' ? 'Close' : 'Cancel'}
              </button>
              
              {mode !== 'view' && (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {mode === 'edit' ? 'Update Attendance' : 'Mark Attendance'}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AttendanceModal;