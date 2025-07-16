import { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ItemTemplate from './ItemTemplate';
import type { ShoppingCartItem } from './ItemTemplate';

const API_BASE_URL = 'http://localhost:8000/';

export default function CartTemplate() {
  const [items, setItems] = useState<ShoppingCartItem[]>([]);
  const [open, setOpen] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('User not authenticated');
      return;
    }

    fetch(`${API_BASE_URL}users/cart/items`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error('API Error:', err));
  }, []);


  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(
            `${API_BASE_URL}products/orders/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:  `Bearer ${token}`,
                },
            }
        );

        const result = await response.json();

        if (response.ok) {
            console.log('Successfully checkout', result);
            alert('Successfully checkout');
        } else {
            console.error('error', result);
        }
    } catch (error) {
        console.error(error);
        alert('error')
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('User not authenticated');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}users/cart/items/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            setItems((prev) => prev.filter((item) => item.id !== itemId));
        } else {
            console.error('Failed to remove item');
        }
    } catch (error) {
        console.error('Error:', error);
    }
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-gray-950/5 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-950/10"
      >
        Open drawer
      </button>

      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-lg font-medium text-gray-900">Shopping cart</DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                        >
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-8 flow-root">
                        <div className="-my-6 divide-y divide-gray-200">
                            <div className='py-6'>
                                {items.map((cartItem) => (
                                    <ItemTemplate key={cartItem.id} cartItem={cartItem} onRemove={handleRemoveItem}/>
                                ))}
                            </div>
                        </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>${items.reduce((total, item) => total + item.product.price, 0).toFixed(2)}</p>
                    </div>
                    <div className="mt-6">
                      <a
                        onClick={handleCheckout}
                        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700"
                      >
                        Checkout
                      </a>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                      <p>
                        or{' '}
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
