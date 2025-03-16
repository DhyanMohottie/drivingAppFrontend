import React, { useState, } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
      } else {
        setLoading(false);
        setError(null);
        navigate('/sign-in');
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        <input type="text" placeholder='Username' className='border p-3 rounded-lg' id='username' onChange={handleChange} required/>
        
        <select className='border p-3 rounded-lg' id='gender' onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' onChange={handleChange} required/>

        <input type="text" placeholder='Phone Number' className='border p-3 rounded-lg' id='phoneNumber' onChange={handleChange} required/>

        <input type="email" placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={handleChange} required/>

        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handleChange} required/>

        {error && <p className='text-red-500 mt-5'>{error}</p>}

        <button disabled={loading} className='bg-blue-200 text-black p-3 rounded-lg uppercase hover:opacity-80'>{loading ? 'Loading...' : 'Sign Up'}</button>
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/sign-in'>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
    </div>
  );
}
