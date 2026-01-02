import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Globe, Users, Building, Calendar, DollarSign,
  Bell, Shield, Save, Upload, Check, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

// Settings state structure
const initialSettings = {
  // General Settings
  general: {
    platformName: 'Hotel Channel Manager',
    platformLogo: null,
    favicon: null,
    defaultCurrency: 'USD',
    defaultTimezone: 'UTC',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    language: 'en',
    multiLanguageSupport: true,
    maintenanceMode: false,
  },
  // User & Role Settings
  userRole: {
    enableRoleCreation: true,
    defaultRole: 'staff',
    maxUsersPerHotel: 50,
    minPasswordLength: 8,
    strongPasswordRequired: true,
    sessionTimeout: 30,
  },
  // Hotel & Restaurant Rules
  hotelRestaurant: {
    maxHotelsPerOwner: 10,
    maxRestaurantsPerHotel: 5,
    enableMultiRestaurant: true,
    enablePOSModule: true,
    enableInventoryModule: true,
    enableChannelManager: true,
  },
  // Reservation Settings
  reservation: {
    defaultCheckInTime: '14:00',
    defaultCheckOutTime: '11:00',
    allowOverbooking: false,
    autoCancelNoShowHours: 24,
    reservationIdPrefix: 'RES',
  },
  // Finance & Tax Settings
  finance: {
    defaultGST: 18,
    serviceCharge: 10,
    enableMultipleTaxSlabs: false,
    enableRounding: true,
    invoiceNumberPrefix: 'INV',
    financialYearStart: 'April',
  },
  // Notification Settings
  notification: {
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: false,
    adminAlertEmail: 'admin@hotelmanager.com',
  },
  // Integration Settings
  integration: {
    paymentGateway: 'razorpay',
    smsGateway: 'twilio',
    whatsappAPI: 'whatsapp-business',
    otaIntegration: true,
  },
  // Security Settings
  security: {
    enable2FA: false,
    maxLoginAttempts: 3,
    ipWhitelist: '',
  },
};

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(initialSettings);
  const [isDirty, setIsDirty] = useState({});

  const tabs = [
    { id: 'general', label: 'General Settings', icon: Settings },
    { id: 'userRole', label: 'User & Role Settings', icon: Users },
    { id: 'hotelRestaurant', label: 'Hotel & Restaurant Rules', icon: Building },
    { id: 'reservation', label: 'Reservation Settings', icon: Calendar },
    { id: 'finance', label: 'Finance & Tax Settings', icon: DollarSign },
    { id: 'notification', label: 'Notification Settings', icon: Bell },
    { id: 'integration', label: 'Integration Settings', icon: Globe },
    { id: 'security', label: 'Security Settings', icon: Shield },
  ];

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setIsDirty(prev => ({ ...prev, [section]: true }));
  };

  const handleFileUpload = (section, field, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange(section, field, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (section) => {
    // Simulate API call
    setTimeout(() => {
      toast.success('Settings saved successfully!');
      setIsDirty(prev => ({ ...prev, [section]: false }));
    }, 500);
  };

  const handleForceLogout = () => {
    toast.success('All users have been logged out successfully!');
  };

  // Render General Settings
  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform Name
          </label>
          <input
            type="text"
            value={settings.general.platformName}
            onChange={(e) => handleInputChange('general', 'platformName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Currency
          </label>
          <select
            value={settings.general.defaultCurrency}
            onChange={(e) => handleInputChange('general', 'defaultCurrency', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="INR">INR - Indian Rupee</option>
            <option value="AED">AED - UAE Dirham</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Timezone
          </label>
          <select
            value={settings.general.defaultTimezone}
            onChange={(e) => handleInputChange('general', 'defaultTimezone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Asia/Dubai">Dubai</option>
            <option value="Asia/Kolkata">India</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Format
          </label>
          <select
            value={settings.general.dateFormat}
            onChange={(e) => handleInputChange('general', 'dateFormat', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Format
          </label>
          <select
            value={settings.general.timeFormat}
            onChange={(e) => handleInputChange('general', 'timeFormat', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="12h">12 Hour</option>
            <option value="24h">24 Hour</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={settings.general.language}
            onChange={(e) => handleInputChange('general', 'language', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="ar">Arabic</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform Logo
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload('general', 'platformLogo', e)}
              className="hidden"
              id="platform-logo"
            />
            <label
              htmlFor="platform-logo"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg cursor-pointer flex items-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Logo
            </label>
            {settings.general.platformLogo && (
              <img
                src={settings.general.platformLogo}
                alt="Platform Logo"
                className="h-12 w-12 object-contain border border-gray-200 rounded"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Favicon
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload('general', 'favicon', e)}
              className="hidden"
              id="favicon"
            />
            <label
              htmlFor="favicon"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg cursor-pointer flex items-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Favicon
            </label>
            {settings.general.favicon && (
              <img
                src={settings.general.favicon}
                alt="Favicon"
                className="h-8 w-8 object-contain border border-gray-200 rounded"
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Multi-Language Support</p>
            <p className="text-sm text-gray-600">Enable multiple languages across the platform</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.general.multiLanguageSupport}
            onChange={(e) => handleInputChange('general', 'multiLanguageSupport', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <p className="font-medium text-gray-900">Maintenance Mode</p>
            <p className="text-sm text-gray-600">Disable public access to the platform</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.general.maintenanceMode}
            onChange={(e) => handleInputChange('general', 'maintenanceMode', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
        </label>
      </div>
    </div>
  );

  // Render User & Role Settings
  const renderUserRoleSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Enable Role Creation</p>
            <p className="text-sm text-gray-600">Allow creating custom roles</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.userRole.enableRoleCreation}
            onChange={(e) => handleInputChange('userRole', 'enableRoleCreation', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Role for New Users
          </label>
          <select
            value={settings.userRole.defaultRole}
            onChange={(e) => handleInputChange('userRole', 'defaultRole', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Users per Hotel
          </label>
          <input
            type="number"
            value={settings.userRole.maxUsersPerHotel}
            onChange={(e) => handleInputChange('userRole', 'maxUsersPerHotel', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min="1"
            max="1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Password Length
          </label>
          <input
            type="number"
            value={settings.userRole.minPasswordLength}
            onChange={(e) => handleInputChange('userRole', 'minPasswordLength', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min="6"
            max="32"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={settings.userRole.sessionTimeout}
            onChange={(e) => handleInputChange('userRole', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min="5"
            max="1440"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Strong Password Required</p>
            <p className="text-sm text-gray-600">Enforce uppercase, numbers, and special characters</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.userRole.strongPasswordRequired}
            onChange={(e) => handleInputChange('userRole', 'strongPasswordRequired', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>
    </div>
  );

  // Render Hotel & Restaurant Rules
  const renderHotelRestaurantSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Hotels per Owner
          </label>
          <input
            type="number"
            value={settings.hotelRestaurant.maxHotelsPerOwner}
            onChange={(e) => handleInputChange('hotelRestaurant', 'maxHotelsPerOwner', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min="1"
            max="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Restaurants per Hotel
          </label>
          <input
            type="number"
            value={settings.hotelRestaurant.maxRestaurantsPerHotel}
            onChange={(e) => handleInputChange('hotelRestaurant', 'maxRestaurantsPerHotel', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min="1"
            max="20"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Enable Multi-Restaurant per Hotel</p>
              <p className="text-sm text-gray-600">Allow multiple restaurants in one hotel</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.hotelRestaurant.enableMultiRestaurant}
              onChange={(e) => handleInputChange('hotelRestaurant', 'enableMultiRestaurant', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Enable POS Module</p>
              <p className="text-sm text-gray-600">Activate Point of Sale system</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.hotelRestaurant.enablePOSModule}
              onChange={(e) => handleInputChange('hotelRestaurant', 'enablePOSModule', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Enable Inventory Module</p>
              <p className="text-sm text-gray-600">Activate inventory management system</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.hotelRestaurant.enableInventoryModule}
              onChange={(e) => handleInputChange('hotelRestaurant', 'enableInventoryModule', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Enable Channel Manager (OTA)</p>
              <p className="text-sm text-gray-600">Connect with online travel agencies</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.hotelRestaurant.enableChannelManager}
              onChange={(e) => handleInputChange('hotelRestaurant', 'enableChannelManager', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  // Render Reservation Settings
  const renderReservationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Check-in Time
          </label>
          <input
            type="time"
            value={settings.reservation.defaultCheckInTime}
            onChange={(e) => handleInputChange('reservation', 'defaultCheckInTime', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Check-out Time
          </label>
          <input
            type="time"
            value={settings.reservation.defaultCheckOutTime}
            onChange={(e) => handleInputChange('reservation', 'defaultCheckOutTime', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Auto Cancel No-Show (hours)
          </label>
          <input
            type="number"
            value={settings.reservation.autoCancelNoShowHours}
            onChange={(e) => handleInputChange('reservation', 'autoCancelNoShowHours', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min="1"
            max="72"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reservation ID Prefix
          </label>
          <input
            type="text"
            value={settings.reservation.reservationIdPrefix}
            onChange={(e) => handleInputChange('reservation', 'reservationIdPrefix', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            maxLength="5"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <div>
            <p className="font-medium text-gray-900">Allow Overbooking</p>
            <p className="text-sm text-gray-600">Enable accepting reservations beyond capacity</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.reservation.allowOverbooking}
            onChange={(e) => handleInputChange('reservation', 'allowOverbooking', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
        </label>
      </div>
    </div>
  );

  // Render Finance & Tax Settings
  const renderFinanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default GST (%)
          </label>
          <input
            type="number"
            value={settings.finance.defaultGST}
            onChange={(e) => handleInputChange('finance', 'defaultGST', parseFloat(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min="0"
            max="100"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Charge (%)
          </label>
          <input
            type="number"
            value={settings.finance.serviceCharge}
            onChange={(e) => handleInputChange('finance', 'serviceCharge', parseFloat(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min="0"
            max="100"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Invoice Number Prefix
          </label>
          <input
            type="text"
            value={settings.finance.invoiceNumberPrefix}
            onChange={(e) => handleInputChange('finance', 'invoiceNumberPrefix', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            maxLength="5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Financial Year Start
          </label>
          <select
            value={settings.finance.financialYearStart}
            onChange={(e) => handleInputChange('finance', 'financialYearStart', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="January">January</option>
            <option value="April">April</option>
            <option value="July">July</option>
            <option value="October">October</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Enable Multiple Tax Slabs</p>
              <p className="text-sm text-gray-600">Allow different tax rates for different items</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.finance.enableMultipleTaxSlabs}
              onChange={(e) => handleInputChange('finance', 'enableMultipleTaxSlabs', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Enable Rounding</p>
              <p className="text-sm text-gray-600">Round final amounts to nearest integer</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.finance.enableRounding}
              onChange={(e) => handleInputChange('finance', 'enableRounding', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  // Render Notification Settings
  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Admin Alert Email
        </label>
        <input
          type="email"
          value={settings.notification.adminAlertEmail}
          onChange={(e) => handleInputChange('notification', 'adminAlertEmail', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Send notifications via email</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notification.emailNotifications}
              onChange={(e) => handleInputChange('notification', 'emailNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-600">Send notifications via SMS</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notification.smsNotifications}
              onChange={(e) => handleInputChange('notification', 'smsNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">WhatsApp Notifications</p>
              <p className="text-sm text-gray-600">Send notifications via WhatsApp</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notification.whatsappNotifications}
              onChange={(e) => handleInputChange('notification', 'whatsappNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  // Render Integration Settings
  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Gateway
          </label>
          <select
            value={settings.integration.paymentGateway}
            onChange={(e) => handleInputChange('integration', 'paymentGateway', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="razorpay">Razorpay</option>
            <option value="stripe">Stripe</option>
            <option value="paypal">PayPal</option>
            <option value="square">Square</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMS Gateway
          </label>
          <select
            value={settings.integration.smsGateway}
            onChange={(e) => handleInputChange('integration', 'smsGateway', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="twilio">Twilio</option>
            <option value="nexmo">Nexmo</option>
            <option value="msg91">MSG91</option>
            <option value="aws-sns">AWS SNS</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp API
          </label>
          <select
            value={settings.integration.whatsappAPI}
            onChange={(e) => handleInputChange('integration', 'whatsappAPI', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="whatsapp-business">WhatsApp Business API</option>
            <option value="twilio-whatsapp">Twilio WhatsApp</option>
            <option value="360dialog">360dialog</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">OTA Integration</p>
            <p className="text-sm text-gray-600">Connect with Booking.com, Expedia, etc.</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.integration.otaIntegration}
            onChange={(e) => handleInputChange('integration', 'otaIntegration', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>
    </div>
  );

  // Render Security Settings
  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Login Attempts
          </label>
          <input
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min="1"
            max="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IP Whitelist (comma-separated)
          </label>
          <input
            type="text"
            value={settings.security.ipWhitelist}
            onChange={(e) => handleInputChange('security', 'ipWhitelist', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="192.168.1.1, 10.0.0.1"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Enable Two-Factor Authentication</p>
            <p className="text-sm text-gray-600">Require 2FA for all users</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.security.enable2FA}
            onChange={(e) => handleInputChange('security', 'enable2FA', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>

      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-start gap-3 mb-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Force Logout All Users</p>
            <p className="text-sm text-gray-600">
              This will immediately log out all users from the system. Use this in case of security breach.
            </p>
          </div>
        </div>
        <button
          onClick={handleForceLogout}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Shield className="w-4 h-4" />
          Force Logout All Users
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'userRole':
        return renderUserRoleSettings();
      case 'hotelRestaurant':
        return renderHotelRestaurantSettings();
      case 'reservation':
        return renderReservationSettings();
      case 'finance':
        return renderFinanceSettings();
      case 'notification':
        return renderNotificationSettings();
      case 'integration':
        return renderIntegrationSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3 mb-1">
          <Settings className="h-7 w-7 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        </div>
        <p className="text-sm text-gray-600">
          Configure global system settings and preferences
        </p>
      </div>

      {/* Content - Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Left Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-6">
            <div className="p-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                Settings Menu
              </h3>
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                          : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Section Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              {tabs.map((tab) => {
                if (tab.id === activeTab) {
                  const Icon = tab.icon;
                  return (
                    <div key={tab.id} className="flex items-center gap-3">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <Icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{tab.label}</h2>
                        <p className="text-sm text-gray-500">
                          {tab.id === 'general' && 'Configure platform branding and regional settings'}
                          {tab.id === 'userRole' && 'Manage user access and authentication settings'}
                          {tab.id === 'hotelRestaurant' && 'Define business rules for hotels and restaurants'}
                          {tab.id === 'reservation' && 'Configure booking and reservation policies'}
                          {tab.id === 'finance' && 'Set up tax rates and financial preferences'}
                          {tab.id === 'notification' && 'Configure notification channels and alerts'}
                          {tab.id === 'integration' && 'Manage third-party service integrations'}
                          {tab.id === 'security' && 'Configure security and access control settings'}
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* Content */}
            <div className="p-6">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}

                {/* Save Button */}
                <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-gray-200">
                  {isDirty[activeTab] && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-amber-700 font-medium">Unsaved changes</span>
                    </div>
                  )}
                  <div className="flex gap-3 ml-auto">
                    <button
                      onClick={() => setSettings(initialSettings)}
                      className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors border border-gray-300"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => handleSave(activeTab)}
                      className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      Save Settings
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
