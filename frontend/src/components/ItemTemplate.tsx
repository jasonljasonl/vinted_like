const API_BASE_URL = 'http://localhost:8000/';

export interface ItemImage {
  id: number;
  url: string;
}

export interface Item {
  id: number;
  name: string;
  price: number;
  product_images: ItemImage[];
}

export interface ShoppingCartItem {
  id: number;
  product: Item;
}

interface ItemProps {
  cartItem: ShoppingCartItem;
  onRemove: (id: number) => void;
}

export default function ItemTemplate({ cartItem, onRemove }: ItemProps) {
  const item = cartItem.product;

  return (
    <div className="mb-4 flex items-start gap-4">
        <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
            {item.product_images.length > 0 && (
            <img
                src={`${API_BASE_URL}${item.product_images[0].url.replace(/^backend\//, '')}`}
                alt={item.name}
                className="size-full object-cover"
            />
            )}
        </div>
        <div className='ml-4 flex flex-1 flex-col'>
            <div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>{item.name}</h3>
                    <p className="ml-4">${item.price}</p>
                </div>
            </div>
            <div className="flex flex-1 items-end justify-between text-sm">
                <div className="flex">
                    <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500 mt-1" onClick={() => onRemove(cartItem.id)}>
                        Remove
                    </button>
                </div>
            </div>
        </div>
    </div>

  );
}
