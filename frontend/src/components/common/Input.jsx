import React from 'react';

const Input = ({ label, type = "text", placeholder, value, onChange, name, error }) => {
    return (
        <div className="mb-[1.2rem] flex flex-col">
            {label && (
                <label className="mb-2 text-[0.9rem] font-semibold text-[#1E5470]">
                    {label}
                </label>
            )}
            
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`
                    w-full rounded-xl border px-4 py-3.5 text-base text-[#333] transition-all duration-300
                    placeholder:text-[#a0aec0] placeholder:opacity-80
                    hover:border-[#cbd5e0]
                    focus:bg-white focus:outline-none focus:border-[#6EC1D1] focus:ring-4 focus:ring-[#6EC1D1]/10
                    ${error ? 'border-[#e53e3e]' : 'border-[#e1e9f5]'}
                `}
            />
            {error && (
                <span className="mt-1.5 text-[0.8rem] font-medium text-[#e53e3e]">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;