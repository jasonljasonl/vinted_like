import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from './Button.tsx';

const API_BASE_URL = 'http://localhost:8000/products/';

interface ProductUpdateFormData {
  name: string;
  description: string;
  price: number;
}

const ProductUpdateForm: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductUpdateFormData>({
    name: '',
    description: '',
    price: 0,
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}${productId}`);
        const data = await res.json();
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
        });
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setFormData({ ...formData, price: parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      console.error('Token is missing');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}${productId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const result = await res.json();
        console.log('Product successfully updated:', result);
        navigate('/');
      } else {
        const error = await res.json();
        console.error('API error:', error);
      }
    } catch (err) {
      console.error('Network error:', err);
    }
  };


const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();

  if (!token) {
    console.error('Token is missing');
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${productId}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const result = await res.json();
      console.log('Product successfully deleted:', result);
      navigate('/');
    } else {
      const error = await res.json();
      console.error('API error:', error);
    }
  } catch (err) {
    console.error('Network error:', err);
  }
};



  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-900">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 px-3 py-1.5"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-900">
            Description
          </label>
          <input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 px-3 py-1.5"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-900">
            Price (€)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 px-3 py-1.5"
          />
        </div>

        <div className="mt-8">
          <Button label="Update Product" variant="primary" size="lg" type="submit" />
          <Button label="Delete Product" variant="danger" size="lg" onClick={handleDelete} />
        </div>
      </form>
    </div>
  );
};

export default ProductUpdateForm;
