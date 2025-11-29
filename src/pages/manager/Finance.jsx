import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  Receipt,
  PieChart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  Users,
  ChefHat
} from 'lucide-react';

const Finance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [financeData, setFinanceData] = useState({
    overview: {
      totalRevenue: 2456789,
      totalExpenses: 1234567,
      netProfit: 1222222,
      profitMargin: 49.8
    },
    revenueBreakdown: {
      rooms: 1850000,
      restaurant: 450000,
      events: 120000,
      other: 36789
    },
    expenseBreakdown: {
      salaries: 650000,
      utilities: 180000,
      maintenance: 120000,
      supplies: 95000,
      marketing: 75000,
      other: 114567
    },
    transactions: [
      {
        id: 'TXN001',
        type: 'revenue',
        description: 'Room Booking - Suite #205',
        amount: 15000,
        date: '2024-01-15',
        status: 'completed',
        category: 'rooms'
      },
      {
        id: 'TXN002',
        type: 'expense',
        description: 'Staff Salary - January',
        amount: 650000,
        date: '2024-01-31',
        status: 'completed',
        category: 'salaries'
      },
      {
        id: 'TXN003',
        type: 'revenue',
        description: 'Restaurant Order #R145',
        amount: 2500,
        date: '2024-01-15',
        status: 'pending',
        category: 'restaurant'
      }
    ]
  });

  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'revenue',
    description: '',
    amount: '',
    category: 'rooms',
    date: new Date().toISOString().split('T')[0]
  });

  const revenueCategories = [
    { id: 'rooms', label: 'Room Bookings', icon: Building2, color: 'blue' },
    { id: 'restaurant', label: 'Restaurant', icon: ChefHat, color: 'orange' },
    { id: 'events', label: 'Events & Banquet', icon: Calendar, color: 'green' },
    { id: 'other', label: 'Other Services', icon: Users, color: 'purple' }
  ];

  const expenseCategories = [
    { id: 'salaries', label: 'Staff Salaries', icon: Users, color: 'red' },
    { id: 'utilities', label: 'Utilities', icon: Building2, color: 'yellow' },
    { id: 'maintenance', label: 'Maintenance', icon: Edit, color: 'indigo' },
    { id: 'supplies', label: 'Supplies', icon: Receipt, color: 'pink' },
    { id: 'marketing', label: 'Marketing', icon: TrendingUp, color: 'teal' },
    { id: 'other', label: 'Other Expenses', icon: DollarSign, color: 'gray' }
  ];

  const getStatusBadge = (status) => {
    const config = {
      completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      failed: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle }
    };
    
    const { bg, text, icon: Icon } = config[status] || config.pending;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getTransactionIcon = (type) => {
    return type === 'revenue' ? ArrowUpRight : ArrowDownLeft;
  };

  const getTransactionColor = (type) => {
    return type === 'revenue' ? 'text-green-600' : 'text-red-600';
  };

  const handleAddTransaction = () => {
    // Add transaction logic here
    console.log('Adding transaction:', newTransaction);
    setShowAddTransaction(false);
    setNewTransaction({
      type: 'revenue',
      description: '',
      amount: '',
      category: 'rooms',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const calculatePercentage = (value, total) => {
    return ((value / total) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Finance Management</h1>
            <p className="text-gray-600">Track revenue, expenses, and financial performance</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button 
              onClick={() => setShowAddTransaction(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>
          </div>
        </div>
      </motion.div>

      {/* Financial Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{financeData.overview.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-600">+12.5% from last month</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">₹{financeData.overview.totalExpenses.toLocaleString()}</p>
              <p className="text-xs text-red-600">+8.2% from last month</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900">₹{financeData.overview.netProfit.toLocaleString()}</p>
              <p className="text-xs text-green-600">+18.7% from last month</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profit Margin</p>
              <p className="text-2xl font-bold text-gray-900">{financeData.overview.profitMargin}%</p>
              <p className="text-xs text-green-600">+2.3% from last month</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <PieChart className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Revenue & Expense Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Revenue Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Breakdown</h3>
            <button className="text-blue-600 hover:text-blue-700">
              <Eye className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {revenueCategories.map((category) => {
              const amount = financeData.revenueBreakdown[category.id];
              const percentage = calculatePercentage(amount, financeData.overview.totalRevenue);
              const Icon = category.icon;
              
              return (
                <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                      <Icon className={`h-4 w-4 text-${category.color}-600`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category.label}</p>
                      <p className="text-sm text-gray-600">{percentage}% of total</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">₹{amount.toLocaleString()}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Expense Breakdown</h3>
            <button className="text-blue-600 hover:text-blue-700">
              <Eye className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {expenseCategories.map((category) => {
              const amount = financeData.expenseBreakdown[category.id];
              const percentage = calculatePercentage(amount, financeData.overview.totalExpenses);
              const Icon = category.icon;
              
              return (
                <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                      <Icon className={`h-4 w-4 text-${category.color}-600`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category.label}</p>
                      <p className="text-sm text-gray-600">{percentage}% of total</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">₹{amount.toLocaleString()}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_quarter">This Quarter</option>
              <option value="this_year">This Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="revenue">Revenue Only</option>
              <option value="expenses">Expenses Only</option>
              <option value="rooms">Room Bookings</option>
              <option value="restaurant">Restaurant</option>
              <option value="salaries">Salaries</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-end gap-2">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-1 justify-center">
              <Filter className="w-4 h-4" />
              Apply Filters
            </button>
            <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm">View All</button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {financeData.transactions.map((transaction) => {
                const Icon = getTransactionIcon(transaction.type);
                const colorClass = getTransactionColor(transaction.type);
                
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${transaction.type === 'revenue' ? 'bg-green-100' : 'bg-red-100'}`}>
                          <Icon className={`h-4 w-4 ${colorClass}`} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                          <div className="text-sm text-gray-500">ID: {transaction.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`capitalize text-sm font-medium ${colorClass}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.type === 'revenue' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Transaction</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="revenue">Revenue</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter transaction description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {newTransaction.type === 'revenue' ? (
                    <>
                      <option value="rooms">Room Bookings</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="events">Events</option>
                      <option value="other">Other</option>
                    </>
                  ) : (
                    <>
                      <option value="salaries">Salaries</option>
                      <option value="utilities">Utilities</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="supplies">Supplies</option>
                      <option value="marketing">Marketing</option>
                      <option value="other">Other</option>
                    </>
                  )}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddTransaction(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTransaction}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Transaction
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Finance;