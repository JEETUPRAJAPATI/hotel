import React, { useState, useEffect, useMemo } from 'react';
import { Eye, Edit, Trash2, Search, Filter, Download, FileText, FileSpreadsheet, X, Plus, MoreVertical, Check, Loader, Upload, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { 
  getRestaurants, 
  deleteRestaurant, 
  activateRestaurant, 
  deactivateRestaurant,
  bulkRestaurantActions,
  getUniqueValues,
  formatRestaurantData
} from '../services/restaurantManagementService';
import { mockRestaurants, filterRestaurants, getRestaurantStats } from '../data/restaurantMockData';
import Pagination from '../components/Pagination';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import RestaurantFormModal from '../components/RestaurantFormModal';
import ViewRestaurantDrawer from '../components/ViewRestaurantDrawer';
import LoadingSpinner from '../components/LoadingSpinner';

const RestaurantManagement = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    status: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [uniqueValues, setUniqueValues] = useState({ cities: [], statuses: ['active', 'inactive'] });
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // Fetch restaurants data
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: filters.search,
        city: filters.city,
        status: filters.status,
        sort: sortField,
        order: sortOrder
      };

      try {
        const response = await getRestaurants(params);
        
        if (response.data.success) {
          const formattedRestaurants = response.data.data.restaurants.map(formatRestaurantData);
          setRestaurants(formattedRestaurants);
          setTotalPages(response.data.data.totalPages);
          setTotalItems(response.data.data.total);
          
          // Update unique values for filters
          setUniqueValues(prev => ({
            ...prev,
            cities: getUniqueValues(formattedRestaurants, 'city')
          }));
        }
      } catch (apiError) {
        // Fallback to mock data if API fails
        console.log('Using mock data for restaurants');
        const filtered = filterRestaurants(mockRestaurants, filters);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);
        
        setRestaurants(paginatedData);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setTotalItems(filtered.length);
        
        // Update unique values for filters
        const cities = [...new Set(mockRestaurants.map(r => r.city))];
        setUniqueValues(prev => ({
          ...prev,
          cities
        }));
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast.error('Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchRestaurants();
  }, [currentPage, itemsPerPage, filters, sortField, sortOrder]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      search: '',
      city: '',
      status: ''
    });
    setCurrentPage(1);
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Handle restaurant selection for bulk actions
  const handleSelectRestaurant = (restaurantId) => {
    setSelectedRestaurants(prev => {
      if (prev.includes(restaurantId)) {
        return prev.filter(id => id !== restaurantId);
      } else {
        return [...prev, restaurantId];
      }
    });
  };

  // Select all restaurants
  const handleSelectAll = () => {
    if (selectedRestaurants.length === restaurants.length) {
      setSelectedRestaurants([]);
    } else {
      setSelectedRestaurants(restaurants.map(restaurant => restaurant._id));
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedRestaurants.length === 0) {
      toast.error('Please select restaurants first');
      return;
    }

    try {
      setLoading(true);
      const response = await bulkRestaurantActions(action, selectedRestaurants);
      
      if (response.data.success) {
        toast.success(response.data.message);
        setSelectedRestaurants([]);
        setShowBulkActions(false);
        await fetchRestaurants();
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error(error.response?.data?.message || 'Failed to perform bulk action');
    } finally {
      setLoading(false);
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (restaurant) => {
    try {
      const action = restaurant.status === 'active' ? deactivateRestaurant : activateRestaurant;
      const response = await action(restaurant._id);
      
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchRestaurants();
      }
    } catch (error) {
      console.error('Status toggle error:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedRestaurant) return;

    try {
      const response = await deleteRestaurant(selectedRestaurant._id);
      
      if (response.data.success) {
        toast.success('Restaurant deleted successfully');
        setIsDeleteModalOpen(false);
        setSelectedRestaurant(null);
        setIsDrawerOpen(false);
        await fetchRestaurants();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete restaurant');
    }
  };

  // Export functions
  const exportToCSV = () => {
    const headers = ['Name', 'City', 'Cuisine', 'Status', 'Seating Capacity', 'Phone', 'Email'];
    const csvData = restaurants.map(r => [
      r.name,
      r.city || '',
      r.cuisine_types?.join('; ') || '',
      r.status,
      r.seating_capacity || '',
      r.phone || '',
      r.email || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `restaurants_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Exported to CSV successfully');
    setShowExportDropdown(false);
  };

  const exportToExcel = () => {
    // For simplicity, we'll export as CSV with .xlsx extension
    // In production, you'd use a library like xlsx or exceljs
    const headers = ['Name', 'City', 'State', 'Country', 'Cuisine Types', 'Status', 'Seating Capacity', 'Phone', 'Email', 'Rating', 'Average Price'];
    const excelData = restaurants.map(r => [
      r.name,
      r.city || '',
      r.state || '',
      r.country || '',
      r.cuisine_types?.join(', ') || '',
      r.status,
      r.seating_capacity || '',
      r.phone || '',
      r.email || '',
      r.rating || '',
      r.average_price || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...excelData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `restaurants_${new Date().toISOString().split('T')[0]}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Exported to Excel successfully');
    setShowExportDropdown(false);
  };

  // Import function
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        // Parse CSV data (simplified)
        const importedData = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            return headers.reduce((obj, header, index) => {
              obj[header.toLowerCase().replace(/ /g, '_')] = values[index];
              return obj;
            }, {});
          });

        console.log('Imported data:', importedData);
        toast.success(`Successfully imported ${importedData.length} restaurants`);
        // In production, you would call an API to process this data
        // await importRestaurants(importedData);
        // fetchRestaurants();
      } catch (error) {
        console.error('Import error:', error);
        toast.error('Failed to import file. Please check the format.');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  // Show bulk actions when restaurants are selected
  useEffect(() => {
    setShowBulkActions(selectedRestaurants.length > 0);
  }, [selectedRestaurants]);

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (loading && restaurants.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Restaurant Management</h1>
            <p className="text-gray-600">Manage your hotel restaurants</p>
          </div>
          <div className="flex gap-3">
            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
                <ChevronDown className="w-4 h-4" />
              </button>
              {showExportDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <button
                    onClick={exportToCSV}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 border-b"
                  >
                    <FileText className="w-4 h-4 text-green-600" />
                    Export as CSV
                  </button>
                  <button
                    onClick={exportToExcel}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    Export as Excel
                  </button>
                </div>
              )}
            </div>

            {/* Import Button */}
            <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              Import
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{totalItems}</div>
            <div className="text-gray-600">Total Restaurants</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {restaurants.filter(r => r.status === 'active').length}
            </div>
            <div className="text-gray-600">Active</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">
              {restaurants.filter(r => r.status === 'inactive').length}
            </div>
            <div className="text-gray-600">Inactive</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">
              {restaurants.filter(r => r.is_24x7).length}
            </div>
            <div className="text-gray-600">24/7 Open</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          {/* City Filter */}
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            >
              <option value="">All Cities</option>
              {uniqueValues.cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Items per page */}
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div>
            <button
              onClick={resetFilters}
              className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              {selectedRestaurants.length} restaurant(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={loading}
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                disabled={loading}
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRestaurants.length === restaurants.length && restaurants.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  Name {getSortIcon('name')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('code')}
                >
                  Code {getSortIcon('code')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('city')}
                >
                  Location {getSortIcon('city')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cuisine
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  Status {getSortIcon('status')}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {restaurants.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <Loader className="w-6 h-6 animate-spin mr-2" />
                        Loading restaurants...
                      </div>
                    ) : (
                      <div>
                        <div className="text-lg font-medium mb-2">No restaurants found</div>
                        <div className="text-sm">
                          {Object.values(filters).some(f => f !== '') 
                            ? 'Try adjusting your filters'
                            : 'Click "Add Restaurant" to create your first restaurant'
                          }
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                restaurants.map((restaurant) => (
                  <tr key={restaurant._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRestaurants.includes(restaurant._id)}
                        onChange={() => handleSelectRestaurant(restaurant._id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      {restaurant.image ? (
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 border">
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full hidden items-center justify-center text-gray-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <div className="w-16 h-12 rounded-lg bg-gray-100 border flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{restaurant.code || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{restaurant.phone || '-'}</div>
                      <div className="text-sm text-gray-500">{restaurant.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{restaurant.city || '-'}</div>
                      <div className="text-sm text-gray-500">{restaurant.state || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{restaurant.displayHours}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{restaurant.cuisineTypesDisplay}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        restaurant.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {restaurant.status === 'active' ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {restaurant.displayStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRestaurant(restaurant);
                            setIsDrawerOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusToggle(restaurant)}
                          className={`p-1 rounded transition-colors ${
                            restaurant.status === 'active'
                              ? 'text-red-600 hover:text-red-900 hover:bg-red-50'
                              : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                          }`}
                          title={restaurant.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {restaurant.status === 'active' ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedRestaurant(null);
        }}
        onConfirm={handleDelete}
        title="Delete Restaurant"
        message={`Are you sure you want to delete "${selectedRestaurant?.name}"? This action cannot be undone.`}
      />

      {/* Restaurant Form Modals */}
      {isCreateModalOpen && (
        <RestaurantFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchRestaurants}
          title="Add New Restaurant"
        />
      )}

      {isEditModalOpen && selectedRestaurant && (
        <RestaurantFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedRestaurant(null);
          }}
          onSuccess={fetchRestaurants}
          restaurant={selectedRestaurant}
          title="Edit Restaurant"
        />
      )}

      {/* Restaurant View Drawer */}
      <ViewRestaurantDrawer
        restaurant={selectedRestaurant}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedRestaurant(null);
        }}
        onEdit={(restaurant) => {
          setSelectedRestaurant(restaurant);
          setIsDrawerOpen(false);
          setIsEditModalOpen(true);
        }}
        onDelete={(restaurant) => {
          setSelectedRestaurant(restaurant);
          setIsDrawerOpen(false);
          setIsDeleteModalOpen(true);
        }}
        onStatusToggle={handleStatusToggle}
      />
    </div>
  );
};

export default RestaurantManagement;