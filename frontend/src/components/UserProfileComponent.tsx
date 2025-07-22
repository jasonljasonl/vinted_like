import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductListTemplate from './ProductListTemplate.tsx'
import Menu from './Menu.tsx'
import SearchBar from './SearchBar.tsx'
import LoginForm from './LoginForm.tsx'

const API_BASE_URL = 'http://localhost:8000/'

interface UserProfile {
  id: number;
  username: string;
  name: string;
  lastname: string;
  profile_picture?: string;
}

export default function UserProfileComponent() {
  const { userId } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}users/id/${userId}/`);
            const data = await res.json();
            setUser(data);
        } catch (err) {
            console.error('Error fetching product', err);
        }
    };
    fetchProfile();
  }, [userId]);

  return (
    <div className='flex h-screen'>

        <Menu />

      <main className="flex-1 overflow-y-auto">
          <SearchBar />
        <div>

        {user && (
            <div className="m-8 className flex items-center gap-4">
              {user.profile_picture && (
                <img
                  src={API_BASE_URL + user.profile_picture.replace(/^backend\//, '')}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border object-cover "
                />
              )}
                <div className='flex-col'>
                  <h2 className="text-xl font-semibold">{user.name} {user.lastname}</h2>
                  <h2>{user.username}</h2>
                </div>
            </div>
          )}


          <ProductListTemplate userId={userId ? parseInt(userId) : undefined} />

          <LoginForm />
        </div>
      </main>
    </div>
  );
}
