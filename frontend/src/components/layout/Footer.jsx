import React from 'react';
import {Link} from 'react-router-dom'

const Footer =()=>{
    return(
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section brand">
                    <h2 className="footer-logo">Wasalni</h2>
                    <p>Revolutionizing transport with intergrated bus and train scheduling.</p>

                </div>
                <div className="footer-section links">
                    <h3>services</h3>
                    <Link to="/home">Bus and Train Schedule</Link>
                    <Link to="/profile">My Tokens</Link>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2026 Wasalni Transportation. All rights reserved.</p>
            </div>
        </footer>
    );
};
export default Footer;