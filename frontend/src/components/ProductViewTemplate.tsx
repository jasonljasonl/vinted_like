import Button from './Button.jsx';
import { useEffect, useState } from 'react';



const API_BASE_URL = 'http://localhost:8000/';

interface User {
    id: number;
    username: string;
    name: string;
    lastname: string;
    profile_picture: string;
}

export interface ProductImage {
  id: number;
  url: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  created_by: number;
  product_images: ProductImage[];
}

interface ProductViewTemplateProps {
  productId: number;
}

export default function ProductViewTemplate({ productId }: ProductViewTemplateProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [creator, setCreator] = useState<User | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}products/${productId}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);


  useEffect(() => {
    const fetchCreator = async () => {
        if (product?.created_by) {
            try {
                const res = await fetch(`${API_BASE_URL}users/id/${product.created_by}`);
                const data = await res.json();
                setCreator(data);
            } catch (err) {
                console.error('Failed to fetch creator:', err);
            }
        }
    };
    fetchCreator();
  }, [product?.created_by]);


    const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}products/${productId}/add_to_cart`,
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


  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;




  return (
        <div className="p-8 flex flex-col lg:flex-row">
            <div className="basis-2/4 lg:pr-2">


                <div className="grid grid-cols-2">
                  {product.product_images.map((image) => (
                    <img
                      key={image.id}
                      src={API_BASE_URL + image.url.replace(/^backend\//, '')}
                      alt={product.name}
                      className="rounded object-cover w-full aspect-square w-70 h-70"
                    />
                  ))}
                </div>

            </div>
            <div className="basis-2/4 lg:pl-2">
                <h1 className="text-xl font-semibold m-2">{product.name}</h1>
                <p className="text-lg font-medium m-2">${product.price}</p>
                <p className="text-gray-600 m-2 mb-4">{product.description}</p>
                <Button label="Add to cart" variant="primary" size="lg" onClick={handleAddToCart} />
                <div className="mt-4 border-b-2">

                </div>
                {creator && (
                    <a href={`/users/id/${creator.id}`}>
                      <div className="mt-4 flex items-center gap-2">
                        {creator?.profile_picture && (
                          <img
                            src={API_BASE_URL + creator.profile_picture.replace(/^backend\//, '')}
                            alt={creator.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div className='flex-col'>
                            <p className="font-semibold"> {creator?.name || 'Unknown user'} {creator?.lastname || 'Unknown user'}</p>
                            <p> {creator?.username || 'Unknown user'}</p>
                        </div>
                      </div>
                  </a>
                )}
                </div>
            </div>
  );
}
