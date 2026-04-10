import React from 'react';

const Button = ({ children, onClick, type = "button", variant = "primary", disabled = false, className = "" }) => {
    const baseStyles = "flex items-center justify-center px-6 py-3 text-base font-bold rounded-xl cursor-pointer transition-all duration-300 w-full font-['Segoe_UI',_sans-serif] disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-[#1E5470] text-white shadow-[0_4px_15px_rgba(30,84,112,0.2)] hover:bg-[#2c7da8] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(30,84,112,0.3)]",
        secondary: "bg-white text-[#34495e] border-[1.5px] border-[#dcdde1] hover:bg-[#f5f6fa] hover:border-[#2c3e50] hover:-translate-y-[2px]"
    };

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;