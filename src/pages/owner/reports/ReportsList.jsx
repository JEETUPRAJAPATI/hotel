import React, { useState, useEffect } from 'react';
import { 
  FiFileText, 
  FiDownload, 
  FiCalendar,
  FiFilter,
  FiPlus,
  FiClock,
  FiCheckCircle
} from 'react-icons/fi';
import ownerService from '../../../services/owner/ownerService';
import LoadingSpinner from '../../../components/LoadingSpinner';

const ReportsList = () => {
  const [reports, setReports] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [generatingReport, setGeneratingReport] = useState(false);

  // Mock data
  const mockReports = [
    {
      _id: '1',
      name: 'Monthly Revenue Report',
      type: 'financial',
      status: 'completed',
      createdAt: '2025-11-15T10:00:00Z',
      fileSize: '2.3 MB',
      downloadUrl: '#'
    },
    {
      _id: '2',
      name: 'Staff Attendance Report',
      type: 'staff',
      status: 'processing',
      createdAt: '2025-11-14T15:30:00Z',
      fileSize: '1.8 MB',
      downloadUrl: '#'
    }
  ];

  const mockTemplates = [
    { id: 'revenue', name: 'Revenue Report', description: 'Detailed revenue analysis' },
    { id: 'occupancy', name: 'Occupancy Report', description: 'Room occupancy statistics' },
    { id: 'staff', name: 'Staff Report', description: 'Staff performance and attendance' },
    { id: 'finance', name: 'Financial Report', description: 'Complete financial overview' },
    { id: 'guest', name: 'Guest Report', description: 'Guest satisfaction and feedback' }
  ];

  useEffect(() => {
    fetchReports();
    fetchTemplates();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await ownerService.reports.getReports();
      setReports(response.data.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports(mockReports);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await ownerService.reports.getTemplates();
      setTemplates(response.data.data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setTemplates(mockTemplates);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedTemplate || !dateRange.startDate || !dateRange.endDate) {
      alert('Please select a template and date range');
      return;
    }

    setGeneratingReport(true);
    try {
      const reportData = {
        template: selectedTemplate,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      };

      await ownerService.reports.generateReport(reportData);
      fetchReports(); // Refresh the reports list
      setSelectedTemplate('');
      setDateRange({ startDate: '', endDate: '' });
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleDownload = async (reportId) => {
    try {
      const response = await ownerService.reports.downloadReport(reportId);
      // Handle file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', text: 'Completed' },
      processing: { color: 'bg-yellow-100 text-yellow-800', text: 'Processing' },
      failed: { color: 'bg-red-100 text-red-800', text: 'Failed' }
    };

    const config = statusConfig[status] || statusConfig.processing;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
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
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and manage your business reports</p>
        </div>
      </div>

      {/* Generate New Report */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Generate New Report</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Template
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select template</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Generate Button */}
          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              disabled={generatingReport}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generatingReport ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>

        {/* Template Description */}
        {selectedTemplate && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              {templates.find(t => t.id === selectedTemplate)?.description}
            </p>
          </div>
        )}
      </div>

      {/* Report Templates */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Available Templates</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div 
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                selectedTemplate === template.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  selectedTemplate === template.id ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <FiFileText className={`h-5 w-5 ${
                    selectedTemplate === template.id ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generated Reports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Generated Reports</h2>
          <button
            onClick={fetchReports}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Refresh
          </button>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-12">
            <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports generated</h3>
            <p className="mt-1 text-sm text-gray-500">Generate your first report using the form above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiFileText className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{report.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.fileSize || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {report.status === 'completed' && (
                        <button
                          onClick={() => handleDownload(report._id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <FiDownload className="mr-1 h-4 w-4" />
                          Download
                        </button>
                      )}
                      {report.status === 'processing' && (
                        <span className="text-yellow-600 flex items-center">
                          <FiClock className="mr-1 h-4 w-4" />
                          Processing
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsList;