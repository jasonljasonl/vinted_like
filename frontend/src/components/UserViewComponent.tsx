import { useEffect, useState } from 'react';
import MenuLink from './MenuLink.tsx';


const API_BASE_URL = 'http://localhost:8000/';

export interface UserProfilePicture {
    id: number;
    url: string;
}

export interface User {
    id: number;
    name: string;
    lastname: string;
    username: string;
    profile_picture: string;
}

export default function UserViewComponent() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('User not authenticated');
            return
        }

        fetch(`${API_BASE_URL}users/me/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            if(!res.ok) {
                throw new Error('Failed to fetch user');
            }
            return res.json();
        })
        .then((data) => {
            console.log('API user data:', data);
            setUser(data);
        })
        .catch((err) => console.error(err));
    }, []);

    if (!user) {
        return <MenuLink icon="material-symbols:account-circle-outline" label="Sign in" to="/login" />;
    }


    return(
        <div className='flex items-center gap-x-6'>
            <img
                alt={user.name}
                src={`${API_BASE_URL}${user.profile_picture.replace(/^backend\//, '')}`}
                className='size-14 rounded-full outline-1 -outline-offset-1 outline-black/5 object-cover'
            />
            <div>
                <h3 className="font-bold text-darkgrey-900 text-sm">{user.name} {user.lastname}</h3>
                <p className="text-darkgrey-600 text-xs">{user.username}</p>
            </div>
        </div>

    );
}