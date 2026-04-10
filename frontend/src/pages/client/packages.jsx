import React from 'react';
import { useNavigate } from 'react-router-dom';
import tokenLogo from '../../assets/token_logo.png';
import Button from '../../components/common/Button';

const Packages = () => {
    const navigate = useNavigate();
    
    const plans = [
        { id: 1, name: 'Starter', tokens: 50, price: '5 TND' },
        { id: 2, name: 'Value', tokens: 150, price: '12 TND', popular: true },
        { id: 3, name: 'Pro', tokens: 500, price: '35 TND' },
    ];

    return (
        <div className="min-h-screen bg-[#f4f7f9] px-5 py-[60px] font-sans">
            <div className="relative mx-auto mb-[50px] flex max-w-[1000px] items-center justify-center">
                <button 
                    onClick={() => navigate(-1)} 
                    className="absolute left-0 border-none bg-transparent text-base font-semibold text-[#1e5470] cursor-pointer hover:underline"
                >
                    &#8592; Back
                </button>
                <h2 className="m-0 text-[2.2rem] font-bold text-[#1e5470]">Select your Token Package</h2>
            </div>
            <div className="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-[30px]">
                {plans.map((plan) => (
                    <div 
                        key={plan.id} 
                        className={`relative w-[300px] rounded-[24px] bg-white px-[30px] py-10 text-center shadow-[0_4px_6px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.05)] ${
                            plan.popular 
                            ? 'scale-105 border-2 border-[#6ec1d1] hover:scale-105' 
                            : 'border border-[#e2e8f0]'
                        }`}
                    >
                        {plan.popular && (
                            <span className="absolute left-1/2 top-[-15px] -translate-x-1/2 rounded-[20px] bg-[#6ec1d1] px-5 py-1.5 text-[0.85rem] font-bold text-white shadow-[0_4px_10px_rgba(110,193,209,0.3)]">
                                Best Value
                            </span>
                        )}

                        <h3 className="mb-2.5 text-2xl font-bold text-[#1e5470]">{plan.name}</h3>
                        
                        <div className="my-5 flex justify-center">
                            <img 
                                src={tokenLogo} 
                                alt="Token" 
                                className="h-[60px] w-[60px] object-contain" 
                            />
                        </div>

                        <div className="mb-1 text-[1.4rem] font-bold text-[#2c3e50]">
                            {plan.tokens} Tokens
                        </div>
                        
                        <div className="mb-6 text-[1.8rem] font-extrabold text-[#1e5470]">
                            {plan.price}
                        </div>

                        <ul className="mb-[30px] ml-5 list-none text-left">
                            <li className="mb-3 text-[0.95rem] text-[#4a5568]">
                                <span className="mr-2 text-[#6ec1d1]">✔</span> No expiration date
                            </li>
                            <li className="mb-3 text-[0.95rem] text-[#4a5568]">
                                <span className="mr-2 text-[#6ec1d1]">✔</span> Valid for all routes
                            </li>
                        </ul>

                        <Button className="w-full py-3.5 text-lg font-bold shadow-md hover:shadow-lg">
                            Purchase Now
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Packages;