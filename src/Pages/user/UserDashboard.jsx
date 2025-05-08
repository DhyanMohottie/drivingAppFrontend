import React, { useState, useEffect } from 'react';
import { User, Calendar, BarChart3, MessageSquare, LogOut, Edit, Trash2, Download, Send, Info, X, Check, AlertTriangle } from 'lucide-react';
import { useTrainingSessions } from '../../hooks/useTrainingSessions';
import { useSessionStudents } from '../../hooks/useSessionStudents';
import { useAuth } from '../../hooks/AuthContext';
import axiosInstance from '../../lib/axiosInstance';
import ChatBot from '../../Components/ChatBot';



const UserDashboard = () => {
  // Authentication and user data
  const { logout, updateUser } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // UI state management
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [user , setUser] = useState(null);
  const token = localStorage.getItem('accessToken');
  console.log(token);

  useEffect(() => {

      const getUserInfo = async () => {
        try {
          const response = await axiosInstance.get(`/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.user);
          console.log('User info:', response.data.user);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    getUserInfo();
  } , []);

  // Training sessions data from hooks
  const { 
    sessions: availableSessions, 
    loading: sessionsLoading,
    error: sessionsError
  } = useTrainingSessions();
  
  // User's enrollments
  const [userEnrollments, setUserEnrollments] = useState([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({ ...user });
  const [profileErrors, setProfileErrors] = useState({});
  
  // Chatbot state
  const [chatMessages, setChatMessages] = useState([
    { role: 'system', content: 'Hello! I\'m your driving school assistant. How can I help you today?' }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Fetch user enrollments
  useEffect(() => {
    const fetchUserEnrollments = async () => {
      if (!user?.userID) return;
      
      setEnrollmentsLoading(true);
      try {
        // Using the physicalTrainingService directly would be better in a real app
        const response = await axiosInstance.get(`/enroll-pts/user/${user.userID}`);
        setUserEnrollments(response.data.enrollments);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setEnrollmentsLoading(false);
      }
    };
    
    fetchUserEnrollments();
  }, [user?.userID]);
  
  // Profile validation
  const validateProfileForm = () => {
    const errors = {};
    
    if (!profileForm.firstName) errors.firstName = 'First name is required';
    if (!profileForm.lastName) errors.lastName = 'Last name is required';
    if (!profileForm.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      errors.email = 'Email is invalid';
    }
    if (!profileForm.phoneNumber) errors.phoneNumber = 'Phone number is required';
    if (!profileForm.address) errors.address = 'Address is required';
    
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (validateProfileForm()) {
      try {
        // Here you would call your API to update the profile
        // For example: await userService.updateProfile(profileForm);
        
        // For now, we'll update the local user state
        updateUser(profileForm);
        setShowEditProfile(false);
        
        // Show success message
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    }
  };
  
  // Form change handler
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });
  };
  
  // Enroll in a session
  const handleEnrollSession = async () => {
    if (!selectedSessionId) return;
    
    try {
      // Call the enrollment API
      await axiosInstance.post('/enroll-pts', {
        userId: user.userID,
        sessionId: selectedSessionId
      });
      
      // Refetch enrollments to update the list
      const response = await axiosInstance.get(`/enroll-pts/user/${user.userID}`);
      setUserEnrollments(response.data.enrollments);
      
      // Close the enrollment form
      setShowEnrollForm(false);
      setSelectedSessionId(null);
      
      // Show success message
      alert('Successfully enrolled in the session!');
    } catch (error) {
      console.error('Error enrolling in session:', error);
      alert('Failed to enroll in session. Please try again.');
    }
  };
  
  // Unenroll from a session
  const handleUnenrollSession = async (enrollmentId) => {
    if (!enrollmentId) return;
    
    if (window.confirm('Are you sure you want to cancel this enrollment?')) {
      try {
        // Call the unenroll API
        await axiosInstance.delete(`/enroll-pts/${enrollmentId}`);
        
        // Update local state
        setUserEnrollments(userEnrollments.filter(e => e._id !== enrollmentId));
        
        // Show success message
        alert('Successfully cancelled enrollment.');
      } catch (error) {
        console.error('Error cancelling enrollment:', error);
        alert('Failed to cancel enrollment. Please try again.');
      }
    }
  };
  
  
  // Calculate statistics
  const completedSessions = userEnrollments.filter(e => e.sessionDetails?.status === 'completed').length;
  const upcomingSessions = userEnrollments.filter(e => e.sessionDetails?.status === 'pending').length;
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    let badgeClass = "px-2 py-1 rounded text-xs font-medium";
    
    switch(status?.toLowerCase()) {
      case 'completed':
        badgeClass += " bg-green-100 text-green-800";
        break;
      case 'pending':
      case 'scheduled':
        badgeClass += " bg-blue-100 text-blue-800";
        break;
      case 'cancelled':
        badgeClass += " bg-red-100 text-red-800";
        break;
      case 'confirmed':
        badgeClass += " bg-purple-100 text-purple-800";
        break;
      default:
        badgeClass += " bg-gray-100 text-gray-800";
    }
    
    return <span className={badgeClass}>{status}</span>;
  };

  // Loading state
  if (!user) {
    return <div className="flex justify-center items-center h-screen">
      <p>Loading user data...</p>
    </div>;
  }

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
            <button 
              onClick={logout}
              className="group flex items-center px-2 py-3 text-sm font-medium rounded-md w-full text-indigo-100 hover:bg-indigo-700"
            >
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
                {activeSection === 'sessions' && 'My Training Sessions'}
                {activeSection === 'assistant' && 'AI Assistant'}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{user.firstName} {user.lastName}</span>
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
                  <h3 className="text-xl font-medium leading-6 text-white">Welcome back, {user.firstName}!</h3>
                  <p className="mt-1 text-sm text-blue-100">
                    Your driving journey continues. You're enrolled in {userEnrollments.length} sessions.
                  </p>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Calendar className="h-8 w-8 text-indigo-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Sessions
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {userEnrollments.length}
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
                        <Check className="h-8 w-8 text-emerald-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Completed Sessions
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {completedSessions}
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
                        <Calendar className="h-8 w-8 text-amber-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Upcoming Sessions
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {upcomingSessions}
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Upcoming Sessions Quick View */}
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
                    {enrollmentsLoading ? (
                      <p className="text-gray-500">Loading sessions...</p>
                    ) : userEnrollments.filter(e => e.sessionDetails?.status === 'pending').length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {userEnrollments
                          .filter(e => e.sessionDetails?.status === 'pending')
                          .slice(0, 3)
                          .map(enrollment => (
                            <li key={enrollment._id} className="py-4">
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">{enrollment.sessionDetails?.title || 'Untitled Session'}</h4>
                                  <p className="text-sm text-gray-500">
                                    {enrollment.sessionDetails?.date && new Date(enrollment.sessionDetails.date).toLocaleDateString()} • 
                                    {enrollment.sessionDetails?.time}
                                  </p>
                                  <p className="text-sm text-gray-500">Location: {enrollment.sessionDetails?.location}</p>
                                </div>
                                <StatusBadge status={enrollment.status} />
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
            </div>
          )}

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              {!showEditProfile ? (
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
                          setProfileForm({...user});
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
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.firstName} {user.lastName}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-gray-500">Username</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.username}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-gray-500">Email address</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.phoneNumber}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-gray-500">Address</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.address}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-gray-500">Gender</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.gender}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              ) : (
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
                          value={profileForm.firstName || ''}
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
                          value={profileForm.lastName || ''}
                          onChange={handleProfileChange}
                          className={`mt-1 block w-full border ${profileErrors.lastName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {profileErrors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{profileErrors.lastName}</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={profileForm.email || ''}
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
                          value={profileForm.phoneNumber || ''}
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
                          value={profileForm.gender || ''}
                          onChange={handleProfileChange}
                          className={`mt-1 block w-full border ${profileErrors.gender ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
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
                          value={profileForm.address || ''}
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
            </div>
          )}
          
          {/* Sessions Section */}
          {activeSection === 'sessions' && (
            <div className="space-y-6">
              {/* Enrolled Sessions */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">My Enrolled Sessions</h3>
                    <button
                      onClick={() => setShowEnrollForm(true)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                      Enroll in Session
                    </button>
                  </div>
                  
                  <div className="mt-5">
                    {enrollmentsLoading ? (
                      <p className="text-center py-4 text-gray-500">Loading your enrollments...</p>
                    ) : userEnrollments.length > 0 ? (
                      <div className="flex flex-col">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {userEnrollments.map((enrollment) => (
                                    <tr key={enrollment._id}>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                          {enrollment.sessionDetails?.title || 'Untitled Session'}
                                        </div>
                                        <div className="text-sm text-gray-500">Type: {enrollment.enrollmentType || 'Standard'}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                          {enrollment.sessionDetails?.date && new Date(enrollment.sessionDetails.date).toLocaleDateString()}
                                        </div>
                                        <div className="text-sm text-gray-500">{enrollment.sessionDetails?.time}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {enrollment.sessionDetails?.location}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={enrollment.status} />
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {enrollment.status !== 'completed' && (
                                          <button
                                            onClick={() => handleUnenrollSession(enrollment._id)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Cancel Enrollment"
                                          >
                                            <Trash2 className="h-5 w-5" />
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">You are not enrolled in any sessions yet.</p>
                        <button
                          onClick={() => setShowEnrollForm(true)}
                          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                        >
                          Enroll Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Session Enrollment Modal */}
              {showEnrollForm && (
                <div className="fixed inset-0 overflow-y-auto z-50">
                  <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity">
                      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                    
                    <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Enroll in a Session
                          </h3>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Select a training session from the list below to enroll.
                            </p>
                          </div>
                          
                          <div className="mt-4">
                            {sessionsLoading ? (
                              <p className="text-gray-500">Loading available sessions...</p>
                            ) : sessionsError ? (
                              <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                  <div className="flex-shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                                  </div>
                                  <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                      Error loading sessions
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                      <p>{sessionsError}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : availableSessions.filter(s => s.status === 'pending').length > 0 ? (
                              <div className="mt-2 space-y-2">
                                {availableSessions
                                  .filter(s => s.status === 'pending')
                                  .map(session => {
                                    // Check if user is already enrolled in this session
                                    const isEnrolled = userEnrollments.some(
                                      e => e.sessionId === session.sessionID
                                    );
                                    
                                    return (
                                      <div key={session.sessionID} className="p-3 border border-gray-200 rounded-md">
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <p className="text-sm font-medium text-gray-900">{session.title || 'Untitled Session'}</p>
                                            <p className="text-xs text-gray-500">
                                              {new Date(session.date).toLocaleDateString()} • {session.time}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              Location: {session.location} • Instructor: {session.instructorName || session.instructorID}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {session.currentCount}/{session.maxCount} students enrolled
                                            </p>
                                          </div>
                                          <div>
                                            {isEnrolled ? (
                                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                                                Already Enrolled
                                              </span>
                                            ) : (
                                              <button
                                                onClick={() => setSelectedSessionId(session.sessionID)}
                                                className={`px-3 py-1 text-xs font-medium rounded-md ${
                                                  selectedSessionId === session.sessionID
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                }`}
                                              >
                                                {selectedSessionId === session.sessionID ? 'Selected' : 'Select'}
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            ) : (
                              <p className="text-center py-4 text-gray-500">No available sessions found.</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          disabled={!selectedSessionId}
                          onClick={handleEnrollSession}
                          className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
                            !selectedSessionId ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          Enroll
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowEnrollForm(false);
                            setSelectedSessionId(null);
                          }}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* AI Assistant Section */}
          {activeSection === 'assistant' && <ChatBot />}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;