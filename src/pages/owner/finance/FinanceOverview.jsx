import React, { useState, useEffect } from 'react';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiCalendar,
  FiDownload,
  FiFilter
} from 'react-icons/fi';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import ownerService from '../../../services/owner/ownerService';
import LoadingSpinner from '../../../components/LoadingSpinner';

const FinanceOverview = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [revenueData, setRevenueData] = useState([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);

  // Mock data
  const mockRevenueData = [
    { month: 'Jan', revenue: 45000, expenses: 30000, profit: 15000 },
    { month: 'Feb', revenue: 52000, expenses: 32000, profit: 20000 },
    { month: 'Mar', revenue: 48000, expenses: 31000, profit: 17000 },
    { month: 'Apr', revenue: 61000, expenses: 35000, profit: 26000 },
    { month: 'May', revenue: 58000, expenses: 34000, profit: 24000 },
    { month: 'Jun', revenue: 67000, expenses: 38000, profit: 29000 }
  ];

  const mockExpenseBreakdown = [
    { name: 'Staff Salaries', value: 35000, color: '#3B82F6' },
    { name: 'Utilities', value: 12000, color: '#10B981' },
    { name: 'Maintenance', value: 8000, color: '#F59E0B' },
    { name: 'Marketing', value: 5000, color: '#EF4444' },
    { name: 'Supplies', value: 7000, color: '#8B5CF6' },
    { name: 'Other', value: 3000, color: '#6B7280' }
  ];

  useEffect(() => {
    fetchFinanceData();
  }, [selectedPeriod]);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const response = await ownerService.finance.getOverview(selectedPeriod);
      setOverview(response.data.data);
      setRevenueData(mockRevenueData);
      setExpenseBreakdown(mockExpenseBreakdown);
    } catch (error) {
      console.error('Error fetching finance data:', error);
      // Mock data for demonstration
      setOverview({
        totalRevenue: 345000,
        totalExpenses: 200000,
        netProfit: 145000,
        profitMargin: 42,
        revenueGrowth: 12.5,
        expenseGrowth: 8.2
      });
      setRevenueData(mockRevenueData);
      setExpenseBreakdown(mockExpenseBreakdown);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color, isCurrency = true, isPercentage = false }) => {
    const isPositive = change >= 0;
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {isCurrency && '$'}
              {typeof value === 'number' ? value.toLocaleString() : value}
              {isPercentage && '%'}
            </p>
            {change !== undefined && (
              <div className={`flex items-center mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? <FiTrendingUp className="h-4 w-4 mr-1" /> : <FiTrendingDown className="h-4 w-4 mr-1" />}
                <span className="text-sm font-medium">
                  {Math.abs(change)}% from last period
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Overview</h1>
          <p className="text-gray-600">Track your financial performance and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FiDownload className="mr-2 h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={overview.totalRevenue}
          change={overview.revenueGrowth}
          icon={FiDollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Total Expenses"
          value={overview.totalExpenses}
          change={-overview.expenseGrowth}
          icon={FiDollarSign}
          color="bg-red-500"
        />
        <StatCard
          title="Net Profit"
          value={overview.netProfit}
          change={15.2}
          icon={FiTrendingUp}
          color="bg-blue-500"
        />
        <StatCard
          title="Profit Margin"
          value={overview.profitMargin}
          change={2.1}
          icon={FiDollarSign}
          color="bg-purple-500"
          isCurrency={false}
          isPercentage={true}
        />
      </div>

      {/* Revenue & Profit Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Revenue & Profit Trend</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Profit</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Expenses</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="profit" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#EF4444" 
              strokeWidth={3}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Expense Breakdown & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Expense Breakdown</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  label={(entry) => `${entry.name}: $${entry.value.toLocaleString()}`}
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiDollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Add Expense</p>
                  <p className="text-sm text-gray-600">Record new expense</p>
                </div>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiTrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">View Revenue</p>
                  <p className="text-sm text-gray-600">Detailed revenue analysis</p>
                </div>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiCalendar className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">P&L Report</p>
                  <p className="text-sm text-gray-600">Generate profit & loss</p>
                </div>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FiDownload className="h-5 w-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Export Data</p>
                  <p className="text-sm text-gray-600">Download financial data</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Room booking payment</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Revenue
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">+$450.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Nov 15, 2025</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Staff salary payment</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Expense
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-$2,500.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Nov 14, 2025</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceOverview;