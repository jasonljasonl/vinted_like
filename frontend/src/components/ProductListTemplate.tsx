import { useEffect, useState } from "react";
import ProductCardTemplate from "./ProductCardTemplate";
import type {Product} from "./ProductCardTemplate";

const API_BASE_URL = 'http://localhost:8000/products/'

export default function ProductListTemplate() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}`)
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((err) => console.error('API Error:', err));
    }, []);

    return (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xl:gap-x-8 px-8">
          {products.map((product) => (
            <ProductCardTemplate key={product.id} product={product} />
          ))}
        </div>
    );
}