import ProductViewTemplate from '../ProductViewTemplate.tsx';
import { useParams } from 'react-router-dom';
import SearchBar from '../SearchBar.tsx'
import Menu from '../Menu.tsx'


export default function ProductViewPage() {
  const { productId } = useParams();

  return (
    <div className='h-screen flex '>
        <Menu />
            <main className="flex-1 overflow-y-auto">
                <div>
                    <SearchBar />
                </div>
                <div>
                    <ProductViewTemplate productId={Number(productId)} />
                </div>
            </main>
    </div>
  );
}
