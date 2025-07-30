import { useState, useEffect } from 'react';
import ProductListTemplate from './ProductListTemplate.tsx';
import Layout from './Layout.tsx';

const API_BASE_URL = 'http://localhost:8000/users/'

interface DashboardProps {
  userId?: number | null;
}

export default function Dashboard({ userId: propUserId }: DashboardProps) {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    if (propUserId !== undefined) {
      setUserId(propUserId);
      return;
    }

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
  }, [propUserId]);

  return (
    <Layout>
          <ProductListTemplate userId={userId ?? undefined} />
    </Layout>
  );
}
