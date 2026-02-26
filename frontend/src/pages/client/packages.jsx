import React from "react";
import Button from "../../components/common/Button";
import'../../App.css';
const Packages=()=>{
    const plans=[
        {id:1, name:'Starter',tokens:50,price:'5 TND'},
        {id:2, name:'Value',tokens:150,price:'12 TND'},
        {id:3, name:'Pro',tokens:500,price:'35 TND'}
    ];
    return(
        <div className="packages-container">
            <h1 className="package-title">Select your Token Package</h1>
            <div className="packages-grid">
                {plans.map((plan)=>(
                    <div key={plan.id} className={`package-card ${plan.popular ? 'popular' : ''}`}>
                        {plan.popular && <span className="badge">Best Value</span>}
                        <h3 style={{ color: plan.color }}>{plan.name}</h3>
                        <div className="token-amount">{plan.tokens} Tokens</div>
                        <div className="price">{plan.price}</div>
                        <ul className="features">
                            <li>No expiration date</li>
                            <li>Valid for all routes</li>
                        </ul>
                        <Button variant="submit-primary">Purchase Now</Button>
                    </div>
                ))}                      
            </div>
        </div>
    );
};
export default Packages;