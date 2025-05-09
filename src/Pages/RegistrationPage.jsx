import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import axiosInstance from '../lib/axiosInstance';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  const navigate = useNavigate();
  
  const [registrationForm, setRegistrationForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    address: '',
    gender: '',
    password: '',
    confirmPassword: '',
    isStudent: true,
    agreeTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegistrationForm({
      ...registrationForm,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Clear API error when user makes any change
    if (apiError) {
      setApiError('');
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!registrationForm.firstName) newErrors.firstName = 'First name is required';
    if (!registrationForm.lastName) newErrors.lastName = 'Last name is required';
    
    if (!registrationForm.username) {
      newErrors.username = 'Username is required';
    } else if (registrationForm.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!registrationForm.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registrationForm.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!registrationForm.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    if (!registrationForm.address) newErrors.address = 'Address is required';
    if (!registrationForm.gender) newErrors.gender = 'Please select your gender';
    
    if (!registrationForm.password) {
      newErrors.password = 'Password is required';
    } else if (registrationForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!registrationForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (registrationForm.confirmPassword !== registrationForm.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!registrationForm.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setApiError('');
      
      try {
        // Prepare the form data to send to the backend
        const userData = {
          firstName: registrationForm.firstName,
          lastName: registrationForm.lastName,
          username: registrationForm.username,
          email: registrationForm.email,
          phoneNumber: registrationForm.phoneNumber,
          address: registrationForm.address,
          gender: registrationForm.gender,
          password: registrationForm.password,
          isStudent: registrationForm.isStudent
        };
        
        // Make API call to register endpoint
        const response = await axiosInstance.post('/auth/register', userData);
        
        // If successful, set success state
        if (response.data.success) {
          setIsSuccess(true);
          
          // Store the token from the response if needed
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
          }
          
          // After successful registration, wait 2 seconds then redirect to login
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } catch (error) {
        // Handle API errors
        console.error('Registration error:', error);
        
        if (error.response) {
          // The server responded with a status code outside the 2xx range
          const { data } = error.response;
          setApiError(data.message || 'Registration failed. Please try again.');
          
          // If error mentions existing email, set specific field error
          if (data.message && data.message.includes('email')) {
            setErrors({
              ...errors,
              email: 'This email is already registered'
            });
          }
          
          // If error mentions existing username, set specific field error
          if (data.message && data.message.includes('username')) {
            setErrors({
              ...errors,
              username: 'This username is already taken'
            });
          }
        } else if (error.request) {
          // The request was made but no response was received
          setApiError('No response from server. Please check your internet connection.');
        } else {
          // Something happened in setting up the request
          setApiError('An error occurred. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">DriveSchool</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create a new account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isSuccess ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Registration successful!</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your account has been created. Redirecting to login...
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* API Error Message */}
              {apiError && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Registration Error</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{apiError}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={registrationForm.firstName}
                      onChange={handleChange}
                      className={`block w-full border ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={registrationForm.lastName}
                      onChange={handleChange}
                      className={`block w-full border ${
                        errors.lastName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={registrationForm.username}
                    onChange={handleChange}
                    className={`block w-full pl-10 border ${
                      errors.username ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                </div>
                {errors.username && (
                  <p className="mt-2 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={registrationForm.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    value={registrationForm.phoneNumber}
                    onChange={handleChange}
                    className={`block w-full pl-10 border ${
                      errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    autoComplete="street-address"
                    value={registrationForm.address}
                    onChange={handleChange}
                    className={`block w-full pl-10 border ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                </div>
                {errors.address && (
                  <p className="mt-2 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={registrationForm.gender}
                  onChange={handleChange}
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                    errors.gender ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="mt-2 text-sm text-red-600">{errors.gender}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={registrationForm.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={registrationForm.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 border ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <div>
                <div className="flex items-center">
                  <input
                    id="isStudent"
                    name="isStudent"
                    type="checkbox"
                    checked={registrationForm.isStudent}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isStudent" className="ml-2 block text-sm text-gray-900">
                    Register as a student
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">Uncheck if you're registering as an instructor</p>
              </div>

              <div className="flex items-center">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={registrationForm.agreeTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-900">
                  I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="mt-2 text-sm text-red-600">{errors.agreeTerms}</p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    'Register'
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="/login"
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
//updated