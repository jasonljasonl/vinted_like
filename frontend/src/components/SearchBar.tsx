import { useEffect, useState } from 'react';
import Button from './Button.jsx';

const API_BASE_URL = 'http://localhost:8000/';

interface Product {
  id: number;
  name: string;
}

interface User {
  id: number;
  username: string;
  profile_picture?: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setUsers([]);
      setShowResults(false);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchResults = async () => {
    try {
      const [productRes, userRes] = await Promise.all([
        fetch(`${API_BASE_URL}products/search/?query=${query}`),
        fetch(`${API_BASE_URL}users/search/?query=${query}`)
      ]);

      const [productData, userData] = await Promise.all([
        productRes.json(),
        userRes.json()
      ]);

      setProducts(productData);
      setUsers(userData);
      setShowResults(true);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  return (
    <div className="w-full px-8 p-8 border-b-2 relative">
      <div className="flex">
        <input
          type="text"
          placeholder="🔍 Search a product or user..."
          className="mx-2 p-1 grow border-2 rounded-md"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="mx-2">
          <Button label="+ Add product" variant="primary" size="lg" to="/add-product" />
        </div>
        <div className="mx-2">
          <Button label="Delete" variant="danger" size="lg" to="/add-product" />
        </div>
      </div>

      {showResults && (products.length > 0 || users.length > 0) && (
        <div className="absolute top-full left-8 mt-2 bg-white border shadow-md rounded-md w-[calc(100%-4rem)] max-h-64 overflow-y-auto z-10 p-4">
          {products.length > 0 && (
            <>
              <p className="font-bold mb-1">Products</p>
              <ul className="mb-3">
                {products.map((product) => (
                  <li key={product.id} className="hover:bg-gray-100 p-1 cursor-pointer">
                    <a href={`/products/${product.id}`}>{product.name}</a>
                  </li>
                ))}
              </ul>
            </>
          )}

          {users.length > 0 && (
            <>
              <p className="font-bold mb-1">Users</p>
              <ul>
                {users.map((user) => (
                  <li key={user.id} className="hover:bg-gray-100 p-1 cursor-pointer flex items-center gap-2">
                    {user.profile_picture && (
                      <img
                        src={API_BASE_URL + user.profile_picture.replace(/^backend\//, '')}
                        alt="pp"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    )}
                    <a href={`/users/id/${user.id}`}>{user.username}</a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
