import React, { useState, useEffect } from 'react';
import { Clock, BarChart3, UserPlus, Car, Users, Calendar, Settings, LogOut, X, Check, Trash2, Edit, Plus } from 'lucide-react';

const AdminDashboard = () => {
  // State for active section
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showInstructorForm, setShowInstructorForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVehicleId, setCurrentVehicleId] = useState(null);
  const [currentInstructorId, setCurrentInstructorId] = useState(null);
  
  // Vehicle form state
  const [vehicleForm, setVehicleForm] = useState({
    vehicleID: '',
    vehicleNO: '',
    vehicleType: '',
    transmissionType: '',
    fuelType: '',
    availability: true,
    studentCnt: 0,
  });
  
  // Vehicle form errors
  const [vehicleErrors, setVehicleErrors] = useState({});
  
  // Instructor form state
  const [instructorForm, setInstructorForm] = useState({
    InstructorID: '',
    InstructorName: '',
    email: '',
    InstructorLocation: '',
    InstructorExperience: '',
    password: '',
    isInstructor: true,
  });
  
  // Instructor form errors
  const [instructorErrors, setInstructorErrors] = useState({});
  
  // Sample dummy data
  const [vehicles, setVehicles] = useState([
    {
      vehicleID: 'V001',
      vehicleNO: 'ABC-1234',
      vehicleType: 'Sedan',
      transmissionType: 'Automatic', 
      fuelType: 'Petrol',
      availability: true,
      studentCnt: 5,
      lastService: '15 Mar 2025' // Additional field for UI
    },
    {
      vehicleID: 'V002',
      vehicleNO: 'XYZ-5678',
      vehicleType: 'Hatchback',
      transmissionType: 'Manual',
      fuelType: 'Diesel',
      availability: false,
      studentCnt: 8,
      lastService: '10 Mar 2025'
    },
    {
      vehicleID: 'V003',
      vehicleNO: 'DEF-9012',
      vehicleType: 'SUV',
      transmissionType: 'Automatic',
      fuelType: 'Hybrid',
      availability: true,
      studentCnt: 3,
      lastService: '03 Mar 2025'
    },
  ]);

  const [instructors, setInstructors] = useState([
    {
      InstructorID: 'I001',
      InstructorName: 'Alex Johnson',
      email: 'alex@driveschool.com',
      InstructorLocation: 'Downtown',
      InstructorExperience: 5,
      password: 'password123',
      isInstructor: true,
      specialization: 'Advanced Driving',
      status: 'Available',
      students: 28
    },
    {
      InstructorID: 'I002',
      InstructorName: 'Sarah Miller',
      email: 'sarah@driveschool.com',
      InstructorLocation: 'Northside',
      InstructorExperience: 8,
      password: 'password456',
      isInstructor: true,
      specialization: 'Defensive Driving',
      status: 'In Class',
      students: 32
    },
    {
      InstructorID: 'I003',
      InstructorName: 'James Wilson',
      email: 'james@driveschool.com',
      InstructorLocation: 'Southside',
      InstructorExperience: 3,
      password: 'password789',
      isInstructor: true,
      specialization: 'New Drivers',
      status: 'Available',
      students: 24
    },
  ]);
  
  // Sample statistics data
  const stats = [
    { title: 'Total Instructors', value: instructors.length.toString(), icon: <Users className="h-8 w-8 text-indigo-600" />, change: `+${instructors.length > 1 ? '2' : '0'} this month` },
    { title: 'Available Vehicles', value: vehicles.filter(v => v.availability).length.toString(), icon: <Car className="h-8 w-8 text-emerald-600" />, change: `${vehicles.filter(v => !v.availability).length} in maintenance` },
    { title: 'Classes Today', value: '12', icon: <Calendar className="h-8 w-8 text-amber-600" />, change: '4 remaining' },
    { title: 'Student Enrollments', value: '187', icon: <BarChart3 className="h-8 w-8 text-purple-600" />, change: '+15% from last month' },
  ];

  // Sample instructor availability (for the chart)
  const instructorAvailability = [85, 65, 90, 75, 50, 80, 95];
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Function to handle navigation
  const navigateTo = (section) => {
    setActiveSection(section);
    setShowVehicleForm(false);
    setShowInstructorForm(false);
    setIsEditing(false);
  };

  // Vehicle form handlers
  const handleVehicleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVehicleForm({
      ...vehicleForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const validateVehicleForm = () => {
    const errors = {};
    if (!vehicleForm.vehicleID) errors.vehicleID = 'Vehicle ID is required';
    if (!vehicleForm.vehicleNO) errors.vehicleNO = 'Vehicle number is required';
    if (!vehicleForm.vehicleType) errors.vehicleType = 'Vehicle type is required';
    if (!vehicleForm.transmissionType) errors.transmissionType = 'Transmission type is required';
    if (!vehicleForm.fuelType) errors.fuelType = 'Fuel type is required';
    if (vehicleForm.studentCnt < 0) errors.studentCnt = 'Student count cannot be negative';
    
    // Check for duplicate vehicleID (only when adding new)
    if (!isEditing && vehicles.some(v => v.vehicleID === vehicleForm.vehicleID)) {
      errors.vehicleID = 'Vehicle ID must be unique';
    }
    
    setVehicleErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleVehicleSubmit = (e) => {
    e.preventDefault();
    
    if (validateVehicleForm()) {
      if (isEditing) {
        // Update existing vehicle
        setVehicles(vehicles.map(vehicle => 
          vehicle.vehicleID === currentVehicleId ? { ...vehicleForm, lastService: new Date().toLocaleDateString() } : vehicle
        ));
      } else {
        // Add new vehicle
        setVehicles([...vehicles, { 
          ...vehicleForm, 
          lastService: new Date().toLocaleDateString()
        }]);
      }
      
      // Reset form and state
      setVehicleForm({
        vehicleID: '',
        vehicleNO: '',
        vehicleType: '',
        transmissionType: '',
        fuelType: '',
        availability: true,
        studentCnt: 0,
      });
      setShowVehicleForm(false);
      setIsEditing(false);
      setCurrentVehicleId(null);
    }
  };
  
  const handleEditVehicle = (vehicleID) => {
    const vehicle = vehicles.find(v => v.vehicleID === vehicleID);
    if (vehicle) {
      setVehicleForm({
        vehicleID: vehicle.vehicleID,
        vehicleNO: vehicle.vehicleNO,
        vehicleType: vehicle.vehicleType,
        transmissionType: vehicle.transmissionType,
        fuelType: vehicle.fuelType,
        availability: vehicle.availability,
        studentCnt: vehicle.studentCnt,
      });
      setCurrentVehicleId(vehicleID);
      setIsEditing(true);
      setShowVehicleForm(true);
      setActiveSection('vehicles');
    }
  };
  
  const handleDeleteVehicle = (vehicleID) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(vehicles.filter(vehicle => vehicle.vehicleID !== vehicleID));
    }
  };

  // Instructor form handlers
  const handleInstructorChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInstructorForm({
      ...instructorForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const validateInstructorForm = () => {
    const errors = {};
    if (!instructorForm.InstructorID) errors.InstructorID = 'Instructor ID is required';
    if (!instructorForm.InstructorName) errors.InstructorName = 'Name is required';
    if (!instructorForm.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(instructorForm.email)) {
      errors.email = 'Email is invalid';
    }
    if (!instructorForm.InstructorLocation) errors.InstructorLocation = 'Location is required';
    if (!instructorForm.InstructorExperience) {
      errors.InstructorExperience = 'Experience is required';
    } else if (isNaN(instructorForm.InstructorExperience) || Number(instructorForm.InstructorExperience) < 0) {
      errors.InstructorExperience = 'Experience must be a positive number';
    }
    if (!instructorForm.password) {
      errors.password = 'Password is required';
    } else if (instructorForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    // Check for duplicate InstructorID and email (only when adding new)
    if (!isEditing) {
      if (instructors.some(i => i.InstructorID === instructorForm.InstructorID)) {
        errors.InstructorID = 'Instructor ID must be unique';
      }
      if (instructors.some(i => i.email === instructorForm.email)) {
        errors.email = 'Email must be unique';
      }
    }
    
    setInstructorErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleInstructorSubmit = (e) => {
    e.preventDefault();
    
    if (validateInstructorForm()) {
      if (isEditing) {
        // Update existing instructor
        setInstructors(instructors.map(instructor => 
          instructor.InstructorID === currentInstructorId 
            ? { 
                ...instructor, 
                ...instructorForm,
                // Keep additional UI fields
                specialization: instructor.specialization,
                status: instructor.status,
                students: instructor.students
              } 
            : instructor
        ));
      } else {
        // Add new instructor
        setInstructors([...instructors, { 
          ...instructorForm,
          // Default additional UI fields
          specialization: 'General Driving',
          status: 'Available',
          students: 0
        }]);
      }
      
      // Reset form and state
      setInstructorForm({
        InstructorID: '',
        InstructorName: '',
        email: '',
        InstructorLocation: '',
        InstructorExperience: '',
        password: '',
        isInstructor: true,
      });
      setShowInstructorForm(false);
      setIsEditing(false);
      setCurrentInstructorId(null);
    }
  };
  
  const handleEditInstructor = (instructorID) => {
    const instructor = instructors.find(i => i.InstructorID === instructorID);
    if (instructor) {
      setInstructorForm({
        InstructorID: instructor.InstructorID,
        InstructorName: instructor.InstructorName,
        email: instructor.email,
        InstructorLocation: instructor.InstructorLocation,
        InstructorExperience: instructor.InstructorExperience,
        password: instructor.password,
        isInstructor: instructor.isInstructor,
      });
      setCurrentInstructorId(instructorID);
      setIsEditing(true);
      setShowInstructorForm(true);
      setActiveSection('teachers');
    }
  };
  
  const handleDeleteInstructor = (instructorID) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      setInstructors(instructors.filter(instructor => instructor.InstructorID !== instructorID));
    }
  };

  // Status badge component with appropriate colors
  const StatusBadge = ({ status }) => {
    let badgeClass = "px-2 py-1 rounded text-xs font-medium";
    
    switch(typeof status === 'boolean' ? (status ? 'Available' : 'Unavailable') : status.toLowerCase()) {
      case 'available':
        badgeClass += " bg-green-100 text-green-800";
        break;
      case 'unavailable':
        badgeClass += " bg-red-100 text-red-800";
        break;
      case 'in use':
      case 'in class':
        badgeClass += " bg-blue-100 text-blue-800";
        break;
      case 'maintenance':
        badgeClass += " bg-amber-100 text-amber-800";
        break;
      default:
        badgeClass += " bg-gray-100 text-gray-800";
    }
    
    return <span className={badgeClass}>{typeof status === 'boolean' ? (status ? 'Available' : 'Unavailable') : status}</span>;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-indigo-800 to-indigo-900 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-white font-bold text-xl">DriveSchool Admin</h1>
          </div>
          <div className="mt-6 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              <button 
                onClick={() => navigateTo('dashboard')}
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
                onClick={() => navigateTo('teachers')}
                className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md w-full ${
                  activeSection === 'teachers' 
                    ? 'bg-indigo-700 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-700'
                }`}
              >
                <Users className="mr-3 h-5 w-5" />
                Teachers
              </button>
              
              <button 
                onClick={() => navigateTo('vehicles')}
                className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md w-full ${
                  activeSection === 'vehicles' 
                    ? 'bg-indigo-700 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-700'
                }`}
              >
                <Car className="mr-3 h-5 w-5" />
                Vehicles
              </button>
              
              <button 
                onClick={() => navigateTo('settings')}
                className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md w-full ${
                  activeSection === 'settings' 
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
                {activeSection === 'dashboard' && 'Dashboard'}
                {activeSection === 'teachers' && 'Teachers Management'}
                {activeSection === 'vehicles' && 'Vehicles Management'}
                {activeSection === 'settings' && 'Settings'}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <span className="sr-only">View notifications</span>
                <Clock className="h-6 w-6" />
              </button>
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">Admin User</span>
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
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {stat.icon}
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {stat.title}
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {stat.value}
                            </div>
                            <div className="ml-2 flex items-baseline text-xs font-semibold text-gray-500">
                              {stat.change}
                            </div>
                          </dd>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Quick Actions</h3>
                  <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <button
                      onClick={() => {
                        setActiveSection('teachers');
                        setShowInstructorForm(true);
                        setIsEditing(false);
                      }}
                      className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                      <UserPlus className="mr-3 h-5 w-5" />
                      Add New Teacher
                    </button>
                    <button
                      onClick={() => {
                        setActiveSection('vehicles');
                        setShowVehicleForm(true);
                        setIsEditing(false);
                      }}
                      className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none"
                    >
                      <Car className="mr-3 h-5 w-5" />
                      Add New Vehicle
                    </button>
                    <button
                      className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
                    >
                      <Calendar className="mr-3 h-5 w-5" />
                      Schedule Classes
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Data */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* Teacher Availability Chart */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Teacher Availability (This Week)</h3>
                    <div className="mt-5 h-48">
                      <div className="h-full flex items-end">
                        {instructorAvailability.map((value, index) => (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div className="w-full bg-blue-700 rounded-t" style={{ height: `${value}%` }}>
                              <div 
                                className="bg-gradient-to-t from-blue-600 to-blue-700 w-full h-full rounded-t"
                                style={{ opacity: value / 100 }}
                              ></div>
                            </div>
                            <div className="text-xs font-medium text-gray-500 mt-2">{weekDays[index]}</div>
                            <div className="text-xs font-bold text-gray-700">{value}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Status */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Vehicle Status</h3>
                      <button 
                        onClick={() => navigateTo('vehicles')}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        View All
                      </button>
                    </div>
                    <div className="mt-5 max-h-64 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Service</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {vehicles.slice(0, 3).map(vehicle => (
                            <tr key={vehicle.vehicleID}>
                              <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.vehicleNO}</td>
                              <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{vehicle.vehicleType}</td>
                              <td className="px-3 py-3 whitespace-nowrap">
                                <StatusBadge status={vehicle.availability} />
                              </td>
                              <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{vehicle.lastService}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Teachers Management Section */}
          {activeSection === 'teachers' && (
            <div className="space-y-6">
              {/* Teacher List */}
              {!showInstructorForm && (
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Teachers Management</h3>
                      <button 
                        onClick={() => {
                          setShowInstructorForm(true);
                          setIsEditing(false);
                          setInstructorForm({
                            InstructorID: '',
                            InstructorName: '',
                            email: '',
                            InstructorLocation: '',
                            InstructorExperience: '',
                            password: '',
                            isInstructor: true,
                          });
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Teacher
                      </button>
                    </div>
                    
                    <div className="mt-5">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {instructors.map(instructor => (
                            <tr key={instructor.InstructorID}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                    {instructor.InstructorName.charAt(0)}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{instructor.InstructorName}</div>
                                    <div className="text-xs text-gray-500">ID: {instructor.InstructorID}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instructor.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instructor.InstructorLocation}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instructor.InstructorExperience} years</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={instructor.status} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button 
                                  onClick={() => handleEditInstructor(instructor.InstructorID)}
                                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteInstructor(instructor.InstructorID)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Instructor Form */}
              {showInstructorForm && (
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        {isEditing ? 'Edit Teacher' : 'Add New Teacher'}
                      </h3>
                      <button 
                        onClick={() => {
                          setShowInstructorForm(false);
                          setInstructorErrors({});
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <form onSubmit={handleInstructorSubmit} className="mt-5 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                      <div className="sm:col-span-1">
                        <label htmlFor="InstructorID" className="block text-sm font-medium text-gray-700">Instructor ID</label>
                        <input
                          type="text"
                          name="InstructorID"
                          id="InstructorID"
                          value={instructorForm.InstructorID}
                          onChange={handleInstructorChange}
                          disabled={isEditing}
                          className={`mt-1 block w-full border ${instructorErrors.InstructorID ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {instructorErrors.InstructorID && (
                          <p className="mt-1 text-sm text-red-600">{instructorErrors.InstructorID}</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="InstructorName" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          name="InstructorName"
                          id="InstructorName"
                          value={instructorForm.InstructorName}
                          onChange={handleInstructorChange}
                          className={`mt-1 block w-full border ${instructorErrors.InstructorName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {instructorErrors.InstructorName && (
                          <p className="mt-1 text-sm text-red-600">{instructorErrors.InstructorName}</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={instructorForm.email}
                          onChange={handleInstructorChange}
                          className={`mt-1 block w-full border ${instructorErrors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {instructorErrors.email && (
                          <p className="mt-1 text-sm text-red-600">{instructorErrors.email}</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="InstructorLocation" className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                          type="text"
                          name="InstructorLocation"
                          id="InstructorLocation"
                          value={instructorForm.InstructorLocation}
                          onChange={handleInstructorChange}
                          className={`mt-1 block w-full border ${instructorErrors.InstructorLocation ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {instructorErrors.InstructorLocation && (
                          <p className="mt-1 text-sm text-red-600">{instructorErrors.InstructorLocation}</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="InstructorExperience" className="block text-sm font-medium text-gray-700">Experience (years)</label>
                        <input
                          type="number"
                          name="InstructorExperience"
                          id="InstructorExperience"
                          value={instructorForm.InstructorExperience}
                          onChange={handleInstructorChange}
                          min="0"
                          className={`mt-1 block w-full border ${instructorErrors.InstructorExperience ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {instructorErrors.InstructorExperience && (
                          <p className="mt-1 text-sm text-red-600">{instructorErrors.InstructorExperience}</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          value={instructorForm.password}
                          onChange={handleInstructorChange}
                          className={`mt-1 block w-full border ${instructorErrors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {instructorErrors.password && (
                          <p className="mt-1 text-sm text-red-600">{instructorErrors.password}</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="isInstructor"
                            id="isInstructor"
                            checked={instructorForm.isInstructor}
                            onChange={handleInstructorChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor="isInstructor" className="ml-2 block text-sm text-gray-700">
                            Active Instructor
                          </label>
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => {
                              setShowInstructorForm(false);
                              setInstructorErrors({});
                            }}
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            {isEditing ? 'Update Teacher' : 'Add Teacher'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Vehicles Management Section */}
          {activeSection === 'vehicles' && (
            <div className="space-y-6">
              {/* Vehicle List */}
              {!showVehicleForm && (
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Vehicles Management</h3>
                      <button 
                        onClick={() => {
                          setShowVehicleForm(true);
                          setIsEditing(false);
                          setVehicleForm({
                            vehicleID: '',
                            vehicleNO: '',
                            vehicleType: '',
                            transmissionType: '',
                            fuelType: '',
                            availability: true,
                            studentCnt: 0,
                          });
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none"
                      >
                        <Car className="mr-2 h-4 w-4" />
                        Add Vehicle
                      </button>
                    </div>
                    
                    <div className="mt-5">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transmission</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {vehicles.map(vehicle => (
                            <tr key={vehicle.vehicleID}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <Car className="h-5 w-5" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{vehicle.vehicleNO}</div>
                                    <div className="text-xs text-gray-500">ID: {vehicle.vehicleID}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.vehicleType}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.transmissionType}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.fuelType}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={vehicle.availability} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.studentCnt}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button 
                                  onClick={() => handleEditVehicle(vehicle.vehicleID)}
                                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteVehicle(vehicle.vehicleID)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Vehicle Form */}
              {showVehicleForm && (
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
                      </h3>
                      <button 
                        onClick={() => {
                          setShowVehicleForm(false);
                          setVehicleErrors({});
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <form onSubmit={handleVehicleSubmit} className="mt-5 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                      <div className="sm:col-span-1">
                        <label htmlFor="vehicleID" className="block text-sm font-medium text-gray-700">Vehicle ID</label>
                        <input
                          type="text"
                          name="vehicleID"
                          id="vehicleID"
                          value={vehicleForm.vehicleID}
                          onChange={handleVehicleChange}
                          disabled={isEditing}
                          className={`mt-1 block w-full border ${vehicleErrors.vehicleID ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {vehicleErrors.vehicleID && (
                          <p className="mt-1 text-sm text-red-600">{vehicleErrors.vehicleID}</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="vehicleNO" className="block text-sm font-medium text-gray-700">Vehicle Number</label>
                        <input
                          type="text"
                          name="vehicleNO"
                          id="vehicleNO"
                          value={vehicleForm.vehicleNO}
                          onChange={handleVehicleChange}
                          className={`mt-1 block w-full border ${vehicleErrors.vehicleNO ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {vehicleErrors.vehicleNO && (
                          <p className="mt-1 text-sm text-red-600">{vehicleErrors.vehicleNO}</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                        <select
                          name="vehicleType"
                          id="vehicleType"
                          value={vehicleForm.vehicleType}
                          onChange={handleVehicleChange}
                          className={`mt-1 block w-full border ${vehicleErrors.vehicleType ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        >
                          <option value="">Select Vehicle Type</option>
                          <option value="Sedan">Sedan</option>
                          <option value="Hatchback">Hatchback</option>
                          <option value="SUV">SUV</option>
                          <option value="Truck">Truck</option>
                          <option value="Motorcycle">Motorcycle</option>
                        </select>
                        {vehicleErrors.vehicleType && (
                          <p className="mt-1 text-sm text-red-600">{vehicleErrors.vehicleType}</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="transmissionType" className="block text-sm font-medium text-gray-700">Transmission Type</label>
                        <select
                          name="transmissionType"
                          id="transmissionType"
                          value={vehicleForm.transmissionType}
                          onChange={handleVehicleChange}
                          className={`mt-1 block w-full border ${vehicleErrors.transmissionType ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        >
                          <option value="">Select Transmission Type</option>
                          <option value="Manual">Manual</option>
                          <option value="Automatic">Automatic</option>
                          <option value="Semi-Automatic">Semi-Automatic</option>
                        </select>
                        {vehicleErrors.transmissionType && (
                          <p className="mt-1 text-sm text-red-600">{vehicleErrors.transmissionType}</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700">Fuel Type</label>
                        <select
                          name="fuelType"
                          id="fuelType"
                          value={vehicleForm.fuelType}
                          onChange={handleVehicleChange}
                          className={`mt-1 block w-full border ${vehicleErrors.fuelType ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        >
                          <option value="">Select Fuel Type</option>
                          <option value="Petrol">Petrol</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Electric">Electric</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="CNG">CNG</option>
                        </select>
                        {vehicleErrors.fuelType && (
                          <p className="mt-1 text-sm text-red-600">{vehicleErrors.fuelType}</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label htmlFor="studentCnt" className="block text-sm font-medium text-gray-700">Student Count</label>
                        <input
                          type="number"
                          name="studentCnt"
                          id="studentCnt"
                          value={vehicleForm.studentCnt}
                          onChange={handleVehicleChange}
                          min="0"
                          className={`mt-1 block w-full border ${vehicleErrors.studentCnt ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        />
                        {vehicleErrors.studentCnt && (
                          <p className="mt-1 text-sm text-red-600">{vehicleErrors.studentCnt}</p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="availability"
                            id="availability"
                            checked={vehicleForm.availability}
                            onChange={handleVehicleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor="availability" className="ml-2 block text-sm text-gray-700">
                            Vehicle Available
                          </label>
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => {
                              setShowVehicleForm(false);
                              setVehicleErrors({});
                            }}
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            {isEditing ? 'Update Vehicle' : 'Add Vehicle'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">System Settings</h3>
                <div className="mt-5">
                  <p className="text-gray-500">Settings panel would go here.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;