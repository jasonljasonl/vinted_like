import React, { useState } from 'react';
import Button from './Button.tsx'

const API_BASE_URL = 'http://localhost:8000/products/'

interface ProductCreationFormData {
  name: string;
  created_by: string;
  description: string;
  price: number;
  product_images: File[];
}

const ProductCreationForm: React.FC = () => {
    const storedUsername = localStorage.getItem('username') || '';

    const [formData, setFormData] = useState<ProductCreationFormData>({
        name: '',
        created_by: storedUsername,
        description: '',
        price: 0,
        product_images: [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === 'product_images' && files) {
      setFormData({ ...formData, product_images: Array.from(files) });
    } else if (name === 'price') {
      setFormData({ ...formData, price: parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data:', formData);

        const token = localStorage.getItem('token');
        if (!token) {
          console.error('User is not authenticated');
          return;
        }

        const data = new FormData();
        data.append('name', formData.name)
        data.append('created_by', formData.created_by)
        data.append('description', formData.description)
        data.append('price', formData.price.toString())
        formData.product_images.forEach((file) => {
          data.append('product_images', file);
        });

        try {
            const response = await fetch(`${API_BASE_URL}add`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
              body: data,
            });
            if (response.ok)
             {
                const result = await response.json();
                console.log('Product successfully created', result);
            } else {
                const error = await response.json();
                console.error('Error:', error);
            }
        } catch (err) {
            console.error('error:', err);
        };

    };


return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-900">
            Name
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
            Price
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

        <div>
          <label htmlFor="product_images" className="block text-sm font-medium text-gray-900">
            Product Image
          </label>
          <input
            id="product_images"
            name="product_images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="block w-full"
          />
          {formData.product_images.length > 0 && (
              <ul className="text-sm text-gray-600 mt-2">
                {formData.product_images.map((file, index) => (
                  <li key={index}>📁 {file.name}</li>
                ))}
              </ul>
          )}

        </div>

        <div className="mt-8">
          <Button label="Create Product" variant="primary" size="lg" type="submit" />
        </div>

      </form>
    </div>
  );

}
export default ProductCreationForm;
