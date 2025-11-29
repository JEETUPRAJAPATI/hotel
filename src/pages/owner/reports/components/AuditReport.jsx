import React, { useState } from 'react';
import {
  Activity,
  User,
  Calendar,
  Edit,
  Settings,
  Download,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../components/ui/select';
import LoadingSpinner from '../../../../components/LoadingSpinner';

const AuditReport = ({ dateRange, selectedHotel, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activityFilter, setActivityFilter] = useState('all');

  const auditStats = {
    totalActivities: 1542,
    criticalActions: 34,
    userActions: 892,
    systemActions: 650,
    todayActivities: 156
  };

  const activityLogs = [
    {
      id: 'A001',
      user: 'John Smith',
      role: 'Manager',
      action: 'Room Rate Updated',
      details: 'Changed Deluxe Room rate from ₹3,500 to ₹4,000',
      timestamp: '2024-01-15 10:30:45',
      ip: '192.168.1.105',
      severity: 'medium'
    },
    {
      id: 'A002',
      user: 'Sarah Wilson',
      role: 'Front Desk',
      action: 'Booking Cancelled',
      details: 'Cancelled reservation BOK-2024-001234',
      timestamp: '2024-01-15 10:15:22',
      ip: '192.168.1.112',
      severity: 'high'
    },
    {
      id: 'A003',
      user: 'System',
      role: 'Automated',
      action: 'Backup Completed',
      details: 'Daily database backup completed successfully',
      timestamp: '2024-01-15 03:00:00',
      ip: 'localhost',
      severity: 'low'
    },
    {
      id: 'A004',
      user: 'Mike Johnson',
      role: 'Owner',
      action: 'User Created',
      details: 'Created new staff account for Emily Davis',
      timestamp: '2024-01-15 09:45:18',
      ip: '192.168.1.101',
      severity: 'medium'
    },
    {
      id: 'A005',
      user: 'Emily Davis',
      role: 'Housekeeping',
      action: 'Room Status Updated',
      details: 'Marked Room 205 as Clean and Ready',
      timestamp: '2024-01-15 08:30:12',
      ip: '192.168.1.125',
      severity: 'low'
    }
  ];

  const criticalActions = [
    { action: 'Booking Cancellations', count: 12, change: '+3' },
    { action: 'Rate Modifications', count: 8, change: '+2' },
    { action: 'User Account Changes', count: 5, change: '-1' },
    { action: 'System Configuration', count: 9, change: '+1' }
  ];

  const handleExport = (format) => {
    console.log(`Exporting audit report as ${format}`);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
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
      {/* Audit Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditStats.totalActivities.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">↗ +{auditStats.todayActivities}</span> today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Actions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditStats.criticalActions}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">⚠ Requires attention</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Actions</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditStats.userActions}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline">{((auditStats.userActions/auditStats.totalActivities)*100).toFixed(1)}%</Badge>
              <span className="ml-1">of total</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Actions</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditStats.systemActions}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline">{((auditStats.systemActions/auditStats.totalActivities)*100).toFixed(1)}%</Badge>
              <span className="ml-1">automated</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditStats.todayActivities}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↗ +12.5%</span> from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Actions Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Critical Actions Overview</CardTitle>
          <CardDescription>High-impact activities requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {criticalActions.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{item.action}</span>
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-2xl font-bold">{item.count}</div>
                <div className="text-sm text-gray-600">
                  <span className={item.change.startsWith('+') ? 'text-red-600' : 'text-green-600'}>
                    {item.change}
                  </span> from last period
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Activity Log</span>
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
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Select value={activityFilter} onValueChange={setActivityFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activityLogs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.user}</div>
                        <div className="text-sm text-gray-600">{log.role}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Edit className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">{log.action}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm text-gray-600">
                        {log.details}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{log.timestamp.split(' ')[0]}</div>
                        <div className="text-gray-600">{log.timestamp.split(' ')[1]}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {log.ip}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getSeverityColor(log.severity)} flex items-center gap-1 w-fit`}>
                        {getSeverityIcon(log.severity)}
                        <span className="capitalize">{log.severity}</span>
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

export default AuditReport;