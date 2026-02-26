import React from 'react';
import useAuth from '../../hooks/useAuth';
import tokenLogo from '../../assets/token_logo.png';
import Button from '../../components/common/Button';
import avatar from '../../assets/default_pfp.png'
import '../../App.css';
const Profile = () => {
    const { user, tokens } = useAuth();
    return (
        <div className="profile-page">
            <div className="profile-container">
                {/*profile information*/}
                <div className="info-profile-card info-section">
                    <div className="profile-pic-wrapper">
                        <img src={avatar} alt="avatar" className="profile-avatar" />
                    </div>
                    <h2>personal information</h2>
                    <div className="info-group">
                        <label>Full Name:</label>
                        <p>{user?.name||"user inavailable"}</p>
                    </div>
                    <div className="info-group">
                        <label>Email Address:</label>
                        <p>{user.email||"email inavailable"}</p>
                    </div>
                </div>
                {/*the wallet*/}
                <div className="profile-card wallet-section">
                    <h2>Wasalni Wallet</h2>
                    <div className="Wallet-display">
                        <img src={tokenLogo} alt="token" className="token-icon" />
                        <div className="balance-info">
                            <span className="balance-label">Available Balance:</span>
                            <span className="balance-amount">{tokens?.toLocaleString() || 0}</span>
                        </div>
                    </div>
                    <Button>Add Tokens</Button>
                </div>
            </div>
        </div>
    );
};
export default Profile;