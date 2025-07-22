import { useState, useEffect } from 'react';
import Button from './Button.jsx';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000/';

export interface ProductImage {
  id: number;
  url: string;
}

export interface Product {
  id: number;
  name: string;
  created_by: number;
  price: number;
  product_images: ProductImage[];
}

interface ProductCardProps {
  product: Product;
  userId?: number | null;
}

export default function ProductCardTemplate({ product, userId: propUserId }: ProductCardProps) {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    if (propUserId !== undefined) {
      setUserId(propUserId);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setUserId(null);
      return;
    }

    fetch(`${API_BASE_URL}users/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setUserId(data.id);
      })
      .catch(() => {
        setUserId(null);
      });
  }, [propUserId]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}products/${product.id}/add_to_cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Product added to cart");
      } else {
        alert("Error: " + (result.detail || "Impossible to add."));
      }
    } catch {
      alert("Impossible to add.");
    }
  };

  const hasImages = product.product_images && product.product_images.length > 0;
  const imageUrl = hasImages
    ? API_BASE_URL + product.product_images[0].url.replace(/^backend\//, '')
    : "https://placehold.co/400";

  const isOwner = userId !== null && userId === product.created_by;

  return (
    <div className="group">
        <Link to={`/products/${product.id}`}>
          <img
            src={imageUrl}
            alt={product.name}
            className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75"
          />
          <h2 className="mt-4 text-sm text-gray-700">{product.name}</h2>
          <p className="mt-1 text-lg font-medium text-gray-900">{product.price} €</p>
        </Link>
          <div className="mt-2 flex gap-2">
            <Button label="Add to cart" variant="primary" size="lg" onClick={handleAddToCart} />

            {isOwner && (
              <Link to={`/products/${product.id}/update`}>
                <Button label="⚙️" variant="secondary" size="md" />
              </Link>
            )}
          </div>
    </div>
  );
}
