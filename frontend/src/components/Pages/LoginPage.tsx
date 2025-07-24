import LoginForm from '../LoginForm.tsx';
import Menu from '../Menu.tsx'
import SearchBar from '../SearchBar.tsx'

export default function LoginPage() {

  return (
    <div className='flex h-screen'>
        <Menu />
      <main className="flex-1 overflow-y-auto">
          <SearchBar />
        <div className='pt-8'>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
