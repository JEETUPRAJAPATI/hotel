import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Download,
  CreditCard,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const FinanceReport = ({ dateRange, selectedHotel, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const financeStats = {
    totalRevenue: 5327000,
    roomRevenue: 3516000,
    restaurantRevenue: 1234000,
    addonRevenue: 577000,
    collections: 4892000,
    outstanding: 435000,
    refunds: 89000,
    payouts: 234000
  };

  const revenueBreakdown = [
    { category: 'Room Revenue', amount: 3516000, percentage: 66, color: '#3B82F6' },
    { category: 'F&B Revenue', amount: 1234000, percentage: 23, color: '#10B981' },
    { category: 'Addon Services', amount: 577000, percentage: 11, color: '#F59E0B' }
  ];

  const collectionTrend = [
    { date: 'Jan 15', collections: 456000, outstanding: 89000 },
    { date: 'Jan 16', collections: 567000, outstanding: 67000 },
    { date: 'Jan 17', collections: 432000, outstanding: 45000 },
    { date: 'Jan 18', collections: 678000, outstanding: 78000 },
    { date: 'Jan 19', collections: 543000, outstanding: 56000 },
    { date: 'Jan 20', collections: 789000, outstanding: 34000 },
    { date: 'Jan 21', collections: 621000, outstanding: 23000 }
  ];

  const paymentMethods = [
    { method: 'Card Payment', amount: 2456000, transactions: 567, percentage: 46 },
    { method: 'UPI', amount: 1678000, transactions: 789, percentage: 31 },
    { method: 'Cash', amount: 892000, transactions: 234, percentage: 17 },
    { method: 'Bank Transfer', amount: 301000, transactions: 89, percentage: 6 }
  ];

  const outstandingPayments = [
    { invoice: 'INV-001', guest: 'John Smith', amount: 25000, days: 5, status: 'Pending' },
    { invoice: 'INV-002', guest: 'Corporate Ltd.', amount: 89000, days: 12, status: 'Overdue' },
    { invoice: 'INV-003', guest: 'Sarah Wilson', amount: 15000, days: 2, status: 'Pending' },
    { invoice: 'INV-004', guest: 'Event Co.', amount: 156000, days: 8, status: 'Follow-up' }
  ];

  const gstSummary = {
    cgst: 234000,
    sgst: 234000,
    igst: 89000,
    total: 557000
  };

  const handleExport = (format) => {
    console.log(`Exporting finance report as ${format}`);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'follow-up': return 'bg-orange-100 text-orange-700';
      case 'paid': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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
      {/* Finance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(financeStats.totalRevenue/100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↗ +14.2%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(financeStats.collections/100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↗ +8.7%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(financeStats.outstanding/100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">↗ +2.1%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((financeStats.collections/financeStats.totalRevenue)*100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↗ +1.8%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Distribution by revenue streams</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ category, percentage }) => `${category}: ${percentage}%`}
                >
                  {revenueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${(value/100000).toFixed(1)}L`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Collections Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Collections vs Outstanding</CardTitle>
            <CardDescription>Daily collection performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={collectionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${(value/1000)}K`, '']} />
                <Legend />
                <Bar dataKey="collections" fill="#10B981" name="Collections" />
                <Bar dataKey="outstanding" fill="#EF4444" name="Outstanding" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method Analysis</CardTitle>
          <CardDescription>Revenue and transaction breakdown by payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {paymentMethods.map((payment, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <h4 className="font-medium">{payment.method}</h4>
                  </div>
                  <Badge variant="outline">{payment.percentage}%</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">₹{(payment.amount/100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Transactions:</span>
                    <span className="font-medium">{payment.transactions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg Value:</span>
                    <span className="font-medium">₹{Math.round(payment.amount / payment.transactions).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* GST Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>GST Tax Summary</CardTitle>
            <CardDescription>Tax breakdown for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">CGST (9%)</span>
                <span className="text-lg font-bold">₹{gstSummary.cgst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">SGST (9%)</span>
                <span className="text-lg font-bold">₹{gstSummary.sgst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">IGST (18%)</span>
                <span className="text-lg font-bold">₹{gstSummary.igst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="font-bold text-blue-900">Total GST</span>
                <span className="text-xl font-bold text-blue-900">₹{gstSummary.total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Summary</CardTitle>
            <CardDescription>Detailed breakdown of all revenue streams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{(item.amount/100000).toFixed(1)}L</div>
                    <div className="text-sm text-gray-600">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Payments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Outstanding Payments</span>
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
                <Download className="w-4 h-4" />
                PDF
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Days Overdue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outstandingPayments.map((payment, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{payment.invoice}</TableCell>
                    <TableCell>{payment.guest}</TableCell>
                    <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {payment.days > 7 && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        <span className={payment.days > 7 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                          {payment.days} days
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Follow Up
                      </Button>
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

export default FinanceReport;