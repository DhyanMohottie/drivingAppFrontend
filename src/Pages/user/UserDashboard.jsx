import React, { useState, useEffect } from 'react';
import { User, Car, Calendar, BarChart3, FileText, MessageSquare, Settings, LogOut, Lock, Edit, Trash2, Download, Send, ChevronRight, Info, X } from 'lucide-react';

const UserDashboard = () => {
  // Active section state
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showReportOptions, setShowReportOptions] = useState(false);
  
  // Current user state
  const [currentUser, setCurrentUser] = useState({
    userID: 'U001',
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
    phoneNumber: '555-123-4567',
    address: '123 Main Street, Anytown, USA',
    gender: 'Male',
    isStudent: true,
    enrollDate: '2023-08-15',
    package: 'Premium Driver Training'
  });
  
  // Form states
  const [profileForm, setProfileForm] = useState({...currentUser});
  const [profileErrors, setProfileErrors] = useState({});
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  
  // Chatbot state
  const [chatMessages, setChatMessages] = useState([
    { role: 'system', content: 'Hello! I\'m your driving school assistant. How can I help you today?' }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Enrolled sessions data
  const [sessions, setSessions] = useState([
    {
      id: 'S001',
      title: 'Basic Road Navigation',
      date: '2024-02-15',
      time: '10:00 AM - 12:00 PM',
      instructor: 'Sarah Miller',
      status: 'Completed',
      marks: 92,
      feedback: 'Excellent navigation skills. Good understanding of road signs.'
    },
    {
      id: 'S002',
      title: 'Parallel Parking',
      date: '2024-02-22',
      time: '2:00 PM - 4:00 PM',
      instructor: 'James Wilson',
      status: 'Completed',
      marks: 85,
      feedback: 'Good control of the vehicle. Needs more practice with tight spots.'
    },
    {
      id: 'S003',
      title: 'Highway Driving',
      date: '2024-03-01',
      time: '9:00 AM - 11:00 AM',
      instructor: 'Alex Johnson',
      status: 'Completed',
      marks: 90,
      feedback: 'Excellent speed control and lane changing. Very confident.'
    },
    {
      id: 'S004',
      title: 'Night Driving',
      date: '2024-03-10',
      time: '6:00 PM - 8:00 PM',
      instructor: 'Sarah Miller',
      status: 'Scheduled',
      marks: null,
      feedback: null
    },
    {
      id: 'S005',
      title: 'Defensive Driving',
      date: '2024-03-18',
      time: '1:00 PM - 3:00 PM',
      instructor: 'James Wilson',
      status: 'Scheduled',
      marks: null,
      feedback: null
    }
  ]);
  
  // Profile validation
  const validateProfileForm = () => {
    const errors = {};
    
    if (!profileForm.firstName) errors.firstName = 'First name is required';
    if (!profileForm.lastName) errors.lastName = 'Last name is required';
    if (!profileForm.username) errors.username = 'Username is required';
    if (!profileForm.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      errors.email = 'Email is invalid';
    }
    if (!profileForm.phoneNumber) errors.phoneNumber = 'Phone number is required';
    if (!profileForm.address) errors.address = 'Address is required';
    if (!profileForm.gender) errors.gender = 'Gender is required';
    
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Password validation
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordForm.confirmPassword !== passwordForm.newPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle profile update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    
    if (validateProfileForm()) {
      setCurrentUser({...profileForm});
      setShowEditProfile(false);
      alert('Profile updated successfully!');
    }
  };
  
  // Handle password change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (validatePasswordForm()) {
      // Here you would normally send the password change to your API
      setShowPasswordForm(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      alert('Password changed successfully!');
    }
  };
  
  // Handle account deletion
  const handleDeleteAccount = () => {
    // Here you would normally send a delete request to your API
    alert('Account deleted successfully!');
    // Redirect to login page or similar
  };
  
  // Handle form input changes
  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };
  
  // Send message to chatbot
  const sendMessage = async () => {
    if (!userMessage.trim()) return;
    
    // Add user message to chat
    const newMessage = { role: 'user', content: userMessage };
    setChatMessages([...chatMessages, newMessage]);
    setUserMessage('');
    setIsTyping(true);
    
    // Simulate API call to OpenAI
    setTimeout(() => {
      // This is where you would normally call the OpenAI API
      // For demonstration, we'll simulate a response
      const botResponse = simulateBotResponse(userMessage);
      setChatMessages(prev => [...prev, { role: 'system', content: botResponse }]);
      setIsTyping(false);
    }, 1000);
  };
  
  // Simulate bot response (in a real app, this would be an API call to OpenAI)
  const simulateBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('lesson') || lowerMessage.includes('class') || lowerMessage.includes('session')) {
      return "Your next driving lesson is scheduled for March 18th at 1:00 PM with instructor James Wilson. The topic will be Defensive Driving. Would you like me to provide more details?";
    } else if (lowerMessage.includes('progress') || lowerMessage.includes('how am i doing')) {
      return "You're making excellent progress! Your average score across completed sessions is 89/100. Your instructors have noted your strengths in navigation and highway driving.";
    } else if (lowerMessage.includes('change') && lowerMessage.includes('password')) {
      return "To change your password, go to the Profile section and click on 'Change Password'. You'll need to enter your current password and then your new password twice.";
    } else if (lowerMessage.includes('report')) {
      return "You can generate performance reports from the Reports section. You can choose different time periods and types of reports to get insights into your driving progress.";
    } else {
      return "Thank you for your message. How else can I assist you with your driving lessons or account management?";
    }
  };
  
  // Generate PDF report (simulated)
  const generateReport = (type) => {
    alert(`Generating ${type} report... In a real application, this would create a PDF.`);
    setShowReportOptions(false);
  };
  
  // Calculate statistics
  const completedSessions = sessions.filter(s => s.status === 'Completed').length;
  const upcomingSessions = sessions.filter(s => s.status === 'Scheduled').length;
  const averageScore = sessions.filter(s => s.marks !== null).reduce((acc, curr) => acc + curr.marks, 0) / completedSessions || 0;
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    let badgeClass = "px-2 py-1 rounded text-xs font-medium";
    
    switch(status.toLowerCase()) {
      case 'completed':
        badgeClass += " bg-green-100 text-green-800";
        break;
      case 'scheduled':
        badgeClass += " bg-blue-100 text-blue-800";
        break;
      case 'cancelled':
        badgeClass += " bg-red-100 text-red-800";
        break;
      default:
        badgeClass += " bg-gray-100 text-gray-800";
    }
    
    return <span className={badgeClass}>{status}</span>;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-indigo-800 to-indigo-900 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-white font-bold text-xl">DriveSchool</h1>
          </div>
          <div className="mt-8 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              <button 
                onClick={() => setActiveSection('dashboard')}
                className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md w-full ${
                  activeSection === 'dashboard' 
                    ? 'bg-indigo-700 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-700'
                }`}
              >
                <BarChart3 className="mr-3 h-5 w-5" />
                Dashboard
              </button>
              
              <button 
                onClick={() => setActiveSection('profile')}
                className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md w-full ${
                  activeSection === 'profile' 
                    ? 'bg-indigo-700 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-700'
                }`}
              >
                <User className="mr-3 h-5 w-5" />
                My Profile
              </button>
              
              <button 
                onClick={() => setActiveSection('sessions')}
                className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md w-full ${
                  activeSection === 'sessions' 
                    ? 'bg-indigo-700 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-700'
                }`}
              >
                <Calendar className="mr-3 h-5 w-5" />
                My Sessions
              </button>
              
              <button 
                onClick={() => setActiveSection('reports')}
                className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md w-full ${
                  activeSection === 'reports' 
                    ? 'bg-indigo-700 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-700'
                }`}
              >
                <FileText className="mr-3 h-5 w-5" />
                Reports
              </button>
              
              <button 
                onClick={() => setActiveSection('assistant')}
                className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md w-full ${
                  activeSection === 'assistant' 
                    ? 'bg-indigo-700 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-700'
                }`}
              >
                <MessageSquare className="mr-3 h-5 w-5" />
                AI Assistant
              </button>
            </nav>
          </div>
          <div className="px-2">
            <button className="group flex items-center px-2 py-3 text-sm font-medium rounded-md w-full text-indigo-100 hover:bg-indigo-700">
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top Navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                {activeSection === 'dashboard' && 'Student Dashboard'}
                {activeSection === 'profile' && 'My Profile'}
                {activeSection === 'sessions' && 'My Sessions & Progress'}
                {activeSection === 'reports' && 'Performance Reports'}
                {activeSection === 'assistant' && 'AI Assistant'}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {currentUser.firstName.charAt(0)}{currentUser.lastName.charAt(0)}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{currentUser.firstName} {currentUser.lastName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-5 sm:p-6">
                  <h3 className="text-xl font-medium leading-6 text-white">Welcome back, {currentUser.firstName}!</h3>
                  <p className="mt-1 text-sm text-blue-100">
                    Your driving journey continues. You've completed {completedSessions} sessions with an average score of {averageScore.toFixed(1)}.
                  </p>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Calendar className="h-8 w-8 text-indigo-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Sessions Completed
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {completedSessions}
                          </div>
                          <div className="ml-2 flex items-baseline text-xs font-semibold text-green-500">
                            {upcomingSessions > 0 ? `${upcomingSessions} upcoming` : 'All done!'}
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <BarChart3 className="h-8 w-8 text-emerald-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Average Score
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {averageScore.toFixed(1)}
                          </div>
                          <div className="ml-2 flex items-baseline text-xs font-semibold text-gray-500">
                            out of 100
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Car className="h-8 w-8 text-amber-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Next Session
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-lg font-semibold text-gray-900">
                            {upcomingSessions > 0 ? sessions.find(s => s.status === 'Scheduled').date : 'None scheduled'}
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <User className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Package
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-lg font-semibold text-gray-900">
                            {currentUser.package}
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Upcoming Sessions */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Upcoming Sessions</h3>
                    <button
                      onClick={() => setActiveSection('sessions')}
                      className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="mt-5">
                    {sessions.filter(s => s.status === 'Scheduled').length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {sessions
                          .filter(s => s.status === 'Scheduled')
                          .slice(0, 3)
                          .map(session => (
                            <li key={session.id} className="py-4">
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">{session.title}</h4>
                                  <p className="text-sm text-gray-500">{session.date} • {session.time}</p>
                                  <p className="text-sm text-gray-500">Instructor: {session.instructor}</p>
                                </div>
                                <StatusBadge status={session.status} />
                              </div>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No upcoming sessions scheduled.</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Progress Chart */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Your Progress</h3>
                  <div className="mt-5 h-64">
                    <div className="h-full flex items-end">
                      {sessions
                        .filter(s => s.status === 'Completed')
                        .map((session, index) => (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div className="w-full bg-indigo-100 rounded-t" style={{ height: `${session.marks}%` }}>
                              <div 
                                className="bg-gradient-to-t from-indigo-500 to-indigo-600 w-full h-full rounded-t"
                                style={{ opacity: session.marks / 100 }}
                              ></div>
                            </div>
                            <div className="text-xs font-medium text-gray-500 mt-2 truncate w-full text-center" title={session.title}>
                              {session.title.split(' ')[0]}
                            </div>
                            <div className="text-xs font-bold text-gray-700">{session.marks}%</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              {!showEditProfile && !showPasswordForm && !showDeleteConfirm && (
                <>
                  {/* Profile Information */}
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your personal details and account information.</p>
                        </div>
                        <button
                          onClick={() => {
                            setShowEditProfile(true);
                            setProfileForm({...currentUser});
                          }}
                          className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Edit Profile
                        </button>
                      </div>
                      
                      <div className="mt-5 border-t border-gray-200">
                        <dl className="divide-y divide-gray-200">
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">Full name</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{currentUser.firstName} {currentUser.lastName}</dd>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">Username</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{currentUser.username}</dd>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">Email address</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{currentUser.email}</dd>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{currentUser.phoneNumber}</dd>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">Address</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{currentUser.address}</dd>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">Gender</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{currentUser.gender}</dd>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">Enrolled date</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{currentUser.enrollDate}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                  
                  {/* Account Actions */}
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Account Actions</h3>
                      <div className="mt-5 space-y-4">
                        <div className="p-4 border border-gray-200 rounded-md">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Change Password</h4>
                              <p className="text-sm text-gray-500">Update your password for better security.</p>
                            </div>
                            <button
                              onClick={() => setShowPasswordForm(true)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              Change
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-4 border border-gray-200 rounded-md">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Delete Account</h4>
                              <p className="text-sm text-gray-500">Permanently delete your account and all data.</p>
                            </div>
                            <button
                              onClick={() => setShowDeleteConfirm(true)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Edit Profile Form */}
              {showEditProfile && (
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Profile</h3>
                      <button 
                        onClick={() => {
                          setShowEditProfile(false);
                          setProfileErrors({});
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <form onSubmit={handleProfileUpdate} className="mt-5 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                      <div className="sm:col-span-1">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First name</label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={profileForm.firstName}
                          onChange={handleProfileChange}
                          className={`mt-1 block w-full border ${profileErrors.firstName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {profileErrors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{profileErrors.firstName}</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last name</label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={profileForm.lastName}
                          onChange={handleProfileChange}
                          className={`mt-1 block w-full border ${profileErrors.lastName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {profileErrors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{profileErrors.lastName}</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                          type="text"
                          name="username"
                          id="username"
                          value={profileForm.username}
                          onChange={handleProfileChange}
                          className={`mt-1 block w-full border ${profileErrors.username ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {profileErrors.username && (
                          <p className="mt-1 text-sm text-red-600">{profileErrors.username}</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          className={`mt-1 block w-full border ${profileErrors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {profileErrors.email && (
                          <p className="mt-1 text-sm text-red-600">{profileErrors.email}</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone number</label>
                        <input
                          type="text"
                          name="phoneNumber"
                          id="phoneNumber"
                          value={profileForm.phoneNumber}
                          onChange={handleProfileChange}
                          className={`mt-1 block w-full border ${profileErrors.phoneNumber ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {profileErrors.phoneNumber && (
                          <p className="mt-1 text-sm text-red-600">{profileErrors.phoneNumber}</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                          name="gender"
                          id="gender"
                          value={profileForm.gender}
                          onChange={handleProfileChange}
                          className={`mt-1 block w-full border ${profileErrors.gender ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {profileErrors.gender && (
                          <p className="mt-1 text-sm text-red-600">{profileErrors.gender}</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea
                          name="address"
                          id="address"
                          value={profileForm.address}
                          onChange={handleProfileChange}
                          rows="3"
                          className={`mt-1 block w-full border ${profileErrors.address ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        ></textarea>
                        {profileErrors.address && (
                          <p className="mt-1 text-sm text-red-600">{profileErrors.address}</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-2">
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => {
                              setShowEditProfile(false);
                              setProfileErrors({});
                            }}
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              
              {/* Change Password Form */}
              {showPasswordForm && (
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
                      <button 
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordErrors({});
                          setPasswordForm({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          });
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <form onSubmit={handlePasswordChange} className="mt-5 space-y-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input
                          type="password"
                          name="currentPassword"
                          id="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordFormChange}
                          className={`mt-1 block w-full border ${passwordErrors.currentPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {passwordErrors.currentPassword && (
                          <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordFormChange}
                          className={`mt-1 block w-full border ${passwordErrors.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {passwordErrors.newPassword && (
                          <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordFormChange}
                          className={`mt-1 block w-full border ${passwordErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {passwordErrors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                        )}
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowPasswordForm(false);
                            setPasswordErrors({});
                            setPasswordForm({
                              currentPassword: '',
                              newPassword: '',
                              confirmPassword: ''
                            });
                          }}
                          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Change Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              
              {/* Delete Account Confirmation */}
              {showDeleteConfirm && (
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <Trash2 className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Account</h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to delete your account? All of your data will be permanently removed.
                            This action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Sessions Section */}
          {activeSection === 'sessions' && (
            <div className="space-y-6">
              {/* Session Listing */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">My Driving Sessions</h3>
                  
                  <div className="mt-5">
                    <div className="flex flex-col">
                      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {sessions.map((session) => (
                                  <tr key={session.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium text-gray-900">{session.title}</div>
                                      <div className="text-sm text-gray-500">ID: {session.id}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">{session.date}</div>
                                      <div className="text-sm text-gray-500">{session.time}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.instructor}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <StatusBadge status={session.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {session.marks ? `${session.marks}/100` : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <button
                                        className="text-indigo-600 hover:text-indigo-900"
                                        onClick={() => {
                                          // Here you would normally show session details
                                          alert(`Session Feedback: ${session.feedback || 'No feedback available yet'}`);
                                        }}
                                      >
                                        <Info className="h-5 w-5" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Performance Summary */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Performance Summary</h3>
                  
                  <div className="mt-5">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Average Score</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{averageScore.toFixed(1)}/100</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Sessions Completed</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{completedSessions}/{sessions.length}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Instructor Feedback Summary</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                            {sessions
                              .filter(s => s.feedback)
                              .map((session) => (
                                <li key={session.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                  <div className="w-0 flex-1 flex items-center">
                                    <span className="ml-2 flex-1 w-0 truncate font-medium">{session.title}</span>
                                  </div>
                                  <div className="ml-4 flex-shrink-0">
                                    <span className="text-gray-500">{session.feedback}</span>
                                  </div>
                                </li>
                              ))}
                          </ul>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Reports Section */}
          {activeSection === 'reports' && (
            <div className="space-y-6">
              {/* Report Generator */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Generate Performance Reports</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose a report type to generate a detailed PDF of your driving progress.
                  </p>
                  
                  <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-gray-50 overflow-hidden rounded-lg border border-gray-200">
                      <div className="px-4 py-5 sm:p-6">
                        <h4 className="text-base font-medium text-gray-900">Progress Report</h4>
                        <p className="mt-1 text-sm text-gray-500">
                          A detailed report of your scores and progress over time.
                        </p>
                        <div className="mt-4">
                          <button
                            onClick={() => generateReport('Progress')}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Generate
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 overflow-hidden rounded-lg border border-gray-200">
                      <div className="px-4 py-5 sm:p-6">
                        <h4 className="text-base font-medium text-gray-900">Feedback Summary</h4>
                        <p className="mt-1 text-sm text-gray-500">
                          A compilation of all instructor feedback and comments.
                        </p>
                        <div className="mt-4">
                          <button
                            onClick={() => generateReport('Feedback')}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Generate
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 overflow-hidden rounded-lg border border-gray-200">
                      <div className="px-4 py-5 sm:p-6">
                        <h4 className="text-base font-medium text-gray-900">Comprehensive Report</h4>
                        <p className="mt-1 text-sm text-gray-500">
                          Full report with attendance, scores, feedback, and recommendations.
                        </p>
                        <div className="mt-4">
                          <button
                            onClick={() => generateReport('Comprehensive')}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Generate
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Report History */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Report History</h3>
                  
                  <div className="mt-5">
                    <div className="flex flex-col">
                      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated Date</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Download</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">March Progress Report</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-03-15</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Progress</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <button className="text-indigo-600 hover:text-indigo-900">
                                      <Download className="h-5 w-5" />
                                    </button>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">February Summary</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-02-28</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Comprehensive</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <button className="text-indigo-600 hover:text-indigo-900">
                                      <Download className="h-5 w-5" />
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* AI Assistant Section */}
          {activeSection === 'assistant' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6 flex flex-col h-full">
                <h3 className="text-lg font-medium leading-6 text-gray-900">AI Driving Assistant</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Ask questions about your driving lessons, progress, or account.
                </p>
                
                <div className="mt-5 flex-1 overflow-y-auto border border-gray-200 rounded-md p-4 flex flex-col space-y-4 h-96">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-3/4 p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-indigo-100 text-indigo-900'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-3/4 p-3 rounded-lg bg-gray-100 text-gray-900">
                        <p className="text-sm">Typing...</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <div className="flex">
                    <input
                      type="text"
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Type your message..."
                    />
                    <button
                      onClick={sendMessage}
                      className="bg-indigo-600 text-white rounded-r-md px-4 py-2 hover:bg-indigo-700 focus:outline-none"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Powered by OpenAI. Try asking about your upcoming lessons, progress, or account settings.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;