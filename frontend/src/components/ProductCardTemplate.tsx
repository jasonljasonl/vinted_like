import Button from './Button.jsx';

const API_BASE_URL = 'http://localhost:8000/'

export interface ProductImage {
  id: number;
  url: string;
}

export interface Product {
    id: number;
    name: string;
    created_by: string;
    price: number;
    product_images: ProductImage[];
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCardTemplate({ product }: ProductCardProps) {

  const handleAddToCart = async () => {

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('User is not authenticated');
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
      console.log("Added to cart:", result);
      alert("Product Added to cart");
    } else {
      console.error("Error:", result);
      alert("Error: " + (result.detail || "Impossible to add."));
    }

    } catch (error) {
      console.error(error);
      alert("Impossible to add.");
    }
  };

    const hasImages = product.product_images && product.product_images.length > 0;
    const imageUrl = hasImages ? API_BASE_URL + product.product_images[0].url.replace(/^backend\//, '') : "https://placehold.co/400";

    return(
        <div className="group">
          <img
            src={imageUrl}
            alt={product.name}
            className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 "
          />
          <h2 className="mt-4 text-sm text-gray-700">{product.name}</h2>
          <p className="mt-1 text-lg font-medium text-gray-900">{product.price} €</p>

          <div className='mt-2'>
            <Button label='Add to cart' variant='primary' size='lg' onClick={handleAddToCart} />
          </div>

        </div>
    )
}