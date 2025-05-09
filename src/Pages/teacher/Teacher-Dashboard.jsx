import React, { useState } from 'react';
import { Calendar, Clock, User, Users, FileText, Download, Plus, Check, Edit, Trash2, X } from 'lucide-react';
import { useTrainingSessions } from '../../hooks/useTrainingSessions';
import { useSessionStudents } from '../../hooks/useSessionStudents';
import { useVehicles } from '../../hooks/useVehicles';
import { useInstructors } from '../../hooks/useInstructors';
import { useAuth } from '../../hooks/AuthContext';
import { physicalTrainingService } from '../../services/physicalTrainingService';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { sessions, loading, error, createSession, updateSession, deleteSession, completeSession } = useTrainingSessions();
  const { vehicles } = useVehicles();
  const { instructors } = useInstructors();
  
  // UI state
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [showStudents, setShowStudents] = useState(false);
  const [filter, setFilter] = useState('all');
  
  // Form state
  const [form, setForm] = useState({
    date: '',
    time: '',
    location: '',
    vehicleID: '',
    instructorID: user?.InstructorID || '',
    maxCount: 5
  });
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  // Session students hook
  const { 
    students, 
    loading: studentsLoading, 
    updateAttendance,
    generatePDF
  } = useSessionStudents(selectedSessionId);
  
  // Filter sessions based on selected filter
  const filteredSessions = sessions.filter(session => {
    const today = new Date().toISOString().split('T')[0];
    
    if (filter === 'upcoming') {
      return session.status === 'pending' && session.date >= today;
    } else if (filter === 'completed') {
      return session.status === 'completed';
    }
    
    return true; // 'all' filter
  });
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };
  
  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.time) newErrors.time = 'Time is required';
    if (!form.location) newErrors.location = 'Location is required';
    if (!form.vehicleID) newErrors.vehicleID = 'Vehicle is required';
    if (!form.instructorID) newErrors.instructorID = 'Instructor is required';
    if (form.maxCount < 1) newErrors.maxCount = 'At least 1 student is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (isEditing && currentSession) {
        await updateSession(currentSession.sessionID, form);
      } else {
        await createSession(form);
      }
      
      // Reset form
      setForm({
        date: '',
        time: '',
        location: '',
        vehicleID: '',
        instructorID: user?.InstructorID || '',
        maxCount: 5
      });
      
      setShowForm(false);
      setIsEditing(false);
      setCurrentSession(null);
    } catch (error) {
      console.error('Error saving session:', error);
      // Show error to user
    }
  };
  
  // Handler to edit a session
  const handleEdit = (session) => {
    setCurrentSession(session);
    setForm({
      date: session.date.split('T')[0], // format date for input
      time: session.time,
      location: session.location,
      vehicleID: session.vehicleID,
      instructorID: session.instructorID,
      maxCount: session.maxCount
    });
    setIsEditing(true);
    setShowForm(true);
  };
  
  // Handler to view students for a session
  const handleViewStudents = (sessionId) => {
    setSelectedSessionId(sessionId);
    setShowStudents(true);
  };
  
  // Handler to delete a session
  const handleDelete = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await deleteSession(sessionId);
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };
  
  // Handler to mark session as completed
  const handleComplete = async (sessionId) => {
    try {
      await completeSession(sessionId);
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };
  
  // Handler to update student attendance
  const handleAttendanceUpdate = async (enrollmentId, status) => {
    try {
      await updateAttendance(enrollmentId, status);
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };
  
  // Handler to generate PDF for a session
  const handleGeneratePDF = async (session) => {
    try {
      await generatePDF(session);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  
  // Handler to generate instructor report
  const handleGenerateInstructorReport = async () => {
    try {
      if (user?.InstructorID) {
        await physicalTrainingService.generateInstructorReportPDF(user.InstructorID, 
          sessions.filter(s => s.instructorID === user.InstructorID)
        );
      }
    } catch (error) {
      console.error('Error generating instructor report:', error);
    }
  };

  // Status badge component  
  const StatusBadge = ({ status }) => {
    let bgColor, textColor;
    
    switch(status.toLowerCase()) {
      case 'pending':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'completed':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'cancelled':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        break;
      case 'attended':
        bgColor = 'bg-purple-100';
        textColor = 'text-purple-800';
        break;
      case 'absent':
        bgColor = 'bg-orange-100';
        textColor = 'text-orange-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {status}
      </span>
    );
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-48">
      <p className="text-gray-500">Loading sessions...</p>
    </div>;
  }
  
  if (error) {
    return <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>;
  }
  
  return (
    <div className="space-y-6 px-10 py-6">
      {/* Header and Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Training Sessions</h2>
          <p className="mt-1 text-sm text-gray-500">Manage physical training sessions and student attendance</p>
        </div>
        
        <div className="flex space-x-2">
          {/* Filter buttons */}
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                filter === 'all' 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 text-sm font-medium border-t border-b ${
                filter === 'upcoming' 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                filter === 'completed' 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Completed
            </button>
          </div>
          
          {/* Action buttons */}
          <button
            onClick={() => {
              setForm({
                date: '',
                time: '',
                location: '',
                vehicleID: '',
                instructorID: user?.InstructorID || '',
                maxCount: 5
              });
              setIsEditing(false);
              setCurrentSession(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Session
          </button>
          
          {user?.InstructorID && (
            <button
              onClick={handleGenerateInstructorReport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </button>
          )}
        </div>
      </div>
      
      {/* Sessions Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredSessions.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredSessions.map((session) => (
              <li key={session.sessionID}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Calendar className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-indigo-600">{session.location}</p>
                        <div className="flex text-sm text-gray-500">
                          <p>{new Date(session.date).toLocaleDateString()}</p>
                          <p className="ml-1 pl-1 border-l border-gray-300">{session.time}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">{session.currentCount}/{session.maxCount}</span>
                      </div>
                      <StatusBadge status={session.status} />
                    </div>
                  </div>
                  
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <User className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {instructors.find(i => i.InstructorID === session.instructorID)?.InstructorName || session.instructorID}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <FileText className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {vehicles.find(v => v.vehicleID === session.vehicleID)?.vehicleModel || session.vehicleID}
                      </p>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm sm:mt-0">
                      <button
                        onClick={() => handleViewStudents(session.sessionID)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        title="View Students"
                      >
                        <Users className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => handleGeneratePDF(session)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        title="Download Report"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      
                      {session.status !== 'completed' && (
                        <>
                          <button
                            onClick={() => handleEdit(session)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            title="Edit Session"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          
                          <button
                            onClick={() => handleComplete(session.sessionID)}
                            className="text-green-600 hover:text-green-900 mr-3"
                            title="Mark as Completed"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(session.sessionID)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Session"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No training sessions found.</p>
            <button
              onClick={() => setFilter('all')}
              className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              View all sessions
            </button>
          </div>
        )}
      </div>
      
      {/* Create/Edit Session Form Modal */}
      {showForm && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {isEditing ? 'Edit Training Session' : 'Create New Training Session'}
                </h3>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        value={form.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md ${
                          errors.date 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                      />
                      {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                      <input
                        type="time"
                        name="time"
                        id="time"
                        value={form.time}
                        onChange={handleChange}
                        className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md ${
                          errors.time 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                      />
                      {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        name="location"
                        id="location"
                        value={form.location}
                        onChange={handleChange}
                        className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md ${
                          errors.location 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                      />
                      {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="vehicleID" className="block text-sm font-medium text-gray-700">Vehicle</label>
                      <select
                        name="vehicleID"
                        id="vehicleID"
                        value={form.vehicleID}
                        onChange={handleChange}
                        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base sm:text-sm rounded-md ${
                          errors.vehicleID 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                      >
                        <option value="">Select a vehicle</option>
                        {vehicles.map(v => (
                          <option key={v.vehicleID} value={v.vehicleNO}>
                            {v.vehicleNO} ({v.vehicleType })
                          </option>
                        ))}
                      </select>
                      {errors.vehicleID && <p className="mt-1 text-sm text-red-600">{errors.vehicleID}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="instructorID" className="block text-sm font-medium text-gray-700">Instructor</label>
                      <select
                        name="instructorID"
                        id="instructorID"
                        value={form.instructorID}
                        onChange={handleChange}
                        disabled={user?.InstructorID}
                        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base sm:text-sm rounded-md ${
                          errors.instructorID 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        } ${user?.InstructorID ? 'bg-gray-100' : ''}`}
                      >
                        <option value="">Select an instructor</option>
                        {instructors.map(i => (
                          <option key={i.InstructorID} value={i.InstructorID}>
                            {i.InstructorName}
                          </option>
                        ))}
                      </select>
                      {errors.instructorID && <p className="mt-1 text-sm text-red-600">{errors.instructorID}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="maxCount" className="block text-sm font-medium text-gray-700">Max Students</label>
                      <input
                        type="number"
                        name="maxCount"
                        id="maxCount"
                        min="1"
                        max="10"
                        value={form.maxCount}
                        onChange={handleChange}
                        className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md ${
                          errors.maxCount 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                      />
                      {errors.maxCount && <p className="mt-1 text-sm text-red-600">{errors.maxCount}</p>}
                    </div>
                  </div>
                  
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:text-sm"
                    >
                      {isEditing ? 'Update Session' : 'Create Session'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Students Modal */}
      {showStudents && selectedSessionId && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Students List
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowStudents(false);
                      setSelectedSessionId(null);
                    }}
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mt-4">
                  {studentsLoading ? (
                    <p className="text-center py-4 text-gray-500">Loading students...</p>
                  ) : students.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {students.map((student) => (
                        <li key={student._id} className="py-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{student.userId}</p>
                            <p className="text-sm text-gray-500">
                              Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <StatusBadge status={student.status} />
                            
                            {!filteredSessions.find(s => s.sessionID === selectedSessionId)?.status === 'completed' && (
                              <div className="ml-4 flex space-x-2">
                                <button
                                  onClick={() => handleAttendanceUpdate(student._id, 'attended')}
                                  className={`p-1 rounded-full ${
                                    student.status === 'attended' 
                                      ? 'bg-green-100 text-green-600' 
                                      : 'text-gray-400 hover:text-green-600'
                                  }`}
                                  title="Mark as Attended"
                                >
                                  <Check className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleAttendanceUpdate(student._id, 'absent')}
                                  className={`p-1 rounded-full ${
                                    student.status === 'absent' 
                                      ? 'bg-red-100 text-red-600' 
                                      : 'text-gray-400 hover:text-red-600'
                                  }`}
                                  title="Mark as Absent"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center py-4 text-gray-500">No students enrolled in this session yet.</p>
                  )}
                </div>
                
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowStudents(false);
                      setSelectedSessionId(null);
                    }}
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;