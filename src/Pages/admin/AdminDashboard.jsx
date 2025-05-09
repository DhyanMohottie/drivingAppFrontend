import React, { useState, useEffect } from 'react';
import { Car, BarChart3, Plus, Edit, Trash2, Download, X, Check, AlertTriangle, ArrowLeft } from 'lucide-react';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useVehicles } from '../../hooks/useVehicles';

const AdminManagement = () => {
  // Use the custom hook for vehicle data operations
  const { 
    vehicles, 
    loading, 
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    fetchVehicles
  } = useVehicles();

  // Local state
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVehicleId, setCurrentVehicleId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  
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
  
  // Form validation errors
  const [errors, setErrors] = useState({});

  // Alert function
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Form change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVehicleForm({
      ...vehicleForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Form validation
  const validateForm = () => {
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
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        if (isEditing) {
          // Update existing vehicle
          await updateVehicle(currentVehicleId, vehicleForm);
          showAlert('Vehicle updated successfully');
        } else {
          // Add new vehicle
          await createVehicle(vehicleForm);
          showAlert('Vehicle added successfully');
        }
        
        // Reset form and state
        resetForm();
      } catch (error) {
        showAlert(`Error: ${error.message}`, 'error');
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setVehicleForm({
      vehicleID: '',
      vehicleNO: '',
      vehicleType: '',
      transmissionType: '',
      fuelType: '',
      availability: true,
      studentCnt: 0,
    });
    setShowForm(false);
    setIsEditing(false);
    setCurrentVehicleId(null);
    setErrors({});
  };
  
  // Edit vehicle handler
  const handleEdit = (vehicleID) => {
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
      setShowForm(true);
    }
  };
  
  // Delete vehicle handler
  const handleDelete = async (vehicleID) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle(vehicleID);
        showAlert('Vehicle deleted successfully');
      } catch (error) {
        showAlert(`Error: ${error.message}`, 'error');
      }
    }
  };

  // Generate PDF Report
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Vehicles Report', 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // Create the table
    const tableColumn = ["ID", "Vehicle No", "Type", "Transmission", "Fuel", "Status", "Students"];
    const tableRows = [];
    
    // Add data
    vehicles.forEach(vehicle => {
      const vehicleData = [
        vehicle.vehicleID,
        vehicle.vehicleNO,
        vehicle.vehicleType,
        vehicle.transmissionType,
        vehicle.fuelType,
        vehicle.availability ? 'Available' : 'Unavailable',
        vehicle.studentCnt,
      ];
      tableRows.push(vehicleData);
    });
    
    // Generate the table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 66, 160] },
    });
    
    // Save the PDF
    doc.save('vehicles-report.pdf');
    showAlert('PDF generated successfully');
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    let badgeClass = "px-2 py-1 rounded text-xs font-medium";
    
    if (typeof status === 'boolean') {
      if (status) {
        badgeClass += " bg-green-100 text-green-800";
        return <span className={badgeClass}>Available</span>;
      } else {
        badgeClass += " bg-red-100 text-red-800";
        return <span className={badgeClass}>Unavailable</span>;
      }
    }
    
    return <span className={badgeClass}>{status}</span>;
  };

  // Refresh data
  const refreshData = () => {
    fetchVehicles();
    showAlert('Data refreshed');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="spinner-border text-indigo-600 h-12 w-12" role="status">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-2 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Alert Notification */}
      {alert.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          alert.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          <div className="flex items-center">
            {alert.type === 'error' ? 
              <AlertTriangle className="h-5 w-5 mr-2" /> : 
              <Check className="h-5 w-5 mr-2" />
            }
            <p>{alert.message}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard with Vehicle Management</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setShowForm(true);
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
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </button>
            <button
              onClick={generatePDF}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
            >
              <Download className="mr-2 h-4 w-4" />
              Generate PDF
            </button>
            <button
              onClick={refreshData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Vehicle Form */}
        {showForm && (
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h3>
                <button 
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-1">
                  <label htmlFor="vehicleID" className="block text-sm font-medium text-gray-700">Vehicle ID</label>
                  <input
                    type="text"
                    name="vehicleID"
                    id="vehicleID"
                    value={vehicleForm.vehicleID}
                    onChange={handleChange}
                    disabled={isEditing}
                    className={`mt-1 block w-full border ${errors.vehicleID ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {errors.vehicleID && (
                    <p className="mt-1 text-sm text-red-600">{errors.vehicleID}</p>
                  )}
                </div>
                
                <div className="sm:col-span-1">
                  <label htmlFor="vehicleNO" className="block text-sm font-medium text-gray-700">Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNO"
                    id="vehicleNO"
                    value={vehicleForm.vehicleNO}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.vehicleNO ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {errors.vehicleNO && (
                    <p className="mt-1 text-sm text-red-600">{errors.vehicleNO}</p>
                  )}
                </div>
                
                <div className="sm:col-span-1">
                  <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                  <select
                    name="vehicleType"
                    id="vehicleType"
                    value={vehicleForm.vehicleType}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.vehicleType ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="SUV">SUV</option>
                    <option value="Truck">Truck</option>
                    <option value="Motorcycle">Motorcycle</option>
                  </select>
                  {errors.vehicleType && (
                    <p className="mt-1 text-sm text-red-600">{errors.vehicleType}</p>
                  )}
                </div>
                
                <div className="sm:col-span-1">
                  <label htmlFor="transmissionType" className="block text-sm font-medium text-gray-700">Transmission Type</label>
                  <select
                    name="transmissionType"
                    id="transmissionType"
                    value={vehicleForm.transmissionType}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.transmissionType ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  >
                    <option value="">Select Transmission Type</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Semi-Automatic">Semi-Automatic</option>
                  </select>
                  {errors.transmissionType && (
                    <p className="mt-1 text-sm text-red-600">{errors.transmissionType}</p>
                  )}
                </div>
                
                <div className="sm:col-span-1">
                  <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700">Fuel Type</label>
                  <select
                    name="fuelType"
                    id="fuelType"
                    value={vehicleForm.fuelType}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.fuelType ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                  </select>
                  {errors.fuelType && (
                    <p className="mt-1 text-sm text-red-600">{errors.fuelType}</p>
                  )}
                </div>
                
                <div className="sm:col-span-1">
                  <label htmlFor="studentCnt" className="block text-sm font-medium text-gray-700">Student Count</label>
                  <input
                    type="number"
                    name="studentCnt"
                    id="studentCnt"
                    value={vehicleForm.studentCnt}
                    onChange={handleChange}
                    min="0"
                    className={`mt-1 block w-full border ${errors.studentCnt ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {errors.studentCnt && (
                    <p className="mt-1 text-sm text-red-600">{errors.studentCnt}</p>
                  )}
                </div>
                
                <div className="sm:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="availability"
                      id="availability"
                      checked={vehicleForm.availability}
                      onChange={handleChange}
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
                      onClick={resetForm}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                      {isEditing ? 'Update Vehicle' : 'Add Vehicle'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Car className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Vehicles
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {vehicles.length}
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
                  <Car className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Available Vehicles
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {vehicles.filter(v => v.availability).length}
                    </div>
                    <div className="ml-2 flex items-baseline text-xs font-semibold text-gray-500">
                      {vehicles.filter(v => !v.availability).length} unavailable
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
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Students
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {vehicles.reduce((total, v) => total + Number(v.studentCnt), 0)}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicles Table */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">All Vehicles</h3>
            
            {vehicles.length > 0 ? (
              <div className="overflow-x-auto">
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
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
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
                            onClick={() => handleEdit(vehicle.vehicleID)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(vehicle.vehicleID)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <Car className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new vehicle.</p>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setIsEditing(false);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    New Vehicle
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;