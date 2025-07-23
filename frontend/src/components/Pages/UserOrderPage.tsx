import OrderTemplate from '../OrderTemplate.tsx';
import Menu from '../Menu.tsx';
import SearchBar from '../SearchBar.tsx';

export default function UserOrderPage() {

  return (
    <div className='flex h-screen'>
        <Menu />
        <main className='flex-1 overflow-y-auto'>
            <SearchBar />
            <div className='pt-8'>
                <OrderTemplate />
            </div>
        </main>
    </div>
  );
}
