import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from './Logout.tsx';
import { Icon } from '@iconify/react';

interface LogoutButtonProps {
  icon: string;
  label: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ icon, label }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md w-full text-left"
    >
      <Icon icon={icon} className="text-gray-500 text-2xl" />
      <span className="text-md font-medium text-gray-700">{label}</span>
    </button>
  );
};

export default LogoutButton;
