import ProductViewTemplate from '../ProductViewTemplate.tsx';
import { useParams } from 'react-router-dom';
import Layout from '../Layout.tsx';


export default function ProductViewPage() {
  const { productId } = useParams();

  return (
    <Layout>
        <ProductViewTemplate productId={Number(productId)} />
    </Layout>
  );
}
