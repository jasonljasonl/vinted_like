import { useState, useEffect } from 'react';
import ProductListTemplate from './ProductListTemplate.tsx'
import Menu from './Menu.tsx'
import SearchBar from './SearchBar.tsx'
import LoginForm from './LoginForm.tsx'

const API_BASE_URL = 'http://localhost:8000/users/'


export default function Dashboard() {
    const [userId, setUserId] = useState<number | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${API_BASE_URL}me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log('Connected user:', data);
        setUserId(data.id);
      })
      .catch(err => console.error(err));
  }, []);

    return(
      <div className='flex h-screen'>

        <button
        className="md:hidden absolute top-4 left-4 z-50 bg-white p-2 rounded shadow"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
            ☰
        </button>

        <aside className={`fixed md:static z-40 h-full w-64 bg-white border-r-2 transform transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <Menu />
        </aside>


        <main className="flex-1 overflow-y-auto">
                <div className='w-full px-8 p-8 border-b-2'>
                    <SearchBar />
                </div>
                <div className='pt-8'>
                    {userId && <ProductListTemplate userId={userId} />}

                </div>
        </main>
      </div>
    );


}