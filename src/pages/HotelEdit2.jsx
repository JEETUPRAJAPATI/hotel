import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import {
  ArrowLeft, Upload, X, MapPin, Phone, Mail, User, Building2,
  DollarSign, FileText, Camera, Image, CreditCard, Banknote,
  CheckCircle, AlertTriangle, Globe, Map, Eye, EyeOff, Search,
  ChevronDown, ChevronUp, Save
} from 'lucide-react';
import hotelService from '../services/hotelService';

const HotelEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Image previews
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    // Hotel Info
    name: '',
    category: '',
    priceRange: { min: '', max: '' },
    currency: 'USD',
    description: '',
    
    // Location
    address: '',
    country: '',
    state: '',
    city: '',
    zipcode: '',
    
    // Contact
    contactPerson: { name: '', phone: '', email: '' },
    website: '',
    fax: '',
    
    // Features
    amenities: [],
    facilities: [],
    
    // Policies
    checkIn: '15:00',
    checkOut: '11:00',
    cancellationPolicy: '',
    petPolicy: { allowed: false, fee: 0 },
    smokingPolicy: false,
    childrenPolicy: '',
    paymentPolicy: '',
    
    // Pricing
    taxRate: 10,
    serviceCharge: 0,
    
    // Bank Details (Optional)
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: '',
      swiftCode: '',
      routingNumber: ''
    },
    
    // Billing Info (Optional)
    billingInfo: {
      gstNumber: '',
      panNumber: '',
      bankAccount: ''
    },
    
    // Legal Info (Optional)
    legalInfo: {
      businessLicense: '',
      taxNumber: '',
      gstNumber: '',
      panNumber: ''
    },
    
    // Social Media (Optional)
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: ''
    }
  });

  // Location data
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Search states for dropdowns
  const [countrySearch, setCountrySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  // Dropdown open states
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const hotelCategories = [
    { value: 'hotel', label: 'Hotel' },
    { value: 'resort', label: 'Resort' },
    { value: 'motel', label: 'Motel' },
    { value: 'hostel', label: 'Hostel' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'boutique', label: 'Boutique Hotel' },
    { value: 'business', label: 'Business Hotel' },
    { value: 'luxury', label: 'Luxury Hotel' },
    { value: 'budget', label: 'Budget Hotel' }
  ];

  const availableAmenities = [
    { value: 'wifi', label: 'WiFi' },
    { value: 'parking', label: 'Parking' },
    { value: 'pool', label: 'Swimming Pool' },
    { value: 'gym', label: 'Gym/Fitness Center' },
    { value: 'spa', label: 'Spa' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'bar', label: 'Bar' },
    { value: 'business_center', label: 'Business Center' },
    { value: 'conference_rooms', label: 'Conference Rooms' },
    { value: 'airport_shuttle', label: 'Airport Shuttle' },
    { value: 'pet_friendly', label: 'Pet Friendly' },
    { value: 'laundry', label: 'Laundry Service' },
    { value: 'concierge', label: 'Concierge' },
    { value: 'air_conditioning', label: 'Air Conditioning' },
    { value: 'room_service', label: 'Room Service' }
  ];

  // SearchableSelect Component with fixed focus
  const SearchableSelect = ({ 
    label, 
    value, 
    onChange, 
    options, 
    placeholder, 
    searchValue, 
    onSearchChange, 
    isOpen, 
    setIsOpen, 
    disabled = false,
    required = false,
    error = null
  }) => {
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }, 100);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, setIsOpen]);

    const filteredOptions = options.filter(option => 
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleSelect = (selectedValue, selectedLabel) => {
      onChange(selectedValue);
      onSearchChange(selectedLabel);
      setIsOpen(false);
    };

    const handleInputChange = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onSearchChange(e.target.value);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    return (
      <div className="relative searchable-select" ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && '*'}
        </label>
        <div className={`relative ${disabled ? 'opacity-50' : ''}`}>
          <div
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer flex items-center justify-between ${
              error ? 'border-red-500' : ''
            } ${disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-white'}`}
          >
            <span className={`${value ? 'text-gray-900' : 'text-gray-500'}`}>
              {value || placeholder}
            </span>
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
          
          {isOpen && !disabled && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={`Search ${label.toLowerCase()}...`}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => handleSelect(option.value, option.label)}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{option.label}</div>
                      {option.description && (
                        <div className="text-sm text-gray-600">{option.description}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    No {label.toLowerCase()} found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  };

  // Load hotel data
  const loadHotel = async () => {
    try {
      setLoading(true);
      const response = await hotelService.getHotel(id);
      const hotelData = response.data;

      // Populate form with existing data
      setFormData({
        name: hotelData.name || '',
        category: hotelData.category || '',
        priceRange: {
          min: hotelData.pricing?.baseRate || '',
          max: hotelData.pricing?.baseRate ? String(Number(hotelData.pricing.baseRate) + 1000) : ''
        },
        currency: hotelData.pricing?.currency || 'USD',
        description: hotelData.description || '',
        
        // Location
        address: hotelData.address?.street || '',
        country: hotelData.address?.country || '',
        state: hotelData.address?.state || '',
        city: hotelData.address?.city || '',
        zipcode: hotelData.address?.zipCode || '',
        
        // Contact
        contactPerson: {
          name: 'Hotel Manager',
          phone: hotelData.contact?.phone || '',
          email: hotelData.contact?.email || ''
        },
        website: hotelData.contact?.website || '',
        fax: hotelData.contact?.fax || '',
        
        // Features
        amenities: hotelData.amenities || [],
        facilities: hotelData.facilities || [],
        
        // Policies
        checkIn: hotelData.policies?.checkIn || '15:00',
        checkOut: hotelData.policies?.checkOut || '11:00',
        cancellationPolicy: hotelData.policies?.cancellation || '',
        petPolicy: {
          allowed: hotelData.policies?.pets?.allowed || false,
          fee: hotelData.policies?.pets?.fee || 0
        },
        smokingPolicy: hotelData.policies?.smoking || false,
        childrenPolicy: hotelData.policies?.children || '',
        paymentPolicy: hotelData.policies?.payment || '',
        
        // Pricing
        taxRate: hotelData.pricing?.taxRate || 10,
        serviceCharge: hotelData.pricing?.serviceCharge || 0,
        
        // Bank Details
        bankDetails: {
          accountName: hotelData.bankDetails?.accountName || '',
          accountNumber: hotelData.bankDetails?.accountNumber || '',
          bankName: hotelData.bankDetails?.bankName || '',
          ifscCode: hotelData.bankDetails?.ifscCode || '',
          swiftCode: hotelData.bankDetails?.swiftCode || '',
          routingNumber: hotelData.bankDetails?.routingNumber || ''
        },
        
        // Billing Info
        billingInfo: {
          gstNumber: hotelData.legalInformation?.gstNumber || '',
          panNumber: hotelData.legalInformation?.panNumber || '',
          bankAccount: hotelData.bankDetails?.accountNumber || ''
        },
        
        // Legal Info
        legalInfo: {
          businessLicense: hotelData.legalInformation?.businessLicense || '',
          taxNumber: hotelData.legalInformation?.taxNumber || '',
          gstNumber: hotelData.legalInformation?.gstNumber || '',
          panNumber: hotelData.legalInformation?.panNumber || ''
        },
        
        // Social Media
        socialMedia: {
          facebook: hotelData.socialMedia?.facebook || '',
          instagram: hotelData.socialMedia?.instagram || '',
          twitter: hotelData.socialMedia?.twitter || '',
          linkedin: hotelData.socialMedia?.linkedin || '',
          youtube: hotelData.socialMedia?.youtube || ''
        }
      });

      // Set location search values
      setCountrySearch(hotelData.address?.country || '');
      setStateSearch(hotelData.address?.state || '');
      setCitySearch(hotelData.address?.city || '');
      setCategorySearch(hotelData.category || '');

      // Set existing images
      if (hotelData.logo) {
        setLogoPreview(hotelData.logo);
      }
      if (hotelData.banner) {
        setCoverPreview(hotelData.banner);
      }
      if (hotelData.images && hotelData.images.length > 0) {
        setGalleryPreviews(hotelData.images.map((img, index) => ({
          id: index + 1,
          url: img.url,
          caption: img.caption || ''
        })));
      }

      // Load location data
      if (hotelData.address?.country) {
        loadCountries();
        if (hotelData.address?.state) {
          loadStates(hotelData.address.country);
          if (hotelData.address?.city) {
            loadCities(hotelData.address.country, hotelData.address.state);
          }
        }
      }

    } catch (err) {
      console.error('Load hotel error:', err);
      setError(err.message || 'Failed to load hotel details');
      toast.error('Failed to load hotel details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadHotel();
      loadCountries();
    }
  }, [id]);

  // Location functions (abbreviated for space)
  const loadCountries = async () => {
    // Implementation from AddHotel.jsx
  };

  const loadStates = async (countryName) => {
    // Implementation from AddHotel.jsx
  };

  const loadCities = async (countryName, stateName) => {
    // Implementation from AddHotel.jsx
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);

      // Prepare hotel data for API
      const hotelData = {
        // Basic Information
        name: formData.name,
        description: formData.description,
        category: formData.category,
        
        // Location
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipcode
        },
        
        // Contact Information
        contact: {
          phone: formData.contactPerson.phone,
          email: formData.contactPerson.email,
          website: formData.website,
          fax: formData.fax
        },
        
        // Hotel Features
        amenities: formData.amenities || [],
        facilities: formData.facilities || [],
        
        // Policies
        policies: {
          checkIn: formData.checkIn || '15:00',
          checkOut: formData.checkOut || '11:00',
          cancellation: formData.cancellationPolicy,
          pets: {
            allowed: formData.petPolicy?.allowed || false,
            fee: formData.petPolicy?.fee || 0
          },
          smoking: formData.smokingPolicy || false,
          children: formData.childrenPolicy,
          payment: formData.paymentPolicy
        },
        
        // Pricing
        pricing: {
          currency: formData.currency || 'USD',
          baseRate: parseFloat(formData.priceRange?.min) || 0,
          taxRate: parseFloat(formData.taxRate) || 10,
          serviceCharge: parseFloat(formData.serviceCharge) || 0
        },
        
        // Bank Details
        bankDetails: {
          accountName: formData.bankDetails?.accountName,
          accountNumber: formData.bankDetails?.accountNumber,
          bankName: formData.bankDetails?.bankName,
          ifscCode: formData.bankDetails?.ifscCode,
          swiftCode: formData.bankDetails?.swiftCode,
          routingNumber: formData.bankDetails?.routingNumber
        },
        
        // Legal Information
        legalInformation: {
          businessLicense: formData.legalInfo?.businessLicense,
          taxNumber: formData.legalInfo?.taxNumber,
          gstNumber: formData.legalInfo?.gstNumber,
          panNumber: formData.legalInfo?.panNumber
        },
        
        // Social Media
        socialMedia: {
          facebook: formData.socialMedia?.facebook,
          instagram: formData.socialMedia?.instagram,
          twitter: formData.socialMedia?.twitter,
          linkedin: formData.socialMedia?.linkedin,
          youtube: formData.socialMedia?.youtube
        },

        // Images
        images: galleryFiles,
        logo: logoFile,
        banner: coverFile
      };

      // Update hotel with toast notifications
      const loadingToast = toast.loading('Updating hotel...');
      
      const response = await hotelService.updateHotel(id, hotelData);
      
      toast.dismiss(loadingToast);
      toast.success('Hotel updated successfully!');
      
      setSuccess(true);
      
      // Navigate back to hotel details after a short delay
      setTimeout(() => {
        navigate(`/manager/hotels/${id}`);
      }, 1500);
      
    } catch (err) {
      console.error('Update hotel error:', err);
      toast.error(err.message || 'Failed to update hotel. Please try again.');
      setError(err.message || 'Failed to update hotel');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/manager/hotels/${id}`)}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Hotel</h1>
              <p className="text-gray-600">Update hotel property details</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
          >
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-medium text-green-800">Hotel Updated Successfully!</h3>
              <p className="text-green-600">Redirecting to hotel details...</p>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
          >
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-medium text-red-800">Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                <p className="text-sm text-gray-600">Hotel name, category, and description</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter hotel name"
                  required
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <SearchableSelect
                label="Category"
                value={formData.category}
                onChange={(value) => handleInputChange('category', value)}
                options={hotelCategories}
                placeholder="Select hotel category"
                searchValue={categorySearch}
                onSearchChange={setCategorySearch}
                isOpen={isCategoryOpen}
                setIsOpen={setIsCategoryOpen}
                required
                error={errors.category}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe your hotel..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(`/manager/hotels/${id}`)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Hotel
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HotelEdit;