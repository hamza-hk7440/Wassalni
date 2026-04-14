import React from 'react';
import { useNavigate } from 'react-router-dom';
import PackageCard from '../../components/common/packageCard';

const Packages = () => {
    const navigate = useNavigate();
    const plans = [
        { id: 1, name: 'Starter', tokens: 20, price: '2 DT' },
        { id: 2, name: 'Basic', tokens: 50, price: '4.5 DT' },
        { id: 3, name: 'Value', tokens: 80, price: '7 DT', popular: true },
        { id: 4, name: 'Standard', tokens: 120, price: '10.5 DT' },
        { id: 5, name: 'Pro', tokens: 200, price: '18 DT' },
        { id: 6, name: 'Premium', tokens: 300, price: '27 DT' },
    ];

    return (
        <div className="min-h-screen bg-[#f4f7f9] px-5 py-[60px] font-sans">
            <div className="relative mx-auto mb-[50px] flex max-w-[1000px] items-center justify-center">
                <button 
                    onClick={() => navigate(-1)} 
                    className="absolute left-0 border-none bg-transparent text-base font-semibold text-[#1e5470] cursor-pointer hover:underline">
                    &#8592; Back
                </button>
                <h2 className="m-0 text-[2.2rem] font-bold text-[#1e5470]">Select your Token Package</h2>
            </div>
            <div className="mx-auto flex max-w-[1000px] flex-wrap justify-center gap-[25px]">
                {plans.map((plan) => (
                    <PackageCard key={plan.id} plan={plan} />
                ))}
            </div>
        </div>
    );
};

export default Packages;