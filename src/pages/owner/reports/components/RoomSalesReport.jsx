import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building,
  TrendingUp,
  Download,
  Search,
  ArrowUpDown,
  Calendar,
  DollarSign,
  Bed,
  Users,
  CreditCard,
  Receipt
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
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const RoomSalesReport = ({ dateRange, selectedHotel, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Mock data for room sales
  const roomSalesData = [
    { date: '2024-01-15', roomType: 'Deluxe', rooms: 15, revenue: 67500, adr: 4500, occupancy: 75 },
    { date: '2024-01-16', roomType: 'Suite', rooms: 8, revenue: 56000, adr: 7000, occupancy: 80 },
    { date: '2024-01-17', roomType: 'Standard', rooms: 25, revenue: 75000, adr: 3000, occupancy: 83 },
    { date: '2024-01-18', roomType: 'Premium', rooms: 12, revenue: 72000, adr: 6000, occupancy: 72 },
    { date: '2024-01-19', roomType: 'Deluxe', rooms: 18, revenue: 81000, adr: 4500, occupancy: 90 }
  ];

  // Revenue trend data
  const revenueTrendData = [
    { date: 'Jan 15', rooms: 67500, restaurant: 25000 },
    { date: 'Jan 16', rooms: 56000, restaurant: 18000 },
    { date: 'Jan 17', rooms: 75000, restaurant: 32000 },
    { date: 'Jan 18', rooms: 72000, restaurant: 28000 },
    { date: 'Jan 19', rooms: 81000, restaurant: 35000 },
    { date: 'Jan 20', rooms: 69000, restaurant: 22000 },
    { date: 'Jan 21', rooms: 88000, restaurant: 40000 }
  ];

  // Room type distribution
  const roomTypeData = [
    { name: 'Deluxe', value: 35, color: '#3B82F6' },
    { name: 'Suite', value: 25, color: '#10B981' },
    { name: 'Standard', value: 30, color: '#F59E0B' },
    { name: 'Premium', value: 10, color: '#EF4444' }
  ];

  // Payment method breakdown
  const paymentData = [
    { method: 'Card', amount: 125000, percentage: 45 },
    { method: 'UPI', amount: 89000, percentage: 32 },
    { method: 'Cash', amount: 45000, percentage: 16 },
    { method: 'Online', amount: 19000, percentage: 7 }
  ];

  const handleExport = (format) => {
    console.log(`Exporting room sales report as ${format}`);
    // Mock export functionality
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
      {/* Room Sales Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Room Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹3,51,500</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↗ +12.5%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rooms Sold</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↗ +8.2%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average ADR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹4,506</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↗ +3.8%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↗ +5.2%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily room revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="rooms" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Room Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Room Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Room Type Distribution</CardTitle>
            <CardDescription>Revenue by room category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roomTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {roomTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method Breakdown</CardTitle>
          <CardDescription>Revenue distribution by payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentData.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium">{payment.method}</div>
                    <div className="text-sm text-gray-600">₹{payment.amount.toLocaleString()}</div>
                  </div>
                </div>
                <Badge variant="secondary">{payment.percentage}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Detailed Room Sales Data</span>
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
                placeholder="Search room sales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('roomType')}
                  >
                    <div className="flex items-center gap-1">
                      Room Type
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('rooms')}
                  >
                    <div className="flex items-center gap-1">
                      Rooms Sold
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('revenue')}
                  >
                    <div className="flex items-center gap-1">
                      Revenue
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('adr')}
                  >
                    <div className="flex items-center gap-1">
                      ADR
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('occupancy')}
                  >
                    <div className="flex items-center gap-1">
                      Occupancy
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roomSalesData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{row.roomType}</Badge>
                    </TableCell>
                    <TableCell>{row.rooms}</TableCell>
                    <TableCell>₹{row.revenue.toLocaleString()}</TableCell>
                    <TableCell>₹{row.adr.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${row.occupancy}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{row.occupancy}%</span>
                      </div>
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

export default RoomSalesReport;