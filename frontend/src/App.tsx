import { Routes, Route } from 'react-router-dom';

import './App.css'
import Dashboard from './components/Dashboard.tsx'
import ProductCreationForm from './components/Pages/AddProductPage.tsx'
import ProductUpdateForm from './components/Pages/UpdateProductPage.tsx'
import ProductViewPage from './components/Pages/ProductViewPage.tsx'
import UserOrderPage from './components/Pages/UserOrderPage.tsx'
import FetchAllProducts from './components/FetchAllProducts.tsx'
import UserProfileComponent from './components/UserProfileComponent.tsx'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/orders" element={<UserOrderPage />} />
      <Route path="/add-product" element={<ProductCreationForm />} />
      <Route path="/products/:productId/update" element={<ProductUpdateForm />} />
      <Route path="/products/:productId" element={<ProductViewPage />} />
      <Route path="/browse-products" element={<FetchAllProducts />} />
      <Route path="/users/id/:userId" element={<UserProfileComponent />} />
    </Routes>
  );
}

export default App
