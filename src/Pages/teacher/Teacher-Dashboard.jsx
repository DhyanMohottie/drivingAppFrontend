import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Users, FileText, Settings, LogOut, Plus, X, Check, Edit, Trash2, ChevronRight, Info } from 'lucide-react';

const TeacherDashboard = () => {
  // Active section state
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [showStudentsList, setShowStudentsList] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  // Mock teacher data
  const [teacherData, setTeacherData] = useState({
    InstructorID: 'I001',
    InstructorName: 'Alex Johnson',
    email: 'alex@driveschool.com',
    InstructorLocation: 'Downtown',
    InstructorExperience: 5,
    specialization: 'Advanced Driving',
    status: 'Available',
    students: 28
  });

  // Session form state
  const [sessionForm, setSessionForm] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    maxStudents: 5,
    description: '',
  });

  const [predictedAttendance, setPredictedAttendance] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);

  useEffect(() => {
    const fetchPrediction = async () => {
      if (sessionForm.startTime) {
        try {
          setPredictionLoading(true);
          const res = await fetch(
            `http://localhost:8000/predict_attendance/?start_time=${encodeURIComponent(sessionForm.startTime)}`
          );
          const data = await res.json();
          setPredictedAttendance(data.predicted_attendance);
        } catch (error) {
          console.error("Prediction error:", error);
          setPredictedAttendance(null);
        } finally {
          setPredictionLoading(false);
        }
      } else {
        setPredictedAttendance(null);
      }
    };

    fetchPrediction();
  }, [sessionForm.startTime]);



  // Session form errors
  const [sessionErrors, setSessionErrors] = useState({});

  // Availability form state
  const [availabilityForm, setAvailabilityForm] = useState({
    monday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
    tuesday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
    wednesday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
    thursday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
    friday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
    saturday: { isAvailable: false, startTime: '10:00', endTime: '15:00' },
    sunday: { isAvailable: false, startTime: '10:00', endTime: '15:00' },
    isOnVacation: false,
    vacationStart: '',
    vacationEnd: '',
    vacationNote: ''
  });

  // Mock sessions data
  const [sessions, setSessions] = useState([
    {
      id: 'S001',
      title: 'Basic Road Navigation',
      date: '2025-03-28',
      startTime: '10:00',
      endTime: '12:00',
      location: 'Downtown Training Center',
      instructorId: 'I001',
      maxStudents: 5,
      status: 'Scheduled',
      description: 'Learn the basics of road navigation and traffic signs.',
      enrolledStudents: [
        { id: 'U001', name: 'John Doe', email: 'john@example.com', attendance: 'Confirmed' },
        { id: 'U002', name: 'Jane Smith', email: 'jane@example.com', attendance: 'Confirmed' },
        { id: 'U003', name: 'Mike Johnson', email: 'mike@example.com', attendance: 'Pending' }
      ]
    },
    {
      id: 'S002',
      title: 'Parallel Parking',
      date: '2025-03-30',
      startTime: '14:00',
      endTime: '16:00',
      location: 'Westside Parking Lot',
      instructorId: 'I001',
      maxStudents: 4,
      status: 'Scheduled',
      description: 'Master the art of parallel parking in tight spaces.',
      enrolledStudents: [
        { id: 'U001', name: 'John Doe', email: 'john@example.com', attendance: 'Confirmed' },
        { id: 'U004', name: 'Sarah Wilson', email: 'sarah@example.com', attendance: 'Confirmed' }
      ]
    },
    {
      id: 'S003',
      title: 'Highway Driving',
      date: '2025-04-05',
      startTime: '09:00',
      endTime: '11:00',
      location: 'Highway 101 Entrance',
      instructorId: 'I001',
      maxStudents: 3,
      status: 'Scheduled',
      description: 'Learn safe highway driving techniques including merging and lane changes.',
      enrolledStudents: [
        { id: 'U002', name: 'Jane Smith', email: 'jane@example.com', attendance: 'Confirmed' },
        { id: 'U003', name: 'Mike Johnson', email: 'mike@example.com', attendance: 'Confirmed' },
        { id: 'U005', name: 'David Brown', email: 'david@example.com', attendance: 'Pending' }
      ]
    },
    {
      id: 'S004',
      title: 'Defensive Driving',
      date: '2025-03-15',
      startTime: '13:00',
      endTime: '15:00',
      location: 'Downtown Training Center',
      instructorId: 'I001',
      maxStudents: 5,
      status: 'Completed',
      description: 'Learn techniques to drive safely and prevent accidents.',
      enrolledStudents: [
        { id: 'U001', name: 'John Doe', email: 'john@example.com', attendance: 'Attended' },
        { id: 'U002', name: 'Jane Smith', email: 'jane@example.com', attendance: 'Attended' },
        { id: 'U003', name: 'Mike Johnson', email: 'mike@example.com', attendance: 'Missed' },
        { id: 'U004', name: 'Sarah Wilson', email: 'sarah@example.com', attendance: 'Attended' }
      ]
    }
  ]);

  // Mock students data
  const [students, setStudents] = useState([
    {
      id: 'U001',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-123-4567',
      enrollDate: '2024-12-15',
      completedSessions: 3,
      upcomingSessions: 2,
      averageScore: 88
    },
    {
      id: 'U002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '555-987-6543',
      enrollDate: '2025-01-05',
      completedSessions: 2,
      upcomingSessions: 2,
      averageScore: 92
    },
    {
      id: 'U003',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '555-456-7890',
      enrollDate: '2025-01-10',
      completedSessions: 1,
      upcomingSessions: 2,
      averageScore: 75
    },
    {
      id: 'U004',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '555-789-1234',
      enrollDate: '2025-01-15',
      completedSessions: 1,
      upcomingSessions: 1,
      averageScore: 94
    },
    {
      id: 'U005',
      name: 'David Brown',
      email: 'david@example.com',
      phone: '555-234-5678',
      enrollDate: '2025-01-20',
      completedSessions: 0,
      upcomingSessions: 1,
      averageScore: null
    }
  ]);

  // Session form validation
  const validateSessionForm = () => {
    const errors = {};

    if (!sessionForm.title) errors.title = 'Session title is required';
    if (!sessionForm.date) errors.date = 'Date is required';
    if (!sessionForm.startTime) errors.startTime = 'Start time is required';
    if (!sessionForm.endTime) errors.endTime = 'End time is required';
    if (!sessionForm.location) errors.location = 'Location is required';

    if (sessionForm.startTime && sessionForm.endTime) {
      const start = new Date(`2000-01-01T${sessionForm.startTime}`);
      const end = new Date(`2000-01-01T${sessionForm.endTime}`);

      if (start >= end) {
        errors.endTime = 'End time must be after start time';
      }
    }

    if (sessionForm.maxStudents < 1) {
      errors.maxStudents = 'Must allow at least 1 student';
    }

    setSessionErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Session form handlers
  const handleSessionChange = (e) => {
    const { name, value, type } = e.target;
    setSessionForm({
      ...sessionForm,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };

  // Availability form handlers
  const handleAvailabilityChange = (day, field, value) => {
    setAvailabilityForm({
      ...availabilityForm,
      [day]: {
        ...availabilityForm[day],
        [field]: field === 'isAvailable' ? value : value
      }
    });
  };

  const handleVacationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAvailabilityForm({
      ...availabilityForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Create or update session
  const handleSessionSubmit = (e) => {
    e.preventDefault();

    if (validateSessionForm()) {
      if (isEditingSession) {
        // Update existing session
        setSessions(sessions.map(session =>
          session.id === currentSessionId ? {
            ...session,
            title: sessionForm.title,
            date: sessionForm.date,
            startTime: sessionForm.startTime,
            endTime: sessionForm.endTime,
            location: sessionForm.location,
            maxStudents: sessionForm.maxStudents,
            description: sessionForm.description
          } : session
        ));
      } else {
        // Create new session
        const newSession = {
          id: `S${Math.floor(1000 + Math.random() * 9000)}`,
          title: sessionForm.title,
          date: sessionForm.date,
          startTime: sessionForm.startTime,
          endTime: sessionForm.endTime,
          location: sessionForm.location,
          instructorId: teacherData.InstructorID,
          maxStudents: sessionForm.maxStudents,
          status: 'Scheduled',
          description: sessionForm.description,
          enrolledStudents: []
        };

        setSessions([...sessions, newSession]);
      }

      // Reset form and state
      setSessionForm({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        maxStudents: 5,
        description: '',
      });
      setShowSessionForm(false);
      setIsEditingSession(false);
      setCurrentSessionId(null);
    }
  };

  // Edit session
  const handleEditSession = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session && session.status !== 'Completed') {
      setSessionForm({
        title: session.title,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        location: session.location,
        maxStudents: session.maxStudents,
        description: session.description || '',
      });
      setCurrentSessionId(sessionId);
      setIsEditingSession(true);
      setShowSessionForm(true);
      setActiveSection('sessions');
    }
  };

  // Cancel session
  const handleCancelSession = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session && session.status !== 'Completed') {
      if (window.confirm(`Are you sure you want to cancel the session "${session.title}"?`)) {
        setSessions(sessions.map(s =>
          s.id === sessionId ? { ...s, status: 'Cancelled' } : s
        ));
      }
    }
  };

  // Save availability settings
  const handleAvailabilitySubmit = (e) => {
    e.preventDefault();

    // Here you would normally send the availability data to your API
    alert('Availability settings saved successfully!');
    setShowAvailabilityForm(false);
  };

  // Toggle teacher availability status
  const toggleAvailabilityStatus = () => {
    setTeacherData({
      ...teacherData,
      status: teacherData.status === 'Available' ? 'Unavailable' : 'Available'
    });
  };

  // View students in a session
  const handleViewStudents = (sessionId) => {
    setSelectedSessionId(sessionId);
    setShowStudentsList(true);
  };

  // Close students list modal
  const closeStudentsList = () => {
    setShowStudentsList(false);
    setSelectedSessionId(null);
  };

  // Calculate stats
  const upcomingSessions = sessions.filter(s => s.status === 'Scheduled').length;
  const completedSessions = sessions.filter(s => s.status === 'Completed').length;
  const cancelledSessions = sessions.filter(s => s.status === 'Cancelled').length;
  const totalStudents = students.length;

  // Status badge component
  const StatusBadge = ({ status }) => {
    let badgeClass = "px-2 py-1 rounded text-xs font-medium";

    switch (status.toLowerCase()) {
      case 'scheduled':
        badgeClass += " bg-blue-100 text-blue-800";
        break;
      case 'completed':
        badgeClass += " bg-green-100 text-green-800";
        break;
      case 'cancelled':
        badgeClass += " bg-red-100 text-red-800";
        break;
      case 'available':
        badgeClass += " bg-green-100 text-green-800";
        break;
      case 'unavailable':
        badgeClass += " bg-gray-100 text-gray-800";
        break;
      case 'confirmed':
        badgeClass += " bg-green-100 text-green-800";
        break;
      case 'pending':
        badgeClass += " bg-yellow-100 text-yellow-800";
        break;
      case 'attended':
        badgeClass += " bg-indigo-100 text-indigo-800";
        break;
      case 'missed':
        badgeClass += " bg-red-100 text-red-800";
        break;
      default:
        badgeClass += " bg-gray-100 text-gray-800";
    }

    return <span className={badgeClass}>{status}</span>;
  };

  // Find selected session
  const selectedSession = selectedSessionId ? sessions.find(s => s.id === selectedSessionId) : null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-indigo-800 to-indigo-900 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-white font-bold text-xl">DriveSchool</h1>
          </div>
          <div className="mt-6 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              <button
                onClick={() => setActiveSection('dashboard')}
                className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md w-full ${activeSection === 'dashboard'
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-100 hover:bg-indigo-700'
                  }`}
              >
                <Calendar className="mr-3 h-5 w-5" />
                Dashboard
              </button>

              <button
                onClick={() => setActiveSection('sessions')}
                className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md w-full ${activeSection === 'sessions'
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-100 hover:bg-indigo-700'
                  }`}
              >
                <FileText className="mr-3 h-5 w-5" />
                Sessions
              </button>

              <button
                onClick={() => setActiveSection('students')}
                className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md w-full ${activeSection === 'students'
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-100 hover:bg-indigo-700'
                  }`}
              >
                <Users className="mr-3 h-5 w-5" />
                Students
              </button>

              <button
                onClick={() => setActiveSection('availability')}
                className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md w-full ${activeSection === 'availability'
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-100 hover:bg-indigo-700'
                  }`}
              >
                <Clock className="mr-3 h-5 w-5" />
                Availability
              </button>

              <button
                onClick={() => setActiveSection('settings')}
                className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md w-full ${activeSection === 'settings'
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-100 hover:bg-indigo-700'
                  }`}
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
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
                {activeSection === 'dashboard' && 'Teacher Dashboard'}
                {activeSection === 'sessions' && 'Sessions Management'}
                {activeSection === 'students' && 'My Students'}
                {activeSection === 'availability' && 'Availability Settings'}
                {activeSection === 'settings' && 'Account Settings'}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center">
                <StatusBadge status={teacherData.status} />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {teacherData.InstructorName}
                </span>
                <div className="ml-2 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  {teacherData.InstructorName.charAt(0)}
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
              {/* Quick Stats */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Calendar className="h-8 w-8 text-indigo-600" />
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
                        <Users className="h-8 w-8 text-amber-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Students
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {totalStudents}
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
                        <Clock className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Availability
                        </dt>
                        <dd className="flex items-center mt-1">
                          <StatusBadge status={teacherData.status} />
                          <button
                            onClick={toggleAvailabilityStatus}
                            className="ml-2 text-xs text-indigo-600 hover:text-indigo-900"
                          >
                            Toggle
                          </button>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Sessions */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Today's Sessions</h3>
                    <button
                      onClick={() => {
                        setShowSessionForm(true);
                        setIsEditingSession(false);
                        setSessionForm({
                          title: '',
                          date: '',
                          startTime: '',
                          endTime: '',
                          location: '',
                          maxStudents: 5,
                          description: '',
                        });
                        setActiveSection('sessions');
                      }}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      New Session
                    </button>
                  </div>

                  <div className="mt-5">
                    {sessions.filter(s => {
                      const today = new Date().toISOString().split('T')[0];
                      return s.date === today && s.status === 'Scheduled';
                    }).length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {sessions
                          .filter(s => {
                            const today = new Date().toISOString().split('T')[0];
                            return s.date === today && s.status === 'Scheduled';
                          })
                          .map(session => (
                            <li key={session.id} className="py-4">
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">{session.title}</h4>
                                  <p className="text-sm text-gray-500">{session.startTime} - {session.endTime} • {session.location}</p>
                                  <p className="text-sm text-gray-500">
                                    Students: {session.enrolledStudents.length}/{session.maxStudents}
                                  </p>
                                </div>
                                <div className="flex items-center">
                                  <StatusBadge status={session.status} />
                                  <button
                                    onClick={() => handleViewStudents(session.id)}
                                    className="ml-3 text-indigo-600 hover:text-indigo-900"
                                  >
                                    <Users className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No sessions scheduled for today.</p>
                    )}
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
                    {sessions.filter(s => {
                      const today = new Date().toISOString().split('T')[0];
                      return s.date > today && s.status === 'Scheduled';
                    }).length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {sessions
                          .filter(s => {
                            const today = new Date().toISOString().split('T')[0];
                            return s.date > today && s.status === 'Scheduled';
                          })
                          .sort((a, b) => new Date(a.date) - new Date(b.date))
                          .slice(0, 3)
                          .map(session => (
                            <li key={session.id} className="py-4">
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">{session.title}</h4>
                                  <p className="text-sm text-gray-500">{session.date} • {session.startTime} - {session.endTime}</p>
                                  <p className="text-sm text-gray-500">{session.location}</p>
                                </div>
                                <div className="flex items-center">
                                  <button
                                    onClick={() => handleEditSession(session.id)}
                                    className="mr-2 text-indigo-600 hover:text-indigo-900"
                                  >
                                    <Edit className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => handleCancelSession(session.id)}
                                    className="mr-2 text-red-600 hover:text-red-900"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                </div>
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

          {/* Sessions Management Section */}
          {activeSection === 'sessions' && (
            <div className="space-y-6">
              {!showSessionForm && (
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Manage Sessions</h3>
                      <button
                        onClick={() => {
                          setShowSessionForm(true);
                          setIsEditingSession(false);
                          setSessionForm({
                            title: '',
                            date: '',
                            startTime: '',
                            endTime: '',
                            location: '',
                            maxStudents: 5,
                            description: '',
                          });
                        }}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Session
                      </button>
                    </div>

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
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {sessions.map((session) => (
                                    <tr key={session.id}>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{session.title}</div>
                                        <div className="text-sm text-gray-500">{session.description.substring(0, 30)}...</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{session.date}</div>
                                        <div className="text-sm text-gray-500">{session.startTime} - {session.endTime}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.location}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {session.enrolledStudents.length}/{session.maxStudents}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={session.status} />
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                          onClick={() => handleViewStudents(session.id)}
                                          className="mr-2 text-indigo-600 hover:text-indigo-900"
                                          title="View Students"
                                        >
                                          <Users className="h-5 w-5" />
                                        </button>

                                        {session.status !== 'Completed' && session.status !== 'Cancelled' && (
                                          <>
                                            <button
                                              onClick={() => handleEditSession(session.id)}
                                              className="mr-2 text-indigo-600 hover:text-indigo-900"
                                              title="Edit Session"
                                            >
                                              <Edit className="h-5 w-5" />
                                            </button>
                                            <button
                                              onClick={() => handleCancelSession(session.id)}
                                              className="text-red-600 hover:text-red-900"
                                              title="Cancel Session"
                                            >
                                              <Trash2 className="h-5 w-5" />
                                            </button>
                                          </>
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
                    </div>
                  </div>
                </div>
              )}

              {/* Create/Edit Session Form */}
              {showSessionForm && (
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        {isEditingSession ? 'Edit Session' : 'Create New Session'}
                      </h3>
                      <button
                        onClick={() => {
                          setShowSessionForm(false);
                          setSessionErrors({});
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSessionSubmit} className="mt-5 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                      <div className="sm:col-span-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Session Title</label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={sessionForm.title}
                          onChange={handleSessionChange}
                          className={`mt-1 block w-full border ${sessionErrors.title ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {sessionErrors.title && (
                          <p className="mt-1 text-sm text-red-600">{sessionErrors.title}</p>
                        )}
                      </div>

                      <div className="sm:col-span-1">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                          type="date"
                          name="date"
                          id="date"
                          value={sessionForm.date}
                          onChange={handleSessionChange}
                          min={new Date().toISOString().split('T')[0]}
                          className={`mt-1 block w-full border ${sessionErrors.date ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {sessionErrors.date && (
                          <p className="mt-1 text-sm text-red-600">{sessionErrors.date}</p>
                        )}
                      </div>

                      <div className="sm:col-span-1">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                          type="text"
                          name="location"
                          id="location"
                          value={sessionForm.location}
                          onChange={handleSessionChange}
                          className={`mt-1 block w-full border ${sessionErrors.location ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {sessionErrors.location && (
                          <p className="mt-1 text-sm text-red-600">{sessionErrors.location}</p>
                        )}
                      </div>

                      <div className="sm:col-span-1">
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input
                          type="time"
                          name="startTime"
                          id="startTime"
                          value={sessionForm.startTime}
                          onChange={handleSessionChange}
                          className={`mt-1 block w-full border ${sessionErrors.startTime ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {sessionErrors.startTime && (
                          <p className="mt-1 text-sm text-red-600">{sessionErrors.startTime}</p>
                        )}
                      </div>

                      <div className="sm:col-span-1">
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                        <input
                          type="time"
                          name="endTime"
                          id="endTime"
                          value={sessionForm.endTime}
                          onChange={handleSessionChange}
                          className={`mt-1 block w-full border ${sessionErrors.endTime ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {sessionErrors.endTime && (
                          <p className="mt-1 text-sm text-red-600">{sessionErrors.endTime}</p>
                        )}
                      </div>


                      <div className="sm:col-span-2 flex gap-4 items-end">

                        <div className="flex-1">
                          <label htmlFor="maxStudents" className="block text-sm font-medium text-gray-700">
                            Maximum Students
                          </label>
                          <input
                            type="number"
                            name="maxStudents"
                            id="maxStudents"
                            min="1"
                            max="10"
                            value={sessionForm.maxStudents}
                            onChange={handleSessionChange}
                            className={`mt-1 block w-full border ${sessionErrors.maxStudents ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm h-10 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          />
                          {sessionErrors.maxStudents && (
                            <p className="mt-1 text-sm text-red-600">{sessionErrors.maxStudents}</p>
                          )}
                        </div>

                        <div className="flex-1">
                          <label className="block text-sm font-medium text-blue-700 mb-1">
                            Predicted Attendance
                          </label>
                          <div
                            className={`
        mt-1 w-full rounded-md border
        ${predictionLoading ? "border-blue-200 bg-blue-50 text-blue-400" : "border-blue-300 bg-blue-50 text-blue-700"}
        h-10 px-3 flex items-center font-semibold
      `}
                            style={{ minHeight: '40px' }}
                          >
                            {sessionForm.startTime ? (
                              predictionLoading
                                ? "Predicting..."
                                : predictedAttendance !== null
                                  ? predictedAttendance
                                  : "N/A"
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>





                      <div className="sm:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          name="description"
                          id="description"
                          rows="3"
                          value={sessionForm.description}
                          onChange={handleSessionChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        ></textarea>
                      </div>

                      <div className="sm:col-span-2">
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => {
                              setShowSessionForm(false);
                              setSessionErrors({});
                            }}
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            {isEditingSession ? 'Update Session' : 'Create Session'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )
          }

          {/* Students Section */}
          {
            activeSection === 'students' && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">My Students</h3>

                  <div className="mt-5">
                    <div className="flex flex-col">
                      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Since</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Score</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {students.map((student) => (
                                  <tr key={student.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                          {student.name.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                          <div className="text-sm text-gray-500">ID: {student.id}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">{student.email}</div>
                                      <div className="text-sm text-gray-500">{student.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.enrollDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">{student.completedSessions} completed</div>
                                      <div className="text-sm text-gray-500">{student.upcomingSessions} upcoming</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {student.averageScore ? `${student.averageScore}/100` : 'N/A'}
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
            )
          }

          {/* Availability Section */}
          {
            activeSection === 'availability' && (
              <div className="space-y-6">
                {!showAvailabilityForm && (
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Availability Status</h3>
                        <div className="flex items-center">
                          <StatusBadge status={teacherData.status} />
                          <button
                            onClick={toggleAvailabilityStatus}
                            className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            Toggle Status
                          </button>
                        </div>
                      </div>

                      <div className="mt-5">
                        <h4 className="text-base font-medium text-gray-900">Weekly Schedule</h4>
                        <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-7">
                          {Object.entries(availabilityForm)
                            .filter(([key]) => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(key))
                            .map(([day, data]) => (
                              <div key={day} className="bg-gray-50 overflow-hidden rounded-lg border border-gray-200 p-4">
                                <h5 className="font-medium text-gray-900 capitalize">{day}</h5>
                                <p className="mt-1 text-sm text-gray-500">
                                  {data.isAvailable ? (
                                    <>
                                      <span className="text-green-600 font-medium">Available</span>
                                      <br />
                                      {data.startTime} - {data.endTime}
                                    </>
                                  ) : (
                                    <span className="text-gray-600">Unavailable</span>
                                  )}
                                </p>
                              </div>
                            ))}
                        </div>

                        <div className="mt-6">
                          {availabilityForm.isOnVacation && (
                            <div className="bg-yellow-50 p-4 rounded-md">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <Clock className="h-5 w-5 text-yellow-400" />
                                </div>
                                <div className="ml-3">
                                  <h3 className="text-sm font-medium text-yellow-800">Vacation Mode Active</h3>
                                  <div className="mt-2 text-sm text-yellow-700">
                                    <p>You are on vacation from {availabilityForm.vacationStart} to {availabilityForm.vacationEnd}.</p>
                                    {availabilityForm.vacationNote && (
                                      <p className="mt-1">Note: {availabilityForm.vacationNote}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => setShowAvailabilityForm(true)}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Availability
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Edit Availability Form */}
                {showAvailabilityForm && (
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Availability</h3>
                        <button
                          onClick={() => setShowAvailabilityForm(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <form onSubmit={handleAvailabilitySubmit} className="mt-5">
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-base font-medium text-gray-900">Weekly Schedule</h4>
                            <p className="mt-1 text-sm text-gray-500">Set your regular weekly availability.</p>

                            <div className="mt-3 space-y-4">
                              {Object.entries(availabilityForm)
                                .filter(([key]) => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(key))
                                .map(([day, data]) => (
                                  <div key={day} className="p-4 bg-gray-50 rounded-md">
                                    <div className="flex items-center justify-between">
                                      <h5 className="font-medium text-gray-900 capitalize">{day}</h5>
                                      <div className="flex items-center">
                                        <input
                                          type="checkbox"
                                          id={`${day}-available`}
                                          checked={data.isAvailable}
                                          onChange={(e) => handleAvailabilityChange(day, 'isAvailable', e.target.checked)}
                                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor={`${day}-available`} className="ml-2 block text-sm text-gray-900">
                                          Available
                                        </label>
                                      </div>
                                    </div>

                                    {data.isAvailable && (
                                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div>
                                          <label htmlFor={`${day}-start`} className="block text-sm font-medium text-gray-700">Start Time</label>
                                          <input
                                            type="time"
                                            id={`${day}-start`}
                                            value={data.startTime}
                                            onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                          />
                                        </div>

                                        <div>
                                          <label htmlFor={`${day}-end`} className="block text-sm font-medium text-gray-700">End Time</label>
                                          <input
                                            type="time"
                                            id={`${day}-end`}
                                            value={data.endTime}
                                            onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>

                          <div className="pt-5 border-t border-gray-200">
                            <h4 className="text-base font-medium text-gray-900">Vacation Settings</h4>
                            <p className="mt-1 text-sm text-gray-500">Set vacation or time off.</p>

                            <div className="mt-3">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="isOnVacation"
                                  name="isOnVacation"
                                  checked={availabilityForm.isOnVacation}
                                  onChange={handleVacationChange}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isOnVacation" className="ml-2 block text-sm text-gray-900">
                                  I'm going on vacation
                                </label>
                              </div>

                              {availabilityForm.isOnVacation && (
                                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                  <div>
                                    <label htmlFor="vacationStart" className="block text-sm font-medium text-gray-700">Start Date</label>
                                    <input
                                      type="date"
                                      id="vacationStart"
                                      name="vacationStart"
                                      value={availabilityForm.vacationStart}
                                      onChange={handleVacationChange}
                                      min={new Date().toISOString().split('T')[0]}
                                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label htmlFor="vacationEnd" className="block text-sm font-medium text-gray-700">End Date</label>
                                    <input
                                      type="date"
                                      id="vacationEnd"
                                      name="vacationEnd"
                                      value={availabilityForm.vacationEnd}
                                      onChange={handleVacationChange}
                                      min={availabilityForm.vacationStart || new Date().toISOString().split('T')[0]}
                                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                  </div>

                                  <div className="sm:col-span-2">
                                    <label htmlFor="vacationNote" className="block text-sm font-medium text-gray-700">Note (Optional)</label>
                                    <input
                                      type="text"
                                      id="vacationNote"
                                      name="vacationNote"
                                      value={availabilityForm.vacationNote}
                                      onChange={handleVacationChange}
                                      placeholder="e.g., Out of town for conference"
                                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => setShowAvailabilityForm(false)}
                              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Save Settings
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )
          }

          {/* Settings Section */}
          {
            activeSection === 'settings' && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Account Settings</h3>
                  <div className="mt-5">
                    <p className="text-gray-500">Account settings panel would go here.</p>
                  </div>
                </div>
              </div>
            )
          }
        </main >
      </div >

      {/* Student List Modal */}
      {
        showStudentsList && selectedSession && (
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Students in {selectedSession.title}
                      </h3>
                      <div className="mt-4">
                        {selectedSession.enrolledStudents.length > 0 ? (
                          <div className="flow-root">
                            <ul className="-my-5 divide-y divide-gray-200">
                              {selectedSession.enrolledStudents.map((student) => (
                                <li key={student.id} className="py-4">
                                  <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                        {student.name.charAt(0)}
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {student.name}
                                      </p>
                                      <p className="text-sm text-gray-500 truncate">
                                        {student.email}
                                      </p>
                                    </div>
                                    <div>
                                      <StatusBadge status={student.attendance} />
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No students enrolled in this session yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={closeStudentsList}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default TeacherDashboard;
