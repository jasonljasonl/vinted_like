import React, { useState } from 'react';
import Button from './Button.tsx'

const API_BASE_URL = 'http://localhost:8000/users/'

interface SignUpFormData {
  name: string;
  lastname: string;
  username: string;
  email: string;
  hashed_password: string;
  profilePicture: File | null;
}

const SignUpForm: React.FC = () => {
    const [formData, setFormData] = useState<SignUpFormData>({
        name: '',
        lastname: '',
        username: '',
        email: '',
        hashed_password: '' ,
        profilePicture: null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;


        if (name === 'profilePicture' && files) {
            setFormData({...formData, profilePicture: files[0]});
        } else {
            setFormData({...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data:', formData);

        const data = new FormData();
        data.append('name', formData.name)
        data.append('lastname', formData.lastname)
        data.append('username', formData.username)
        data.append('email', formData.email);
        data.append('hashed_password', formData.hashed_password);
        if (formData.profilePicture) {
            data.append('profilePicture', formData.profilePicture);
        }

        try {
        const response = await fetch(`${API_BASE_URL}register`, {
            method: 'POST',
            body: data,
        });

        if (response.ok) {
            const result = await response.json();
            console.log('User successfully registered', result);
        } else {
            const error = await response.json();
            console.error('Error:', error);
        }
    } catch (err) {
        console.error('error:', err);
    };

};


    return (
        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
            <form onSubmit={handleSubmit} className='space-y-6'>

                <div>
                    <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                        Name
                    </label>
                    <div className='mt-2'>
                        <input id='name' name='name' value={formData.name} onChange={handleChange} className="block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:outline-none sm:text-sm"/>
                    </div>
                </div>

                <div>
                    <label htmlFor="lastname" className="block text-sm/6 font-medium text-gray-900">
                        Lastname
                    </label>
                    <div className='mt-2'>
                        <input id='lastname' name='lastname' value={formData.lastname} onChange={handleChange} className="block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:outline-none sm:text-sm"/>
                    </div>
                </div>


                <div>
                    <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                        Username
                    </label>
                    <div className='mt-2'>
                        <input id='username' name='username' value={formData.username} onChange={handleChange} className="block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:outline-none sm:text-sm"/>
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                        Email address
                    </label>
                    <div className='mt-2'>
                        <input id='email' name='email' type='email' required autoComplete='email' value={formData.email} onChange={handleChange} className="block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:outline-none sm:text-sm"/>
                    </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="hashed_password" className="block text-sm/6 font-medium text-gray-900">
                      Password
                    </label>
                  </div>

                  <div className="mt-2">
                    <input
                      id="hashed_password"
                      name="hashed_password"
                      type="password"
                      required
                      autoComplete="current-password"
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:outline-none sm:text-sm"
                      value={formData.hashed_password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-gray-900">Profile picture</label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <svg className="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                        <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" />
                      </svg>
                      <div className="mt-4 flex text-sm/6 text-gray-600">
                        <label htmlFor="profilePicture" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500">
                          <span>Upload a file</span>
                          <input id="profilePicture" name="profilePicture" type="file" className="sr-only" onChange={handleChange} accept="image/*" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div className='mt-8'>
                    <Button label='Sign up' variant='primary' size='lg' type='submit' />
                </div>
            </form>

            <p className="mt-2 text-center text-sm/6 text-gray-500">
                Already registered?{' '}
                <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Sign in
            </a>
          </p>

        </div>

    )
}
export default SignUpForm;
