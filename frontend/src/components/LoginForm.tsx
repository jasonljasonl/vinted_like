import React, { useState } from 'react';
import Button from './Button.tsx';

const API_BASE_URL = 'http://localhost:8000/users/';

interface LoginFormData {
  username: string;
  hashed_password: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    hashed_password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const urlEncodedData = new URLSearchParams();
    urlEncodedData.append('username', formData.username);
    urlEncodedData.append('password', formData.hashed_password);

    try {
      const response = await fetch(`${API_BASE_URL}token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData.toString(),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Login error:', error);
        alert('Login failed');
        return;
      }

      const result = await response.json();
      console.log('User logged in:', result);
      const token = result.access_token;
      localStorage.setItem('token', token);

      const userResponse = await fetch(`${API_BASE_URL}me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        console.error('Failed to fetch user data');
        alert("Failed to fetch user info");
        return;
      }

      const userData = await userResponse.json();
      console.log('User data:', userData);
      localStorage.setItem('user_id', userData.id.toString());


      alert('Login successful!');
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred during login');
    }
  };

  return (
    <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label htmlFor='username' className='block text-sm/6 font-medium text-gray-900'>
            Username
          </label>
          <div className='mt-2'>
            <input
              id='username'
              name='username'
              value={formData.username}
              onChange={handleChange}
              className='block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:outline-none sm:text-sm'
            />
          </div>
        </div>

        <div>
          <div className='flex items-center justify-between'>
            <label htmlFor='hashed_password' className='block text-sm/6 font-medium text-gray-900'>
              Password
            </label>
          </div>

          <div className='mt-2'>
            <input
              id='hashed_password'
              name='hashed_password'
              type='password'
              required
              autoComplete='current-password'
              className='block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:outline-none sm:text-sm'
              value={formData.hashed_password}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className='mt-8'>
          <Button label='Login' variant='primary' size='lg' type='submit' />
        </div>
      </form>
        <p className="mt-2 text-center text-sm/6 text-gray-500">
        Not registered?{' '}
            <a href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Register
            </a>
        </p>
    </div>
  );
};

export default LoginForm;
