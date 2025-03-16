import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <Formik
        initialValues={{
          username: '',
          password: '',
          email: '',
          phoneNumber: '',
          address: '',
          gender: '',
          firstName: '',
          lastName: ''
        }}
        validationSchema={Yup.object({
          username: Yup.string().required('Required'),
          password: Yup.string().required('Required'),
          email: Yup.string().email('Invalid email address').required('Required'),
          phoneNumber: Yup.string()
            .matches(/^947\d{8}$/, 'Phone number must start with 947 and be 11 characters long')
            .required('Required'),
          address: Yup.string().required('Required'),
          gender: Yup.string().required('Required'),
          firstName: Yup.string().required('Required'),
          lastName: Yup.string().required('Required')
        })}
        onSubmit={(values, { setSubmitting }) => {
          axios
            .post('http://localhost:3000/user/registerUser', values)
            .then(response => {
              console.log(response.data);
              alert('Registration done!!');
              navigate('/user/interface');
            })
            .catch(error => {
              console.error('Error registering:', error);
              alert('Error in the registration!!');
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="username" className="block font-semibold">
                Username
              </label>
              <Field type="text" name="username" className="w-full border border-gray-300 rounded px-3 py-2" />
              <ErrorMessage name="username" className="text-red-500" />
            </div>
            <div>
              <label htmlFor="password" className="block font-semibold">
                Password
              </label>
              <Field type="password" name="password" className="w-full border border-gray-300 rounded px-3 py-2" />
              <ErrorMessage name="password" className="text-red-500" />
            </div>
            <div>
              <label htmlFor="email" className="block font-semibold">
                Email
              </label>
              <Field type="email" name="email" className="w-full border border-gray-300 rounded px-3 py-2" />
              <ErrorMessage name="email" className="text-red-500" />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block font-semibold">
                Phone Number
              </label>
              <Field type="tel" name="phoneNumber" className="w-full border border-gray-300 rounded px-3 py-2" />
              <ErrorMessage name="phoneNumber" className="text-red-500" />
            </div>
            <div>
              <label htmlFor="address" className="block font-semibold">
                Address
              </label>
              <Field type="text" name="address" className="w-full border border-gray-300 rounded px-3 py-2" />
              <ErrorMessage name="address" className="text-red-500" />
            </div>
            <div>
              <label htmlFor="gender" className="block font-semibold">
                Gender
              </label>
              <Field as="select" name="gender" className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Field>
              <ErrorMessage name="gender" className="text-red-500" />
            </div>
            <div>
              <label htmlFor="firstName" className="block font-semibold">
                First Name
              </label>
              <Field type="text" name="firstName" className="w-full border border-gray-300 rounded px-3 py-2" />
              <ErrorMessage name="firstName" className="text-red-500" />
            </div>
            <div>
              <label htmlFor="lastName" className="block font-semibold">
                Last Name
              </label>
              <Field type="text" name="lastName" className="w-full border border-gray-300 rounded px-3 py-2" />
              <ErrorMessage name="lastName" className="text-red-500" />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-600 "
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterForm;