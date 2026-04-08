import React from "react";
import { useNavigate } from "react-router-dom";
import '../../App.css';
import tokenLogo from '../../assets/token_logo.png';

const Packages = () => {
    const navigate = useNavigate();
    const plans = [
        { id: 1, name: 'Starter', tokens: 50, price: '5 TND' },
        { id: 2, name: 'Value', tokens: 150, price: '12 TND', popular: true },
        { id: 3, name: 'Pro', tokens: 500, price: '35 TND' }
    ];

    return (
        <div className="packages-container">
            <div className="history-header" style={{ justifyContent: 'center', marginBottom: '50px', maxWidth: '1000px', margin: '0 auto 50px auto' }}>
                <button className="back-btn" onClick={() => navigate(-1)}>
                    &#8592; Back
                </button>
                <h2 style={{ fontSize: '2.2rem', color: '#1e5470' }}>Select your Token Package</h2>
            </div>
            
            <div className="packages-grid">
                {plans.map((plan) => (
                    <div key={plan.id} className={`package-card ${plan.popular ? 'popular' : ''}`}>
                        {plan.popular && <span className="badge">Best Value</span>}
                        <h3 style={{ color: '#1e5470', fontSize: '1.5rem', marginBottom: '10px' }}>{plan.name}</h3>
                        
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                            <img src={tokenLogo} alt="Token" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                        </div>
                        
                        <div className="token-amount" style={{ color: '#2c3e50' }}>{plan.tokens} Tokens</div>
                        <div className="price">{plan.price}</div>
                        
                        <ul className="features" style={{ textAlign: 'left', marginLeft: '20px' }}>
                            <li style={{ marginBottom: '10px' }}>✔️ No expiration date</li>
                            <li>✔️ Valid for all routes</li>
                        </ul>
                        
                        <button className="custom-btn" style={{ width: '100%', padding: '12px', fontSize: '1.1rem' }}>
                            Purchase Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Packages;