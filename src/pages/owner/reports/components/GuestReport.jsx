import React, { useState } from 'react';
import {
  Users,
  MapPin,
  Calendar,
  Star,
  Download,
  Search,
  ArrowUpDown,
  Phone,
  Mail,
  Building
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

const GuestReport = ({ dateRange, selectedHotel, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const guestStats = {
    totalGuests: 2891,
    repeatGuests: 423,
    avgStay: 2.3,
    avgSpend: 4250,
    satisfaction: 4.6
  };

  const guestDirectory = [
    { id: 'G001', name: 'John Smith', email: 'john@email.com', phone: '+91 98765 43210', country: 'India', visits: 3, totalSpend: 45000, lastVisit: '2024-01-15' },
    { id: 'G002', name: 'Sarah Wilson', email: 'sarah@email.com', phone: '+1 555 123 4567', country: 'USA', visits: 1, totalSpend: 18000, lastVisit: '2024-01-10' },
    { id: 'G003', name: 'Mike Johnson', email: 'mike@email.com', phone: '+44 20 7946 0958', country: 'UK', visits: 5, totalSpend: 89000, lastVisit: '2024-01-08' }
  ];

  const topSpenders = [
    { name: 'Robert Davis', totalSpend: 156000, visits: 8, avgSpend: 19500 },
    { name: 'Emily Chen', totalSpend: 134000, visits: 6, avgSpend: 22333 },
    { name: 'Michael Brown', totalSpend: 98000, visits: 4, avgSpend: 24500 }
  ];

  const handleExport = (format) => {
    console.log(`Exporting guest report as ${format}`);
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
      {/* Guest Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guestStats.totalGuests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↗ +12.5%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repeat Guests</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guestStats.repeatGuests}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline">{((guestStats.repeatGuests/guestStats.totalGuests)*100).toFixed(1)}%</Badge>
              <span className="ml-1">loyalty rate</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Stay</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guestStats.avgStay} days</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↗ +0.3</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Spend</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{guestStats.avgSpend.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↗ +8.7%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guestStats.satisfaction}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↗ +0.2</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Spenders */}
      <Card>
        <CardHeader>
          <CardTitle>Top Spending Guests</CardTitle>
          <CardDescription>Highest value customers by total spend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSpenders.map((guest, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{guest.name}</div>
                    <div className="text-sm text-gray-600">{guest.visits} visits</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">₹{guest.totalSpend.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">₹{guest.avgSpend.toLocaleString()} avg</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Guest Directory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Guest Directory</span>
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
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search guests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Visits</TableHead>
                  <TableHead>Total Spend</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guestDirectory.map((guest, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{guest.name}</div>
                        <div className="text-sm text-gray-600">{guest.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {guest.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {guest.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-600" />
                        {guest.country}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{guest.visits}</Badge>
                    </TableCell>
                    <TableCell>₹{guest.totalSpend.toLocaleString()}</TableCell>
                    <TableCell>{new Date(guest.lastVisit).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={guest.visits > 2 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                        {guest.visits > 2 ? 'VIP' : 'Regular'}
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

export default GuestReport;