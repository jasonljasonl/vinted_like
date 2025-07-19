import MenuLink from './MenuLink.tsx';
import UserViewComponent from './UserViewComponent.tsx'

export default function Menu() {
    return(
        <nav className="flex flex-col justify-between h-full p-4">
            <div className="space-y-2">
                <MenuLink icon="material-symbols:dashboard-outline" label="Dashboard" to="/" />
                <MenuLink icon="material-symbols:description-outline" label="Orders" to="/" />
                <MenuLink icon="material-symbols:search" label="Browse products" to="/" />
                <MenuLink icon="material-symbols:favorite-outline" label="Wishlist" to="/" />
                <MenuLink icon="material-symbols:settings" label="Settings" to="/" />
                <MenuLink icon="material-symbols:help-outline" label="Need help?" to="/" />
            </div>
            <div className="pt-4 mt-4">
                <UserViewComponent />
            </div>
        </nav>
    )
}