import React, { useState } from 'react';
import {
  Restaurant,
  TrendingUp,
  Download,
  Search,
  ArrowUpDown,
  Users,
  Clock,
  ChefHat,
  Receipt,
  Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../../components/ui/table';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const RestaurantSalesReport = ({ dateRange, selectedHotel, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'revenue', direction: 'desc' });

  // Mock data for restaurant sales
  const outletData = [
    { outlet: 'Main Restaurant', revenue: 125000, orders: 456, avgBill: 274, rating: 4.8 },
    { outlet: 'Rooftop Bar', revenue: 89000, orders: 234, avgBill: 380, rating: 4.6 },
    { outlet: 'Coffee Shop', revenue: 45000, orders: 789, avgBill: 57, rating: 4.7 },
    { outlet: 'Pool Bar', revenue: 67000, orders: 167, avgBill: 401, rating: 4.5 }
  ];

  // Category-wise sales
  const categoryData = [
    { category: 'Appetizers', revenue: 45000, orders: 234, color: '#3B82F6' },
    { category: 'Main Course', revenue: 156000, orders: 567, color: '#10B981' },
    { category: 'Desserts', revenue: 23000, orders: 189, color: '#F59E0B' },
    { category: 'Beverages', revenue: 67000, orders: 345, color: '#EF4444' },
    { category: 'Alcohol', revenue: 89000, orders: 123, color: '#8B5CF6' }
  ];

  // Top menu items
  const topMenuItems = [
    { item: 'Butter Chicken', quantity: 123, revenue: 36900, category: 'Main Course' },
    { item: 'Margherita Pizza', quantity: 89, revenue: 22250, category: 'Main Course' },
    { item: 'Caesar Salad', quantity: 67, revenue: 13400, category: 'Appetizers' },
    { item: 'Chocolate Cake', quantity: 45, revenue: 11250, category: 'Desserts' },
    { item: 'Masala Chai', quantity: 234, revenue: 7020, category: 'Beverages' }
  ];

  // Daily sales trend
  const salesTrendData = [
    { date: 'Jan 15', revenue: 45000, orders: 123 },
    { date: 'Jan 16', revenue: 52000, orders: 145 },
    { date: 'Jan 17', revenue: 48000, orders: 134 },
    { date: 'Jan 18', revenue: 67000, orders: 189 },
    { date: 'Jan 19', revenue: 59000, orders: 167 },
    { date: 'Jan 20', revenue: 72000, orders: 201 },
    { date: 'Jan 21', revenue: 81000, orders: 234 }
  ];

  // Table turnover data
  const tableData = [
    { table: 'T-01', turns: 8, revenue: 12400, avgTime: 45 },
    { table: 'T-02', turns: 6, revenue: 9800, avgTime: 52 },
    { table: 'T-03', turns: 7, revenue: 11200, avgTime: 48 },
    { table: 'T-04', turns: 9, revenue: 15600, avgTime: 42 },
    { table: 'T-05', turns: 5, revenue: 8900, avgTime: 58 }
  ];

  const handleExport = (format) => {
    console.log(`Exporting restaurant sales report as ${format}`);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Restaurant Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total F&B Revenue</CardTitle>
            <Restaurant className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹3,26,000</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↗ +18.3%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,646</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↗ +12.7%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Bill</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹198</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↗ +5.1%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↗ +0.2</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales Trend</CardTitle>
            <CardDescription>Restaurant revenue and orders over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" name="Revenue (₹)" />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category-wise Sales</CardTitle>
            <CardDescription>Revenue distribution by food category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                  label={({ category, revenue }) => `${category}: ₹${(revenue/1000)}K`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Outlet Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Outlet-wise Performance</CardTitle>
          <CardDescription>Revenue and performance metrics by outlet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {outletData.map((outlet, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{outlet.outlet}</h4>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{outlet.rating}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium">₹{outlet.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Orders:</span>
                    <span className="font-medium">{outlet.orders}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg Bill:</span>
                    <span className="font-medium">₹{outlet.avgBill}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Menu Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
            <CardDescription>Most popular menu items by quantity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topMenuItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{item.item}</div>
                      <div className="text-sm text-gray-600">{item.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{item.revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{item.quantity} orders</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Table Turnover */}
        <Card>
          <CardHeader>
            <CardTitle>Table Turnover</CardTitle>
            <CardDescription>Table efficiency and revenue metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tableData.map((table, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium">{table.table}</div>
                      <div className="text-sm text-gray-600">{table.turns} turns</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{table.revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {table.avgTime}m avg
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Restaurant Sales Data</span>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleExport('csv')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                CSV
              </Button>
              <Button
                onClick={() => handleExport('excel')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Excel
              </Button>
              <Button
                onClick={() => handleExport('pdf')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Receipt className="w-4 h-4" />
                PDF
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Sales Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('orders')}>
                    <div className="flex items-center gap-1">
                      Orders
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('revenue')}>
                    <div className="flex items-center gap-1">
                      Revenue
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead>Avg Bill</TableHead>
                  <TableHead>Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryData.map((category, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        {category.category}
                      </div>
                    </TableCell>
                    <TableCell>{category.orders}</TableCell>
                    <TableCell>₹{category.revenue.toLocaleString()}</TableCell>
                    <TableCell>₹{Math.round(category.revenue / category.orders)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {((category.revenue / categoryData.reduce((sum, cat) => sum + cat.revenue, 0)) * 100).toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantSalesReport;