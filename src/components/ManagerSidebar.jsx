import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Bed,
  ChefHat,
  Users,
  Calendar,
  ClipboardList,
  UserCheck,
  Wrench,
  DollarSign,
  BarChart3,
  Settings,
  Bell,
  ChevronDown,
  ChevronRight,
  Home,
  Plus,
  List,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Search,
  CreditCard,
  FileText,
  ShoppingCart,
  Truck,
  TrendingUp,
  UserPlus,
  Shield,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const ManagerSidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({
    dashboard: false,
    hotels: false,
    restaurants: false,
    agents: false,
    reservations: false,
    frontOffice: false,
    housekeeping: false,
    finance: false,
    reports: false,
    staff: false,
    notifications: false,
    settings: false
  });

  const toggleExpanded = (item) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/manager/dashboard',
      children: [
        { title: 'Overview', path: '/manager/dashboard', icon: Eye },
        { title: 'Occupancy Rate', path: '/manager/occupancy', icon: TrendingUp },
        { title: 'Orders Summary', path: '/manager/orders-summary', icon: ClipboardList },
        { title: 'Revenue Snapshot', path: '/manager/revenue', icon: DollarSign },
        { title: 'Alerts & Notifications', path: '/manager/alerts', icon: Bell }
      ]
    },
    {
      id: 'hotels',
      title: 'Hotel Management',
      icon: Building2,
      children: [
        {
          title: 'Manage Hotels',
          children: [
            { title: 'Hotel List', path: '/manager/hotels', icon: List },
            { title: 'Add Hotel', path: '/manager/hotels/add', icon: Plus },
            { title: 'Hotel Profiles', path: '/manager/hotels/profiles', icon: Eye }
          ]
        },
        {
          title: 'Room Management',
          children: [
            { title: 'All Rooms', path: '/manager/rooms', icon: Bed },
            { title: 'Room Categories', path: '/manager/rooms/categories', icon: List },
            { title: 'Room Status', path: '/manager/rooms/status', icon: Eye }
          ]
        }
      ]
    },
    {
      id: 'restaurants',
      title: 'Restaurant Management',
      icon: ChefHat,
      children: [
        {
          title: 'Manage Restaurants',
          children: [
            { title: 'Restaurant List', path: '/manager/restaurants', icon: List },
            { title: 'Add Restaurant', path: '/manager/restaurants/add', icon: Plus },
            { title: 'Restaurant Info', path: '/manager/restaurants/info', icon: Eye }
          ]
        },
        {
          title: 'Menu Management',
          children: [
            { title: 'Menu Categories', path: '/manager/menu/categories', icon: List },
            { title: 'Menu Items', path: '/manager/menu/items', icon: ChefHat }
          ]
        },
        {
          title: 'Orders',
          children: [
            { title: 'All Orders', path: '/manager/restaurant-orders', icon: List },
            { title: 'Pending Orders', path: '/manager/restaurant-orders/pending', icon: Clock },
            { title: 'Completed Orders', path: '/manager/restaurant-orders/completed', icon: CheckCircle }
          ]
        },
        { title: 'KOT (Kitchen Orders)', path: '/manager/kot', icon: ClipboardList },
        { title: 'POS (Billing & Payments)', path: '/manager/pos', icon: CreditCard }
      ]
    },
    {
      id: 'agents',
      title: 'Agent Management',
      icon: Users,
      children: [
        { title: 'Add Agents', path: '/manager/agents/add', icon: UserPlus },
        { title: 'Agent List', path: '/manager/agents', icon: List },
        { title: 'Agent Reservations', path: '/manager/agents/reservations', icon: Calendar },
        { title: 'Commission Management', path: '/manager/agents/commission', icon: DollarSign },
        { title: 'Agent Reports', path: '/manager/agents/reports', icon: BarChart3 }
      ]
    },
    {
      id: 'reservations',
      title: 'Reservation System',
      icon: Calendar,
      children: [
        { title: 'All Reservations', path: '/manager/reservations', icon: List },
        { title: 'Confirmed', path: '/manager/reservations/confirmed', icon: CheckCircle },
        { title: 'Cancelled', path: '/manager/reservations/cancelled', icon: XCircle },
        { title: 'On Hold', path: '/manager/reservations/hold', icon: Pause },
        { title: 'Search / Filter', path: '/manager/reservations/search', icon: Search }
      ]
    },
    {
      id: 'frontOffice',
      title: 'Front Office',
      icon: UserCheck,
      children: [
        { title: 'Check-in / Check-out', path: '/manager/front-office/checkin', icon: UserCheck },
        { title: 'Guest Details', path: '/manager/front-office/guests', icon: Users },
        { title: 'Billing', path: '/manager/front-office/billing', icon: CreditCard }
      ]
    },
    {
      id: 'housekeeping',
      title: 'Housekeeping',
      icon: Wrench,
      children: [
        { title: 'Assign Staff to Rooms', path: '/manager/housekeeping/assign', icon: UserPlus },
        { title: 'Cleaning Status', path: '/manager/housekeeping/status', icon: Eye },
        { title: 'Maintenance Requests', path: '/manager/housekeeping/maintenance', icon: Wrench }
      ]
    },
    {
      id: 'finance',
      title: 'Finance & Accounts',
      icon: DollarSign,
      children: [
        { title: 'Revenue Dashboard', path: '/manager/finance/revenue', icon: TrendingUp },
        { title: 'Hotel Sales Reports', path: '/manager/finance/hotel-sales', icon: BarChart3 },
        { title: 'Restaurant Sales Reports', path: '/manager/finance/restaurant-sales', icon: BarChart3 },
        { title: 'Expense Management', path: '/manager/finance/expenses', icon: FileText },
        {
          title: 'Vendors',
          children: [
            { title: 'Vendor List', path: '/manager/vendors', icon: List },
            { title: 'Vendor Categories', path: '/manager/vendors/categories', icon: List },
            { title: 'Purchase Orders', path: '/manager/vendors/orders', icon: ShoppingCart }
          ]
        },
        { title: 'Payment Tracking', path: '/manager/finance/payments', icon: CreditCard }
      ]
    },
    {
      id: 'reports',
      title: 'Reports',
      icon: BarChart3,
      children: [
        { title: 'Reservation Reports', path: '/manager/reports/reservations', icon: Calendar },
        { title: 'Sales Reports', path: '/manager/reports/sales', icon: TrendingUp },
        { title: 'Revenue Reports', path: '/manager/reports/revenue', icon: DollarSign },
        { title: 'Staff Performance', path: '/manager/reports/staff', icon: Users },
        { title: 'Agent Booking Reports', path: '/manager/reports/agents', icon: BarChart3 }
      ]
    },
    {
      id: 'staff',
      title: 'Staff Management',
      icon: Users,
      children: [
        { title: 'Add Staff', path: '/manager/staff/add', icon: UserPlus },
        { title: 'Staff List', path: '/manager/staff', icon: List },
        { title: 'Assign to Hotel/Restaurant', path: '/manager/staff/assign', icon: MapPin },
        { title: 'Roles & Permissions', path: '/manager/staff/roles', icon: Shield },
        { title: 'Active / Inactive Status', path: '/manager/staff/status', icon: Eye }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      children: [
        { title: 'Booking Alerts', path: '/manager/notifications/bookings', icon: Calendar },
        { title: 'Payment Alerts', path: '/manager/notifications/payments', icon: DollarSign },
        { title: 'Maintenance Alerts', path: '/manager/notifications/maintenance', icon: Wrench },
        { title: 'Staff Alerts', path: '/manager/notifications/staff', icon: Users }
      ]
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      children: [
        { title: 'Organization Info', path: '/manager/settings/organization', icon: Building2 },
        { title: 'Tax / Discount Settings', path: '/manager/settings/tax', icon: DollarSign },
        { title: 'Payment Gateway Settings', path: '/manager/settings/payment', icon: CreditCard },
        { title: 'Profile & Security', path: '/manager/settings/profile', icon: Shield }
      ]
    }
  ];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const renderMenuItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.id];
    const Icon = item.icon;

    if (hasChildren) {
      return (
        <div key={item.id || item.title} className="mb-1">
          <button
            onClick={() => item.id && toggleExpanded(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 text-left text-gray-700 hover:bg-gray-100 transition duration-200 ${
              level > 0 ? 'pl-8' : ''
            }`}
          >
            <div className="flex items-center">
              {Icon && <Icon className="h-5 w-5 mr-3" />}
              <span className="font-medium">{item.title}</span>
            </div>
            {item.id && (isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
          </button>
          {item.id && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="ml-4 border-l border-gray-200"
            >
              {item.children.map((child) => renderMenuItem(child, level + 1))}
            </motion.div>
          )}
          {!item.id && (
            <div className="ml-4 border-l border-gray-200">
              {item.children.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center px-4 py-3 mb-1 text-gray-700 hover:bg-gray-100 transition duration-200 ${
          isActiveLink(item.path) ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
        } ${level > 0 ? 'pl-8' : ''}`}
      >
        {Icon && <Icon className="h-5 w-5 mr-3" />}
        <span className="font-medium">{item.title}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-white mr-3" />
              <div>
                <h2 className="text-white text-lg font-bold">Manager Portal</h2>
                <p className="text-blue-100 text-sm">Multi-Property Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2">
              {menuItems.map((item) => renderMenuItem(item))}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-center text-sm text-gray-600">
              <p>Manager Dashboard v1.0</p>
              <p className="text-xs text-gray-500 mt-1">© 2025 Hotel Management</p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ManagerSidebar;