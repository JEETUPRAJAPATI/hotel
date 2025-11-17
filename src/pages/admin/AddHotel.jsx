import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  ArrowLeft, Upload, X, MapPin, Phone, Mail, User, Building2,
  DollarSign, FileText, Camera, Image, CreditCard, Banknote,
  CheckCircle, AlertTriangle, Globe, Map, Eye, EyeOff, Search,
  ChevronDown, ChevronUp
} from 'lucide-react';
import hotelService from '../services/hotelService';

const AddHotel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // SearchableSelect Component
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
        // Focus the search input when dropdown opens with a small delay
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
    priceRange: {
      min: '',
      max: ''
    },
    description: '',
    
    // Location
    address: '',
    country: '',
    state: '',
    city: '',
    zipcode: '',
    
    // Contact Person
    contactPerson: {
      name: '',
      phone: '',
      email: ''
    },
    
    // Billing Info
    billingInfo: {
      gstNumber: '',
      panNumber: '',
      bankAccount: '',
      ifscCode: ''
    },
    
    status: 'active'
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Hotel categories
  const hotelCategories = [
    { value: 'Premium', label: 'Premium', description: 'High-end hotels with premium amenities' },
    { value: 'Luxury', label: 'Luxury', description: 'Luxury accommodations with exceptional service' },
    { value: 'Normal', label: 'Normal', description: 'Standard comfortable accommodations' },
    { value: 'Budget', label: 'Budget', description: 'Affordable accommodations' },
    { value: 'Boutique', label: 'Boutique', description: 'Unique, stylish, intimate hotels' }
  ];

  // Load countries on component mount
  useEffect(() => {
    loadCountries();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.searchable-select')) {
        setIsCountryOpen(false);
        setIsStateOpen(false);
        setIsCityOpen(false);
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load countries from API
  const loadCountries = async () => {
    try {
      setLoadingLocations(true);
      const response = await fetch('https://countriesnow.space/api/v0.1/countries');
      const data = await response.json();
      
      if (data.error) {
        throw new Error('Failed to load countries');
      }
      
      const countryList = data.data.map(country => ({
        value: country.country,
        label: country.country
      }));
      
      setCountries(countryList.sort((a, b) => a.label.localeCompare(b.label)));
    } catch (err) {
      setError('Failed to load countries. Please try again.');
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
        // If API fails, provide some default states for India
        if (countryName === 'India') {
          const indianStates = [
            'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
            'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
            'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
            'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
            'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
            'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
          ];
          const stateList = indianStates.map(state => ({
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
        // Fallback cities for major Indian states
        const fallbackCities = {
          'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur'],
          'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'],
          'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'],
          'Delhi': ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
          'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut'],
          'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
          'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'],
          'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Malda'],
          'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali'],
          'Haryana': ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak'],
          'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad'],
          'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar'],
          'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Manali', 'Kullu', 'Solan', 'Mandi']
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

  // Random fill function for demo/testing
  const fillRandomData = () => {
    const randomHotels = [
      'Grand Palace Hotel', 'Royal Gardens Resort', 'Ocean View Inn', 'Mountain Peak Lodge',
      'City Central Hotel', 'Seaside Paradise Resort', 'Golden Star Hotel', 'Peaceful Valley Inn',
      'Luxury Downtown Hotel', 'Riverside Manor'
    ];

    const randomCities = [
      'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 
      'Pune', 'Ahmedabad', 'Jaipur', 'Surat'
    ];

    const randomStates = [
      'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal',
      'Telangana', 'Gujarat', 'Rajasthan', 'Kerala', 'Punjab'
    ];

    const randomAmenities = [
      'wifi', 'parking', 'pool', 'gym', 'spa', 'restaurant', 'bar',
      'business_center', 'conference_rooms', 'airport_shuttle'
    ];

    const randomName = randomHotels[Math.floor(Math.random() * randomHotels.length)];
    const randomCity = randomCities[Math.floor(Math.random() * randomCities.length)];
    const randomState = randomStates[Math.floor(Math.random() * randomStates.length)];
    const selectedAmenities = randomAmenities.slice(0, Math.floor(Math.random() * 5) + 3);

    setFormData({
      // Hotel Info
      name: randomName,
      category: 'hotel',
      priceRange: {
        min: Math.floor(Math.random() * 5000) + 1000,
        max: Math.floor(Math.random() * 10000) + 5000
      },
      currency: 'INR',
      description: `Experience luxury and comfort at ${randomName}. Our hotel offers world-class amenities and exceptional service to make your stay memorable.`,
      
      // Location
      address: `${Math.floor(Math.random() * 999) + 1} Hotel Street, ${randomCity}`,
      country: 'India',
      state: randomState,
      city: randomCity,
      zipcode: String(Math.floor(Math.random() * 999999) + 100000),
      
      // Contact
      contactPerson: {
        name: 'Hotel Manager',
        phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        email: `manager@${randomName.toLowerCase().replace(/\s+/g, '')}.com`
      },
      website: `https://www.${randomName.toLowerCase().replace(/\s+/g, '')}.com`,
      fax: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      
      // Features
      amenities: selectedAmenities,
      facilities: ['24/7 Front Desk', 'Concierge Service', 'Housekeeping', 'Laundry Service'],
      
      // Policies
      checkIn: '15:00',
      checkOut: '11:00',
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
      petPolicy: {
        allowed: Math.random() > 0.5,
        fee: Math.floor(Math.random() * 2000) + 500
      },
      smokingPolicy: false,
      childrenPolicy: 'Children of all ages are welcome',
      paymentPolicy: 'Credit cards, debit cards, and cash accepted',
      
      // Pricing
      taxRate: Math.floor(Math.random() * 15) + 5,
      serviceCharge: Math.floor(Math.random() * 10) + 2,
      
      // Optional fields - keeping empty as per user request
      bankDetails: {
        accountName: '',
        accountNumber: '',
        bankName: '',
        ifscCode: '',
        swiftCode: '',
        routingNumber: ''
      },
      billingInfo: {
        gstNumber: '',
        panNumber: '',
        bankAccount: ''
      },
      legalInfo: {
        businessLicense: '',
        taxNumber: '',
        gstNumber: '',
        panNumber: ''
      },
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        youtube: ''
      }
    });

    // Update location-dependent data
    setCountrySearch('India');
    setStateSearch(randomState);
    setCitySearch(randomCity);

    toast.success('Form filled with random data!');
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

  // Handle country change
  const handleCountryChange = (countryName) => {
    handleInputChange('country', countryName);
    handleInputChange('state', '');
    handleInputChange('city', '');
    setStateSearch('');
    setCitySearch('');
    
    if (countryName) {
      loadStates(countryName);
    } else {
      setStates([]);
      setCities([]);
    }
  };

  // Handle state change
  const handleStateChange = (stateName) => {
    handleInputChange('state', stateName);
    handleInputChange('city', '');
    setCitySearch('');
    
    if (stateName && formData.country) {
      loadCities(formData.country, stateName);
    } else {
      setCities([]);
    }
  };

  // Handle category change
  const handleCategoryChange = (categoryValue) => {
    handleInputChange('category', categoryValue);
  };

  // Handle image upload
  const handleImageUpload = (type, file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'logo') {
        setLogoPreview(e.target.result);
        setLogoFile(file);
      } else if (type === 'cover') {
        setCoverPreview(e.target.result);
        setCoverFile(file);
      } else if (type === 'gallery') {
        const newPreview = {
          id: Date.now(),
          url: e.target.result,
          file: file
        };
        setGalleryPreviews(prev => [...prev, newPreview]);
        setGalleryFiles(prev => [...prev, file]);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle multiple file upload for gallery
  const handleMultipleImageUpload = (files) => {
    Array.from(files).forEach(file => {
      handleImageUpload('gallery', file);
    });
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      if (type === 'gallery') {
        handleMultipleImageUpload(files);
      } else {
        handleImageUpload(type, files[0]);
      }
    }
  };

  // Remove image
  const removeImage = (type, id = null) => {
    if (type === 'logo') {
      setLogoPreview(null);
      setLogoFile(null);
    } else if (type === 'cover') {
      setCoverPreview(null);
      setCoverFile(null);
    } else if (type === 'gallery' && id) {
      setGalleryPreviews(prev => prev.filter(item => item.id !== id));
      setGalleryFiles(prev => {
        const index = galleryPreviews.findIndex(item => item.id === id);
        if (index > -1) {
          return prev.filter((_, i) => i !== index);
        }
        return prev;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Hotel name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.priceRange.min) newErrors.priceMin = 'Minimum price is required';
    if (!formData.priceRange.max) newErrors.priceMax = 'Maximum price is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.contactPerson.name.trim()) newErrors.contactName = 'Contact person name is required';
    if (!formData.contactPerson.phone.trim()) newErrors.contactPhone = 'Phone number is required';
    if (!formData.contactPerson.email.trim()) newErrors.contactEmail = 'Email is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactPerson.email && !emailRegex.test(formData.contactPerson.email)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    // Phone validation (basic)
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    if (formData.contactPerson.phone && !phoneRegex.test(formData.contactPerson.phone)) {
      newErrors.contactPhone = 'Please enter a valid phone number';
    }

    // Price validation
    if (formData.priceRange.min && formData.priceRange.max) {
      if (parseFloat(formData.priceRange.min) >= parseFloat(formData.priceRange.max)) {
        newErrors.priceMax = 'Maximum price must be greater than minimum price';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare form data for submission
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

      // Create hotel with toast notifications
      const loadingToast = toast.loading('Creating hotel...');
      
      const response = await hotelService.createHotel(hotelData);
      
      toast.dismiss(loadingToast);
      toast.success('Hotel created successfully!');
      
      setSuccess(true);
      
      // Navigate to hotels list after a short delay
      setTimeout(() => {
        navigate('/manager/hotels');
      }, 1500);
      
    } catch (err) {
      console.error('Create hotel error:', err);
      toast.error(err.message || 'Failed to create hotel. Please try again.');
      setError(err.message || 'Failed to create hotel');
    } finally {
      setLoading(false);
    }
  };

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
              onClick={() => navigate('/manager/hotels')}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Hotel</h1>
              <p className="text-gray-600">Create a new hotel property with all details</p>
            </div>
          </div>
          
          {/* Random Fill Button */}
          <button
            type="button"
            onClick={fillRandomData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            Fill Random Data
          </button>
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
              <h3 className="font-medium text-green-800">Hotel Created Successfully!</h3>
              <p className="text-sm text-green-600">Redirecting to hotel list...</p>
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
            <div className="flex-1">
              <h3 className="font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Hotel Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Hotel Information</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hotel Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.name ? 'border-red-500' : ''
                      }`}
                      placeholder="Enter hotel name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <SearchableSelect
                      label="Category"
                      value={formData.category}
                      onChange={handleCategoryChange}
                      options={hotelCategories}
                      placeholder="Select category"
                      searchValue={categorySearch}
                      onSearchChange={setCategorySearch}
                      isOpen={isCategoryOpen}
                      setIsOpen={setIsCategoryOpen}
                      required={true}
                      error={errors.category}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Price (₹) *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          min="0"
                          value={formData.priceRange.min}
                          onChange={(e) => handleInputChange('priceRange.min', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.priceMin ? 'border-red-500' : ''
                          }`}
                          placeholder="1000"
                        />
                      </div>
                      {errors.priceMin && <p className="mt-1 text-sm text-red-600">{errors.priceMin}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Price (₹) *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          min="0"
                          value={formData.priceRange.max}
                          onChange={(e) => handleInputChange('priceRange.max', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.priceMax ? 'border-red-500' : ''
                          }`}
                          placeholder="5000"
                        />
                      </div>
                      {errors.priceMax && <p className="mt-1 text-sm text-red-600">{errors.priceMax}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Describe your hotel, amenities, and unique features..."
                    />
                  </div>
                </div>
              </motion.div>

              {/* Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Location</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                        errors.address ? 'border-red-500' : ''
                      }`}
                      placeholder="Enter complete address"
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                  </div>

                  <div>
                    <SearchableSelect
                      label="Country"
                      value={formData.country}
                      onChange={handleCountryChange}
                      options={countries}
                      placeholder="Select country"
                      searchValue={countrySearch}
                      onSearchChange={setCountrySearch}
                      isOpen={isCountryOpen}
                      setIsOpen={setIsCountryOpen}
                      disabled={loadingLocations}
                      required={true}
                      error={errors.country}
                    />
                  </div>

                  <div>
                    <SearchableSelect
                      label="State"
                      value={formData.state}
                      onChange={handleStateChange}
                      options={states}
                      placeholder="Select state"
                      searchValue={stateSearch}
                      onSearchChange={setStateSearch}
                      isOpen={isStateOpen}
                      setIsOpen={setIsStateOpen}
                      disabled={!formData.country || loadingLocations}
                      required={true}
                      error={errors.state}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <SearchableSelect
                        label="City"
                        value={formData.city}
                        onChange={(value) => handleInputChange('city', value)}
                        options={cities}
                        placeholder="Select city"
                        searchValue={citySearch}
                        onSearchChange={setCitySearch}
                        isOpen={isCityOpen}
                        setIsOpen={setIsCityOpen}
                        disabled={!formData.state || loadingLocations}
                        required={true}
                        error={errors.city}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        value={formData.zipcode}
                        onChange={(e) => handleInputChange('zipcode', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter zip code"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Person */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Contact Person</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson.name}
                      onChange={(e) => handleInputChange('contactPerson.name', e.target.value)}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.contactName ? 'border-red-500' : ''
                      }`}
                      placeholder="Enter contact person name"
                    />
                    {errors.contactName && <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.contactPerson.phone}
                        onChange={(e) => handleInputChange('contactPerson.phone', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.contactPhone ? 'border-red-500' : ''
                        }`}
                        placeholder="+91 9876543210"
                      />
                    </div>
                    {errors.contactPhone && <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={formData.contactPerson.email}
                        onChange={(e) => handleInputChange('contactPerson.email', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.contactEmail ? 'border-red-500' : ''
                        }`}
                        placeholder="contact@hotel.com"
                      />
                    </div>
                    {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Images */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Camera className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Images</h2>
                </div>

                <div className="space-y-6">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Hotel Logo
                    </label>
                    {logoPreview ? (
                      <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden group">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeImage('logo')}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'logo')}
                        className="relative"
                      >
                        <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-colors group">
                          <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-500 mb-2" />
                          <span className="text-xs text-gray-500 group-hover:text-blue-600 text-center px-2">
                            Upload Logo
                            <br />
                            <span className="text-[10px]">or drag & drop</span>
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload('logo', e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">Max 5MB. Square format recommended.</p>
                  </div>

                  {/* Cover Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Cover Image
                    </label>
                    {coverPreview ? (
                      <div className="relative w-full h-48 border-2 border-gray-200 rounded-lg overflow-hidden group">
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeImage('cover')}
                            className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'cover')}
                        className="relative"
                      >
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-colors group">
                          <Image className="w-12 h-12 text-gray-400 group-hover:text-blue-500 mb-3" />
                          <span className="text-sm text-gray-500 group-hover:text-blue-600 mb-1 font-medium">Upload Cover Image</span>
                          <span className="text-xs text-gray-400 mb-2">Drag & drop or click to browse</span>
                          <span className="text-xs text-gray-400">Recommended: 1200x400px</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload('cover', e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">Max 5MB. Wide format (3:1 ratio) recommended for best display.</p>
                  </div>

                  {/* Gallery Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Hotel Gallery <span className="text-gray-500">(Optional)</span>
                    </label>
                    
                    {galleryPreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                        {galleryPreviews.map((preview) => (
                          <div key={preview.id} className="relative group">
                            <img
                              src={preview.url}
                              alt="Gallery preview"
                              className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage('gallery', preview.id)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, 'gallery')}
                      className="relative"
                    >
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-colors group">
                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
                        <span className="text-sm text-gray-500 group-hover:text-blue-600 mb-1 font-medium">Add Gallery Images</span>
                        <span className="text-xs text-gray-400">Drag & drop multiple images or click to browse</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleMultipleImageUpload(e.target.files)}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Add up to 10 images. Max 5MB each. JPG, PNG, WebP supported.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Billing Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-orange-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Billing Information (Optional)</h2>
                  <p className="text-sm text-gray-600">Banking and billing details for payments</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Number
                    </label>
                    <input
                      type="text"
                      value={formData.billingInfo.gstNumber}
                      onChange={(e) => handleInputChange('billingInfo.gstNumber', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter GST number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PAN Number
                    </label>
                    <input
                      type="text"
                      value={formData.billingInfo.panNumber}
                      onChange={(e) => handleInputChange('billingInfo.panNumber', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter PAN number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Account Number
                    </label>
                    <div className="relative">
                      <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.billingInfo.bankAccount}
                        onChange={(e) => handleInputChange('billingInfo.bankAccount', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter bank account number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={formData.billingInfo.ifscCode}
                      onChange={(e) => handleInputChange('billingInfo.ifscCode', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter IFSC code"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Status</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hotel Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Submit Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200"
          >
            <button
              type="button"
              onClick={() => navigate('/manager/hotels')}
              className="px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Hotel...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Save Hotel
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default AddHotel;