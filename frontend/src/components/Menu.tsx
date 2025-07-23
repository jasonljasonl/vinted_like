import { useState } from 'react';

import MenuLink from './MenuLink.tsx';
import UserViewComponent from './UserViewComponent.tsx'


export default function Menu() {
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return(
        <div>
          <button
            className="md:hidden absolute top-4 left-4 z-50 bg-white p-2 rounded shadow"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          <aside className={`fixed md:static z-40 h-full w-64 bg-white border-r-2 transform transition-transform duration-300
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <nav className="flex flex-col justify-between h-full p-4">
                <div className="space-y-2">
                    <MenuLink icon="material-symbols:dashboard-outline" label="Dashboard" to="/dashboard" />
                    <MenuLink icon="material-symbols:description-outline" label="Orders" to="/orders" />
                    <MenuLink icon="material-symbols:search" label="Browse products" to="/browse-products" />
                    <MenuLink icon="material-symbols:favorite-outline" label="Wishlist" to="/" />
                    <MenuLink icon="material-symbols:settings" label="Settings" to="/" />
                    <MenuLink icon="material-symbols:help-outline" label="Need help?" to="/" />

                </div>
                <div className="pt-4 mt-4">
                    <UserViewComponent />
                </div>
            </nav>
          </aside>
        </div>
    )
}