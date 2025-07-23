import { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:8000/';


export interface ProductImage {
  id: number;
  url: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;
    product_images: ProductImage[];
}

export interface ShoppingCartItem {
    id: number;
    product: Product;
}

export interface ShoppingCart {
    id: number;
    owner: number;
    items: ShoppingCartItem[];
    total_amount: number;
}

export interface UserOrder {
    id: string;
    buyer: number;
    shopping_cart_id: number;
    created_at: string;
    related_shopping_cart: ShoppingCart;
    items: ShoppingCartItem[];
}

export interface User {
    id: number;
    name: string;
    lastname: string;
    username: string;
    profile_picture: string;
}

export default function OrderTemplate() {
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<UserOrder[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        fetch(`${API_BASE_URL}users/me/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(console.error);

        fetch(`${API_BASE_URL}users/orders/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(console.error);
    }, []);

    if (!user) return <p>Loading user...</p>;
    if (!orders.length) return <p>No orders found.</p>;

    return (
        <div>
            <h1>Orders</h1>
            {orders.map(order => {
                 const totalAmount = order.items.reduce((sum, item) => sum + item.product.price, 0);

                return (
                    <div key={order.id} className='p-2 m-2 border'>
                        <p><strong>Order ID:</strong> {order.id}</p>
                        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                        <p><strong>Total:</strong> {totalAmount.toFixed(2)} €</p>

                        {order.items.length === 0 ? (
                            <p>No products in this order.</p>
                        ) : (
                            order.items.map(item => (
                                <div key={item.id} className='flex m-2'>
                                    <img
                                        src={API_BASE_URL + item.product.product_images[0].url.replace(/^backend\//, '')}
                                        alt={item.product.name}
                                        className="aspect-square w-24 rounded-md bg-gray-200 object-cover"
                                    />
                                    <div className='flex-col p-2'>
                                        <p><strong>{item.product.name}</strong></p>
                                        <p>{item.product.price}€</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                );
            })}
        </div>
    );
}
