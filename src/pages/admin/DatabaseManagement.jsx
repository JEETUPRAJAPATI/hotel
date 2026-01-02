import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Database, Table, Activity, Shield, HardDrive, Clock,
  RefreshCw, Download, Upload, Eye, Code, Search,
  CheckCircle, AlertTriangle, TrendingUp, Server, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock Data
const mockCollections = [
  { name: 'users', documents: 1250, size: '2.4 MB', indexes: 5, lastUpdated: '2 hours ago' },
  { name: 'hotels', documents: 150, size: '8.7 MB', indexes: 8, lastUpdated: '1 hour ago' },
  { name: 'restaurants', documents: 320, size: '5.2 MB', indexes: 6, lastUpdated: '3 hours ago' },
  { name: 'reservations', documents: 8450, size: '45.3 MB', indexes: 12, lastUpdated: '15 mins ago' },
  { name: 'rooms', documents: 2100, size: '12.8 MB', indexes: 7, lastUpdated: '30 mins ago' },
  { name: 'orders', documents: 15670, size: '89.5 MB', indexes: 10, lastUpdated: '5 mins ago' },
  { name: 'payments', documents: 12340, size: '67.2 MB', indexes: 9, lastUpdated: '10 mins ago' },
  { name: 'logs', documents: 125890, size: '234.6 MB', indexes: 4, lastUpdated: '1 min ago' },
];

const mockBackups = [
  { date: '2026-01-01 02:00', size: '456.8 MB', type: 'Full', status: 'Completed' },
  { date: '2025-12-31 02:00', size: '448.2 MB', type: 'Full', status: 'Completed' },
  { date: '2025-12-30 14:00', size: '23.4 MB', type: 'Incremental', status: 'Completed' },
];

const mockIndexes = [
  { collection: 'users', fields: 'email', type: 'Single', status: 'Active' },
  { collection: 'users', fields: 'email, role', type: 'Compound', status: 'Active' },
  { collection: 'hotels', fields: 'ownerId, status', type: 'Compound', status: 'Active' },
  { collection: 'reservations', fields: 'hotelId, checkIn', type: 'Compound', status: 'Active' },
  { collection: 'orders', fields: 'restaurantId, createdAt', type: 'Compound', status: 'Active' },
];

const mockQueries = [
  { collection: 'reservations', type: 'find', time: '23ms', status: 'Success', query: '{ status: "confirmed" }' },
  { collection: 'orders', type: 'aggregate', time: '145ms', status: 'Success', query: '[{ $match: {...} }]' },
  { collection: 'users', type: 'find', time: '12ms', status: 'Success', query: '{ role: "admin" }' },
  { collection: 'payments', type: 'find', time: '567ms', status: 'Slow', query: '{ amount: { $gte: 1000 } }' },
];

const mockLogs = [
  { time: '2 mins ago', level: 'INFO', message: 'Database connection established' },
  { time: '5 mins ago', level: 'WARN', message: 'Slow query detected on payments collection' },
  { time: '15 mins ago', level: 'INFO', message: 'Backup completed successfully' },
  { time: '1 hour ago', level: 'ERROR', message: 'Connection timeout on replica set' },
];

const DatabaseManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [showSampleDataDrawer, setShowSampleDataDrawer] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Database Overview', icon: Database },
    { id: 'collections', label: 'Collections Manager', icon: Table },
    { id: 'backup', label: 'Backup & Restore', icon: HardDrive },
    { id: 'indexes', label: 'Index Management', icon: Zap },
    { id: 'queries', label: 'Query Monitor', icon: Activity },
    { id: 'logs', label: 'Logs & Health', icon: Shield },
  ];

  const handleRefresh = () => {
    toast.success('Database stats refreshed successfully!');
  };

  const handleBackup = () => {
    toast.success('Backup initiated successfully!');
  };

  const handleDownloadBackup = () => {
    toast.success('Backup download started!');
  };

  const handleRestoreBackup = () => {
    toast.success('Restore process initiated!');
  };

  const handleRebuildIndex = (collection) => {
    toast.success(`Index rebuilt for ${collection} collection!`);
  };

  const handleViewSchema = (collection) => {
    setSelectedCollection(collection);
    setShowSchemaModal(true);
  };

  const handleViewSampleData = (collection) => {
    setSelectedCollection(collection);
    setShowSampleDataDrawer(true);
  };

  // Render Overview Section
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Database Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div>
          <p className="text-sm text-gray-600 mb-1">Database Name</p>
          <p className="text-lg font-bold text-gray-900">hotel_channel_db</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Environment</p>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Production
          </span>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Database Type</p>
          <p className="text-lg font-semibold text-gray-900">MongoDB v6.0</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Connection Status</p>
          <span className="inline-flex items-center gap-1 text-green-600 font-medium">
            <CheckCircle className="w-4 h-4" />
            Connected
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Total Collections</p>
            <Database className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">8</p>
          <p className="text-xs text-gray-500 mt-1">Active collections</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Total Documents</p>
            <Table className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">166,270</p>
          <p className="text-xs text-gray-500 mt-1">Across all collections</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Database Size</p>
            <HardDrive className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">465.7 MB</p>
          <p className="text-xs text-gray-500 mt-1">Storage used</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Avg Query Time</p>
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">45ms</p>
          <p className="text-xs text-green-600 mt-1">↓ 12% faster</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {mockLogs.slice(0, 4).map((log, idx) => (
            <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
              <div className={`p-1.5 rounded ${
                log.level === 'ERROR' ? 'bg-red-100' :
                log.level === 'WARN' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                <Activity className={`w-3.5 h-3.5 ${
                  log.level === 'ERROR' ? 'text-red-600' :
                  log.level === 'WARN' ? 'text-yellow-600' : 'text-blue-600'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{log.message}</p>
                <p className="text-xs text-gray-500 mt-0.5">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Collections Section
  const renderCollections = () => {
    const filteredCollections = mockCollections.filter(col =>
      col.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-4">
        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Collections Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Collection Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Indexes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCollections.map((collection) => (
                  <tr key={collection.name} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Table className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{collection.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {collection.documents.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{collection.size}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{collection.indexes}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{collection.lastUpdated}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewSchema(collection)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Schema"
                        >
                          <Code className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewSampleData(collection)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="View Sample Data"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Render Backup Section
  const renderBackup = () => (
    <div className="space-y-6">
      {/* Backup Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={handleBackup}
          className="p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg transition-colors group"
        >
          <Upload className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-gray-900">Create Backup</p>
          <p className="text-xs text-gray-600 mt-1">Start new database backup</p>
        </button>

        <button
          onClick={handleDownloadBackup}
          className="p-4 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg transition-colors group"
        >
          <Download className="w-6 h-6 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-gray-900">Download Backup</p>
          <p className="text-xs text-gray-600 mt-1">Download latest backup file</p>
        </button>

        <button
          onClick={handleRestoreBackup}
          className="p-4 bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 rounded-lg transition-colors group"
        >
          <RefreshCw className="w-6 h-6 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-gray-900">Restore Backup</p>
          <p className="text-xs text-gray-600 mt-1">Restore from backup file</p>
        </button>
      </div>

      {/* Backup History */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Backup History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date & Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Size</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockBackups.map((backup, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{backup.date}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{backup.size}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                      backup.type === 'Full' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {backup.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      {backup.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Indexes Section
  const renderIndexes = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Active Indexes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Collection</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Index Fields</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockIndexes.map((index, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">{index.collection}</span>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                      {index.fields}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                      index.type === 'Compound' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {index.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      {index.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleRebuildIndex(index.collection)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Rebuild
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Query Monitor Section
  const renderQueries = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Recent Queries</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {mockQueries.map((query, idx) => (
            <div key={idx} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">{query.collection}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    {query.type}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${
                    query.status === 'Slow' ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {query.time}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    query.status === 'Slow' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {query.status}
                  </span>
                </div>
              </div>
              <code className="text-xs bg-gray-100 px-3 py-2 rounded block text-gray-700 overflow-x-auto">
                {query.query}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Logs Section
  const renderLogs = () => (
    <div className="space-y-6">
      {/* Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-900">DB Health</h4>
          </div>
          <p className="text-2xl font-bold text-green-600">Healthy</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Replication</h4>
          </div>
          <p className="text-2xl font-bold text-blue-600">Active</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h4 className="font-semibold text-gray-900">Slow Queries</h4>
          </div>
          <p className="text-2xl font-bold text-orange-600">3</p>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">System Logs</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {mockLogs.map((log, idx) => (
            <div key={idx} className="p-4 hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <span className={`px-2 py-1 text-xs font-bold rounded ${
                  log.level === 'ERROR' ? 'bg-red-100 text-red-700' :
                  log.level === 'WARN' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {log.level}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{log.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{log.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'collections':
        return renderCollections();
      case 'backup':
        return renderBackup();
      case 'indexes':
        return renderIndexes();
      case 'queries':
        return renderQueries();
      case 'logs':
        return renderLogs();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3 mb-1">
          <Database className="h-7 w-7 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">Database Management</h1>
        </div>
        <p className="text-sm text-gray-600">
          Monitor and manage MongoDB collections, backups, and database health
        </p>
      </div>

      {/* Content - Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Left Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-6">
            <div className="p-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                Database Menu
              </h3>
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                          : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Section Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              {tabs.map((tab) => {
                if (tab.id === activeTab) {
                  const Icon = tab.icon;
                  return (
                    <div key={tab.id} className="flex items-center gap-3">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <Icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{tab.label}</h2>
                        <p className="text-sm text-gray-500">
                          {tab.id === 'overview' && 'View database metrics and recent activity'}
                          {tab.id === 'collections' && 'Manage and view MongoDB collections'}
                          {tab.id === 'backup' && 'Create and manage database backups'}
                          {tab.id === 'indexes' && 'Monitor and optimize database indexes'}
                          {tab.id === 'queries' && 'Track query performance and execution'}
                          {tab.id === 'logs' && 'View system logs and database health status'}
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* Content */}
            <div className="p-6">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Schema Modal */}
      {showSchemaModal && selectedCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Schema: {selectedCollection.name}
              </h3>
              <button
                onClick={() => setShowSchemaModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "_id": "ObjectId",
  "name": "String (Required)",
  "email": "String (Required, Unique)",
  "role": "String (Required)",
  "status": "String (Optional)",
  "createdAt": "Date (Auto)",
  "updatedAt": "Date (Auto)"
}`}
              </pre>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowSchemaModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sample Data Drawer */}
      {showSampleDataDrawer && selectedCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end z-50">
          <div className="bg-white h-full w-full md:w-2/3 lg:w-1/2 shadow-xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Sample Data: {selectedCollection.name}
              </h3>
              <button
                onClick={() => setShowSampleDataDrawer(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "status": "active",
    "createdAt": "2026-01-01T00:00:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "manager",
    "status": "active",
    "createdAt": "2026-01-01T00:00:00Z"
  }
]`}
              </pre>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowSampleDataDrawer(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseManagement;
