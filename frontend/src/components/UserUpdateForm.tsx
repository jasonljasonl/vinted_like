import { useEffect, useState } from 'react';
import Button from './Button.tsx'

const API_BASE_URL = 'http://localhost:8000';

export default function UserUpdateForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    lastname: '',
    new_password: '',
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${API_BASE_URL}/users/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setFormData({
          username: data.username,
          email: data.email,
          name: data.name,
          lastname: data.lastname,
          new_password: '',
        });
      })
      .catch(err => {
        console.error(err);
        setMessage("Failed to load user data.");
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage("You must be logged in.");
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) form.append(key, value);
    });

    if (profilePicture) {
      form.append('profilePicture', profilePicture);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/me/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!response.ok) {
        throw new Error("Update failed.");
      }

      const result = await response.json();
      setMessage("Profile updated successfully!");
      console.log(result);
    } catch (err) {
      console.error(err);
      setMessage("Error while updating profile.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 m-4">

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="lock w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:outline-none sm:text-sm"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="lock w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:outline-none sm:text-sm"
      />

      <input
        type="text"
        name="name"
        placeholder="First name"
        value={formData.name}
        onChange={handleChange}
        className="lock w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:outline-none sm:text-sm"
      />

      <input
        type="text"
        name="lastname"
        placeholder="Last name"
        value={formData.lastname}
        onChange={handleChange}
        className="lock w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:outline-none sm:text-sm"
      />

      <input
        type="password"
        name="new_password"
        placeholder="New password"
        value={formData.new_password}
        onChange={handleChange}
        className="lock w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:outline-none sm:text-sm"
      />

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
                  <input id="profilePicture" name="profilePicture" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>



        <div className='mt-8'>
        <Button label='Save' variant='primary' size='lg' type='submit' />
        </div>

      {message && <p className="text-sm text-center mt-2 text-gray-700">{message}</p>}
    </form>
  );
}
