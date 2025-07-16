import './App.css'
import Button from './components/Button.tsx'
import SignUpForm from './components/SignUpForm.tsx'
import LoginForm from './components/LoginForm.tsx'
import ProductCreationForm from './components/ProductCreationForm.tsx'
import ProductListTemplate from './components/ProductListTemplate.tsx'
import CartTemplate from './components/CartTemplate.tsx'

function App() {

  return (
    <>
        <Button label='Sign in' variant='primary' size='md' />
        <Button label='Cancel' variant='secondary' size='md' />
        <Button label='Delete' variant='danger' size='md' />

        <SignUpForm />
        <LoginForm />
        <ProductCreationForm />
        <ProductListTemplate />
        <CartTemplate />
    </>
  )
}

export default App
