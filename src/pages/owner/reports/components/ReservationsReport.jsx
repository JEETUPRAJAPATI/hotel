import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Building,
  TrendingUp,
  Download,
  Search,
  ArrowUpDown,
  MapPin,
  Clock,
  XCircle,
  AlertCircle
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

const ReservationsReport = ({ dateRange, selectedHotel, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Mock reservations data
  const reservationStats = {
    totalReservations: 1247,
    occupancyRate: 78.5,
    adr: 4250,
    revpar: 3336,
    cancellations: 89,
    noShows: 23
  };

  const channelData = [
    { channel: 'Direct', bookings: 456, revenue: 1940000, color: '#3B82F6' },
    { channel: 'OTA', bookings: 567, revenue: 2410000, color: '#10B981' },
    { channel: 'Walk-in', bookings: 123, revenue: 522750, color: '#F59E0B' },
    { channel: 'Corporate', bookings: 101, revenue: 454500, color: '#EF4444' }
  ];

  const guestSourceData = [
    { country: 'India', guests: 789, percentage: 63.3 },
    { country: 'USA', guests: 234, percentage: 18.8 },
    { country: 'UK', guests: 123, percentage: 9.9 },
    { country: 'Others', guests: 101, percentage: 8.1 }
  ];

  const occupancyTrend = [
    { date: 'Jan 15', occupancy: 75, adr: 4200 },
    { date: 'Jan 16', occupancy: 82, adr: 4350 },
    { date: 'Jan 17', occupancy: 79, adr: 4180 },
    { date: 'Jan 18', occupancy: 86, adr: 4500 },
    { date: 'Jan 19', occupancy: 73, adr: 4100 },
    { date: 'Jan 20', occupancy: 91, adr: 4600 },
    { date: 'Jan 21', occupancy: 88, adr: 4450 }
  ];

  const reservationDetails = [
    { id: 'R001', guest: 'John Smith', checkIn: '2024-01-15', checkOut: '2024-01-17', rooms: 1, amount: 8500, status: 'Confirmed', source: 'Direct' },
    { id: 'R002', guest: 'Sarah Wilson', checkIn: '2024-01-16', checkOut: '2024-01-19', rooms: 2, amount: 18900, status: 'Checked In', source: 'OTA' },
    { id: 'R003', guest: 'Mike Johnson', checkIn: '2024-01-17', checkOut: '2024-01-20', rooms: 1, amount: 12750, status: 'Cancelled', source: 'Walk-in' },
    { id: 'R004', guest: 'Emily Davis', checkIn: '2024-01-18', checkOut: '2024-01-21', rooms: 3, amount: 28500, status: 'Confirmed', source: 'Corporate' }
  ];

  const handleExport = (format) => {
    console.log(`Exporting reservations report as ${format}`);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'checked in': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'no show': return 'bg-orange-100 text-orange-700';
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
      {/* Reservation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reservations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservationStats.totalReservations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↗ +15.2%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservationStats.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↗ +3.8%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ADR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{reservationStats.adr.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↗ +7.1%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RevPAR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{reservationStats.revpar.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↗ +11.3%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy & ADR Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Occupancy & ADR Trend</CardTitle>
            <CardDescription>Daily occupancy rate and average daily rate</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={occupancyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="occupancy" stroke="#3B82F6" strokeWidth={2} name="Occupancy %" />
                <Line yAxisId="right" type="monotone" dataKey="adr" stroke="#10B981" strokeWidth={2} name="ADR (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Channels */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Channels</CardTitle>
            <CardDescription>Revenue distribution by booking source</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                  label={({ channel, revenue }) => `${channel}: ₹${(revenue/100000).toFixed(1)}L`}
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Channel Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Channel Performance</CardTitle>
          <CardDescription>Detailed breakdown by booking channels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {channelData.map((channel, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{channel.channel}</h4>
                  <Badge variant="outline" style={{ color: channel.color, borderColor: channel.color }}>
                    {((channel.revenue / channelData.reduce((sum, ch) => sum + ch.revenue, 0)) * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bookings:</span>
                    <span className="font-medium">{channel.bookings}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium">₹{(channel.revenue/100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg Value:</span>
                    <span className="font-medium">₹{Math.round(channel.revenue / channel.bookings).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Guest Source Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Guest Source by Country</CardTitle>
            <CardDescription>Geographic distribution of guests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {guestSourceData.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">{source.country}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12">{source.percentage}%</span>
                    </div>
                    <Badge variant="outline">{source.guests}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cancellation Summary</CardTitle>
            <CardDescription>Analysis of cancelled and no-show reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium">Cancellations</div>
                    <div className="text-sm text-gray-600">{((reservationStats.cancellations / reservationStats.totalReservations) * 100).toFixed(1)}% of total bookings</div>
                  </div>
                </div>
                <Badge variant="destructive">{reservationStats.cancellations}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-medium">No Shows</div>
                    <div className="text-sm text-gray-600">{((reservationStats.noShows / reservationStats.totalReservations) * 100).toFixed(1)}% of total bookings</div>
                  </div>
                </div>
                <Badge variant="outline" className="border-orange-200 text-orange-700">{reservationStats.noShows}</Badge>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Total Loss Impact</div>
                <div className="text-lg font-bold text-red-600">
                  ₹{((reservationStats.cancellations + reservationStats.noShows) * reservationStats.adr).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Actions & Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reservation Details</span>
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
                  <TableHead>Reservation ID</TableHead>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Rooms</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservationDetails.map((reservation, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{reservation.id}</TableCell>
                    <TableCell>{reservation.guest}</TableCell>
                    <TableCell>{new Date(reservation.checkIn).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(reservation.checkOut).toLocaleDateString()}</TableCell>
                    <TableCell>{reservation.rooms}</TableCell>
                    <TableCell>₹{reservation.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(reservation.status)}>
                        {reservation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{reservation.source}</TableCell>
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

export default ReservationsReport;