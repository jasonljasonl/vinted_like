import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';


export interface MenuLinkProps {
    icon: string;
    label: string;
    to: string;
}

export default function MenuLink({ icon, label, to } : MenuLinkProps) {
    return (
        <div>
            <Link to={to} className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md">
                <Icon icon={icon} className="text-gray-500 text-2xl" />
                <span className="text-md font-medium text-gray-700">{label}</span>
            </Link>
        </div>
    );
}