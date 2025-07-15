import React from "react";

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    label: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
    label,
    variant = 'primary',
    size = 'md',
    onClick,
    type = 'button',
}) => {
        const baseStyle = 'rounded px-4 font-semibold focus:outline-none transition'

        const variantStyle = {
            primary: "rounded-md bg-blue-500 text-white hover:bg-blue-600",
            secondary: "rounded-md bg-gray-200 text-black hover:bg-gray-300",
            danger: "rounded-md bg-red-500 text-white hover:bg-red-600",
        };

        const sizeStyle = {
            sm: 'text-sm py-1',
            md: 'text-base py-2',
            lg: 'text-sm/6 w-full justify-center py-1',
        }

        const className = `${baseStyle} ${variantStyle[variant]} ${sizeStyle[size]}`;

        return (
            <button type={type} className={className} onClick={onClick}>
                {label}
            </button>
        );
    };

export default Button;