import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import {
  ArrowLeft, Save, X, MapPin, Phone, Mail, Star, Building, Users, DollarSign,
  Upload, Camera, Image, Globe, Search, ChevronDown, ChevronUp, Banknote,
  FileText, Eye, EyeOff
} from 'lucide-react';
import hotelService from '../services/hotelService';

const HotelEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState(null);

  // Image states
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

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

const HotelEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hotel, setHotel] = useState(null);
  // Form data
  const [formData, setFormData] = useState({
    // Hotel Info
    name: '',
    category: '',
    priceRange: {
      min: '',
      max: ''
    },
    currency: 'USD',
    description: '',
    
    // Location
    address: '',
    country: '',
    state: '',
    city: '',
    zipcode: '',
    
    // Contact
    contactPerson: {
      name: '',
      phone: '',
      email: ''
    },
    website: '',
    fax: '',
    
    // Features
    amenities: [],
    facilities: [],
    
    // Policies
    checkIn: '15:00',
    checkOut: '11:00',
    cancellationPolicy: '',
    petPolicy: {
      allowed: false,
      fee: 0
    },
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
    'wifi', 'parking', 'pool', 'gym', 'spa', 'restaurant', 'bar',
    'business_center', 'conference_rooms', 'airport_shuttle',
    'pet_friendly', 'laundry', 'concierge', 'air_conditioning',
    'room_service', 'fitness_center', 'outdoor_pool', 'indoor_pool',
    'breakfast', 'elevator', 'wheelchair_accessible', 'smoking_area',
    'non_smoking_rooms', 'family_rooms', 'facilities_for_disabled_guests'
  ];

  // Load hotel data
  const loadHotel = async () => {
    try {
      setLoading(true);
      const response = await hotelService.getHotel(id);
      const hotelData = response.data;
      setHotel(hotelData);

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
          name: 'Hotel Manager', // Default name
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

  // Load countries
  const loadCountries = async () => {
    try {
      setLoadingLocations(true);
      const response = await fetch('https://countriesnow.space/api/v0.1/countries');
      const data = await response.json();
      
      if (data.error) {
        const fallbackCountries = [
          'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
          'Germany', 'France', 'Japan', 'China', 'Brazil'
        ];
        const countryList = fallbackCountries.map(country => ({
          value: country,
          label: country
        }));
        setCountries(countryList.sort((a, b) => a.label.localeCompare(b.label)));
        return;
      }
      
      const countryList = data.data.map(country => ({
        value: country.country,
        label: country.country
      }));
      
      setCountries(countryList.sort((a, b) => a.label.localeCompare(b.label)));
    } catch (err) {
      setError('Failed to load countries');
      setCountries([]);
      console.error('Country loading error:', err);
    } finally {
      setLoadingLocations(false);
    }
  };

  // Load states when country changes
  const loadStates = async (countryName) => {
    try {
      setLoadingLocations(true);
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country: countryName })
      });
      
      const data = await response.json();
      
      if (data.error) {
        const fallbackStates = {
          'India': ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Rajasthan', 'Kerala', 'Punjab', 'Haryana'],
          'United States': ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan']
        };
        
        if (fallbackStates[countryName]) {
          const stateList = fallbackStates[countryName].map(state => ({
            value: state,
            label: state
          }));
          setStates(stateList.sort((a, b) => a.label.localeCompare(b.label)));
        } else {
          setStates([]);
        }
        return;
      }
      
      const stateList = data.data.states.map(state => ({
        value: state.name,
        label: state.name
      }));
      
      setStates(stateList.sort((a, b) => a.label.localeCompare(b.label)));
      setCities([]); // Clear cities when country changes
    } catch (err) {
      setError('Failed to load states');
      setStates([]);
      console.error('State loading error:', err);
    } finally {
      setLoadingLocations(false);
    }
  };

  // Load cities when state changes
  const loadCities = async (countryName, stateName) => {
    try {
      setLoadingLocations(true);
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          country: countryName,
          state: stateName 
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        // Fallback cities for major states
        const fallbackCities = {
          'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur'],
          'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'],
          'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli']
        };
        
        if (fallbackCities[stateName]) {
          const cityList = fallbackCities[stateName].map(city => ({
            value: city,
            label: city
          }));
          setCities(cityList.sort((a, b) => a.label.localeCompare(b.label)));
        } else {
          setCities([]);
        }
        return;
      }
      
      const cityList = data.data.map(city => ({
        value: city,
        label: city
      }));
      
      setCities(cityList.sort((a, b) => a.label.localeCompare(b.label)));
    } catch (err) {
      setError('Failed to load cities');
      setCities([]);
      console.error('City loading error:', err);
    } finally {
      setLoadingLocations(false);
    }
  };
        priceRange: hotelData.priceRange,
        amenities: [...hotelData.amenities],
        status: hotelData.status
      });
    }
    setLoading(false);
  }, [id]);

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
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSave = () => {
    // Here you would typically send the data to your API
    console.log('Saving hotel data:', formData);
    alert('Hotel updated successfully!');
    navigate('/admin/hotels');
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
      navigate('/admin/hotels');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading hotel data...</div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Hotel not found</div>
          <button
            onClick={() => navigate('/admin/hotels')}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/admin/hotels')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Hotels
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Hotel</h1>
        <p className="text-gray-600">Update hotel information and settings</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Hotel Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Building className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{hotel.name}</h2>
              <p className="text-gray-600">Hotel ID: #{hotel.id}</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hotel Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner *
                  </label>
                  <input
                    type="text"
                    value={formData.owner}
                    onChange={(e) => handleInputChange('owner', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={formData.address.country}
                    onChange={(e) => handleInputChange('address.country', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP/Postal Code *
                  </label>
                  <input
                    type="text"
                    value={formData.address.zip}
                    onChange={(e) => handleInputChange('address.zip', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.contact.phone}
                    onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => handleInputChange('contact.email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Hotel Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Rating *
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => handleInputChange('rating', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Number of Rooms *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.rooms}
                    onChange={(e) => handleInputChange('rooms', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Price Range *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., $100 - $300"
                    value={formData.priceRange}
                    onChange={(e) => handleInputChange('priceRange', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {availableAmenities.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="Active"
                    checked={formData.status === 'Active'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-green-700">Active</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="Inactive"
                    checked={formData.status === 'Inactive'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-red-700">Inactive</span>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HotelEdit;