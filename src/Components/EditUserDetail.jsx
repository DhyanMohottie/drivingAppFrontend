import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import instance from '../api';
import { useNavigate } from 'react-router-dom';
import UserSideBar from './UserSideBar';

function EditUserDetail() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Fetch user data from the server using the user ID stored in local storage
    // const userId = localStorage.getItem('userId');
        // "userID": "ST250193",
    const userId = userData.userID;

    fetchUserData(userId);
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await instance(`/user/profile/${userId}`); // Adjust the API endpoint accordingly
      const userData = await response.data;
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await instance.delete(`/user/profile/${user.userID}`);
      // if (response.ok) {
      //   console.log('Account deleted');
      // } else {
      //   console.error('Failed to delete account');
      // }
      alert('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account');
    }
  };

  const initialValues = {
    firstName: user ? user.firstName : '',
    lastName: user ? user.lastName : '',
    username: user ? user.username : '',
    email: user ? user.email : '',
    phoneNumber: user ? user.phoneNumber : '',
    address: user ? user.address : '',
    gender: user ? user.gender : '',
    isStudent: user ? user.isStudent : true,
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    gender: Yup.string().required('Gender is required'),
    isStudent: Yup.boolean(),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await instance.put(`/user/profile/${user.userID}`, values);
      if (response.status === 200) {
        console.log('User details updated:', values);
        alert('User details updated successfully');
        navigate('/user/interface')
      } else {
        console.error('Failed to update user details');
        alert('Failed to update user details');
      }
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };
  

  return (
    <div className='flex flex-row '>
    <UserSideBar/>
    <div className="edit-user-detail p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">Edit User Details</h1>
      {user && (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <label className="block mb-2">
                First Name:
                <Field type="text" name="firstName" className="block w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500" />
                <ErrorMessage name="firstName" component="div" className="text-red-500" />
              </label>
  
              <label className="block mb-2">
                Last Name:
                <Field type="text" name="lastName" className="block w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500" />
                <ErrorMessage name="lastName" component="div" className="text-red-500" />
              </label>
  
              <label className="block mb-2">
                Username:
                <Field type="text" name="username" className="block w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500" />
                <ErrorMessage name="username" component="div" className="text-red-500" />
              </label>
  
              <label className="block mb-2">
                Email:
                <Field type="email" name="email" className="block w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500" />
                <ErrorMessage name="email" component="div" className="text-red-500" />
              </label>
  
              <label className="block mb-2">
                Phone Number:
                <Field type="text" name="phoneNumber" className="block w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500" />
                <ErrorMessage name="phoneNumber" component="div" className="text-red-500" />
              </label>
  
              <label className="block mb-2">
                Address:
                <Field type="text" name="address" className="block w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500" />
                <ErrorMessage name="address" component="div" className="text-red-500" />
              </label>
  
              <label className="block mb-2">
                Gender:
                <Field as="select" name="gender" className="block w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="other">Other</option>
                </Field>
                <ErrorMessage name="gender" component="div" className="text-red-500" />
              </label>
  
              <label className="block mb-3">
                Are you a student?
                <Field type="checkbox" name="isStudent" className="ml-2" />
              </label>
  
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 " disabled={isSubmitting}>
                Save Details
              </button>
            </Form>
          )}
        </Formik>
      )}
      <button onClick={handleDeleteAccount} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
        Delete My Account
      </button>
    </div>
    </div>
  );
  
}

export default EditUserDetail;
