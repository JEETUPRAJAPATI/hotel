import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  MessageSquare,
  User,
  Calendar,
  Bell,
  Coffee,
  Home
} from 'lucide-react'

const StaffDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('tasks')

  const myTasks = [
    { 
      id: 1, 
      title: 'Clean Room 205', 
      description: 'Deep cleaning required after checkout',
      priority: 'high', 
      dueTime: '10:30 AM',
      status: 'pending',
      location: 'Floor 2'
    },
    { 
      id: 2, 
      title: 'Restock Mini Bar - Room 312', 
      description: 'Guest requested mini bar restocking',
      priority: 'medium', 
      dueTime: '11:15 AM',
      status: 'in-progress',
      location: 'Floor 3'
    },
    { 
      id: 3, 
      title: 'Laundry Pickup', 
      description: 'Collect laundry from rooms 101-120',
      priority: 'low', 
      dueTime: '2:00 PM',
      status: 'pending',
      location: 'Floor 1'
    },
    { 
      id: 4, 
      title: 'Maintenance Report', 
      description: 'Submit daily maintenance checklist',
      priority: 'medium', 
      dueTime: '5:00 PM',
      status: 'completed',
      location: 'Office'
    },
  ]

  const messages = [
    {
      id: 1,
      from: 'Sarah (Manager)',
      message: 'Great job on yesterday\'s tasks! Keep up the excellent work.',
      time: '30 min ago',
      type: 'appreciation'
    },
    {
      id: 2,
      from: 'System',
      message: 'New task assigned: Guest complaint - Room 407',
      time: '1 hour ago',
      type: 'task'
    },
    {
      id: 3,
      from: 'Mike (Colleague)',
      message: 'Can you help with the conference room setup?',
      time: '2 hours ago',
      type: 'help'
    },
  ]

  const quickActions = [
    { 
      title: 'Start Break', 
      icon: Coffee, 
      color: 'from-orange-500 to-orange-600',
      action: () => console.log('Break started')
    },
    { 
      title: 'Report Issue', 
      icon: Bell, 
      color: 'from-red-500 to-red-600',
      action: () => console.log('Report issue')
    },
    { 
      title: 'Request Help', 
      icon: MessageSquare, 
      color: 'from-blue-500 to-blue-600',
      action: () => console.log('Request help')
    },
    { 
      title: 'Clock Out', 
      icon: Home, 
      color: 'from-green-500 to-green-600',
      action: () => console.log('Clock out')
    },
  ]

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-600" />
      case 'pending': return <ClipboardList className="w-5 h-5 text-orange-600" />
      default: return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getMessageIcon = (type) => {
    switch (type) {
      case 'appreciation': return '👏'
      case 'task': return '📋'
      case 'help': return '🤝'
      default: return '💬'
    }
  }

  const markTaskComplete = (taskId) => {
    console.log('Task completed:', taskId)
  }

  const startTask = (taskId) => {
    console.log('Task started:', taskId)
  }

  const tabs = [
    { id: 'tasks', label: 'My Tasks', icon: ClipboardList },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
  ]

  const completedToday = myTasks.filter(task => task.status === 'completed').length
  const pendingTasks = myTasks.filter(task => task.status === 'pending').length
  const inProgressTasks = myTasks.filter(task => task.status === 'in-progress').length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
              <p className="text-gray-600">Your daily tasks and updates</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedToday}</p>
                <p className="text-sm text-gray-600">Completed Today</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{inProgressTasks}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingTasks}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={action.action}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{action.title}</p>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'tasks' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {myTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {getStatusIcon(task.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>📍 {task.location}</span>
                        <span>⏰ Due: {task.dueTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {task.status === 'pending' && (
                      <button
                        onClick={() => startTask(task.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Start
                      </button>
                    )}
                    {task.status === 'in-progress' && (
                      <button
                        onClick={() => markTaskComplete(task.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Complete
                      </button>
                    )}
                    {task.status === 'completed' && (
                      <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {selectedTab === 'messages' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex gap-4 p-4 rounded-lg bg-gray-50">
                    <div className="text-2xl">{getMessageIcon(message.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900">{message.from}</p>
                        <span className="text-sm text-gray-500">{message.time}</span>
                      </div>
                      <p className="text-gray-600">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'schedule' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Schedule</h3>
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Schedule View</h4>
              <p className="text-gray-600 mb-4">View your upcoming shifts and time off</p>
              <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Today's Shift:</span>
                  <span className="text-blue-600">8:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Break Time:</span>
                  <span className="text-green-600">12:00 PM - 1:00 PM</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default StaffDashboard