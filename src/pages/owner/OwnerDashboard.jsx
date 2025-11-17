import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2,
  Users, 
  ChefHat,
  Calendar, 
  Bed,
  ClipboardList, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle,
  CalendarDays,
  Star,
  Eye,
  Plus
} from 'lucide-react';
import ownerService from '../../services/owner/ownerService';
import LoadingSpinner from '../../components/LoadingSpinner';

const OwnerDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalHotels: 12,
    totalRestaurants: 8,
    occupancyRate: 87,
    todayRevenue: 145230
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Try to fetch real data first
      const response = await ownerService.dashboard.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Keep existing mock data if API fails
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color, subtitle }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-sm border-l-4"
        style={{ borderLeftColor: color }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: color + '20', color: color }}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        {change && (
          <div className="mt-3 text-sm text-green-600">
            {change}
          </div>
        )}
      </motion.div>
    );
  };

  const PerformanceCard = ({ title, items, icon: Icon, color }) => {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: color + '20', color: color }}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">{item.subtitle}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{item.value}</p>
                <p className={`text-xs px-2 py-1 rounded-full ${item.statusColor}`}>
                  {item.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    console.log('Dashboard is loading...');
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <LoadingSpinner />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  console.log('Dashboard rendering with stats:', stats);

  const statsData = [
    {
      title: 'Total Hotels',
      value: stats.totalHotels || '12',
      subtitle: '+1 this quarter from last month',
      icon: Building2,
      color: '#3B82F6',
      change: '+1 this quarter from last month'
    },
    {
      title: 'Total Restaurants',
      value: stats.totalRestaurants || '8',
      subtitle: '+2 this month from last month',
      icon: ChefHat,
      color: '#10B981',
      change: '+2 this month from last month'
    },
    {
      title: 'Occupancy Rate',
      value: (stats.occupancyRate || '87') + '%',
      subtitle: '+5% from last month from last month',
      icon: Bed,
      color: '#F59E0B',
      change: '+5% from last month from last month'
    },
    {
      title: "Today's Revenue",
      value: '₹' + (stats.todayRevenue || '145,230').toLocaleString(),
      subtitle: '+12% from yesterday from last month',
      icon: DollarSign,
      color: '#8B5CF6',
      change: '+12% from yesterday from last month'
    }
  ];

  const hotelPerformance = [
    { name: 'Grand Hotel', subtitle: '60 rooms', value: '₹15,230', status: 'excellent', statusColor: 'bg-green-100 text-green-800' },
    { name: 'City Center Hotel', subtitle: '45 rooms', value: '₹12,450', status: 'good', statusColor: 'bg-blue-100 text-blue-800' },
    { name: 'Seaside Resort', subtitle: '51 rooms', value: '₹17,550', status: 'excellent', statusColor: 'bg-green-100 text-green-800' }
  ];

  const restaurantPerformance = [
    { name: 'Main Restaurant', subtitle: '45 orders today', value: '₹8,500', status: 'excellent', statusColor: 'bg-green-100 text-green-800' },
    { name: 'Cafe Corner', subtitle: '32 orders today', value: '₹3,200', status: 'good', statusColor: 'bg-blue-100 text-blue-800' },
    { name: 'Rooftop Dining', subtitle: '28 orders today', value: '₹12,800', status: 'excellent', statusColor: 'bg-green-100 text-green-800' },
    { name: 'Pool Bar', subtitle: '18 orders today', value: '₹2,100', status: 'average', statusColor: 'bg-yellow-100 text-yellow-800' },
    { name: 'Lobby Cafe', subtitle: '19 orders today', value: '₹1,850', status: 'good', statusColor: 'bg-blue-100 text-blue-800' }
  ];

  const alerts = [
    { message: 'Room 204 - Grand Hotel needs maintenance', time: '2 hours ago', type: 'maintenance' },
    { message: 'New reservation from MMT for 3 rooms', time: '4 hours ago', type: 'booking' },
    { message: 'Payment pending for Restaurant Villa order #1234', time: '6 hours ago', type: 'payment' },
    { message: '5 new check-ins completed at City Center Hotel', time: '8 hours ago', type: 'checkin' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Owner Dashboard</h2>
        <p>Welcome to your hotel management dashboard!</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
            subtitle={stat.subtitle}
          />
        ))}
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hotel Performance */}
        <PerformanceCard
          title="Hotel Performance"
          items={hotelPerformance}
          icon={Building2}
          color="#3B82F6"
        />

        {/* Restaurant Performance */}
        <PerformanceCard
          title="Restaurant Performance"
          items={restaurantPerformance}
          icon={ChefHat}
          color="#10B981"
        />

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg mr-3 bg-red-100 text-red-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Restaurant Orders */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg mr-3 bg-green-100 text-green-600">
              <ChefHat className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Restaurant Orders</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-3 text-sm font-medium text-gray-500">Restaurant</th>
                <th className="text-left pb-3 text-sm font-medium text-gray-500">Amount</th>
                <th className="text-left pb-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left pb-3 text-sm font-medium text-gray-500">Time</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              <tr className="border-b">
                <td className="py-3 text-sm text-gray-900">Main Restaurant</td>
                <td className="py-3 text-sm text-gray-900">₹1,250</td>
                <td className="py-3">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Completed</span>
                </td>
                <td className="py-3 text-sm text-gray-500">10 mins ago</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 text-sm text-gray-900">Rooftop Dining</td>
                <td className="py-3 text-sm text-gray-900">₹2,800</td>
                <td className="py-3">
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Preparing</span>
                </td>
                <td className="py-3 text-sm text-gray-500">15 mins ago</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 text-sm text-gray-900">Pool Bar</td>
                <td className="py-3 text-sm text-gray-900">₹850</td>
                <td className="py-3">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Completed</span>
                </td>
                <td className="py-3 text-sm text-gray-500">25 mins ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;