import type { ReactNode } from 'react';
import SearchBar from './SearchBar';
import Menu from './Menu';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex">
      <Menu />
      <main className="flex-1 overflow-y-auto">
        <div>
            <SearchBar />
        </div>
        <div>
            {children}
        </div>
      </main>
    </div>
  );
}
