import { Routes, Route } from 'react-router-dom';

import './App.css'
import Dashboard from './components/Dashboard.tsx'
import ProductCreationForm from './components/Pages/AddProductPage.tsx'
import ProductUpdateForm from './components/Pages/UpdateProductPage.tsx'
import ProductViewPage from './components/Pages/ProductViewPage.tsx'
import UserOrderPage from './components/Pages/UserOrderPage.tsx'
import LoginPage from './components/Pages/LoginPage.tsx'
import RegisterPage from './components/Pages/RegisterPage.tsx'
import SettingsPage from './components/Pages/SettingsPage.tsx'
import ComingSoonPage from './components/Pages/ComingSoonPage.tsx'
import FetchAllProducts from './components/FetchAllProducts.tsx'
import UserProfileComponent from './components/UserProfileComponent.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'

function App() {

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><UserOrderPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/add-product" element={<ProtectedRoute><ProductCreationForm /></ProtectedRoute>} />
      <Route path="/products/:productId/update" element={<ProtectedRoute><ProductUpdateForm /></ProtectedRoute>} />
      <Route path="/products/:productId" element={<ProductViewPage />} />
      <Route path="/browse-products" element={<FetchAllProducts />} />
      <Route path="/users/id/:userId" element={<UserProfileComponent />} />
      <Route path="/wishlist" element={<ProtectedRoute><ComingSoonPage /></ProtectedRoute>} />
      <Route path="/help" element={<ComingSoonPage />} />
    </Routes>
  );
}

export default App
